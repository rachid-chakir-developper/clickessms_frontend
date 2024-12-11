import { Box, Typography } from '@mui/material';
import React from 'react';
import { useSession } from '../../../../../_shared/context/SessionProvider';

export default function PurchaseOrderFooterDocument() {
    const { user } = useSession();
    const { company } = user;

    return (
        <Box
            sx={{
                borderTop: '1px solid #ccc',
                padding: '16px',
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="caption" sx={{  color: '#777', textAlign: 'center' }} gutterBottom>
                {company?.name} - 
                {company?.address} - 
                Tél: {company?.phone} - 
                Email: {company?.email} - 
                Iban: {company.iban}
            </Typography>
            <Typography variant="caption" sx={{ marginTop: '10px', color: '#777', textAlign: 'center' }} >
                Ce devis est confidentiel et destiné uniquement à la personne ou à l'entité à qui il est adressé. Toute divulgation, reproduction ou distribution de ce document est interdite sans l'autorisation écrite de {company?.name}.
            </Typography>
        </Box>
    );
}
