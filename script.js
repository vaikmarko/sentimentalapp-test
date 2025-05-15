document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const storyInput = document.getElementById('story-input');
    const enhancedStory = document.getElementById('enhanced-story');
    const musicOptions = document.getElementById('music-options');
    const result = document.getElementById('result');
    
    const userStoryTextarea = document.getElementById('user-story');
    const storyOutput = document.getElementById('story-output');
    const lyricsOutput = document.getElementById('lyrics');
    const musicAudio = document.getElementById('music-audio');
    const albumCover = document.getElementById('album-cover');
    
    // Buttons
    const enhanceStoryBtn = document.getElementById('enhance-story');
    const editStoryBtn = document.getElementById('edit-story');
    const createMusicBtn = document.getElementById('create-music');
    const generateMusicBtn = document.getElementById('generate-music');
    const startOverBtn = document.getElementById('start-over');
    
    // For demo purposes, we'll just use placeholders
    // In the real implementation, these will call APIs
    
    // Enhance Story Button
    enhanceStoryBtn.addEventListener('click', function() {
        const userStory = userStoryTextarea.value.trim();
        
        if (!userStory) {
            alert('Please share your story first.');
            return;
        }
        
        // Show loading state
        enhanceStoryBtn.textContent = 'Transforming...';
        enhanceStoryBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(function() {
            // For demo, just add some enhancements to the original story
            const enhancedContent = enhanceStoryDemo(userStory);
            storyOutput.innerHTML = enhancedContent;
            
            // Show enhanced story section, hide input
            storyInput.classList.add('hidden');
            enhancedStory.classList.remove('hidden');
            
            // Reset button
            enhanceStoryBtn.textContent = 'Transform My Story';
            enhanceStoryBtn.disabled = false;
        }, 2000);
    });
    
    // Edit Story Button
    editStoryBtn.addEventListener('click', function() {
        userStoryTextarea.value = storyOutput.textContent;
        enhancedStory.classList.add('hidden');
        storyInput.classList.remove('hidden');
    });
    
    // Create Music Button
    createMusicBtn.addEventListener('click', function() {
        enhancedStory.classList.add('hidden');
        musicOptions.classList.remove('hidden');
    });
    
    // Generate Music Button
    generateMusicBtn.addEventListener('click', function() {
        // Show loading state
        generateMusicBtn.textContent = 'Generating...';
        generateMusicBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(function() {
            const selectedStyle = document.querySelector('input[name="music-style"]:checked').value;
            
            // For demo, generate placeholder content
            const generatedLyrics = generateLyricsDemo(storyOutput.textContent, selectedStyle);
            lyricsOutput.textContent = generatedLyrics;
            
            // In a real implementation, we would call the Suno API here
            // For now, we'll just use a placeholder audio file
            musicAudio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
            
            // Hide music options, show result
            musicOptions.classList.add('hidden');
            result.classList.remove('hidden');
            
            // Reset button
            generateMusicBtn.textContent = 'Generate Music';
            generateMusicBtn.disabled = false;
        }, 3000);
    });
    
    // Start Over Button
    startOverBtn.addEventListener('click', function() {
        result.classList.add('hidden');
        userStoryTextarea.value = '';
        storyInput.classList.remove('hidden');
    });
    
    // Demo functions (will be replaced with real API calls later)
    function enhanceStoryDemo(story) {
        // Simple enhancement for demo purposes
        const sentences = story.split('. ');
        let enhancedStory = '';
        
        sentences.forEach(sentence => {
            if (sentence) {
                const enhancedSentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
                enhancedStory += `<p>${enhancedSentence}.</p>`;
            }
        });
        
        return enhancedStory;
    }
    
    function generateLyricsDemo(story, style) {
        // Simple lyrics generation for demo
        const words = story.replace(/<\/?p>/g, '').split(' ');
        const keyWords = words.filter(word => word.length > 4).slice(0, 10);
        
        let lyrics = '';
        switch(style) {
            case 'pop':
                lyrics = `Verse 1:\n${keyWords[0]}, ${keyWords[1]}, memories alive\n`;
                lyrics += `The way I felt that day, I can still survive\n`;
                lyrics += `${keyWords[2]}, ${keyWords[3]}, emotions so real\n`;
                lyrics += `This is the story of how I feel\n\n`;
                
                lyrics += `Chorus:\n${keyWords[4]} and ${keyWords[5]}, they shape who I am\n`;
                lyrics += `My life, my story, I'll do what I can\n`;
                lyrics += `${keyWords[6]} and ${keyWords[7]}, they're part of my soul\n`;
                lyrics += `This journey's mine, and I'm in control\n`;
                break;
                
            case 'folk':
                lyrics = `The ${keyWords[0]} was shining through the trees that day\n`;
                lyrics += `When ${keyWords[1]} came along and showed the way\n`;
                lyrics += `${keyWords[2]} whispered secrets only I could hear\n`;
                lyrics += `And ${keyWords[3]} reminded me why I'm here\n\n`;
                
                lyrics += `Oh, ${keyWords[4]}, what a tale to tell\n`;
                lyrics += `Through ${keyWords[5]} and time, I've known it well\n`;
                lyrics += `${keyWords[6]} keeps me standing tall\n`;
                lyrics += `This is my story, I'm living it all\n`;
                break;
                
            default:
                lyrics = `Verse:\nThrough ${keyWords[0]} and ${keyWords[1]}, I found my way\n`;
                lyrics += `${keyWords[2]} taught me lessons that remain today\n`;
                lyrics += `With ${keyWords[3]} and ${keyWords[4]}, the story unfolds\n`;
                lyrics += `These ${keyWords[5]} memories turn into gold\n\n`;
                
                lyrics += `Chorus:\n${keyWords[6]} and ${keyWords[7]}, part of who I am\n`;
                lyrics += `${keyWords[8]} and ${keyWords[9]}, they help me understand\n`;
                lyrics += `This is my journey, my story to tell\n`;
                lyrics += `These moments I've lived, I've lived them well\n`;
        }
        
        return lyrics;
    }
});
