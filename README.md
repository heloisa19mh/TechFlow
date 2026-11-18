# TechFlow · Suporte Inteligente de TI

Protótipo navegável de uma plataforma de suporte inteligente de TI, desenvolvido para a disciplina de Laboratório de Inovação.

O TechFlow orienta o usuário na identificação e resolução de problemas técnicos por meio de um fluxo interativo de diagnóstico. Quando necessário, permite registrar chamados com informações previamente preenchidas.

## Acesse o projeto

🌐 **[Acessar o TechFlow](https://heloisa19mh.github.io/TechFlow/)**

O projeto está disponível para navegação diretamente pelo navegador.

## Como executar

Para executar localmente, abra o arquivo `index.html` no navegador. Não é necessário instalar dependências.

## Funcionalidades

- Acesso com escolha de perfil: Solicitante ou Técnico.
- Página inicial com atalhos, resumo e meus chamados.
- Identificação da categoria do problema com sugestão automática.
- Diagnóstico interativo com perguntas de sim ou não.
- Orientações de solução passo a passo.
- Abertura de chamados com informações pré-preenchidas e anexos.
- Painel técnico com fila por prioridade, filtros, busca e gerenciamento de chamados.

## Estrutura do projeto

| Arquivo | Função |
|---|---|
| `index.html` | Estrutura da página e carregamento dos arquivos |
| `css/styles.css` | Estilos principais da aplicação |
| `css/dusk.css` | Tema visual Dusk |
| `js/site.js` | Páginas do site: Início, Como funciona, Categorias, Prioridades e Ajuda |
| `js/data.js` | Categorias, árvore de perguntas, soluções e chamados de exemplo |
| `js/state.js` | Estado da aplicação, salvamento no navegador e funções auxiliares |
| `js/views.js` | As 7 telas do MVP |
| `js/app.js` | Navegação, ações e eventos |

## As 7 telas do MVP

1. **Acesso:** escolha de perfil entre Solicitante e Técnico.
2. **Início:** atalhos, resumo e meus chamados.
3. **Categoria do problema:** sugestão automática conforme o texto digitado.
4. **Diagnóstico:** perguntas de sim ou não, com atalhos de teclado 1, 2 e 3.
5. **Solução:** orientações passo a passo, com opção de abrir chamado.
6. **Chamado:** formulário pré-preenchido, com anexos.
7. **Painel do técnico:** fila por prioridade, filtros, busca, assumir e encerrar chamados.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript

## Armazenamento

O protótipo funciona diretamente no navegador, sem backend ou banco de dados. Os chamados criados são armazenados localmente por meio do `localStorage`.

## Dicas para a apresentação

- Utilize o **Modo de demonstração**, disponível no rodapé, para navegar entre as telas.
- Os chamados criados ficam salvos no navegador.
- Para voltar ao estado inicial, utilize a opção **Restaurar dados de exemplo**.
- Para criar novos problemas, edite `TF.TREE` e `TF.RESULTS` em `js/data.js`.
