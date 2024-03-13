import { useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useSession, useSessionDispatch } from '../../../../_shared/context/SessionProvider';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { LOGOUT_USER } from '../../../../_shared/graphql/mutations/AuthMutations';
import { useMutation } from '@apollo/client';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Tableau de bord',
    icon: 'eva:home-fill',
    route: '/online/dashboard',
  },
  {
    label: 'Mon compte',
    icon: 'eva:person-fill',
    route: '/online/account/profil',
  },
  {
    label: 'Paramètres',
    icon: 'eva:settings-2-fill',
    route: '/online/parametres',
  },
];

// ----------------------------------------------------------------------

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '.MuiListItemIcon-root': {
        color: theme.palette.primary.contrastText,
      }
    },
  }));

export default function AccountPopover() {
    const { user } = useSession();
    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const navigate = useNavigate();
    const dispatch = useSessionDispatch();
    const [logoutUser, { loading : loadingLogout }] = useMutation(LOGOUT_USER, {
        onCompleted: (datas) => {
            if(datas.logoutUser.done){
            }else{
                setNotifyAlert({
                isOpen: true,
                message: `${datas.logoutUser.message}.`,
                type: 'error'
                })
            }
            dispatch({ type: 'LOGOUT' })
            navigate('/');
        },
        onError: (err) => {
            console.log(err)
            setNotifyAlert({
                isOpen: true,
                message: "Une erreur s'est produite",
                type: 'error'
            })
        },
    })
  
    const onLogoutUser = () => {
        handleClose()
        setConfirmDialog({
            isOpen: true,
            title: 'ATTENTION',
            subTitle: "Voulez vous vraiment vous déconnecter ?",
            onConfirm: () => { setConfirmDialog({isOpen: false})
                                logoutUser()
                            }
        })
    }

    return (
        <>
        <IconButton
            onClick={handleOpen}
            sx={{
            width: 40,
            height: 40,
            background: (theme) => alpha(theme.palette.grey[500], 0.08),
            ...(open && {
                background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            }),
            }}
        >
            <Avatar
            src={user.photo}
            alt={user.firstName}
            sx={{
                width: 36,
                height: 36,
                border: (theme) => `solid 2px ${theme.palette.background.default}`,
            }}
            >
            {user.firstName.charAt(0).toUpperCase()}
            </Avatar>
        </IconButton>

        <Popover
            open={!!open}
            anchorEl={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
            sx: {
                p: 0,
                mt: 1,
                ml: 0.75,
                width: 200,
            },
            }}
        >
            <Box sx={{ my: 1.5, px: 2 }}>
            <Typography variant="subtitle2" noWrap>
                {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {user.email}
            </Typography>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {MENU_OPTIONS.map((option, index) => (
                <StyledNavLink key={`${index}${option.label}`} to={option.route}>
                    <MenuItem key={option.label} onClick={handleClose}>
                        {option.label}
                    </MenuItem>
                </StyledNavLink>
            ))}

            <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

            <MenuItem
            disableRipple
            disableTouchRipple
            onClick={onLogoutUser}
            sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
            >
            Se déconnecter
            </MenuItem>
        </Popover>
        </>
    );
}