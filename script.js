document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Sections
    const chatSection = document.getElementById('chat-section');
    const storyReviewSection = document.getElementById('story-review-section');
    const enhancedStorySection = document.getElementById('enhanced-story-section');
    const musicOptionsSection = document.getElementById('music-options-section');
    const lyricsSection = document.getElementById('lyrics-section');
    const musicResultSection = document.getElementById('music-result-section');
    
    // DOM Elements - Containers
    const chatContainer = document.getElementById('chat-container');
    const storyContent = document.getElementById('story-content');
    const enhancedContent = document.getElementById('enhanced-content');
    const lyricsContent = document.getElementById('lyrics-content');
    const finalLyrics = document.getElementById('final-lyrics');
    const albumCover = document.getElementById('album-cover');
    const musicAudio = document.getElementById('music-audio');
    
    // DOM Elements - Inputs and Buttons
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const finishStoryBtn = document.getElementById('finish-story-btn');
    const backToChatBtn = document.getElementById('back-to-chat-btn');
    const enhanceStoryBtn = document.getElementById('enhance-story-btn');
    const backToReviewBtn = document.getElementById('back-to-review-btn');
    const toMusicOptionsBtn = document.getElementById('to-music-options-btn');
    const backToEnhancedBtn = document.getElementById('back-to-enhanced-btn');
    const generateLyricsBtn = document.getElementById('generate-lyrics-btn');
    const backToMusicOptionsBtn = document.getElementById('back-to-music-options-btn');
    const generateMusicBtn = document.getElementById('generate-music-btn');
    const downloadBtn = document.getElementById('download-btn');
    const startNewBtn = document.getElementById('start-new-btn');
    
    // Variables
    let chatHistory = [];
    let storyText = '';
    let enhancedStory = '';
    let generatedLyrics = '';
    
    // Add initial assistant message
    addMessage('assistant', 'Hello! I\'d love to help you tell your story. What would you like to share with me today? Feel free to write in any language you prefer.');
    
    // Event Listeners
    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
    
    finishStoryBtn.addEventListener('click', finishStory);
    backToChatBtn.addEventListener('click', function() {
        storyReviewSection.classList.add('hidden');
        chatSection.classList.remove('hidden');
    });
    
    enhanceStoryBtn.addEventListener('click', enhanceStory);
    backToReviewBtn.addEventListener('click', function() {
        enhancedStorySection.classList.add('hidden');
        storyReviewSection.classList.remove('hidden');
    });
    
    toMusicOptionsBtn.addEventListener('click', function() {
        enhancedStorySection.classList.add('hidden');
        musicOptionsSection.classList.remove('hidden');
    });
    
    backToEnhancedBtn.addEventListener('click', function() {
        musicOptionsSection.classList.add('hidden');
        enhancedStorySection.classList.remove('hidden');
    });
    
    generateLyricsBtn.addEventListener('click', generateLyrics);
    backToMusicOptionsBtn.addEventListener('click', function() {
        lyricsSection.classList.add('hidden');
        musicOptionsSection.classList.remove('hidden');
    });
    
    generateMusicBtn.addEventListener('click', generateMusic);
    startNewBtn.addEventListener('click', startNewStory);
    
    // Functions
    async function handleUserMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage('user', message);
        userInput.value = '';
        
        // Add to chat history
        chatHistory.push({
            role: 'user',
            content: message
        });
        
        // Get AI response
        await getAIResponse();
    }
    
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
            // Call our serverless function instead of OpenAI directly
            const response = await fetch('/.netlify/functions/chat-gpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages })
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
            console.error('Error:', error);
            
            // Remove typing indicator
            const indicator = document.querySelector('.typing');
            if (indicator) {
                chatContainer.removeChild(indicator);
            }
            
            // Add error message
            addMessage('system', `Error: ${error.message || 'Something went wrong. Please try again.'}`);
        }
    }
    
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        // Add avatar
        const avatar = document.createElement('span');
        avatar.className = 'avatar';
        
        if (role === 'user') {
            avatar.textContent = '👤';
        } else if (role === 'assistant') {
            avatar.textContent = '🤖';
        } else {
            avatar.textContent = '⚠️';
        }
        
        // Add message content
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        // Add to message div
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        // Add to chat container
        chatContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    function finishStory() {
        // Extract user messages for story
        storyText = '';
        
        chatHistory.forEach(msg => {
            if (msg.role === 'user') {
                storyText += msg.content + '\n\n';
            }
        });
        
        // Display in review section
        storyContent.textContent = storyText;
        
        // Switch sections
        chatSection.classList.add('hidden');
        storyReviewSection.classList.remove('hidden');
    }
    
    async function enhanceStory() {
        // Get updated story text (in case user edited it)
        storyText = storyContent.textContent;
        
        // Show loading state
        enhanceStoryBtn.textContent = 'Enhancing...';
        enhanceStoryBtn.disabled = true;
        
        try {
            // Create system message for enhancement
            const systemMessage = {
                role: 'system',
                content: `You are an insightful writing assistant for Sentimental, an app that helps people transform their personal experiences into meaningful narratives.

Your task is to enhance this personal story while preserving the author's voice and emotional truth. Respond in the same language as the story.

When enhancing:
1. Identify emotional themes and meaningful patterns
2. Add thoughtful observations about the significance of moments described
3. Highlight connections that might not be immediately obvious to the author
4. Maintain the original voice, tone, and language of the story
5. Organize the narrative with a natural flow
6. Keep your enhancement concise but meaningful

The goal is to help the author see deeper meaning in their own story, not to rewrite it.`
            };
            
            // Create messages array
            const messages = [
                systemMessage,
                { role: 'user', content: `Please enhance this personal story: ${storyText}` }
            ];
            
            // Call our serverless function
            const response = await fetch('/.netlify/functions/chat-gpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages })
            });
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Get enhanced story
            enhancedStory = data.choices[0].message.content;
            
            // Format and display enhanced story
            enhancedContent.innerHTML = '';
            
            enhancedStory.split('\n').forEach(paragraph => {
                if (paragraph.trim()) {
                    const p = document.createElement('p');
                    p.textContent = paragraph;
                    enhancedContent.appendChild(p);
                }
            });
            
            // Switch sections
            storyReviewSection.classList.add('hidden');
            enhancedStorySection.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error enhancing story:', error);
            alert(`Error: ${error.message || 'Something went wrong enhancing your story. Please try again.'}`);
        } finally {
            // Reset button
            enhanceStoryBtn.textContent = 'Get Deeper Reflection';
            enhanceStoryBtn.disabled = false;
        }
    }
    
    async function generateLyrics() {
        // Get selected music style
        const musicStyle = document.querySelector('input[name="music-style"]:checked').value;
        
        // Show loading state
        generateLyricsBtn.textContent = 'Generating...';
        generateLyricsBtn.disabled = true;
        
        try {
            // Create system message for lyrics generation
            const systemMessage = {
                role: 'system',
                content: `You are a talented songwriter for Sentimental, an app that transforms personal stories into songs.

Your task is to create meaningful lyrics based on the user's personal story in a ${musicStyle} style. Write the lyrics in the same language as the story.

When creating lyrics:
1. Extract key emotions, themes, and moments from their story
2. Create a chorus that captures the essence of their experience
3. Write verses that tell their story in a poetic way
4. Follow typical ${musicStyle} song structure and style
5. Make the lyrics personal and authentic to their experience
6. Create approximately 2 verses and a chorus

Format the lyrics clearly with "Verse 1:", "Chorus:", "Verse 2:", etc.`
            };
            
            // Create messages array
            const messages = [
                systemMessage,
                { role: 'user', content: `Create ${musicStyle} style lyrics based on this personal story and reflection: 

Original story:
${storyText}

Enhanced reflection:
${enhancedStory}` }
            ];
            
            // Call our serverless function
            const response = await fetch('/.netlify/functions/chat-gpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages })
            });
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Get generated lyrics
            generatedLyrics = data.choices[0].message.content;
            
            // Format and display lyrics
            lyricsContent.innerHTML = '';
            
            generatedLyrics.split('\n').forEach(line => {
                if (line.includes(':')) {
                    // Section header (Verse, Chorus, etc.)
                    const header = document.createElement('h3');
                    header.textContent = line;
                    lyricsContent.appendChild(header);
                } else if (line.trim()) {
                    // Regular line
                    const p = document.createElement('p');
                    p.textContent = line;
                    lyricsContent.appendChild(p);
                } else {
                    // Empty line
                    lyricsContent.appendChild(document.createElement('br'));
                }
            });
            
            // Switch sections
            musicOptionsSection.classList.add('hidden');
            lyricsSection.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error generating lyrics:', error);
            alert(`Error: ${error.message || 'Something went wrong generating lyrics. Please try again.'}`);
        } finally {
            // Reset button
            generateLyricsBtn.textContent = 'Generate Lyrics';
            generateLyricsBtn.disabled = false;
        }
    }
    
    function generateMusic() {
        // For the test version, we'll use placeholder music
        // In the actual implementation, you would call the Suno API here
        
        // Show loading state
        generateMusicBtn.textContent = 'Generating...';
        generateMusicBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Set placeholder music
            musicAudio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
            
            // Create placeholder album cover
            albumCover.innerHTML = `
                <div class="placeholder-album-cover">
                    <div class="album-title">Your Story</div>
                    <div class="album-subtitle">by Sentimental</div>
                </div>
            `;
            
            // Display lyrics in final section
            finalLyrics.innerHTML = lyricsContent.innerHTML;
            
            // Switch sections
            lyricsSection.classList.add('hidden');
            musicResultSection.classList.remove('hidden');
            
            // Reset button
            generateMusicBtn.textContent = 'Create Music';
            generateMusicBtn.disabled = false;
        }, 3000);
    }
    
    function startNewStory() {
        // Reset everything
        chatHistory = [];
        storyText = '';
        enhancedStory = '';
        generatedLyrics = '';
        
        // Clear chat container
        chatContainer.innerHTML = '';
        
        // Add initial assistant message
        addMessage('assistant', 'Hello! I\'d love to help you tell another story. What would you like to share with me today?');
        
        // Reset other sections
        storyContent.textContent = '';
        enhancedContent.innerHTML = '';
        lyricsContent.innerHTML = '';
        finalLyrics.innerHTML = '';
        
        // Show chat section, hide others
        musicResultSection.classList.add('hidden');
        chatSection.classList.remove('hidden');
    }
});
