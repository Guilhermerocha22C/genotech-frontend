const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

const responses = {
    1: "Acesse a aba FAQ no menu do site para ver as perguntas frequentes e suas respostas.",
    2: "Você pode explorar tanto a Tabela Periódica quanto as moléculas em 3D na aba Elementos 3D do nosso site. Lá, você encontrará uma visualização interativa da Tabela Periódica e poderá ver modelos 3D detalhados de várias moléculas.",
    3: "Para suporte, você pode entrar em contato conosco através do e-mail suporte@genotech.com ou utilizar o formulário de contato disponível na seção Fale Conosco do site.",
    4: "Por favor, descreva sua dúvida e iremos ajudá-lo o mais rápido possível."
};

function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage !== "") {
        appendMessage(userMessage, 'user-message');
        respondToMessage(userMessage);
        userInput.value = "";
    }
}

function sendMessageOption(option) {
    respondToMessage(option);
}

function appendMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${className}`;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function respondToMessage(message) {
    let response = "Desculpe, eu não entendi isso.";
    if (typeof message === 'number' && responses[message]) {
        response = responses[message];
    } else if (responses[message]) {
        response = responses[message];
    }

    showTypingIndicator();
    setTimeout(() => {
        hideTypingIndicator();
        appendBotResponse(response);
    }, 1000);
}

function appendBotResponse(response) {
    const lastMessage = chatBox.querySelector('.chat-message.bot-message:last-child');
    if (lastMessage && lastMessage.textContent === response) {
        return;
    }
    appendMessage(response, 'bot-message');
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message bot-message';
    typingIndicator.textContent = 'GenoChat está digitando...';
    typingIndicator.id = 'typing-indicator';
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        chatBox.removeChild(typingIndicator);
    }
}

function clearChat() {
    chatBox.innerHTML = '<div class="chat-message bot-message" id="clear-message">Chat limpo.</div>';
    chatBox.scrollTop = chatBox.scrollHeight;
    setTimeout(() => {
        const clearMessage = document.getElementById('clear-message');
        if (clearMessage) {
            chatBox.removeChild(clearMessage);
        }
        appendMessage('Bem-vindo ao GenoChat! Como posso ajudar você hoje?', 'bot-message');
        showOptions();
    }, 3000);
}

function showOptions() {
    const optionsHtml = `
        <div class="options" id="options">
            <button onclick="sendMessageOption(1)">Onde posso encontrar as perguntas frequentes (FAQ)?</button>
            <button onclick="sendMessageOption(2)">Onde posso explorar a Tabela Periódica e moléculas em 3D?</button>
            <button onclick="sendMessageOption(3)">Como posso entrar em contato com o suporte?</button>
            <button onclick="sendMessageOption(4)">Tenho outra dúvida</button>
        </div>
    `;
    const optionsContainer = document.createElement('div');
    optionsContainer.innerHTML = optionsHtml;
    chatBox.appendChild(optionsContainer);
}
