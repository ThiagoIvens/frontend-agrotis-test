🚀 Tecnologias Utilizadas
- React (com TypeScript)
- React Router DOM (Gerenciamento de rotas e layout estrutural)
- Material UI (MUI) (Componentes de interface e estilização)
- Axios (Comunicação HTTP com a API Backend)

📋 Funcionalidades Principais
- Gestão de Produtores (Growers):
    - Listagem centralizada com suporte a dados de produção, comissão e vigência.
    - Modais dedicados para Cadastro e Edição.
    - Seleção única de Laboratório e seleção múltipla de Propriedades Rurais vinculadas.
    - Ações de edição e exclusão com feedback visual via Snackbar.
- Gestão de Laboratórios (Laboratories):
    - Tabela paginada nativa integrada com o backend.
    - Modal de criação e edição de dados cadastrais e financeiros (custos e taxas).
    - Cálculo Financeiro Individual: Botão de ação com ícone e Tooltip que aciona um modal interativo exibindo o valor processado.
- Gestão de Propriedades Rurais (Farmsteads):
    - Tabela paginada para controle de áreas totais em hectares e taxas por hectare.
    - Cadastro de propriedades autônomas para posterior vínculo com produtores.
    - Modal de cálculo financeiro integrado por propriedade.
    - Painel de Indicadores e Relatórios (Report):
- Interface analítica baseada em filtros customizados para consulta de dados consolidados de laboratórios e produtores.

🛠️ Como Executar o Projeto
Pré-requisitos
Certifique-se de ter o Node.js instalado na sua máquina.

1. Clonar o repositório e instalar as dependências

```Bash
git clone <url-do-repositorio>
cd frontend-agrotis-test
npm install --legacy-peer-deps
```

2. Configurar a API
   Certifique-se de que o seu backend em Spring Boot está em execução (geralmente em http://localhost:8080). Ajuste o arquivo de serviço do Axios (src/services/api.ts) caso a URL base seja diferente.

3. Iniciar o ambiente de desenvolvimento

```Bash
npm run dev
```

A aplicação estará acessível no navegador através do endereço fornecido pelo terminal (geralmente http://localhost:5173).

🗂️ Estrutura de Pastas

```Plaintext
src/
├── components/       # Componentes globais (Layout, Navegação, etc.)
├── pages/            # Telas principais da aplicação (Growers, Laboratories, Farmsteads, Reports)
├── services/         # Configuração do cliente HTTP (Axios)
├── types/            # Definições de interfaces e DTOs TypeScript
├── App.tsx           # Configuração de rotas e ThemeProvider
└── main.tsx          # Ponto de entrada da aplicação React
```
