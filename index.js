const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Cria uma nova instância do cliente
const client = new Client();

client.on('qr', (qr) => {
    // Gera o código QR no terminal para que o usuário possa escanear e autenticar
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente está pronto!');
    // Envia uma mensagem para um número específico
    client.sendMessage('5561987654321@c.us', 'Olá do whatsapp-web.js!');
});

client.on('message', message => {
    if(message.body === 'Oi') {
        client.sendMessage(message.from, 'Olá! Como posso ajudar você hoje?');
    }
});

client.initialize();
