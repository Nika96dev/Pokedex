// backend/server.js

// =============================================
// IMPORT DELLE DIPENDENZE
// =============================================
import express from 'express';       // Framework per creare il server web
import fetch from 'node-fetch';      // Per fare richieste HTTP a API esterne
import dotenv from 'dotenv';         // Per gestire variabili d'ambiente

// =============================================
// CONFIGURAZIONE INIZIALE
// =============================================
dotenv.config(); // Carica le variabili d'ambiente dal file .env
const app = express(); // Crea un'istanza di Express
const PORT = process.env.PORT || 3000; // Porta del server (da .env o default 3000)

// =============================================
// MIDDLEWARE
// =============================================
// Middleware per gestire CORS (Cross-Origin Resource Sharing)
// Permette al frontend di comunicare con il backend da origini diverse
// IMPORTANTE: In produzione limitare l'accesso solo al dominio del frontend!
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Consenti tutte le origini
  next(); // Passa al prossimo middleware/route
});

// =============================================
// ROTTA PRINCIPALE
// =============================================
/**
 * Endpoint GET per ottenere informazioni base di un Pokémon
 * @param {string} name - Nome del Pokémon (case-insensitive)
 * @returns {Object} JSON con:
 * - name: nome del Pokémon
 * - id: identificativo unico
 * - image: URL immagine ufficiale
 * @throws {404} Se il Pokémon non viene trovato
 * @throws {500} Errore generico del server
 */
app.get('/api/pokemon/:name', async (req, res) => {
  try {
    // 1. Effettua la richiesta alla PokeAPI
    const apiResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${req.params.name.toLowerCase()}` // Case-insensitive
    );

    // 2. Gestione degli errori HTTP
    if (!apiResponse.ok) {
      return res.status(404).json({ error: 'Pokemon non trovato' });
    }

    // 3. Elaborazione dei dati ricevuti
    const rawData = await apiResponse.json();
    
    // 4. Formattazione della risposta per il frontend
    const processedData = {
      name: rawData.name,                   // Nome normalizzato
      id: rawData.id,                       // ID univoco
      image: rawData.sprites.other['official-artwork'].front_default // Immagine ufficiale HD
    };

    // 5. Invia la risposta al client
    res.json(processedData);

  } catch (error) {
    // 6. Gestione degli errori generici
    console.error('Errore nel fetch:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// =============================================
// AVVIO SERVER
// =============================================
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/pokemon/pikachu`);
});

// =============================================
// BEST PRACTICES NOTES
// =============================================
/*
1. Sicurezza:
   - Aggiungere rate limiting per prevenire abusi
   - Implementare helmet per headers sicuri
   - Validare input con express-validator

2. Performance:
   - Aggiungere caching delle risposte (es. con Redis)
   - Implementare timeout per le richieste esterne
   - Usare compressione per le risposte JSON

3. Manutenibilità:
   - Separare le route in file diversi
   - Centralizzare la gestione degli errori
   - Usare logger strutturati (es. Winston)
*/