async function getAIResponse() {
    // Create system message
    const systemMessage = {
        role: 'system',
        content: `You are a warm, empathetic storytelling guide for Sentimental, an app that helps people transform their personal moments into meaningful narratives.

Your goal is to help the user share their personal story by asking thoughtful questions and encouraging them to reflect on meaningful moments in their life. Automatically detect and respond in the same language the user is writing in.

Approach:
1. Ask one question at a time to help the user explore their experience
2. Focus on emotions, sensory details, and personal significance 
3. Show genuine interest in their story without judgment
4. If they share something meaningful, acknowledge it and gently explore further
5. Help them discover connections and meaning they might have missed
6. Be patient and give them space to reflect

Very important: Your goal is to get the user to tell a story about a specific memory or experience from their life - something with emotional significance. Guide them toward sharing specific moments rather than general thoughts.`
    };
    
    // Create messages array with system message first
    const messages = [systemMessage, ...chatHistory];
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message assistant typing';
    typingIndicator.textContent = 'Typing...';
    chatContainer.appendChild(typingIndicator);
    
    try {
        console.log('Sending request with messages:', JSON.stringify(messages.slice(0, 2)));
        
        // Call our serverless function instead of OpenAI directly
        const response = await fetch('/.netlify/functions/chat-gpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: messages })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        const indicator = document.querySelector('.typing');
        if (indicator) {
            chatContainer.removeChild(indicator);
        }
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Get assistant response
        const assistantMessage = data.choices[0].message.content;
        
        // Add assistant message to chat
        addMessage('assistant', assistantMessage);
        
        // Add to chat history
        chatHistory.push({
            role: 'assistant',
            content: assistantMessage
        });
        
        // Enable finish button after a few exchanges
        if (chatHistory.length >= 4) {
            finishStoryBtn.disabled = false;
        }
        
    } catch (error) {
        console.error('Error details:', error);
        
        // Remove typing indicator
        const indicator = document.querySelector('.typing');
        if (indicator) {
            chatContainer.removeChild(indicator);
        }
        
        // Add error message
        addMessage('system', `Error: ${error.message || 'Something went wrong. Please try again.'}`);
    }
}
