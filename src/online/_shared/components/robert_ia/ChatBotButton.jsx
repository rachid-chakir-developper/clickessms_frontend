// ChatbotButton.js
import React, { useState } from 'react';
import { Fab, Box, Typography, IconButton, Paper } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import ChatWindow from './ChatWindow';

const ChatbotButton = () => {
    const [open, setOpen] = useState(false);
    const [bubbleVisible, setBubbleVisible] = useState(true);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleBubbleClose = () => {
        setBubbleVisible(false);
    };

    return (
        <>
            {bubbleVisible && !open && (
                <Paper
                    elevation={3}
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 120,
                        p: .5,
                        paddingRight: 3,
                        display: 'flex',
                        alignItems: 'center',
                        maxWidth: 500,
                        borderRadius: '20px 0 0 20px',

                    }}
                >
                    <Typography variant="body2" sx={{fontSize: '15px', fontWeight: 'bold',}}>
                        <IconButton onClick={handleBubbleClose}>
                            <CloseIcon />
                        </IconButton>
                        Bonjour ! Je suis Robert IA, votre assistant de tout les jours.
                    </Typography>
                </Paper>
            )}
            <Fab
                color="primary"
                aria-label="chat"
                onClick={handleOpen}
                sx={{ position: 'fixed', bottom: 16, right: 80 }}
            >
                <SmartToyIcon sx={{ width: '120px' }} />
            </Fab>
            <ChatWindow open={open} onClose={handleClose} />
        </>
    );
};

export default ChatbotButton;
