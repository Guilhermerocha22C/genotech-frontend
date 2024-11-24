document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    sendButton.onclick = sendMessage;

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage !== "") {
            appendMessage(userMessage, 'user-message');
            await getResponseFromAPI(userMessage);
            userInput.value = "";
        }
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

    appendMessage('Bem-vindo ao GenoChat! Como posso ajudar você hoje?', 'bot-message');
});