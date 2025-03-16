import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// ✅ Utilisation de l'API alternative "All-API Quotes"
app.get('/quote', async (req, res) => {
    try {
        console.log("📡 Fetching quote from All-API Quotes...");
        const response = await fetch('https://all-api.fr/api/quotes');
        const data = await response.json();

        console.log("✅ API Response:", data);

        if (!data || !data.quote) {
            return res.status(404).json({ error: "Aucune citation trouvée." });
        }

        res.json({ quote: data.quote });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de la citation :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
