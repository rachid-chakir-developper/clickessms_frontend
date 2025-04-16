import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Tooltip, MenuItem, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Print } from '@mui/icons-material';
import { GENERATE_PDF_MUTATION } from '../../../../_shared/graphql/mutations/PrinterMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

const GeneratePdfButton = ({ documentType, id, data, apparence="menuItem" }) => {
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const [generatePdf, { loading, error }] = useMutation(GENERATE_PDF_MUTATION);

    const handleClick = async () => {
        try {
            const { data: responseData } = await generatePdf({
                variables: { documentType, id, data },
            });

            const { pdfFile } = responseData.generatePdf;

            if (pdfFile) {
                // Convertir la chaîne base64 en un tableau de bytes
                const byteCharacters = atob(pdfFile); // Décode le base64
                const byteArrays = [];

                // Convertir en tableau d'octets
                for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                    const slice = byteCharacters.slice(offset, offset + 1024);
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    byteArrays.push(new Uint8Array(byteNumbers));
                }

                // Créer un Blob à partir des bytes
                const file = new Blob(byteArrays, { type: 'application/pdf' });

                // Créer un lien pour télécharger le fichier
                const link = document.createElement('a');
                link.href = URL.createObjectURL(file);
                link.download = `${documentType}_${id}.pdf`;
                link.click();

                // Afficher un message de succès
                setNotifyAlert({
                    isOpen: true,
                    message: 'PDF exporté avec succès',
                    type: 'success',
                });
            }
        } catch (err) {
            console.error('Error generating PDF:', err);
            setNotifyAlert({
                isOpen: true,
                message: 'Erreur lors de la génération du PDF. ! Veuillez réessayer.',
                type: 'error',
            });
        }
    };
    
    return (
        <>
        
            {apparence === 'menuItem' && (
                <MenuItem onClick={handleClick} disabled={loading}>
                    {loading ? (
                    <CircularProgress size={24} sx={{ marginRight: 2 }} />
                    ) : (
                    <Print fontSize="small" sx={{ mr: 2 }} />
                    )}
                    Imprimer
                </MenuItem>
            )}

            {apparence === 'iconButton' && (<Tooltip title="Imprimer">
                <IconButton onClick={handleClick} disabled={loading}>
                    {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                    <Print />
                    )}
                </IconButton>
            </Tooltip>
            )}
        </>
    );
};

export default GeneratePdfButton;
