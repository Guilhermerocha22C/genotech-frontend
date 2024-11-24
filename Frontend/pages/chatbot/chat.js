document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

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
            const response = await fetch('https://genotech-backend.vercel.app/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
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