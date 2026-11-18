# TechFlow · Suporte Inteligente de TI (protótipo)

Protótipo navegável para a disciplina de Laboratório de Inovação. Não usa backend nem banco de dados: roda direto no navegador.

## Como executar
Abra o arquivo `index.html` no navegador (duplo clique). Não precisa instalar nada.

## Estrutura
| Arquivo | Função |
|---|---|
| `index.html` | Estrutura da página e carregamento dos arquivos |
| `css/styles.css` + `css/dusk.css` | Visual base das telas + tema "Dusk" (pílula, gradientes, claro/escuro) |
| `js/site.js` | Páginas do site: Início, Como funciona, Categorias, Prioridades e Ajuda |
| `data.js` | Categorias, árvore de perguntas, soluções e chamados de exemplo |
| `state.js` | Estado da aplicação, salvamento no navegador e funções auxiliares |
| `views.js` | As 7 telas do MVP (HTML) |
| `app.js` | Navegação, ações e eventos |

## As 7 telas do MVP
1. Acesso (escolha de perfil: Solicitante ou Técnico)
2. Início (atalhos, resumo e meus chamados)
3. Categoria do problema (com sugestão automática pelo texto digitado)
4. Diagnóstico em perguntas de sim/não (atalhos de teclado 1, 2, 3)
5. Solução passo a passo (resolveu ou abrir chamado)
6. Chamado pré-preenchido, com anexos
7. Painel do técnico (fila por prioridade, filtros, busca, assumir, encerrar)

## Dicas para a apresentação
- Use "Modo demonstração" (rodapé) para pular entre as telas.
- Os chamados criados ficam salvos no navegador (localStorage). Para voltar ao estado inicial, use "Restaurar dados de exemplo".
- Para criar novos problemas, edite `TF.TREE` e `TF.RESULTS` em `data.js`.
