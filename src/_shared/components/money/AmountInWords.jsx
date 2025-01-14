import React from 'react';
import { ToWords } from 'to-words';

const AmountInWords = ({ amount }) => {
    // Vérifier si le montant est un nombre
    if (typeof amount !== 'number') {
        return <><em>Le montant doit être un nombre.</em></>;
    }

    // Initialiser l'instance ToWords avec le locale pour le français
    const toWords = new ToWords({ localeCode: 'fr-FR' });
    
    // Convertir le montant en lettres
    const amountInWords = toWords.convert(amount, { currency: true }).replace(/,/g, ' et '); // Remplace les virgules par "et"

    return (
        <>{amountInWords.charAt(0).toUpperCase() + amountInWords.slice(1)}</>
    );
};

export default AmountInWords;
