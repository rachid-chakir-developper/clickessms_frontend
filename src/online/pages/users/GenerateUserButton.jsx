import React from 'react';
import {
    Box,
    Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { GroupAdd } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GENERATE_USER } from '../../../_shared/graphql/mutations/UserMutations';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';

export default function GenerateUserButton({ sx, employees=[], buttonType="button", size="medium", label="Générer les comptes pour les employés"  }) {
    const navigate = useNavigate();
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();

    const onGenerateUser = () => {
        setConfirmDialog({
        isOpen: true,
        title: 'ATTENTION',
        subTitle: 'Voulez-vous vraiment générer Générer les comptes pour les employés ?',
        onConfirm: () => {
            setConfirmDialog({ isOpen: false });
            generateUser({
            variables: { employees: employees?.map((e)=>e?.id) },
            });
        },
        });
    };

    const downloadExcel = (base64Data, filename = 'comptes_utilisateurs.xlsx') => {
        const link = document.createElement('a');
        link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

    const [generateUser, { loading: loadingPost }] = useMutation(
        GENERATE_USER,
        {
        onCompleted: (data) => {
            console.log(data);
            if (data.generateUser.success) {
                const { count, generatedCount, excelFileBase64} = data.generateUser
                setNotifyAlert({
                    isOpen: true,
                    message: `Ajouté avec succès. ${count} touchés / ${generatedCount} générés`,
                    type: 'success',
                });
                downloadExcel(excelFileBase64)
                
            } else {
            setNotifyAlert({
                isOpen: true,
                message: `Non ajouté ! Veuillez réessayer. ${data.generateUser.message}`,
                type: 'error',
            });
            }
        },
        update(cache, { data: { generateUser } }) {
            if (generateUser.success) {
            const newUsers = generateUser.users;
        
            cache.modify({
                fields: {
                users(existingUsers = { totalCount: 0, nodes: [] }, { readField }) {
                    // Créer une Map des utilisateurs existants
                    const existingNodesMap = new Map(
                    existingUsers.nodes.map((user) => [readField('id', user), user])
                    );
        
                    // Ajouter ou remplacer les utilisateurs avec les nouveaux
                    newUsers.forEach((newUser) => {
                    existingNodesMap.set(newUser.id, newUser);
                    });
        
                    // Construire la nouvelle liste : les nouveaux en haut
                    const updatedNodes = [
                    ...newUsers,
                    ...existingUsers.nodes.filter(
                        (user) => !newUsers.find((nu) => nu.id === readField('id', user))
                    ),
                    ];
        
                    return {
                    totalCount: updatedNodes.length,
                    nodes: updatedNodes,
                    };
                },
                },
            });
            }
        },
        onError: (err) => {
            console.log(err);
            setNotifyAlert({
            isOpen: true,
            message: 'Non ajouté ! Veuillez réessayer.',
            type: 'error',
            });
        },
        }
    );


    return (
        <Box sx={sx}>
            {buttonType === "button" && (
                <Button
                    size={size}
                    variant="outlined"
                    onClick={onGenerateUser}
                    endIcon={<GroupAdd />}
                    >
                    {label}
                </Button>
            )}

            {buttonType === "buttonIcon" && (
                <Tooltip title={label}>
                    <IconButton size={size} onClick={onGenerateUser}>
                        <GroupAdd />
                    </IconButton>
                </Tooltip>
            )}

            {buttonType === "menuItem" && (
                <Tooltip title={label}>
                    <MenuItem onClick={onGenerateUser}>
                        <GroupAdd sx={{ mr: 2 }} />
                        {label}
                    </MenuItem>
                </Tooltip>
            )}
        </Box>
    );
};
