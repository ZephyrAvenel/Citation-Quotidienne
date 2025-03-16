import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {
    const [quote, setQuote] = useState('');
    const [translatedQuote, setTranslatedQuote] = useState('');
    const [language, setLanguage] = useState('en');

    // Fonction pour récupérer une citation d'Alfred Jarry
    const fetchQuote = () => {
        fetch('http://localhost:3000/quote')
            .then(response => response.json())
            .then(data => setQuote(data.quote))
            .catch(error => console.error("Erreur lors de la récupération de la citation :", error));
    };

    useEffect(() => {
        fetchQuote();
    }, []);

    // Fonction pour traduire la citation
    const translateQuote = () => {
        fetch(`http://localhost:3000/translate?text=${encodeURIComponent(quote)}&target=${language}`)
            .then(response => response.json())
            .then(data => setTranslatedQuote(data.translatedText))
            .catch(error => console.error("Erreur lors de la traduction :", error));
    };

    return (
        <div className="container">
            <h1>Citation Quotidienne de Jarry</h1>
            <p className="quote">{quote}</p>
            
            <button onClick={fetchQuote}>Nouvelle Citation</button>

            <div>
                <select onChange={(e) => setLanguage(e.target.value)}>
                    <option value="en">Anglais</option>
                    <option value="es">Espagnol</option>
                    <option value="de">Allemand</option>
                </select>
                <button onClick={translateQuote}>Traduire</button>
            </div>

            {translatedQuote && <p className="translated">{translatedQuote}</p>}
        </div>
    );
}

export default App;
