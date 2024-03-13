import { Avatar, Box, Typography, alpha } from "@mui/material";
import { useSession } from "../../../../_shared/context/SessionProvider";
import { Link } from "react-router-dom";

export default function AccountCard({ open }) {
    const { user } = useSession();
    return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundImage: `url(${user?.coverImage})`, // Ajoutez l'image d'arrière-plan ici
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 1),
                }}
            >
                <Box
                    sx={{
                        py: 1.2,
                        px: 2,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.5),
                        boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.2) inset'
                    }}
                >
                    <Link to="/online/account/profil">
                        <Avatar
                            src={user?.photo}
                            alt={user?.firstName}
                            sx={{
                                boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)', // Ajoutez l'ombre extérieure ici
                                border: '2px solid white', // Ajoutez une bordure blanche autour de l'avatar si nécessaire
                            }}
                        />
                    </Link>

                    {open && <Box
                        sx={{
                            mt: 1,
                            width: '100%',
                            display: 'flex',
                            borderRadius: 1.5,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: (theme) => theme.palette.primary.contrastText,
                        }}
                    >
                        <Typography variant="subtitle2">{user?.firstName} {user?.lastName}</Typography>
                        <Typography variant="body2" sx={{ fontSize: 11.5, fontStyle: 'italic' }}>
                            {user?.email}
                        </Typography>
                    </Box>}
                </Box>
            </Box>
        );
}