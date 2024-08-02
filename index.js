const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// URLs do site da ASSEP
const urls = {
    cursos: "https://moeda.assep.org.br/subscription/",
    doacoes: "https://doe.assep.org.br/",
    voluntariado: "https://docs.google.com/forms/d/e/1FAIpQLSdyG7tv-DRvEHyVCaKvlC8_2UB-eWdUsNdLBxjV990yNmshqw/viewform?pli=1"
};

// Lista de projetos
const projetos = [
    "NASA - Núcleo de Amparo Social e Acadêmico",
    "AMPARO SOCIAL",
    "ACADÊMICO SOCIAL",
    "AMGI - Apoio a Mulheres na Gravidez Integral",
    "ATENDIMENTO DIÁRIO",
    "ACOLHIMENTO SAMUEL"
];

// Cria uma nova instância do cliente
const client = new Client();

client.on('qr', (qr) => {
    // Gera o código QR no terminal para que o usuário possa escanear e autenticar
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente está pronto!');
    // Envia uma mensagem para um número específico (apenas para teste)
    client.sendMessage('5561987654321@c.us', 'Olá do whatsapp-web.js!');
});

const userState = {};  // Armazena o estado da conversa para cada usuário

client.on('message', message => {
    handleIncomingMessage(message);
});

client.initialize();

function handleIncomingMessage(message) {
    const chatId = message.from;
    const text = message.body.toLowerCase();

    if (!userState[chatId]) {
        userState[chatId] = {};
    }

    switch (userState[chatId].state) {
        case 'cursos':
            handleCursosFlow(message);
            break;
        case 'doacoes':
            handleDoacoesFlow(message);
            break;
        case 'projetos':
            handleProjetosFlow(message);
            break;
        case 'voluntariado':
            handleVoluntariadoFlow(message);
            break;
        default:
            sendMainMenu(message);
            break;
    }
}

function sendMainMenu(message) {
    const chatId = message.from;
    userState[chatId].state = 'main_menu';
    const menu = `
    Olá! Como posso ajudar você hoje? Escolha uma das opções abaixo:
    1. Informações sobre projetos
    2. Cursos abertos
    3. Seja voluntário
    4. Faça sua doação
    5. Fale com um atendente
    `;
    client.sendMessage(chatId, menu);
}

function handleCursosFlow(message) {
    const chatId = message.from;
    const text = message.body.toLowerCase();
    if (!userState[chatId].cpfSolicitado) {
        client.sendMessage(chatId, 'Para se inscrever em nossos cursos, insira seu CPF (apenas números):');
        userState[chatId].cpfSolicitado = true;
    } else if (text.match(/^\d{11}$/)) {
        submitCpfForCursos(chatId, text);
        userState[chatId].state = null;
        userState[chatId].cpfSolicitado = false;
    } else {
        client.sendMessage(chatId, 'CPF inválido. Por favor, insira seu CPF (apenas números):');
    }
}

async function submitCpfForCursos(chatId, cpf) {
    try {
        const response = await axios.post(urls.cursos, {
            cpf: cpf,
            acao: 'Entrar'
        });

        if (response.status === 200) {
            client.sendMessage(chatId, `Cadastro realizado com sucesso. Para mais detalhes, visite: ${urls.cursos}`);
        } else {
            client.sendMessage(chatId, 'Houve um problema ao realizar o cadastro. Por favor, tente novamente mais tarde.');
        }
    } catch (error) {
        client.sendMessage(chatId, 'Houve um problema ao realizar o cadastro. Por favor, tente novamente mais tarde.');
    }
}

function handleDoacoesFlow(message) {
    const chatId = message.from;
    const text = message.body.toLowerCase();
    if (text.includes('menu')) {
        sendMainMenu(message);
        return;
    }
    client.sendMessage(chatId, `Você pode fazer uma doação em: ${urls.doacoes}`);
    userState[chatId].state = null;
}

function handleProjetosFlow(message) {
    const chatId = message.from;
    const text = message.body.toLowerCase();
    if (text.includes('menu')) {
        sendMainMenu(message);
        return;
    }
    const projetosList = projetos.map((projeto, index) => `${index + 1}. ${projeto}`).join('\n');
    client.sendMessage(chatId, `Aqui estão os projetos disponíveis:\n${projetosList}\nDigite 'menu' para voltar ao menu principal.`);
    userState[chatId].state = null;
}

function handleVoluntariadoFlow(message) {
    const chatId = message.from;
    const text = message.body.toLowerCase();
    if (text.includes('menu')) {
        sendMainMenu(message);
        return;
    }
    client.sendMessage(chatId, `Você pode se inscrever como voluntário em: ${urls.voluntariado}`);
    userState[chatId].state = null;
}

function handleMainMenuSelection(message, selection) {
    const chatId = message.from;
    switch (selection) {
        case '1':
            userState[chatId].state = 'projetos';
            handleProjetosFlow(message);
            break;
        case '2':
            userState[chatId].state = 'cursos';
            handleCursosFlow(message);
            break;
        case '3':
            userState[chatId].state = 'voluntariado';
            handleVoluntariadoFlow(message);
            break;
        case '4':
            userState[chatId].state = 'doacoes';
            handleDoacoesFlow(message);
            break;
        case '5':
            client.sendMessage(chatId, 'Sua mensagem será respondida por um atendente.');
            userState[chatId].state = null;
            break;
        default:
            client.sendMessage(chatId, 'Opção inválida. Por favor, escolha uma das opções do menu.');
            sendMainMenu(message);
            break;
    }
}

client.on('message', message => {
    const chatId = message.from;
    if (!userState[chatId] || !userState[chatId].state || userState[chatId].state === 'main_menu') {
        const text = message.body.trim();
        handleMainMenuSelection(message, text);
    } else {
        handleIncomingMessage(message);
    }
});
