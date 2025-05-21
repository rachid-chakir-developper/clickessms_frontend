import React from 'react';
import { Tooltip, MenuItem, IconButton, Button } from '@mui/material';
import { Folder } from '@mui/icons-material';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

const OpenLibraryButton = ({
  folderParent = null,
  title = 'Ouvrir la bibliothèque.',
  apparence = 'button',
  onAfterClick = () => {},
}) => {
    const { setDialogListLibrary } = useFeedBacks();

    const onOpenDialogListLibrary = () => {
        setDialogListLibrary({
        isOpen: true,
        folderParent,
        onClose: () => setDialogListLibrary({ isOpen: false }),
        });

        onAfterClick();
    };

    return (
        <Tooltip title={title}>
        {apparence === 'menuItem' && (
            <MenuItem onClick={onOpenDialogListLibrary}>
            <Folder fontSize="small" sx={{ mr: 2 }} />
                {title}
            </MenuItem>
        )}
        {apparence==="button" && 
            <Button variant="outlined" onClick={onOpenDialogListLibrary} endIcon={<Folder />}>
                {title}
            </Button>
        }
        {apparence === 'iconButton' && (
            <IconButton onClick={onOpenDialogListLibrary}>
                <Folder />
            </IconButton>
        )}
        </Tooltip>
    );
};

export default OpenLibraryButton;
