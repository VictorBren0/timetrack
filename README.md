<h1 align="center">⏱️ Timetrack</h1>

Timetrack é um PWA desenvolvido com React, com o objetivo de ajudar usuários a resolver problemas de gestão de horários.

## :page_facing_up: Explicação

A tela inicial apresenta uma visão geral das atividades diárias, permitindo que os usuários vejam rapidamente suas tarefas pendentes e concluídas. Além disso, há uma seção dedicada para adicionar novas atividades, onde os usuários podem inserir detalhes como título e horário. Para melhorar o aplicativo, oferece um dashboard com estatísticas detalhadas sobre o uso do tempo, ajudando os usuários a identificar padrões e otimizar sua produtividade.


## 📸 Capturas de Tela
<table>
  <tr>
    <td><img width="300" src="https://github.com/user-attachments/assets/60ba7c29-115c-4ee0-adb8-38cb493ee9cf" /></td>
    <td><img width="300" src="https://github.com/user-attachments/assets/a001897b-36f1-4809-8b32-fbb44ef3c80b" /></td>
    <td><img width="300" src="https://github.com/user-attachments/assets/320a5084-30e0-4191-8133-e09149fc3cbd" /></td>
  <tr>
    <td><img width="300" src="https://github.com/user-attachments/assets/8cff3a83-558e-4c69-91fd-7351125c3f00" /></td>
    <td><img src="https://github.com/user-attachments/assets/8e694a83-d5d1-4bfd-b2f5-8232bc7b8ecb" width="300"/></td>
    <td><img src="https://github.com/user-attachments/assets/e3a10d6c-f4a3-427d-9081-db402c1b0178" width="300"/></td>
  </tr>
</table>

## 📁 Telas

O APP é composto por 5 telas diferentes:

- **Login:** Tela inicial para acesso ao app. O usuário informa seu e-mail e senha para entrar em sua conta e visualizar suas tarefas.
- **Cadastro:** Permite que novos usuários criem uma conta, preenchendo informações como e-mail e senha para começar a usar o aplicativo.
- **Home:** Exibe todas as tarefas cadastradas pelo usuário, com opções para adicionar, editar ou excluir tarefas.
- **Dashboard:** Apresenta estatísticas detalhadas sobre a gestão do tempo, ajudando os usuários a analisar seu desempenho.
- **Perfil:** Permite que os usuários visualizem suas informações pessoais e façam logout da conta.

## :dart: Funcionalidades Implementadas

:heavy_check_mark: Listagem dinâmica de tarefas;\
:heavy_check_mark: Adição de novas tarefas com validação de campos;\
:heavy_check_mark: Edição e exclusão de tarefas existentes;\
:heavy_check_mark: Dashboard com gráficos e estatísticas;\
:heavy_check_mark: Autenticação de usuários com Firebase;\
:heavy_check_mark: Design responsivo para diferentes dispositivos;\
:heavy_check_mark: Armazenamento local de dados;\
:heavy_check_mark: Notificações para lembrar de tarefas pendentes;\
:heavy_check_mark: Sincronização de dados com Firebase.
:heavy_check_mark: Analytics com Firebase.

## :rocket: Tecnologias

As seguintes ferramentas foram utilizadas neste projeto:

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [Firebase](https://firebase.google.com/)

## :closed_book: Requisitos ##

Antes de começar, você precisa ter [Git](https://git-scm.com) e [Node.js](https://nodejs.org/) instalados em seu computador.

Adicione a variável de ambiente do Firebase no arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## :checkered_flag: Getting Started ##

```bash
# Clone o projeto
$ git clone https://github.com/VictorBren0/timetrack.git

# Accesso
$ cd timetrack

# Instalando dependencias
$ npm install

# Rodando o projeto
$ npm run dev

```
