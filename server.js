import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import https from 'https';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// ✅ Vérifier si la clé API est définie (si besoin)
const API_KEY = process.env.LIBRE_QUOTES_API_KEY; // Remplacez par votre clé si l'API en a besoin

// ✅ Force IPv4 pour éviter les erreurs de DNS
const agent = new https.Agent({ family: 4 });

/**
 * Route principale - Test du serveur
 */
app.get('/', (req, res) => {
    res.send("🚀 Serveur de Citations en ligne !");
});

/**
 * Route pour obtenir une citation aléatoire depuis l'API LibreQuotes
 */
app.get('/quote', async (req, res) => {
    try {
        console.log("🔍 Récupération d'une citation depuis LibreQuotes...");

        // URL de l'API LibreQuotes
        const url = "https://api.librequotes.com/v1/random?format=json";

        // Ajout de la clé API si nécessaire
        const headers = API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {};

        // Effectuer la requête avec un agent HTTPS pour éviter les erreurs DNS
        const response = await fetch(url, { agent, headers });

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // ✅ Formater la réponse
        const formattedQuote = {
            quote: data.quote || "Aucune citation trouvée.",
            author: data.author || "Auteur inconnu",
            category: data.category || "Inconnue"
        };

        console.log("✅ Citation reçue:", formattedQuote);

        res.json(formattedQuote);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de la citation:", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
