/* =========================================================
   TechFlow · dados fixos do protótipo
   Para ampliar o sistema, edite aqui: categorias, árvore de
   perguntas (TREE), soluções (RESULTS) e chamados de exemplo.
   ========================================================= */
window.TF = window.TF || {};

/* Pessoas da demonstração */
TF.NAMES = { user: "Luany Cardoso", tech: "Lucas Cordeiro" };

/* Categorias */
TF.CATS = [
  { id: "hardware",    name: "Computadores / Hardware",   sub: "Não liga, lento, tela, teclado" },
  { id: "rede",        name: "Internet / Rede",           sub: "Sem conexão, Wi-Fi, VPN" },
  { id: "impressoras", name: "Impressoras & Periféricos", sub: "Impressão, scanner, mouse" },
  { id: "acessos",     name: "Acessos, Contas e Senhas",  sub: "Senha, bloqueio, permissões" },
  { id: "email",       name: "E-mail e Sistemas",         sub: "Outlook, webmail, sistemas internos" }
];

  /* Ícone da categoria (PNG). v = "w" branco (sobre gradiente) ou "b" azul (sobre fundo claro/escuro) */
  TF.icon = function (id, v) {
    return '<img class="ci" src="img/ico-' + id + (v === "b" ? "-b" : "") + '.png" alt="" draggable="false">';
  };
TF.CATNAME = {};
TF.CATS.forEach(function (c) { TF.CATNAME[c.id] = c.name; });

/* Palavras-chave (sem acento) usadas para sugerir a categoria pelo texto digitado */
TF.KEYWORDS = {
  hardware:    ["computador", "notebook", "pc", "monitor", "tela", "teclado", "liga", "desliga", "lento", "trava", "gabinete", "fonte"],
  rede:        ["internet", "wifi", "wi-fi", "rede", "vpn", "conexao", "site", "link", "cabo de rede"],
  impressoras: ["impressora", "imprimir", "impressao", "scanner", "mouse", "toner", "papel", "fila"],
  acessos:     ["senha", "login", "bloqueada", "bloqueio", "acesso", "conta", "permissao", "entrar"],
  email:       ["email", "e-mail", "outlook", "webmail", "sistema", "erp", "caixa de entrada"]
};

/* Tempo-alvo de primeiro atendimento por prioridade (apenas ilustrativo) */
TF.SLA = { "Alta": "até 1 hora", "Média": "até 4 horas", "Baixa": "até 1 dia útil" };
TF.PRI = { "Alta": 0, "Média": 1, "Baixa": 2 };
TF.PCLS = { "Alta": "b-alta", "Média": "b-media", "Baixa": "b-baixa" };
TF.SCLS = { "Aberto": "b-aberto", "Em Atendimento": "b-atend", "Concluído": "b-done" };

/* Árvore de diagnóstico.
   Cada pergunta aponta (y = sim, n = não, u = não sei) para outra pergunta (h2, n1...)
   ou para um resultado (r_...) definido em TF.RESULTS. */
