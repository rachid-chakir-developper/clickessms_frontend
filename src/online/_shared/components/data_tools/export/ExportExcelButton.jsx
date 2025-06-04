import React from 'react';
import { useMutation } from '@apollo/client';
import {
    Tooltip,
    MenuItem,
    IconButton,
    CircularProgress,
    Button,
} from '@mui/material';
import { GridOn, Download, FileDownload } from '@mui/icons-material';
import { EXPORT_EXCEL_MUTATION } from '../../../../../_shared/graphql/mutations/PrinterMutations';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';

const ExportExcelButton = ({ dashboardActivityFilter=null, documentType, id, data, apparence = "menuItem", title = "Exporter en Excel" }) => {
    const { setNotifyAlert } = useFeedBacks();
    const [exportExcel, { loading }] = useMutation(EXPORT_EXCEL_MUTATION);

    const handleClick = async () => {
        try {
            const { data: responseData } = await exportExcel({
                variables: { dashboardActivityFilter, documentType, id, data },
            });

            const { fileBase64 } = responseData.exportExcel;

            if (fileBase64) {
                const byteCharacters = atob(fileBase64);
                const byteArrays = [];

                for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                    const slice = byteCharacters.slice(offset, offset + 1024);
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    byteArrays.push(new Uint8Array(byteNumbers));
                }

                const file = new Blob(byteArrays, {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });

                const fileURL = URL.createObjectURL(file);

                const link = document.createElement('a');
                link.href = fileURL;
                link.download = `${documentType}.xlsx`;
                link.click();

                setTimeout(() => {
                    URL.revokeObjectURL(fileURL);
                }, 100);

                setNotifyAlert({
                    isOpen: true,
                    message: 'Fichier Excel exporté avec succès',
                    type: 'success',
                });
            }

        } catch (err) {
            console.error('Erreur lors de l\'export Excel :', err);
            setNotifyAlert({
                isOpen: true,
                message: 'Erreur lors de l\'export Excel. Veuillez réessayer.',
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
                        <FileDownload fontSize="small" sx={{ mr: 2 }} />
                    )}
                    {title}
                </MenuItem>
            )}

            {apparence === 'iconButton' && (
                <Tooltip title={title}>
                    <IconButton onClick={handleClick} disabled={loading}>
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <FileDownload />
                        )}
                    </IconButton>
                </Tooltip>
            )}

            {apparence === 'iconButtonExport' && (
                <Tooltip title={title}>
                    <IconButton onClick={handleClick} disabled={loading}>
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <FileDownload />
                        )}
                    </IconButton>
                </Tooltip>
            )}

            {apparence === 'buttonExport' && (
                <Tooltip title={title}>
                    <Button variant="outlined" 
                        startIcon={loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <FileDownload />
                        )}
                        onClick={handleClick} disabled={loading}
                    >
                        {title}
                    </Button>
                </Tooltip>
            )}
        </>
    );
};

export default ExportExcelButton;
