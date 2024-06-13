import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    IconButton,
    InputAdornment,
    Avatar, Button, Tooltip
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useMutation} from "@apollo/client";
import {useSession} from "../../../../_shared/context/SessionProvider";
import { USER_QUESTION } from '../../../../_shared/graphql/mutations/RobertIaMutation';

const ChatWindow = ({ open, onClose, }) => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([{ sender: 'bot', text: `Bonjour, je suis ROBERP, votre assistant spécialiste du secteur social et médico-social. Je suis là pour répondre à toutes vos questions et corriger vos écrits professionnels . Comment puis-je vous aider aujourd'hui ?` }]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const messagesEndRef = useRef(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const { user } = useSession();
    const [numberOpenaiTokens, SetNumberOpenaiTokens] = useState();
    const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
        return sessionStorage.getItem('disclaimerAccepted') === 'true';
    });

    const [userQuestion, { loading, error }] = useMutation(USER_QUESTION, {
        onCompleted: (data) => {
            const newAnswer = data.userQuestion.answer;
            SetNumberOpenaiTokens(data.userQuestion?.numberCurrentOpenaiTokens ? data.userQuestion?.numberCurrentOpenaiTokens : numberOpenaiTokens);
            setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: question }, { sender: 'bot', text: newAnswer }]);
            setQuestion('');
        },
        onError: (error) => {
            console.error('Error fetching the answer:', error);
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Une erreur c\'est produite.' }]);
        },
        onFinally: () => {
            setTimeout(() => {
                setIsBlocked(false);
            }, 3000);
        }
    });
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isBlocked) return;

        if (numberOpenaiTokens > 0) {
            setIsBlocked(true);
            try {
                userQuestion({ variables: { question } });
            } catch (error) {
                console.error('Error fetching the answer:', error);
                setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Une erreur c\'est produite.' }]);
            } finally {
                setTimeout(() => {
                    setIsBlocked(false);
                }, 3000);
            }
        } else {
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Vous n\'avez plus de token disponible.' }]);
        }
    };

    useEffect(() => {
        SetNumberOpenaiTokens(user?.numberCurrentOpenaiTokens);
    }, [user]);



    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleDisclaimerAccept = () => {
        setDisclaimerAccepted(true);
        sessionStorage.setItem('disclaimerAccepted', 'true');
    };

    if (!open) {
        return null;
    }

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                bottom: isFullscreen ? 0 : 16,
                right: isFullscreen ? 0 : 16,
                width: isFullscreen ? 'calc(100% - 280px)' : 400,
                height: isFullscreen ? 'calc(100% - 65px)' : 500,
                zIndex: 1300,
                display: 'flex',
                flexDirection: 'column',
            }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #ccc' }}>
                <Tooltip title="ROBERP IA peut faire des erreurs. Envisagez de vérifier les informations importantes!">
                    <Typography variant="h6">Robert IA</Typography>
                </Tooltip>
                <Tooltip title="Nombre d'utilisations restante avant d'être temporairement bloqué">
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        Tokens restants : {numberOpenaiTokens}
                    </Typography>
                </Tooltip>
                <Box>
                    <Tooltip title={isFullscreen ? "Quitter le pleine écran" : "Passer en pleine écran"}>
                        <IconButton onClick={toggleFullscreen}>
                            {isFullscreen ?
                                <FullscreenExitIcon /> : <FullscreenIcon />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Réduire la fenêtre du ChatBot">
                        <IconButton onClick={onClose}>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Box sx={{
                overflowY: 'auto',
                p: 2,
                flex: 1,
                '&::-webkit-scrollbar': {
                    width: '6px',
                    display: 'none'
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '0px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555',
                },
                '&:hover': {
                    '&::-webkit-scrollbar': {
                        display: 'block'
                    }
                },
            }}>
                <List>
                    {messages.map((message, index) => (
                        <ListItem key={index} sx={{
                            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                            textAlign: message.sender === 'user' ? 'right' : 'left',
                        }}>
                            {message.sender === 'bot' && (
                                <Avatar sx={{ mr: 1, mt: 1, }} src="/robertIA_seul.png" />
                            )}
                            <ListItemText sx={{
                                flex: 'initial',
                                backgroundColor: message.sender === 'user' ? '#F4F4F4' : '#FFFFFF',
                                border: message.sender === 'user' ? '1px solid #ccc' : 'none',
                                p: 1,
                                borderRadius: 2
                            }} primary={message.text} secondary={message.sender === 'user' ? '' : 'Robert'} />
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, borderTop: '1px solid #ccc', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <TextField
                    label={numberOpenaiTokens > 0 ? "Entrer votre question" : "Vous n'avez plus de token disponible"}
                    variant="outlined"
                    fullWidth
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={numberOpenaiTokens <= 0 || !disclaimerAccepted}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={!disclaimerAccepted}
                                    sx={{ borderRadius: '50%', padding: '5px', backgroundColor: onmouseenter ? 'black' : 'primary.main', color: 'white', '&:hover': { backgroundColor: 'black', } }}
                                >
                                    <Tooltip title="Envoyer le message">
                                        <ArrowUpwardIcon />
                                    </Tooltip>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '30px', backgroundColor: '#F4F4F4' } }}
                />
                {!disclaimerAccepted && (
                    <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'white',
                        zIndex: 1400,
                        p: 2,
                        borderTop: '1px solid #ccc',
                        textAlign: 'center',
                    }}>
                        <Typography variant="body1">
                            ROBERP IA peut faire des erreurs. Envisagez de vérifier les informations importantes.
                        </Typography>
                        <Button onClick={handleDisclaimerAccept} variant="contained" sx={{ mt: 2 }}>
                            J'ai lu
                        </Button>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default ChatWindow;