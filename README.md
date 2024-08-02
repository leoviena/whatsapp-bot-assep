# WhatsApp Bot for ASSEP

Este é um projeto de bot para WhatsApp desenvolvido para a ASSEP, utilizando a biblioteca `whatsapp-web.js`.

## Visão Geral

O projeto consiste em um bot que interage com os usuários através do WhatsApp, utilizando a biblioteca `whatsapp-web.js` para conectar e enviar mensagens. Este bot pode ser utilizado para automatizar respostas a perguntas frequentes, fornecer informações sobre serviços e muito mais.

## Funcionalidades

- Responder automaticamente a mensagens recebidas.
- Enviar mensagens programadas.
- Gerenciar conversas e interações com usuários.
- Enviar mensagens de boas-vindas.

## Requisitos

- Node.js (versão 12 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Conta no WhatsApp

## Instalação

Siga os passos abaixo para configurar e executar o projeto:

### 1. Clonar o Repositório

```bash
git clone https://github.com/leoviena/whatsapp-bot-assep.git
cd whatsapp-bot-assep
```

### 2. Instalar Dependências
```bash
npm install
```
### 3. Configurar o Ambiente
Renomeie o arquivo .env.example para .env e configure as variáveis de ambiente conforme necessário.

### 4. Executar o Projeto
node index.js

### Uso 

## Iniciar o Bot
Execute o comando acima para iniciar o bot. Você verá um QR code no terminal. Escaneie o QR code com seu aplicativo WhatsApp para autenticar o bot.

## Enviar Mensagens
O bot responderá automaticamente a qualquer mensagem recebida. Você pode personalizar as respostas editando o arquivo index.js.

## Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Agradecimentos
Este projeto utiliza a biblioteca [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js), desenvolvida por Pedro Lopez. Agradecemos ao desenvolvedor e à comunidade por disponibilizar e manter essa ferramenta que facilita a integração com o WhatsApp.
