import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Alert, Avatar, Box, ListItemIcon } from '@mui/material';
import {
  Add,
  ArrowBackIos,
  Delete,
  Edit,
  Folder,
  InsertDriveFile,
  InsertDriveFileOutlined,
  PlayCircleOutline,
} from '@mui/icons-material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_FOLDER } from '../../../../_shared/graphql/queries/MediaQueries';
import DialogAddFolder from './DialogAddFolder';
import DialogAddFile from './DialogAddFile';
import {
  DELETE_FILE,
  DELETE_FOLDER,
} from '../../../../_shared/graphql/mutations/MediaMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogListLibrary({
  dialogListLibrary,
  setDialogListLibrary,
}) {
  let { isOpen, onClose, type, folderParent } = dialogListLibrary;
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [openDialogFile, setOpenDialogFile] = React.useState(false);
  const [openDialogFolder, setOpenDialogFolder] = React.useState(false);
  const [folder, setFolder] = React.useState();
  const [fileToEdit, setFileToEdit] = React.useState();
  const [folderToEdit, setFolderToEdit] = React.useState();
  const closeDialogFile = (value) => {
    setOpenDialogFile(false);
    if (value) {
      getFolder({ variables: { id: folder.id } });
    }
  };
  const closeDialogFolder = (value) => {
    setOpenDialogFolder(false);
    if (value) {
      getFolder({ variables: { id: folder.id } });
    }
  };
  const handleClickOpenDialogAdd = (item, type) => {
    switch (type) {
      case 'folder':
        setOpenDialogFolder(true);
        setFolderToEdit(item);
        break;

      case 'file':
        setOpenDialogFile(true);
        setFileToEdit(item);
        break;

      default:
        break;
    }
  };
  const handleClose = () => {
    onClose();
  };

  const [getFolder, { loading: loadingFolder }] = useLazyQuery(GET_FOLDER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setFolder(data.folder);
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (isOpen) {
      if (folderParent && folderParent.id > 0) {
        getFolder({ variables: { id: folderParent.id } });
      } else {
        setFolder(null);
      }
    }
  }, [isOpen]);
  const handleClickOpenThisFolder = (folderId) => {
    getFolder({ variables: { id: folderId } });
  };
  const handleClickOpenThisParentFolder = (folder) => {
    if (folderParent.id !== folder.id) {
      getFolder({ variables: { id: folder.folder.id } });
    }
  };
  const [showActions, setShowActions] = React.useState('-1');

  const [deleteFolder, { loading: loadingDeleteFolder }] = useMutation(
    DELETE_FOLDER,
    {
      onCompleted: (datas) => {
        if (datas.deleteFolder.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
          getFolder({ variables: { id: folder.id } });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteFolder.message}.`,
            type: 'error',
          });
        }
      },
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

  const [deleteFile, { loading: loadingDeleteFile }] = useMutation(
    DELETE_FILE,
    {
      onCompleted: (datas) => {
        if (datas.deleteFile.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
          getFolder({ variables: { id: folder.id } });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteFile.message}.`,
            type: 'error',
          });
        }
      },
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

  const onDeleteFolder = (item) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: `Voulez vous vraiment supprimer le dossier: << ${item?.name} >> ?`,
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteFolder({ variables: { id: item?.id } });
      },
    });
  };

  const onDeleteFile = (item) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: `Voulez vous vraiment supprimer le fichier: << ${item?.name} >> ?`,
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteFile({ variables: { id: item?.id } });
      },
    });
  };

  const handleClickToDelete = (item, type) => {
    switch (type) {
      case 'folder':
        onDeleteFolder(item);
        break;

      case 'file':
        onDeleteFile(item);
        break;

      default:
        break;
    }
  };
  return (
    <>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() =>
                setDialogListLibrary({ ...dialogListLibrary, isOpen: false })
              }
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Bibliothèque | {folderParent?.name}
            </Typography>
            <Box sx={{ display: 'flex', flex: 1 }}>
              <Button
                variant="outlined"
                disableElevation
                color="inherit"
                sx={{ mr: 2 }}
                endIcon={<Add />}
                onClick={() => {
                  handleClickOpenDialogAdd(null, 'folder');
                }}
              >
                Ajouter un dossier
              </Button>
              <Button
                variant="outlined"
                disableElevation
                color="inherit"
                sx={{ mr: 2 }}
                endIcon={<Add />}
                onClick={() => {
                  handleClickOpenDialogAdd(null, 'file');
                }}
              >
                Ajouter un fichier
              </Button>
            </Box>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Valider
            </Button>
          </Toolbar>
        </AppBar>
        {/* <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItem>
        </List> */}
        {folder && folderParent?.id !== folder?.id && (
          <List key={`folderParent`}>
            <ListItem
              button
              onClick={() => {
                handleClickOpenThisParentFolder(folder);
              }}
            >
              <ListItemIcon>
                <ArrowBackIos />
              </ListItemIcon>
            </ListItem>
            <Divider />
          </List>
        )}
        {(!folder || (folder?.folders < 1 && folder?.files < 1)) &&
          !loadingFolder && (
            <Alert severity="warning" sx={{ margin: 2 }}>
              Ce dossier est vide !
            </Alert>
          )}

        <List key={`folder`}>
          {folder?.folders?.map((folderItem, index) => {
            return (
              <div key={`folder${index}`}>
                <ListItem
                  button
                  key={`folder${index}_`}
                  secondaryAction={
                    showActions === `folder${index}` && (
                      <>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          sx={{ marginX: 0.5 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClickToDelete(folderItem, 'folder');
                          }}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          sx={{ marginX: 0.5 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClickOpenDialogAdd(folderItem, 'folder');
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </>
                    )
                  }
                  onClick={() => {
                    handleClickOpenThisFolder(folderItem?.id);
                  }}
                  onMouseEnter={() => setShowActions(`folder${index}`)}
                  onMouseLeave={() => setShowActions('-1')}
                >
                  <ListItemIcon>
                    <Folder />
                  </ListItemIcon>
                  <ListItemText
                    primary={folderItem?.name}
                    secondary={folderItem?.descreption}
                  />
                </ListItem>
                <Divider />
              </div>
            );
          })}
          {folder?.files?.map((file, index) => {
            return (
              <div key={`file${index}`}>
                <ListItem
                  button
                  key={`file${index}_`}
                  secondaryAction={
                    showActions === `file${index}` && (
                      <>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          sx={{ marginX: 0.5 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClickToDelete(file, 'file');
                          }}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          sx={{ marginX: 0.5 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClickOpenDialogAdd(file, 'file');
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </>
                    )
                  }
                  onClick={() => {
                    window.open(file.file);
                  }}
                  onMouseEnter={() => setShowActions(`file${index}`)}
                  onMouseLeave={() => setShowActions('-1')}
                >
                  <ListItemIcon>
                    {file?.fileType !== 'IMAGE' &&
                      file?.fileType !== 'VIDEO' && <InsertDriveFileOutlined />}
                    {file?.fileType === 'IMAGE' && (
                      <Avatar
                        sx={{ width: 24, height: 24 }}
                        alt={file?.fileType?.name}
                        src={file?.file}
                      />
                    )}
                    {file?.fileType === 'VIDEO' && <PlayCircleOutline />}
                  </ListItemIcon>
                  <ListItemText
                    primary={file?.name}
                    secondary={file?.descreption}
                  />
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </List>
      </Dialog>
      <DialogAddFolder
        open={openDialogFolder}
        onClose={closeDialogFolder}
        folderParent={folder}
        type={type}
        folderToEdit={folderToEdit}
      />
      <DialogAddFile
        open={openDialogFile}
        onClose={closeDialogFile}
        folderParent={folder}
        type={type}
        fileToEdit={fileToEdit}
      />
    </>
  );
}