TF.TREE = {
  hardware: { start: "h1", n: {
    h1: { q: "O computador liga a luz do gabinete ao pressionar o botão de ligar?", hint: "Observe o LED frontal do gabinete ou a luz do botão no notebook.", y: "h2", n: "h3", u: "h3" },
    h2: { q: "O monitor mostra alguma imagem?", hint: "Veja também se a luz de status do monitor está acesa.", y: "h4", n: "r_video", u: "r_video" },
    h3: { q: "A régua ou o filtro de linha está com a luz do interruptor acesa?", hint: "Ela fica no próprio interruptor do filtro de linha.", y: "r_fonte", n: "r_power", u: "r_power" },
    h4: { q: "O computador está lento ou trava com frequência?", hint: "Por exemplo, programas levam mais de um minuto para abrir.", y: "r_lento", n: "r_outro", u: "r_outro" } } },
  rede: { start: "n1", n: {
    n1: { q: "Colegas ao lado ou seu celular estão com internet normalmente?", hint: "Teste outro aparelho na mesma rede da empresa.", y: "n2", n: "r_redegeral", u: "r_outro" },
    n2: { q: "O Wi-Fi do seu computador mostra conectado à rede da empresa?", hint: "Veja o ícone de rede perto do relógio.", y: "r_dns", n: "r_wifi", u: "r_wifi" } } },
  impressoras: { start: "p1", n: {
    p1: { q: "A impressora está ligada e sem luzes de erro no painel?", hint: "Luz vermelha ou alaranjada piscando indica erro.", y: "p2", n: "r_imppower", u: "r_imppower" },
    p2: { q: "Os documentos ficam parados na fila de impressão?", hint: "Abra a fila pelo ícone da impressora perto do relógio.", y: "r_fila", n: "r_papel", u: "r_fila" } } },
  acessos: { start: "a1", n: {
    a1: { q: "Aparece a mensagem de conta bloqueada ou desativada?", hint: "Geralmente surge após várias tentativas de senha incorreta.", y: "r_bloqueio", n: "a2", u: "a2" },
    a2: { q: "Você esqueceu a senha atual?", hint: "Se não lembra, a redefinição leva cerca de 2 minutos.", y: "r_senha", n: "r_outro", u: "r_outro" } } },
  email: { start: "e1", n: {
    e1: { q: "Você consegue abrir seu e-mail pelo navegador (webmail)?", hint: "Acesse o endereço de webmail da empresa.", y: "r_outlook", n: "e2", u: "e2" },
    e2: { q: "Colegas do seu setor também estão sem e-mail?", hint: "Pergunte a quem está por perto.", y: "r_mailgeral", n: "r_cred", u: "r_cred" } } }
};

