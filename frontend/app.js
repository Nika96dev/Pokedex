// frontend/app.js
async function searchPokemon() {
    const input = document.getElementById('pokemonInput');
    const resultDiv = document.getElementById('result');
    const image = document.getElementById('pokemonImage');
    const errorMessage = document.getElementById('errorMessage');

    resultDiv.classList.add('hidden');
    errorMessage.textContent = '';

    try {
        const response = await fetch(`http://localhost:3000/api/pokemon/${encodeURIComponent(input.value)}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }

        const data = await response.json();
        
        image.src = data.image;
        image.alt = `Immagine di ${data.name}`;
        resultDiv.classList.remove('hidden');
    } catch (error) {
        errorMessage.textContent = error.message;
        resultDiv.classList.remove('hidden');
    }
}