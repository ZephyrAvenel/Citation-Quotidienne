import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

// Charger les variables d'environnement
dotenv.config();

// Désactiver la vérification SSL temporairement pour éviter CERT_HAS_EXPIRED
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Endpoint pour récupérer une citation d'Alfred Jarry
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
        console.error("Erreur lors de la récupération de la citation :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// Endpoint pour traduire une citation avec Google Translate API
app.get('/translate', async (req, res) => {
    const textToTranslate = req.query.text;
    const targetLanguage = req.query.target || 'en';
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!textToTranslate) {
        return res.status(400).json({ error: 'Le texte à traduire est requis.' });
    }

    try {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?q=${encodeURIComponent(textToTranslate)}&target=${targetLanguage}&key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            return res.status(data.error.code).json({ error: data.error.message });
        }

        res.json({ translatedText: data.data.translations[0].translatedText });
    } catch (error) {
        console.error('Erreur lors de la traduction :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

// Lancer le serveur sur le port défini par Render
app.listen(PORT, () => {
    console.log(`✅ Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
