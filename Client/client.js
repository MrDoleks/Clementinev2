//NOTE: async enables promise-based behavior in the program
function speech(phrase) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = phrase;

    /*
    window.speechSynthesis.getVoices().find(v => v.name === 'Melina').join(', ')
    
    > Alex, Alice, Alva, Amelie, Anna, Carmit, Damayanti, Daniel, Diego, Ellen, Fiona, Fred, Ioana,
    Joana, Jorge, Juan, Kanya, Karen, Kyoko, Laura, Lekha, Luca, Luciana, Maged, Mariska, Mei-Jia,
    Melina, Milena, Moira, Monica, Nora, Paulina, Rishi, Samantha, Sara, Satu, Sin-ji, Tessa,
    Thomas, Ting-Ting, Veena, Victoria, Xander, Yelda, Yuna, Yuri, Zosia, Zuzana
    
    EN voice: "Alex:en-US, Daniel:en-GB, Fiona:en-scotland, Fred:en-US, Karen:en-AU, Moira:en-IE, Rishi:en-IN, Samantha:en-US, Tessa:en-ZA, Veena:en-IN, Victoria:en-US"

    window.speechSynthesis.getVoices().find(v => v.name === 'Melina')
    */
    const voiceToUse = 'Victoria';
    speech.voice = window.speechSynthesis.getVoices().find(v => v.name === voiceToUse);

    // speech.volume = 1; // Not sure if this is a percentage or something else
    // speech.rate = 1;
    // speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

async function handleSubmit() {
    try { //try statement allows to check for errors 
        // Set loading to true, or in other words, update the elements' content to be in the loading state
        document.querySelector("#out").innnerText = "loading...";
        //checks if checkbox is selected
        const search = document.querySelector("#searchMode").checked; 
        // Ternary, if the search is true then set the url equal to the url to the left side of the colon, else set it to the url on the right side of the colon. 
        const url = search ? "http://localhost:3000/search" : "http://localhost:3000/chat"; 
        const response = await fetch(url, {
            method: "POST",
        //sets the body of the request equal to input provided by user
            body: document.querySelector("#in").value,
        });
        const responseData = await response.json(); //NOTE: const determines that the value of the constant cannot be altered
        let responsePhrase;
        if (search) {
            // Extracts the plaintext from wolfram data api response 
            const data = responseData.queryresult.pods
                // strings in JS resolve to false if empty, so remove any results with not plaintext answers using filter
                .filter((item) => item.subpods[0].plaintext)
                // Map takes an array and for every item in that array makes 
                .map((item) => `${item.id}: ${item.subpods[0].plaintext}`)
                // determines how many pods are in output
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
                .slice(0, 3);
            responsePhrase = data.join("\n\n");
        } else {
            // Botlibre version
            responsePhrase = responseData.message
                .replace('Brain Bot', 'Clementine').replace('Paphus Solutions', 'David Oleksy').replace('Admin', 'my admin, David').replace('Male', 'David');
        }
        document.querySelector("#out").innerText = responsePhrase;
        speech(responsePhrase);
    } catch (error) {
        console.log("fails request", error)
    }
}
function clearText(){
    document.querySelector("#in").value = '';
}