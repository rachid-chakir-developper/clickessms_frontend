import * as React from 'react';
import { Box, Button, Card, CardContent, CardMedia, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MediaModal from '../modals/MediaModal';
import { Close } from '@mui/icons-material';
import TheTextField from './TheTextField';

const FileCard = ({ file, onDelete, onClick }) => {
  return (
      <Box 
      sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '10px', 
          border: '1px solid #ccc', 
          padding: '10px', 
          borderRadius: '4px',
          background: "#f1f1f1"
      }}
      >
      <a href={file?.localUrl ? file?.localUrl : file?.path} target="_blank">
        <FileCopyIcon sx={{ marginRight: '10px' }} />
    </a>
    <a href={file?.localUrl ? file?.localUrl : file?.path} target="_blank"><Typography variant="body1" sx={{ flexGrow: 1 }}>
          {file.caption || file?.file?.name}
          {/* {file.localUrl || file.path} */}
      </Typography>
    </a>
      <IconButton 
          onClick={onDelete} 
          edge="end" 
          color="error"
      >
          <Close />
      </IconButton>
      </Box>
  );
};


export default function MultiFileField(props) {
  const {type = 'button', label="Ajouter des fichiers"} = props
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploadedFiles, setUploadedFiles] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleOpenModal = (file, index) => {
    setCurrentIndex(index);
    setSelectedFile(file);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
    setTimeout(() => {
      setCurrentIndex(0);
    }, 1000);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      localUrl: URL.createObjectURL(file),
      caption: file.name,
      file,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    if (props?.onChange) {
      props.onChange([...uploadedFiles, ...newFiles]);
    }
  };

  const handleDeleteFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    if (props?.onChange) {
      props.onChange(newFiles);
    }
  };

  const handleCaptionChange = (index, newCaption) => {
    const newFiles = uploadedFiles.map((file, i) => 
      i === index ? { ...file, caption: newCaption } : file
    );
    setUploadedFiles(newFiles);
    if (props?.onChange) {
      props.onChange(newFiles);
    }
  };

  React.useEffect(() => {
    if (Array.isArray(props?.fileValue)) {
      setUploadedFiles(props.fileValue.map(value => 
        (typeof value?.file === 'string') ? 
        ({ id : value?.id, path: value?.file, localUrl: null, caption: value?.caption, file: null }) : value
      ));
    }
  }, [props?.fileValue]);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }} // Cacher le champ de fichier
            id="file-upload" // ID pour le bouton d'attachement
            />
            <label htmlFor="file-upload">
            {type === 'icon' && <Tooltip title={label}><IconButton component="span">
                <AttachFileIcon />
            </IconButton></Tooltip>}
            {type !== 'icon' && <Button component="span" variant="outlined" startIcon={<AttachFileIcon />}>
                    {label}
            </Button>}
            </label>
        </Box>
      <Box sx={{ display: 'flex', justifyContent: 'start', flexWrap: 'wrap', marginY: 4 }}>
        {uploadedFiles.map((file, index) => (
          <Box key={index} sx={{padding: 2}}>
            <FileCard
              file={file}
              onDelete={() => handleDeleteFile(index)}
              onClick={() => handleOpenModal(file, index)}
            />
            <TheTextField
              size="small"
              fullWidth
              multiline
              variant="outlined"
              label="Caption"
              value={file.caption}
              onChange={(e) => handleCaptionChange(index, e.target.value)}
              disabled={props.disabled}
            />
          </Box>
        ))}
      </Box>

      {selectedFile && (
        <MediaModal
          open={modalOpen}
          handleClose={handleCloseModal}
          currentIndex={currentIndex}
          files={uploadedFiles.map(file => ({ file: file.localUrl || file.path, caption: file.caption }))}
        />
      )}
    </>
  );
}
