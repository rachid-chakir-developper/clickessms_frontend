import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Tooltip, MenuItem, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import { PictureAsPdf, Print } from '@mui/icons-material';
import { GENERATE_PDF_MUTATION } from '../../../../_shared/graphql/mutations/PrinterMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

const GeneratePdfButton = ({ documentType, id, data, apparence="menuItem", title="Imprimer" }) => {
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const [generatePdf, { loading, error }] = useMutation(GENERATE_PDF_MUTATION);

    const handleClick = async () => {
        try {
            const { data: responseData } = await generatePdf({
                variables: { documentType, id, data },
            });

            const { pdfFile } = responseData.generatePdf;

            if (pdfFile) {
                const byteCharacters = atob(pdfFile);
                const byteArrays = [];
            
                for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                    const slice = byteCharacters.slice(offset, offset + 1024);
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    byteArrays.push(new Uint8Array(byteNumbers));
                }
            
                const file = new Blob(byteArrays, { type: 'application/pdf' });
            
                const fileURL = URL.createObjectURL(file);
            
                // Ouvrir dans un nouvel onglet
                window.open(fileURL, '_blank');
            
                // Télécharger automatiquement
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = `${documentType}_${id}.pdf`;
                link.click();
            
                // Nettoyer l'URL après un délai
                setTimeout(() => {
                    URL.revokeObjectURL(fileURL);
                }, 100);
            
                // Message de succès
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

            {apparence === 'iconButton' && (<Tooltip title={title}>
                <IconButton onClick={handleClick} disabled={loading}>
                    {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                    <Print />
                    )}
                </IconButton>
            </Tooltip>
            )}

            {apparence === 'iconButtonExport' && (<Tooltip title={title}>
                <IconButton onClick={handleClick} disabled={loading}>
                    {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                    <PictureAsPdf />
                    )}
                </IconButton>
            </Tooltip>
            )}
        </>
    );
};

export default GeneratePdfButton;
