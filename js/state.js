/* =========================================================
   TechFlow · estado da aplicação e funções auxiliares
   Não há backend nem banco de dados: os chamados ficam salvos
   apenas no localStorage do navegador (e podem ser restaurados).
   ========================================================= */
(function () {
  "use strict";
  var KEY = "techflow.proto.v1";

  /* Estado de navegação / formulário (vive só enquanto a página está aberta) */
  TF.S = {
    role: "user", screen: 1,
    cat: null, desc: "", node: null, path: [], result: null,
    checked: [], resolved: false, obs: "", files: [], created: null,
    sel: null, filter: "todos", q: "", sol: ""
  };

  /* Dados persistentes */
  TF.store = { tickets: [], nextNo: 89, selfServed: 23 };

  function defaults() {
    return { tickets: JSON.parse(JSON.stringify(TF.SEED)), nextNo: 89, selfServed: 23 };
  }

  TF.load = function () {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && Array.isArray(d.tickets)) { TF.store = d; return; }
      }
    } catch (e) { /* localStorage indisponível: segue só em memória */ }
    TF.store = defaults();
  };

  TF.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(TF.store)); } catch (e) {}
  };

  TF.resetData = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    TF.store = defaults();
  };

  /* ---------- Utilidades ---------- */
  TF.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  TF.norm = function (s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  TF.catIco = function (id) { return TF.icon(id, "b"); };

  /* Sugere categoria a partir do texto digitado (conta quantas palavras-chave aparecem) */
  TF.suggest = function (text) {
    var t = TF.norm(text), best = null, bestN = 0;
    if (t.length < 3) return null;
    Object.keys(TF.KEYWORDS).forEach(function (id) {
      var n = TF.KEYWORDS[id].filter(function (k) { return t.indexOf(k) > -1; }).length;
      if (n > bestN) { best = id; bestN = n; }
    });
    return best;
  };

  /* Fila do técnico: pendentes primeiro, depois por prioridade, depois mais recentes */
  TF.sorted = function (list) {
    return (list || TF.store.tickets).slice().sort(function (a, b) {
      var da = a.status === "Concluído" ? 1 : 0, db = b.status === "Concluído" ? 1 : 0;
      if (da !== db) return da - db;
      if (TF.PRI[a.pri] !== TF.PRI[b.pri]) return TF.PRI[a.pri] - TF.PRI[b.pri];
      return b.id < a.id ? -1 : 1;
    });
  };

  TF.filtered = function () {
    var S = TF.S, q = TF.norm(S.q);
    return TF.sorted().filter(function (t) {
      if (S.filter !== "todos" && t.status !== S.filter) return false;
      if (!q) return true;
      return TF.norm([t.title, t.id, t.user, TF.CATNAME[t.cat]].join(" ")).indexOf(q) > -1;
    });
  };

  TF.current = function () {
    return TF.store.tickets.filter(function (x) { return x.id === TF.S.sel; })[0];
  };

  TF.node = function () { return TF.TREE[TF.S.cat].n[TF.S.node]; };

  TF.resetDx = function () {
    var S = TF.S;
    S.cat = null; S.desc = ""; S.node = null; S.path = []; S.result = null;
    S.checked = []; S.resolved = false; S.obs = ""; S.files = []; S.created = null;
  };

  /* Diagnóstico de exemplo, usado pelo modo demonstração */
  TF.sampleDx = function () {
    var S = TF.S;
    S.cat = "hardware"; S.node = "h3";
    S.path = [{ id: "h1", q: TF.TREE.hardware.n.h1.q, a: "Não" }];
    S.result = "r_power"; S.checked = [];
  };
})();
