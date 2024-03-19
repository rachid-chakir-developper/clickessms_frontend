
import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_DATAS } from '../../../../_shared/graphql/queries/DataQueries';
import { DELETE_DATA } from '../../../../_shared/graphql/mutations/DataMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import DialogAddData from './DialogAddData';
import { Alert, Avatar, List, ListItem, ListItemAvatar, ListItemText, Tooltip } from '@mui/material';
import { Delete, Edit, Group } from '@mui/icons-material';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DialogListDatas({open, onClose, data}) {
    const [openDialog, setOpenDialog] = React.useState(false);
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const [dataToEdit, setDataToEdit] = React.useState()
    const [getDatas, { loading : loadingDatas, data: datasData }] = useLazyQuery(GET_DATAS)
    React.useEffect(
        () => {
            if(open) {
            getDatas(({ variables: { typeData: data.type } }));
            }
        },
        [open],
    );
    const [deleteData, { loading : loadingDelete }] = useMutation(DELETE_DATA, {
        onCompleted: (datas) => {
            if(datas.deleteData.deleted){
            setNotifyAlert({
                isOpen: true,
                message: 'Supprimé avec succès',
                type: 'success'
            })
            }else{
            setNotifyAlert({
                isOpen: true,
                message: 'Non Supprimé ! Veuillez réessayer.',
                type: 'error'
            })
            } 
        },
        update(cache, { data: { deleteData } }) {
            console.log('Updating cache after deletion:', deleteData);
          
            const deletedDataId = deleteData.id;
          
            cache.modify({
              fields: {
                datas(existingDatas = [], { readField }) {
          
                    const updatedDatas = existingDatas.filter((data) =>
                        readField('id', data) !== deletedDataId
                    );
            
                    console.log('Updated datas:', updatedDatas);
            
                    return updatedDatas;
                },
              },
            });
        },
        onError: (err) => {
            console.log(err)
            setNotifyAlert({
            isOpen: true,
            message: 'Non Supprimé ! Veuillez réessayer.',
            type: 'error'
            })
        },
    })
    const [errors, setErrors] = React.useState([])
    const handleOk = (e) => {
        e.preventDefault()
        console.log(1);
        onClose(2);
    };
    const closeDialog = (value) => {
        setOpenDialog(false);
    };
    const handleClickEdit = (data) => {
        setOpenDialog(true);
        setDataToEdit(data);
    };
    

    const onDeleteData = (id) => {
        setConfirmDialog({
          isOpen: true,
          title: 'ATTENTION',
          subTitle: "Voulez vous vraiment supprimer ?",
          onConfirm: () => { setConfirmDialog({isOpen: false})
                        deleteData({ variables: { id : id } })
                      }
        })
    }

  return (
    <div>
        <BootstrapDialog
            onClose={onClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth={'xs'}
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Liste des éléments "{data?.name}"
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
            <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <List dense={true}>
                {loadingDatas && <ProgressService type="notification" />}
                {datasData?.datas?.length < 1 && !loadingDatas && <Alert severity="warning">La liste est vide pour le moment !</Alert>}
                {datasData?.datas?.map((data, index) => {
                    return <ListItem key={index}
                        secondaryAction={
                            <>
                                <Tooltip title="Modifier">
                                    <IconButton edge="end" aria-label="supprimer"
                                    onClick={()=> onDeleteData(data?.id)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Modifier">
                                    <IconButton edge="end" aria-label="modifier"
                                    onClick={() => handleClickEdit(data)}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        }
                    >
                    <ListItemAvatar>
                        <Avatar>
                            <Group />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={data?.name}
                    />
                    </ListItem>
                })}
                </List>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleOk}>
                    Fermer
                </Button>
            </DialogActions>
        </BootstrapDialog>
        <DialogAddData open={openDialog} onClose={closeDialog} data={data} dataToEdit={dataToEdit}/>
    </div>
  );
}
