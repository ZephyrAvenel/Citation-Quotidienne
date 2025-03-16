import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import https from 'https';  // Ajout pour gérer SSL

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Ignorer les erreurs SSL
const agent = new https.Agent({ rejectUnauthorized: false });

app.get('/quote', async (req, res) => {
    try {
        console.log("Fetching quote from Quotable API...");
        const response = await fetch('https://api.quotable.io/quotes?author=Alfred%20Jarry', { agent });
        const data = await response.json();

        console.log("API Response:", data);

        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ error: "Aucune citation trouvée." });
        }

        const randomQuote = data.results[Math.floor(Math.random() * data.results.length)];
        res.json({ quote: randomQuote.content });
    } catch (error) {
        console.error("Erreur lors de la récupération de la citation :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
