/* =========================================================
   TechFlow · navegação, ações e eventos
   ========================================================= */
(function () {
  "use strict";
  var S = TF.S; S.screen = 0;
  var $app = document.getElementById("app");
  var $bar = document.getElementById("bar");
  var $chips = document.getElementById("chips");
  var $toast = document.getElementById("toast");

  /* ---------- Desenho da tela ---------- */
  function toast(m) {
    $toast.textContent = m;
    $toast.classList.add("on");
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { $toast.classList.remove("on"); }, 2600);
  }

  function render() {
    $bar.innerHTML = TF.v.bar();
    $app.innerHTML = TF.v.screen();
    $chips.innerHTML = TF.SCREEN_NAMES.map(function (n, i) {
      return '<button class="chip" data-act="jump" data-n="' + (i + 1) + '"' + (S.screen === i + 1 ? ' aria-current="step"' : '') + '><b>' + (i + 1) + '</b>' + n + '</button>';
    }).join("");
    document.title = (S.screen ? TF.SCREEN_NAMES[S.screen - 1] : TF.PAGES.filter(function (p) { return p[0] === S.page; })[0][1]) + " · TechFlow";
    S.screen === 0 ? setupScroll() : onScroll();
    countUp();
  }

  /* Número do card "Por que triar antes" sobe até o valor final */
  function countUp() {
    var el = $app.querySelector("[data-count]"); if (!el) return;
    var to = +el.dataset.count;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = to; return; }
    var t0 = null; el.textContent = "0";
    (function tick(t) { if (t0 === null) t0 = t; var k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); })(performance.now());
  }

  function go(n) {
    S.screen = n;
    if (n === 7 && !S.sel) { var s = TF.sorted(); S.sel = s[0] ? s[0].id : null; }
    render();
    window.scrollTo(0, 0);
    $app.focus({ preventScroll: true });
  }

  /* Usado pelo modo demonstração para pular direto a uma tela */
  function jump(n) {
    S.role = n === 7 ? "tech" : "user";
    TF.resetDx();
    if (n === 4) { S.cat = "hardware"; S.node = "h1"; S.path = []; }
    if (n === 5 || n === 6) TF.sampleDx();
    go(n);
  }

  /* ---------- Site: transição, rolagem e efeitos ---------- */
  var $wipe = document.getElementById("wipe");
  /* Transição entre telas: esmaece para a tela com a marca, troca o conteúdo e esmaece de volta (~0,6 s) */
  var wipeBusy = false;
  function wipe(fn) {
    if (wipeBusy) return;
    wipeBusy = true;
    $wipe.classList.remove("out");
    $wipe.classList.add("on");
    setTimeout(function () { fn(); window.scrollTo(0, 0); }, 200);   /* tela coberta: troca o conteúdo */
    setTimeout(function () { $wipe.classList.add("out"); }, 200 + 130);
    setTimeout(function () { $wipe.classList.remove("on", "out"); wipeBusy = false; }, 200 + 130 + 280);
  }
  function toPage(p) { wipe(function () { S.page = p; S.screen = 0; render(); }); }
  function nightSet(i) {
    var st = TF.site.steps[i]; if (!st || nightSet.i === i) return; nightSet.i = i;
    var q = function (id) { return document.getElementById(id); };
    if (!q("ns")) return;
    q("ns").innerHTML = TF.site.phoneScr[st[3]]; q("nn").textContent = st[0]; q("np").textContent = st[2]; q("nc").textContent = "0" + (i + 1) + " / 05";
    [].forEach.call(document.querySelectorAll("#night li"), function (li, k) { li.classList.toggle("on", k === i); });
  }
  function prog(el) { var r = el.getBoundingClientRect(), t = r.height - window.innerHeight; return t > 0 ? Math.min(.999, Math.max(0, -r.top / t)) : 0; }
  function onScroll() {
    var dn = document.querySelector(".dn"); if (dn) dn.classList.toggle("sc", window.scrollY > 40);
    var n = document.getElementById("night"), w = document.getElementById("want");
    if (n && window.innerWidth > 900) nightSet(Math.floor(prog(n) * TF.site.steps.length));
    if (w) {
      var k = Math.floor(prog(w) * TF.site.want.length);
      [].forEach.call(w.querySelectorAll("h3"), function (h, i) { h.classList.toggle("on", i === k); h.classList.toggle("near", Math.abs(i - k) === 1); h.style.display = Math.abs(i - k) > 2 ? "none" : ""; });
      document.getElementById("wp").textContent = TF.site.want[k][1];
    }
    [].forEach.call(document.querySelectorAll(".rv0:not(.in)"), function (el) { if (el.getBoundingClientRect().top < window.innerHeight * .9) el.classList.add("in"); });
  }
  function setupScroll() { nightSet.i = -1; onScroll(); }
  window.addEventListener("scroll", onScroll, { passive: true });
  (function stars() { var b = document.getElementById("stars"), h = ""; for (var i = 0; i < 70; i++) h += '<i style="left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;opacity:' + (.2 + Math.random() * .6) + '"></i>'; b.innerHTML = h; })();

  /* ---------- Diagnóstico ---------- */
  function answer(v) {
    var nd = TF.node(), nx = nd[v];
    var label = v === "y" ? "Sim" : (v === "n" ? "Não" : "Não sei / Outro");
    S.path.push({ id: S.node, q: nd.q, a: label });
    if (TF.RESULTS[nx]) { S.result = nx; S.checked = []; S.node = null; go(5); return; }
    S.node = nx;
    render();
    window.scrollTo(0, 0);
  }

  function makeTicket() {
    var r = TF.RESULTS[S.result], st = TF.store;
    var no = "#TF-2026-" + String(st.nextNo).padStart(3, "0");
    st.nextNo++;
    var t = {
      id: no,
      title: S.desc ? (S.desc.length > 60 ? S.desc.slice(0, 58) + "…" : S.desc) : r.title,
      cat: S.cat, pri: r.pri, status: "Aberto", user: TF.NAMES.user, tech: "", when: "agora",
      cause: r.cause,
      path: S.path.map(function (p) { return [p.q, p.a]; }),
      obs: S.obs, files: S.files.slice()
    };
    st.tickets.push(t);
    TF.save();
    S.created = t;
    S.sel = t.id;
  }

  /* ---------- Ações disparadas por data-act ---------- */
  var ACT = {
    role: function (d) { S.role = d.v; render(); },
    togpw: function (d, el) {
      var i = document.getElementById("pw");
      i.type = i.type === "password" ? "text" : "password";
      el.textContent = i.type === "password" ? "Mostrar" : "Ocultar";
    },
    jump: function (d) { jump(+d.n); },
    home: function () { jump(S.role === "tech" ? 7 : 2); },
    logout: function () { toPage("home"); },
    nav: function (d) { toPage(d.p); },
    goto: function (d) { var e = document.getElementById(d.t); if (e) e.scrollIntoView({ behavior: "smooth", block: "start" }); },
    down: function () { var n = document.getElementById("night"); if (n) n.scrollIntoView({ behavior: "smooth" }); },
    start: function () { wipe(function () { S.role = "user"; TF.resetDx(); go(1); }); },
    theme: function () { var h = document.documentElement; h.dataset.theme = h.dataset.theme === "dark" ? "light" : "dark"; try { localStorage.setItem("techflow.theme", h.dataset.theme); } catch (e) {} render(); },
    plan: function (d) { S.plan = d.v; var y = window.scrollY; render(); window.scrollTo(0, y); },
    nstep: function (d) { nightSet(+d.i); },
    resetdata: function () {
      if (!window.confirm("Restaurar os chamados de exemplo? Os chamados criados por você serão apagados.")) return;
      TF.resetData(); S.sel = null; render(); toast("Dados de exemplo restaurados");
    },

    /* Fluxo do solicitante */
    newdx: function () { TF.resetDx(); go(3); },
    shortcut: function (d) { wipe(function () { S.role = "user"; TF.resetDx(); S.cat = d.c; go(3); }); },
    pickcat: function (d) {
      S.cat = d.c; render();
      var b = $app.querySelector('[data-act="startdx"]'); if (b) b.focus();
    },
    usesuggest: function (d) { S.cat = d.c; render(); },
    startdx: function () { if (!S.cat) return; S.node = TF.TREE[S.cat].start; S.path = []; go(4); },
    ans: function (d) { answer(d.v); },
    back: function () {
      if (!S.path.length) { go(3); return; }
      var p = S.path.pop(); S.node = p.id; render();
    },
    restart: function () {
      if (S.path.length && !window.confirm("Reiniciar o diagnóstico? Suas respostas atuais serão descartadas.")) return;
      S.node = TF.TREE[S.cat].start; S.path = []; render(); toast("Diagnóstico reiniciado");
    },
    backq: function () {
      var p = S.path.pop();
      if (!p) { go(3); return; }
      S.node = p.id; S.result = null; go(4);
    },
    tick: function (d, el) {
      var i = +d.i, k = S.checked.indexOf(i);
      if (el.checked && k < 0) S.checked.push(i);
      if (!el.checked && k > -1) S.checked.splice(k, 1);
      var c = document.getElementById("tickcount");
      if (c) c.textContent = S.checked.length + " de " + TF.RESULTS[S.result].steps.length;
    },
    resolved: function () { S.resolved = true; TF.store.selfServed++; TF.save(); render(); window.scrollTo(0, 0); },
    openticket: function () { go(6); },
    backres: function () { go(5); },
    rmfile: function (d) { S.files.splice(+d.i, 1); render(); },
    confirm: function () { makeTicket(); render(); window.scrollTo(0, 0); },

    /* Painel técnico */
    sel: function (d) { S.sel = d.id; S.sol = ""; render(); },
    filter: function (d) { S.filter = d.v; render(); },
    assume: function () {
      var t = TF.current(); if (!t || t.status !== "Aberto") return;
      t.status = "Em Atendimento"; t.tech = TF.NAMES.tech; TF.save(); render(); toast("Chamado " + t.id + " assumido por você");
    },
    release: function () {
      var t = TF.current(); if (!t) return;
      t.status = "Aberto"; t.tech = ""; TF.save(); render(); toast("Chamado " + t.id + " devolvido à fila");
    },
    reopen: function () {
      var t = TF.current(); if (!t) return;
      t.status = "Em Atendimento"; t.tech = t.tech || TF.NAMES.tech; delete t.solution; TF.save(); render(); toast("Chamado " + t.id + " reaberto");
    },
    closeticket: function () {
      var t = TF.current(); if (!t) return;
      if (!S.sol.trim()) {
        toast("Descreva a solução antes de encerrar");
        var e = document.getElementById("sol"); if (e) e.focus();
        return;
      }
      t.status = "Concluído"; t.solution = S.sol.trim(); if (!t.tech) t.tech = TF.NAMES.tech;
      S.sol = ""; TF.save(); render(); toast("Chamado " + t.id + " encerrado");
    }
  };

  /* ---------- Eventos ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-act]");
    if (!el || el.tagName === "INPUT" || el.disabled) return;
    var f = ACT[el.dataset.act];
    if (f) f(el.dataset, el);
  });

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.act === "tick") { ACT.tick(t.dataset, t); return; }
    if (t.id === "fileIn") {
      for (var i = 0; i < t.files.length; i++) S.files.push(t.files[i].name);
      render();
    }
  });

  document.addEventListener("input", function (e) {
    var id = e.target.id;
    if (id === "desc") {
      S.desc = e.target.value;
      var box = document.getElementById("suggest");
      if (box) box.innerHTML = TF.v.suggestHtml();
    }
    if (id === "obs") S.obs = e.target.value;
    if (id === "sol") S.sol = e.target.value;
    if (id === "q") {
      S.q = e.target.value;
      var pos = e.target.selectionStart;
      render();
      var q = document.getElementById("q");
      if (q) { q.focus(); q.setSelectionRange(pos, pos); }
    }
  });

  document.addEventListener("submit", function (e) {
    if (e.target.id === "loginForm") { e.preventDefault(); wipe(function () { go(S.role === "tech" ? 7 : 2); }); }
  });

  document.addEventListener("keydown", function (e) {
    var tag = e.target.tagName;
    /* Linha da tabela acessível por teclado */
    if ((e.key === "Enter" || e.key === " ") && tag === "TR" && e.target.dataset.act === "sel") {
      e.preventDefault(); ACT.sel(e.target.dataset); return;
    }
    /* Atalhos 1, 2, 3 na tela de perguntas */
    if (S.screen === 4 && !/INPUT|TEXTAREA|SELECT/.test(tag) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var map = { "1": "y", "2": "n", "3": "u" };
      if (map[e.key]) { e.preventDefault(); answer(map[e.key]); }
    }
  });

  /* ---------- Início ---------- */
  try { var th = localStorage.getItem("techflow.theme"); if (th) document.documentElement.dataset.theme = th; } catch (e) {}
  TF.load();
  render();
})();