/* Resultados: causa provável, prioridade, tempo estimado e passos de autoatendimento */
TF.RESULTS = {
  r_power: { title: "Computador sem energia", cause: "Possível cabo de alimentação desconectado ou mau contato no filtro de linha", pri: "Média", mins: 25,
    why: "O equipamento não liga, mas a causa mais comum é externa ao computador e pode ser testada em minutos.",
    steps: ["Verifique se o cabo está bem conectado na tomada.", "Teste ligar outro aparelho na mesma tomada.", "Verifique a chave liga/desliga da fonte atrás do gabinete."] },
  r_fonte: { title: "Computador não liga mesmo com energia", cause: "Possível falha na fonte de alimentação do computador", pri: "Alta", mins: 40,
    why: "Há energia na tomada e o equipamento não responde. O usuário fica parado, então a prioridade sobe.",
    steps: ["Confirme que a chave da fonte, atrás do gabinete, está na posição I (ligada).", "Desconecte o cabo de força por 30 segundos e conecte novamente.", "Se for notebook, retire a bateria (se removível), segure o botão de ligar por 15 segundos e ligue com o carregador."] },
  r_video: { title: "Computador ligado sem imagem", cause: "Possível cabo de vídeo solto ou monitor na entrada errada", pri: "Média", mins: 20,
    why: "O computador funciona; o problema costuma estar na conexão com o monitor.",
    steps: ["Reconecte o cabo de vídeo nas duas pontas (monitor e computador).", "No monitor, troque a entrada (HDMI, DisplayPort ou VGA) pelo botão de menu.", "Se houver outro monitor livre, teste com ele."] },
  r_lento: { title: "Computador lento ou travando", cause: "Possível excesso de programas abertos ou pouco espaço em disco", pri: "Baixa", mins: 30,
    why: "O trabalho continua possível, apenas mais devagar.",
    steps: ["Feche programas que você não está usando e reinicie o computador.", "Abra o Gerenciador de Tarefas (Ctrl+Shift+Esc) e veja qual programa usa mais memória.", "Confira se o disco C: tem mais de 10% livre e esvazie a lixeira."] },
  r_redegeral: { title: "Sem internet para vários usuários", cause: "Possível queda de rede no setor ou no link de internet", pri: "Alta", mins: 35,
    why: "Mais de uma pessoa está afetada. A equipe de infraestrutura precisa ser avisada logo.",
    steps: ["Confirme se o cabo de rede está encaixado no computador e na parede.", "Reinicie o computador e tente abrir um site.", "Se nada mudar, abra o chamado: a equipe verificará o switch do seu setor."] },
  r_dns: { title: "Conectado sem acesso a sites", cause: "Possível falha de resolução de nomes (DNS) no seu computador", pri: "Média", mins: 25,
    why: "Só o seu computador está afetado e há solução local conhecida.",
    steps: ["Desligue e ligue o Wi-Fi do computador.", "Abra o Prompt de Comando e execute: ipconfig /flushdns", "Reinicie o navegador e tente novamente."] },
  r_wifi: { title: "Wi-Fi desconectado", cause: "Possível Wi-Fi desligado ou rede da empresa fora de alcance", pri: "Baixa", mins: 15,
    why: "Em geral é uma configuração simples do próprio computador.",
    steps: ["Verifique se o modo avião está desligado.", "Selecione a rede da empresa e informe suas credenciais.", "Aproxime-se do ponto de acesso e tente de novo."] },
  r_imppower: { title: "Impressora com erro ou desligada", cause: "Possível papel atolado, tampa aberta ou cabo de energia solto", pri: "Média", mins: 20,
    why: "O erro é físico e costuma ser resolvido no próprio equipamento.",
    steps: ["Confirme que o cabo de energia está firme e a impressora ligada.", "Abra as tampas e retire papel preso, se houver.", "Desligue por 1 minuto e ligue novamente."] },
  r_fila: { title: "Fila de impressão travada", cause: "Possível trabalho de impressão travado na fila", pri: "Baixa", mins: 15,
    why: "É um problema de software comum, com solução rápida.",
    steps: ["Abra a fila de impressão e cancele todos os documentos.", "Reinicie a impressora.", "Envie o documento novamente, uma cópia por vez."] },
  r_papel: { title: "Impressão sai em branco ou falha", cause: "Possível toner ou papel inadequado", pri: "Baixa", mins: 15,
    why: "Sem erro de conexão, o consumível é a causa mais provável.",
    steps: ["Verifique o nível de toner no painel da impressora.", "Confirme se o papel está bem alinhado na bandeja.", "Imprima uma página de teste pelo menu da impressora."] },
  r_bloqueio: { title: "Conta bloqueada", cause: "Conta bloqueada por tentativas incorretas de senha", pri: "Alta", mins: 20,
    why: "Sem acesso à conta o usuário não consegue trabalhar. Só a equipe de TI pode desbloquear.",
    steps: ["Aguarde 15 minutos: alguns bloqueios expiram sozinhos.", "Tente entrar de novo digitando a senha com calma.", "Se o aviso continuar, abra o chamado para desbloqueio."] },
  r_senha: { title: "Senha esquecida", cause: "Senha esquecida, com redefinição disponível por autoatendimento", pri: "Baixa", mins: 20,
    why: "Pode ser resolvido pelo próprio usuário sem apoio da TI.",
    steps: ["Na tela de login, clique em “Esqueci minha senha”.", "Confirme sua identidade pelo e-mail pessoal ou celular cadastrado.", "Crie uma nova senha com 12 caracteres ou mais."] },
  r_outlook: { title: "Aplicativo de e-mail com falha", cause: "Possível perfil do aplicativo de e-mail corrompido ou desatualizado", pri: "Média", mins: 30,
    why: "O webmail funciona, então a conta está ativa e o problema é local.",
    steps: ["Feche completamente o aplicativo de e-mail e abra de novo.", "Use o webmail enquanto resolve, para não parar o trabalho.", "Reinicie o computador e confirme se há atualizações pendentes."] },
  r_mailgeral: { title: "Indisponibilidade de e-mail no setor", cause: "Possível falha no servidor de e-mail ou na conexão do setor", pri: "Alta", mins: 45,
    why: "Vários usuários afetados. O chamado ajuda a agrupar relatos e acelerar o diagnóstico.",
    steps: ["Aguarde 5 minutos e tente novamente.", "Confirme que sua internet está funcionando abrindo outro site.", "Abra o chamado para somar seu relato aos dos colegas."] },
  r_cred: { title: "E-mail sem acesso à conta", cause: "Possível senha expirada ou credenciais salvas desatualizadas", pri: "Média", mins: 25,
    why: "A falha é individual e provavelmente ligada à sua conta.",
    steps: ["Entre no portal de contas e confirme se a senha não expirou.", "Remova a senha salva no aplicativo e entre de novo.", "Se aparecer outro erro, anote a mensagem exata."] },
  r_outro: { title: "Causa não identificada", cause: "A triagem não encontrou uma causa única para este caso", pri: "Média", mins: 15,
    why: "Sem causa clara, o técnico recebe o histórico completo para continuar a partir dele.",
    steps: ["Reinicie o equipamento e teste novamente.", "Anote qualquer mensagem de erro exibida na tela.", "Abra o chamado para atendimento com um técnico."] }
};

