import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement

const app = express();
const PORT = process.env.PORT || 3000; // 👈 Render définira le port en production

app.use(cors());

// Endpoint pour récupérer une citation
app.get('/quote', async (req, res) => {
    try {
        const response = await fetch('https://api.librequotes.com/v1/random?format=json');
        const data = await response.json();

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Aucune citation trouvée.' });
        }

        const quote = {
            quote: data[0].quote,
            author: data[0].author,
            category: data[0].category || "unknown"
        };

        res.json(quote);
    } catch (error) {
        console.error("Erreur lors de la récupération des citations :", error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
