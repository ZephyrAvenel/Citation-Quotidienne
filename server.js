import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config(); // Charger les variables d'environnement

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_NINJAS_KEY; // Clé API Ninjas stockée dans .env

app.use(cors());

// ✅ Endpoint pour récupérer une citation d'Alfred Jarry via l'API Ninjas
app.get('/quote', async (req, res) => {
    try {
        console.log("📡 Fetching quote from API Ninjas...");

        const author = "Alfred Jarry"; // Auteur souhaité
        const url = `https://api.api-ninjas.com/v1/quotes?author=${encodeURIComponent(author)}`;
        
        const response = await fetch(url, {
            headers: {
                'X-Api-Key': API_KEY // Ajouter la clé API dans les en-têtes
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur API Ninjas: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            return res.status(404).json({ error: "Aucune citation trouvée pour cet auteur." });
        }

        console.log("✅ API Response:", data);
        res.json({ quote: data[0].quote });

    } catch (error) {
        console.error("❌ Erreur lors de la récupération de la citation :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
