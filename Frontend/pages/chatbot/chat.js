const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage !== "") {
        appendMessage(userMessage, 'user-message');
        await getResponseFromAPI(userMessage);
        userInput.value = "";
    }
}

async function sendMessageOption(option) {
    const optionText = document.querySelector(`button[onclick="sendMessageOption(${option})"]`).textContent;
    appendMessage(optionText, 'user-message');
    await getResponseFromAPI(optionText);
}

function appendMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${className}`;
    messageElement.innerHTML = message; 
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getResponseFromAPI(message) {
    showTypingIndicator();
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Você é um assistente especializado em genética e biotecnologia para o site GenoTech. Responda à seguinte pergunta: ${message}`
                    }]
                }]
            })
        });

        const data = await response.json();
        hideTypingIndicator();
        if (data.candidates && data.candidates[0].content) {
            appendBotResponse(data.candidates[0].content.parts[0].text);
        } else {
            appendBotResponse("Desculpe, não consegui processar sua solicitação.");
        }
    } catch (error) {
        hideTypingIndicator();
        appendBotResponse(`Erro: ${error.message}`);
    }
}

function appendBotResponse(response) {
    const formattedResponse = response
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        .replace(/__(.*?)__/g, '<u>$1</u>'); 

    appendMessage(formattedResponse, 'bot-message');
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


document.addEventListener('DOMContentLoaded', () => {
    appendMessage('Bem-vindo ao GenoChat! Como posso ajudar você hoje?', 'bot-message');
    showOptions();
});