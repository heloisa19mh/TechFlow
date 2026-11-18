/* =========================================================
   TechFlow · telas (funções que devolvem HTML)
   1 Acesso · 2 Início · 3 Categoria · 4 Diagnóstico
   5 Solução · 6 Chamado · 7 Painel técnico
   ========================================================= */
(function () {
  "use strict";
  var esc = TF.esc;
  var v = TF.v = {};

  TF.SCREEN_NAMES = ["Acesso", "Início", "Categoria", "Diagnóstico", "Solução", "Chamado", "Painel técnico"];

  /* ---------- Peças reutilizáveis ---------- */
  function pri(p) { return '<span class="badge ' + TF.PCLS[p] + '">' + esc(p) + '</span>'; }
  function st(s) { return '<span class="badge ' + TF.SCLS[s] + '">' + esc(s) + '</span>'; }

  function logoSvg() {
    return '<svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="8" fill="#1E3A8A"/><path d="M14 6v6M14 12l-5 5M14 12l5 5" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="14" cy="6" r="2.4" fill="#fff"/><circle cx="9" cy="19" r="2.4" fill="#F8FAFC"/><circle cx="19" cy="19" r="2.4" fill="#F97316"/></svg>';
  }

  function checkSvg() {
    return '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
  }

  /* Etapas do fluxo do solicitante. pct = progresso da barra */
  function stepper(step, pct) {
    var L = ["Categoria", "Diagnóstico", "Solução", "Chamado"];
    var h = '<div class="stepper"><div class="row between"><div class="steps" aria-label="Etapas">';
    L.forEach(function (l, i) {
      var c = i + 1 < step ? "done" : (i + 1 === step ? "on" : "");
      h += '<span class="' + c + '"' + (i + 1 === step ? ' aria-current="step"' : '') + '>' + (i + 1 < step ? "✓ " : "") + (i + 1) + '. ' + l + '</span>';
    });
    h += '</div><b class="mono">' + pct + '%</b></div><div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Progresso do diagnóstico"><i style="width:' + pct + '%"></i></div></div>';
    return h;
  }

  /* Lista "pergunta → resposta" usada no chamado e no painel técnico */
  function pathItems(path) {
    var h = '<ol class="qa">';
    path.forEach(function (p) {
      var q = Array.isArray(p) ? p[0] : p.q, a = Array.isArray(p) ? p[1] : p.a;
      h += '<li><small>Pergunta</small>' + esc(q) + '<br><b>Resposta: ' + esc(a) + '</b></li>';
    });
    return h + '</ol>';
  }

  function catCards(selectable, act) {
    var h = '<div class="cats"' + (selectable ? ' role="radiogroup" aria-label="Categoria do problema"' : '') + '>';
    TF.CATS.forEach(function (c) {
      h += '<button class="cat"' + (selectable ? ' role="radio" aria-checked="' + (TF.S.cat === c.id) + '"' : '') + ' data-act="' + act + '" data-c="' + c.id + '">' +
        '<span class="ico" aria-hidden="true">' + TF.icon(c.id, "b") + '</span><b>' + esc(c.name) + '</b><span class="s">' + esc(c.sub) + '</span></button>';
    });
    return h + '</div>';
  }

  /* Sugestão de categoria (atualizada sem redesenhar a tela inteira) */
  v.suggestHtml = function () {
    var S = TF.S, id = TF.suggest(S.desc);
    if (!id || id === S.cat) return "";
    return '<div class="note suggest"><span>Parece ser um problema de <b>' + TF.catIco(id) + ' ' + esc(TF.CATNAME[id]) + '</b>.</span><button class="btn btn-primary" data-act="usesuggest" data-c="' + id + '">Usar esta categoria</button></div>';
  };

  /* ---------- Barra superior ---------- */
  v.bar = function () {
    var S = TF.S, inApp = S.screen > 0, nav = "";
    TF.PAGES.forEach(function (p) { nav += '<button data-act="nav" data-p="' + p[0] + '"' + (!inApp && S.page === p[0] ? ' aria-current="page"' : '') + '>' + p[1] + '</button>'; });
    var cta = !inApp ? '<button class="cta-top" data-act="start">Acessar <b>\u2197</b></button>' : '<button class="cta-top" data-act="' + (S.screen === 1 ? "nav" : "logout") + '" data-p="home">' + (S.screen === 1 ? "Voltar ao site" : "Sair") + '</button>';
    return '<div class="dn"><button class="logo" data-act="nav" data-p="home" aria-label="TechFlow">' + '<img src="img/logo-compact.png" alt="TechFlow"></button><nav class="pill" aria-label="Principal">' + nav + '</nav><div class="r"><button class="tg" data-act="theme" aria-label="Alternar tema">' + (document.documentElement.dataset.theme === "dark" ? "\u2733" : "\u2733") + '</button>' + cta + '</div></div>';
  };

  /* ---------- 1 · Acesso ---------- */
  function s1() {
    var isU = TF.S.role === "user";
    return '<div class="loginP"><div class="lg-in"><section class="lg-l"><div class="eyebrow2">Seu espaço de trabalho</div><h1>Vamos colocar tudo em movimento?</h1><p>Entre como solicitante para iniciar um diagnóstico ou como técnico para acompanhar a fila de atendimento.</p><div class="lg-note"><span>\u2726</span>Protótipo de demonstração. Os dados ficam salvos neste navegador.</div></section>' +
      '<section class="pane lg-card"><div><div class="eyebrow2 dk">Bem-vindo ao TechFlow</div><h2>Acesse sua conta</h2></div>' +
      '<div class="field"><span class="eyebrow2 dk" id="perf">Selecione seu perfil</span><div class="seg" role="group" aria-labelledby="perf">' +
      '<button type="button" data-act="role" data-v="user" aria-pressed="' + isU + '">Solicitante<small>Preciso de suporte</small></button>' +
      '<button type="button" data-act="role" data-v="tech" aria-pressed="' + !isU + '">Técnico<small>Vou atender chamados</small></button></div></div>' +
      '<form id="loginForm" class="stack" novalidate>' +
      '<div class="field"><label for="email">E-mail</label><input class="input" id="email" type="email" autocomplete="username" value="' + (isU ? "luany.barros@empresa.com" : "lucas.cordeiro@empresa.com") + '"></div>' +
      '<div class="field"><label for="pw">Senha</label><div class="pw-wrap"><input class="input" id="pw" type="password" autocomplete="current-password" value="demo1234"><button type="button" data-act="togpw" aria-label="Mostrar ou ocultar senha">Mostrar</button></div></div>' +
      '<button class="btn btn-primary btn-lg lg-go" type="submit">Entrar no TechFlow <b>\u2197</b></button></form>' +
      '<p class="muted small">Campos preenchidos para demonstração. Qualquer senha funciona.</p></section></div></div>';
  }

  /* ---------- 2 · Início ---------- */
  function s2() {
    var mine = TF.store.tickets.filter(function (t) { return t.user === TF.NAMES.user; }).sort(function (a, b) { return a.id < b.id ? 1 : -1; }).slice(0, 5);
    var STEPS = [["Escolha a área", "do problema."], ["Responda", "2 ou 3 perguntas de sim ou não."], ["Teste a solução", "ou abra o chamado já preenchido."]];

    var hero = '<section class="heroN hm hi"><div class="hi-in"><div class="hi-txt">' +
      '<div class="eyebrow2"><i></i>Triagem guiada</div>' +
      '<h1><b>Olá, Lucas!</b><b class="l">Como podemos ajudar hoje?</b></h1>' +
      '<p>Em vez de preencher um formulário, responda perguntas curtas. Muitos problemas se resolvem sem abrir chamado.</p>' +
      '<div class="hbtn"><button class="hb w" data-act="newdx">Iniciar novo diagnóstico de TI <b>\u2197</b></button><button class="hb g" data-act="goto" data-t="meus">Meus chamados <b>\u2193</b></button></div></div>' +
      '<aside class="hi-card" aria-label="Autoatendimento"><small>Por que triar antes</small><div class="hi-num" data-count="' + TF.store.selfServed + '">' + TF.store.selfServed + '</div><div class="hi-lbl">problemas resolvidos por autoatendimento este mês</div><p>Cada um poupa tempo seu e da equipe de TI. Quando o chamado é necessário, ele já chega com prioridade e histórico.</p></aside></div></section>';

    var steps = '<div class="wrap"><ol class="hi-steps rv0">' + STEPS.map(function (x, i) {
      return '<li style="--d:' + (i * 120) + 'ms"><span class="n">' + (i + 1) + '</span><p><b>' + x[0] + '</b> ' + x[1] + '</p></li>';
    }).join("") + '</ol></div>';

    var cats = '<section class="wrap hi-sec"><div class="hi-head rv0"><h2>Atalhos por categoria</h2><p class="muted">Vá direto para a área do seu problema.</p></div><div class="hi-cats">' +
      TF.CATS.map(function (c, i) {
        return '<button class="cat2 g' + i + ' rv0" style="--d:' + (i * 90) + 'ms" data-act="shortcut" data-c="' + c.id + '"><span class="ic" aria-hidden="true">' + TF.icon(c.id, "w") + '</span><span class="tx"><b>' + esc(c.name) + '</b><small>' + esc(c.sub) + '</small></span><span class="go" aria-hidden="true">\u2197</span></button>';
      }).join("") + '</div></section>';

    var list = '<section class="wrap hi-sec" id="meus"><div class="hi-tk rv0"><div class="hi-head"><h2>Meus chamados recentes</h2></div><div class="list">';
    if (!mine.length) list += '<p class="empty">Você ainda não abriu nenhum chamado.<button class="btn btn-ghost" data-act="newdx">Iniciar um diagnóstico</button></p>';
    mine.forEach(function (t) {
      list += '<div class="li"><div class="t"><b>' + esc(t.title) + '</b><span><span class="mono">' + esc(t.id) + '</span> · ' + esc(TF.CATNAME[t.cat]) + ' · ' + esc(t.when) + (t.tech && t.status !== "Aberto" ? ' · Técnico: ' + esc(t.tech) : '') + '</span></div>' + pri(t.pri) + st(t.status) + '</div>';
    });
    list += '</div></div></section>';

    return hero + steps + cats + list;
  }

  /* ---------- 3 · Categoria ---------- */
  function s3() {
    var S = TF.S;
    return stepper(1, 25) +
      '<div><h1 class="page-title">Em qual área está o problema?</h1><p class="muted" style="margin-top:6px">Escolha a mais próxima. As perguntas seguintes serão ajustadas à sua escolha.</p></div>' +
      catCards(true, "pickcat") +
      '<div class="card field"><label for="desc">Quer contar o que está acontecendo? <span class="muted" style="font-weight:400">(opcional)</span></label><textarea class="input" id="desc" maxlength="200" placeholder="Ex.: a impressora não imprime desde hoje cedo">' + esc(S.desc) + '</textarea><span class="muted small">Se você escrever, sugerimos a categoria automaticamente.</span><div id="suggest">' + v.suggestHtml() + '</div></div>' +
      '<div class="row between"><button class="btn btn-ghost" data-act="jump" data-n="2">← Cancelar</button><button class="btn btn-primary btn-lg" data-act="startdx"' + (S.cat ? "" : " disabled") + '>' + (S.cat ? "Continuar →" : "Escolha uma área para continuar") + '</button></div>';
  }

  /* ---------- 4 · Diagnóstico ---------- */
  function s4() {
    var S = TF.S, nd = TF.node(), d = S.path.length, pct = Math.min(70, 50 + d * 8);
    var h = stepper(2, pct) + '<div class="card lift q"><div class="row between"><span class="badge b-aberto">' + TF.catIco(S.cat) + " " + esc(TF.CATNAME[S.cat]) + '</span><span class="muted small">Pergunta ' + (d + 1) + '</span></div>';
    if (d) {
      h += '<div class="trail" aria-label="Respostas anteriores">';
      S.path.forEach(function (p) { h += '<span>' + esc(p.q.length > 46 ? p.q.slice(0, 44) + "…" : p.q) + ' <b>' + esc(p.a) + '</b></span>'; });
      h += '</div>';
    }
    h += '<div class="stack" style="gap:8px"><h2>' + esc(nd.q) + '</h2><p class="muted">' + esc(nd.hint) + '</p></div>' +
      '<div class="answers"><button class="ans yes" data-act="ans" data-v="y">Sim <kbd>1</kbd></button><button class="ans" data-act="ans" data-v="n">Não <kbd>2</kbd></button><button class="ans" data-act="ans" data-v="u">Não sei / Outro <kbd>3</kbd></button></div></div>' +
      '<div class="row between"><button class="btn btn-ghost" data-act="back">← Voltar para pergunta anterior</button><button class="btn btn-ghost" data-act="restart">Reiniciar diagnóstico</button></div>';
    return h;
  }

  /* ---------- 5 · Solução ---------- */
  function s5() {
    var S = TF.S, r = TF.RESULTS[S.result];
    if (S.resolved) {
      return '<div class="card lift center stack" style="padding:40px 24px"><div class="okmark">' + checkSvg() + '</div>' +
        '<h1 class="page-title">Problema resolvido!</h1><p class="muted" style="max-width:48ch">Nenhum chamado foi aberto. Você economizou cerca de ' + r.mins + ' minutos de espera e a equipe de TI ficou livre para casos que precisam de um técnico.</p>' +
        '<div class="note">Contabilizado em “Resolvidos por autoatendimento”: ' + TF.store.selfServed + ' este mês.</div>' +
        '<div class="row center"><button class="btn btn-primary" data-act="jump" data-n="2">Voltar ao início</button><button class="btn btn-ghost" data-act="newdx">Novo diagnóstico</button></div></div>';
    }
    var done = S.checked.length, total = r.steps.length;
    var h = stepper(3, 75) +
      '<div class="cause"><div class="row"><span class="eyebrow">Causa provável</span><span class="badge ' + TF.PCLS[r.pri] + '">Prioridade ' + esc(r.pri.toLowerCase()) + '</span></div><h2>' + esc(r.cause) + '</h2></div>';
    h += '<section class="card"><h2 style="margin-bottom:4px">Tente você mesmo, passo a passo</h2><p class="muted small" style="margin-bottom:14px">Marque cada passo conforme for testando. <b id="tickcount">' + done + ' de ' + total + '</b> feitos.</p><ul class="todo">';
    r.steps.forEach(function (s, i) {
      h += '<li><label><input type="checkbox" data-act="tick" data-i="' + i + '"' + (S.checked.indexOf(i) > -1 ? " checked" : "") + '><span>' + esc(s) + '</span></label></li>';
    });
    h += '</ul></section>' +
      '<div class="final"><button class="btn btn-ok btn-lg" data-act="resolved">✔ Resolveu meu problema</button><button class="btn btn-alert btn-lg" data-act="openticket">Não resolveu, abrir chamado</button></div>' +
      '<div class="note">Se abrir o chamado, o técnico já receberá a categoria, a prioridade e as respostas que você deu. Você não precisa explicar tudo de novo.</div>' +
      '<div><button class="btn btn-ghost" data-act="backq">← Revisar minhas respostas</button></div>';
    return h;
  }

  /* ---------- 6 · Chamado ---------- */
  function s6() {
    var S = TF.S;
    if (S.created) {
      var t = S.created;
      return '<div class="card lift center stack" style="padding:40px 24px"><div class="okmark">' + checkSvg() + '</div><h1 class="page-title" style="font-size:clamp(22px,3vw,28px)">Chamado enviado</h1><div class="ticketno">' + esc(t.id) + '</div>' +
        '<div class="row center">' + pri(t.pri) + st(t.status) + '</div>' +
        '<p class="muted" style="max-width:50ch">Seu chamado já está na fila do técnico, na posição da prioridade ' + esc(t.pri.toLowerCase()) + '. Primeiro atendimento previsto: <b>' + esc(TF.SLA[t.pri]) + '</b>.</p>' +
        '<div class="note timeline"><b>E agora?</b><br>1. Um técnico assume o chamado.<br>2. Você acompanha o status em “Meus chamados recentes”.<br>3. O técnico registra a solução e encerra.</div>' +
        '<div class="row center"><button class="btn btn-primary" data-act="jump" data-n="2">Ver meus chamados</button><button class="btn btn-ghost" data-act="jump" data-n="7">Ver como técnico</button></div></div>';
    }
    var r = TF.RESULTS[S.result];
    var h = stepper(4, 100) + '<div><h1 class="page-title">Confirmar chamado</h1><p class="muted" style="margin-top:6px">Preenchemos tudo com o que você respondeu. Só falta acrescentar o que quiser.</p></div>';
    h += '<section class="card"><div class="row between" style="margin-bottom:14px"><h2>Dados da triagem</h2><span class="badge b-aberto">Preenchido automaticamente</span></div><div class="locked">' +
      '<div class="field"><label for="f1">Categoria identificada</label><input class="input" id="f1" readonly value="' + esc(TF.CATNAME[S.cat]) + '"></div>' +
      '<div class="field"><label for="f2">Prioridade calculada</label><input class="input" id="f2" readonly value="' + esc(r.pri) + ' (atendimento ' + esc(TF.SLA[r.pri]) + ')"></div></div>' +
      '<p class="muted small" style="margin-top:10px">' + esc(r.why) + '</p>' +
      '<div class="field" style="margin-top:14px"><label for="f3">Causa provável</label><input class="input" id="f3" readonly value="' + esc(r.cause) + '"></div></section>';
    h += '<section class="card"><h2 style="margin-bottom:14px">Resumo do diagnóstico</h2>' + (S.desc ? '<p style="margin-bottom:14px"><b>Seu relato:</b> ' + esc(S.desc) + '</p>' : '') + pathItems(S.path) +
      '<p class="muted small" style="margin-top:14px">Passos de autoatendimento já tentados: ' + S.checked.length + ' de ' + r.steps.length + '.</p></section>';
    h += '<section class="card stack"><div class="field"><label for="obs">Detalhes adicionais <span class="muted" style="font-weight:400">(opcional)</span></label><textarea class="input" id="obs" placeholder="Algo que o técnico precise saber? Local, horário, mensagens de erro…">' + esc(S.obs) + '</textarea></div>' +
      '<div class="field"><span class="label">Anexos</span><div class="drop"><label class="btn btn-ghost" for="fileIn" style="cursor:pointer">Anexar imagem ou captura de tela</label><input id="fileIn" type="file" accept="image/*" multiple hidden><span class="muted small">PNG ou JPG (no protótipo, só o nome do arquivo é guardado)</span></div>' +
      (S.files.length ? '<div class="files">' + S.files.map(function (f, i) { return '<span class="file">' + esc(f) + '<button data-act="rmfile" data-i="' + i + '" aria-label="Remover ' + esc(f) + '">×</button></span>'; }).join("") + '</div>' : '') + '</div></section>';
    h += '<div class="row between"><button class="btn btn-ghost" data-act="backres">← Voltar à solução</button><button class="btn btn-primary btn-lg" data-act="confirm">Confirmar e Enviar Chamado</button></div>';
    return h;
  }

  /* ---------- 7 · Painel técnico ---------- */
  function s7() {
    var S = TF.S, all = TF.store.tickets;
    function count(s) { return all.filter(function (t) { return t.status === s; }).length; }
    var list = TF.filtered(), t = TF.current();
    var h = '<div><div class="eyebrow">Fila de triagem</div><h1 class="page-title" style="margin-top:4px">Painel do técnico</h1><p class="muted" style="margin-top:6px;max-width:62ch">Cada chamado chega com categoria, prioridade e o caminho do diagnóstico. A triagem evita a primeira rodada de perguntas, estimada em cerca de 6 minutos por chamado.</p></div>';
    h += '<div class="metrics"><div class="metric hl"><b>' + count("Aberto") + '</b><span>Aguardando técnico</span></div><div class="metric"><b>' + count("Em Atendimento") + '</b><span>Em atendimento</span></div><div class="metric"><b>' + count("Concluído") + '</b><span>Concluídos</span></div><div class="metric"><b>' + TF.store.selfServed + '</b><span>Resolvidos por autoatendimento</span></div></div>';

    var filters = [["todos", "Todos (" + all.length + ")"], ["Aberto", "Abertos (" + count("Aberto") + ")"], ["Em Atendimento", "Em atendimento (" + count("Em Atendimento") + ")"], ["Concluído", "Concluídos (" + count("Concluído") + ")"]];
    h += '<div class="tech"><section class="card" style="padding:12px 8px 8px"><div class="between row" style="padding:6px 12px 0"><h2>Fila ordenada por prioridade</h2></div>' +
      '<div class="toolbar"><div class="chips" role="group" aria-label="Filtrar por status">' + filters.map(function (f) { return '<button class="chip" data-act="filter" data-v="' + f[0] + '" aria-pressed="' + (S.filter === f[0]) + '">' + esc(f[1]) + '</button>'; }).join("") + '</div>' +
      '<input class="input" id="q" type="search" placeholder="Buscar chamado…" aria-label="Buscar chamado" value="' + esc(S.q) + '"></div>' +
      '<div class="scroll"><table><thead><tr><th>Chamado</th><th>Prioridade</th><th>Status</th><th>Solicitante</th></tr></thead><tbody>';
    if (!list.length) h += '<tr><td colspan="4" class="empty">Nenhum chamado encontrado com esse filtro.</td></tr>';
    list.forEach(function (x) {
      h += '<tr data-act="sel" data-id="' + esc(x.id) + '" class="' + (S.sel === x.id ? "sel " : "") + (x.status === "Concluído" ? "done" : "") + '" tabindex="0"><td><b>' + esc(x.title) + '</b><br><span class="mono muted small">' + esc(x.id) + ' · ' + esc(x.when) + '</span></td><td>' + pri(x.pri) + '</td><td>' + st(x.status) + '</td><td>' + esc(x.user) + '</td></tr>';
    });
    h += '</tbody></table></div></section>';
    h += t ? detail(t) : '<section class="card muted">Selecione um chamado na fila para ver os detalhes.</section>';
    return h + '</div>';
  }

  function detail(t) {
    var S = TF.S;
    var h = '<section class="card lift stack"><div><div class="row between"><span class="mono" style="font-weight:600">' + esc(t.id) + '</span><span class="row" style="gap:6px">' + pri(t.pri) + st(t.status) + '</span></div><h2 style="font-size:19px;margin-top:8px">' + esc(t.title) + '</h2><p class="muted small" style="margin-top:4px">' + esc(t.user) + ' · ' + TF.catIco(t.cat) + " " + esc(TF.CATNAME[t.cat]) + (t.tech ? ' · Responsável: ' + esc(t.tech) : '') + '</p></div>' +
      '<div><div class="eyebrow" style="margin-bottom:10px">Caminho percorrido na árvore</div>' + pathItems(t.path) + '</div>' +
      '<div><div class="eyebrow" style="margin-bottom:4px">Causa provável</div><p>' + esc(t.cause) + '</p></div>';
    if (t.obs) h += '<div><div class="eyebrow" style="margin-bottom:4px">Observação do solicitante</div><p>' + esc(t.obs) + '</p></div>';
    if (t.files && t.files.length) h += '<div><div class="eyebrow" style="margin-bottom:6px">Anexos</div><div class="files">' + t.files.map(function (f) { return '<span class="file" style="padding:4px 10px">' + esc(f) + '</span>'; }).join("") + '</div></div>';
    if (t.solution) h += '<div class="sol"><b>Solução registrada:</b> ' + esc(t.solution) + '</div>';

    h += '<div class="actions"><div class="eyebrow">Ações</div>';
    if (t.status === "Aberto") {
      h += '<button class="btn btn-primary" data-act="assume">Assumir chamado</button>';
    } else if (t.status === "Em Atendimento") {
      h += '<button class="btn btn-ghost" data-act="release">Devolver à fila</button>';
    } else {
      h += '<button class="btn btn-ghost" data-act="reopen">Reabrir chamado</button>';
    }
    if (t.status !== "Concluído") {
      h += '<div class="field"><label for="sol">Solução aplicada</label><textarea class="input" id="sol" placeholder="O que foi feito para resolver?">' + esc(S.sol) + '</textarea></div><button class="btn btn-ok" data-act="closeticket">Registrar solução e encerrar</button>';
    }
    return h + '</div></section>';
  }

  /* Entrada: devolve o HTML da tela atual */
  v.screen = function () {
    var n = TF.S.screen; if (n === 1) return s1(); if (n === 0) return TF.site[TF.S.page]() + TF.site.footer(); if (n === 2) return '<div class="inicio">' + s2() + '</div>'; return '<div class="wrap app"><div class="screen">' + [null, s1, s2, s3, s4, s5, s6, s7][n]() + '</div></div>';
  };
})();
