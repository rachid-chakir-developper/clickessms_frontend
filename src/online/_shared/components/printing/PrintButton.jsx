import React from 'react';
import { Tooltip, MenuItem, IconButton } from '@mui/material';
import { Print } from '@mui/icons-material';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

const PrintButton = ({ options={type: null, data:null}, title = 'Imprimer.', apparence="iconBoton" }) => {
    const  { setPrintingModal } = useFeedBacks();
    const onOpenModalToPrint = () => {
      setPrintingModal({
          isOpen: true,
          ...options,
          onClose: () => { 
            setPrintingModal({isOpen: false})
            }
        })
    }

    return (
        <Tooltip title={title}>
            {apparence==='menuItem' && <MenuItem
                onClick={onOpenModalToPrint}
            >
                <Print fontSize="small" sx={{ mr: 2}} />
                Imprimer
            </MenuItem>}
            
            {apparence==='iconBoton' && <IconButton
                onClick={onOpenModalToPrint}
                >
                <Print />
            </IconButton>}
        </Tooltip>
    );
};

export default PrintButton;
