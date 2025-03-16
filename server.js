import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/quote', async (req, res) => {
    try {
        const response = await fetch('https://api.quotable.io/quotes?author=Alfred%20Jarry');
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ error: "Aucune citation trouvée." });
        }

        const randomQuote = data.results[Math.floor(Math.random() * data.results.length)];
        res.json({ quote: randomQuote.content });
    } catch (error) {
        console.error("Erreur API Quotable:", error);
        res.status(500).json({ error: "Erreur interne." });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