/* Chamados de exemplo (usados na primeira abertura e ao restaurar os dados) */
TF.SEED = [
  { id: "#TF-2026-088", title: "Impressora do 2º andar não imprime", cat: "impressoras", pri: "Média", status: "Em Atendimento", user: "Lucas Almeida", tech: "Marina Costa", when: "há 40 min", cause: "Possível trabalho de impressão travado na fila", path: [["A impressora está ligada e sem luzes de erro no painel?", "Sim"], ["Os documentos ficam parados na fila de impressão?", "Sim"]], obs: "Só acontece nessa impressora, as outras do andar funcionam.", files: [] },
  { id: "#TF-2026-087", title: "Redefinição de senha do ERP", cat: "acessos", pri: "Baixa", status: "Concluído", user: "Lucas Almeida", tech: "Marina Costa", when: "ontem", cause: "Senha esquecida, com redefinição disponível por autoatendimento", path: [["Aparece a mensagem de conta bloqueada ou desativada?", "Não"], ["Você esqueceu a senha atual?", "Sim"]], obs: "", files: [], solution: "Senha redefinida pelo portal de contas." },
  { id: "#TF-2026-086", title: "Sem internet no setor financeiro", cat: "rede", pri: "Alta", status: "Aberto", user: "Carla Menezes", tech: "", when: "há 12 min", cause: "Possível queda de rede no setor ou no link de internet", path: [["Colegas ao lado ou seu celular estão com internet normalmente?", "Não"]], obs: "Seis pessoas do financeiro sem acesso desde as 9h.", files: [] },
  { id: "#TF-2026-085", title: "Computador não liga mesmo com energia", cat: "hardware", pri: "Alta", status: "Aberto", user: "Rafael Duarte", tech: "", when: "há 25 min", cause: "Possível falha na fonte de alimentação do computador", path: [["O computador liga a luz do gabinete ao pressionar o botão de ligar?", "Não"], ["A régua ou o filtro de linha está com a luz do interruptor acesa?", "Sim"]], obs: "Testei outra tomada e nada.", files: ["foto-gabinete.jpg"] },
  { id: "#TF-2026-084", title: "Aplicativo de e-mail não abre", cat: "email", pri: "Média", status: "Aberto", user: "Joana Ribeiro", tech: "", when: "há 1 h", cause: "Possível perfil do aplicativo de e-mail corrompido ou desatualizado", path: [["Você consegue abrir seu e-mail pelo navegador (webmail)?", "Sim"]], obs: "", files: [] },
  { id: "#TF-2026-083", title: "Conta bloqueada após troca de senha", cat: "acessos", pri: "Alta", status: "Em Atendimento", user: "Paulo Nogueira", tech: "Marina Costa", when: "há 2 h", cause: "Conta bloqueada por tentativas incorretas de senha", path: [["Aparece a mensagem de conta bloqueada ou desativada?", "Sim"]], obs: "", files: [] },
  { id: "#TF-2026-082", title: "Monitor sem imagem", cat: "hardware", pri: "Média", status: "Concluído", user: "Beatriz Lima", tech: "Marina Costa", when: "ontem", cause: "Possível cabo de vídeo solto ou monitor na entrada errada", path: [["O computador liga a luz do gabinete ao pressionar o botão de ligar?", "Sim"], ["O monitor mostra alguma imagem?", "Não"]], obs: "", files: [], solution: "Cabo HDMI trocado." },
  { id: "#TF-2026-081", title: "Caixa de e-mail cheia", cat: "email", pri: "Baixa", status: "Concluído", user: "Lucas Almeida", tech: "Marina Costa", when: "há 3 dias", cause: "Possível senha expirada ou credenciais salvas desatualizadas", path: [["Você consegue abrir seu e-mail pelo navegador (webmail)?", "Não"], ["Colegas do seu setor também estão sem e-mail?", "Não"]], obs: "", files: [], solution: "Limite da caixa ampliado." }
];
