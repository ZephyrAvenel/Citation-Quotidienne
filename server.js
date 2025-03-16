// Importation des modules nécessaires
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Charger les variables d’environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_NINJAS_KEY; // Assurez-vous que cette clé est bien définie dans votre fichier .env

// Middleware
app.use(cors());

// 🚀 Endpoint pour récupérer une citation depuis l'API Ninjas
app.get('/quote', async (req, res) => {
    try {
        console.log("🔄 Fetching quote from API Ninjas...");

        // Construire l'URL de l'API
        const url = `https://api.api-ninjas.com/v1/quotes`;
        
        // Effectuer la requête à l'API avec la clé d'API
        const response = await fetch(url, {
            headers: { 'X-Api-Key': API_KEY }
        });

        const data = await response.json();
        console.log("✅ API Response:", data);

        // Vérifier si l'API a bien retourné une citation
        if (data.length > 0) {
            res.json({
                quote: data[0].quote,
                author: data[0].author,  // ✅ Ajout de l’auteur
                category: data[0].category
            });
        } else {
            res.status(404).json({ error: "Aucune citation trouvée" });
        }

    } catch (error) {
        console.error("❌ Erreur lors de la récupération de la citation :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
