import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Chip,
  Toolbar,
  InputAdornment,
  styled,
  Divider,
  Tooltip,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { 
  Add, 
  Edit, 
  Delete, 
  Search, 
  FilterList, 
  AttachFile, 
  Description,
  Visibility
} from '@mui/icons-material';
import dayjs from 'dayjs';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${TableCell.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Sample intervention types
const INTERVENTION_TYPES = [
  { id: 'MAINTENANCE', label: 'Maintenance' },
  { id: 'INSTALLATION', label: 'Installation' },
  { id: 'REPAIR', label: 'Réparation' },
  { id: 'INSPECTION', label: 'Inspection' },
  { id: 'TRAINING', label: 'Formation' },
  { id: 'OTHER', label: 'Autre' },
];

// Sample intervention statuses
const INTERVENTION_STATUSES = [
  { id: 'SCHEDULED', label: 'Planifiée', color: 'info' },
  { id: 'IN_PROGRESS', label: 'En cours', color: 'warning' },
  { id: 'COMPLETED', label: 'Terminée', color: 'success' },
  { id: 'CANCELLED', label: 'Annulée', color: 'error' },
  { id: 'PENDING', label: 'En attente', color: 'default' },
];

// Sample interventions for demonstration
const SAMPLE_INTERVENTIONS = [
  {
    id: '1',
    type: 'MAINTENANCE',
    title: 'Maintenance périodique équipement A',
    description: 'Maintenance trimestrielle des machines de production',
    status: 'COMPLETED',
    scheduledDate: '2023-10-15',
    endDate: '2023-10-15',
    duration: 4,
    technician: 'Jean Martin',
    cost: 850,
    location: 'Usine principale - Zone A',
    attachments: [
      { id: '1', name: 'rapport_maintenance.pdf' }
    ]
  },
  {
    id: '2',
    type: 'REPAIR',
    title: 'Réparation système de ventilation',
    description: 'Remplacement pièces défectueuses du système de ventilation',
    status: 'SCHEDULED',
    scheduledDate: '2023-11-20',
    endDate: null,
    duration: null,
    technician: 'Sophie Dubois',
    cost: 1200,
    location: 'Entrepôt - Section B',
    attachments: []
  },
  {
    id: '3',
    type: 'TRAINING',
    title: 'Formation utilisation nouveaux équipements',
    description: 'Session de formation pour les opérateurs sur les nouveaux équipements installés',
    status: 'IN_PROGRESS',
    scheduledDate: '2023-11-05',
    endDate: '2023-11-07',
    duration: 16,
    technician: 'Pierre Leroy',
    cost: 2000,
    location: 'Salle de formation',
    attachments: [
      { id: '2', name: 'manuel_equipement.pdf' },
      { id: '3', name: 'presentation_formation.pptx' }
    ]
  },
];

export default function SupplierInterventions({ supplier }) {
  const [interventions, setInterventions] = useState(SAMPLE_INTERVENTIONS);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Form state
  const [interventionForm, setInterventionForm] = useState({
    type: '',
    title: '',
    description: '',
    status: 'SCHEDULED',
    scheduledDate: dayjs(),
    endDate: null,
    duration: '',
    technician: '',
    cost: '',
    location: '',
    attachments: []
  });

  // Filtered interventions based on search and filter
  const filteredInterventions = interventions.filter(intervention => {
    const matchesSearch = searchTerm === '' || 
      intervention.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || intervention.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setInterventionForm({
      type: '',
      title: '',
      description: '',
      status: 'SCHEDULED',
      scheduledDate: dayjs(),
      endDate: null,
      duration: '',
      technician: '',
      cost: '',
      location: '',
      attachments: []
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (intervention) => {
    setDialogMode('edit');
    setInterventionForm({
      ...intervention,
      scheduledDate: intervention.scheduledDate ? dayjs(intervention.scheduledDate) : null,
      endDate: intervention.endDate ? dayjs(intervention.endDate) : null,
    });
    setSelectedIntervention(intervention);
    setOpenDialog(true);
  };

  const handleOpenDetailsDialog = (intervention) => {
    setSelectedIntervention(intervention);
    setDetailsDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIntervention(null);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialog(false);
    setSelectedIntervention(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInterventionForm({
      ...interventionForm,
      [name]: value
    });
  };

  const handleDateChange = (name, date) => {
    setInterventionForm({
      ...interventionForm,
      [name]: date
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      file: file // This would be processed and uploaded to storage in a real implementation
    }));

    setInterventionForm({
      ...interventionForm,
      attachments: [...interventionForm.attachments, ...newAttachments]
    });
  };

  const handleRemoveAttachment = (attachmentId) => {
    setInterventionForm({
      ...interventionForm,
      attachments: interventionForm.attachments.filter(att => att.id !== attachmentId)
    });
  };

  const handleSubmit = () => {
    if (dialogMode === 'add') {
      const newIntervention = {
        ...interventionForm,
        id: Date.now().toString(),
        scheduledDate: interventionForm.scheduledDate.format('YYYY-MM-DD'),
        endDate: interventionForm.endDate ? interventionForm.endDate.format('YYYY-MM-DD') : null,
      };
      setInterventions([...interventions, newIntervention]);
    } else {
      const updatedInterventions = interventions.map(item => 
        item.id === selectedIntervention.id 
          ? {
              ...interventionForm,
              scheduledDate: interventionForm.scheduledDate.format('YYYY-MM-DD'),
              endDate: interventionForm.endDate ? interventionForm.endDate.format('YYYY-MM-DD') : null,
            }
          : item
      );
      setInterventions(updatedInterventions);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setInterventions(interventions.filter(item => item.id !== id));
  };

  // Helper functions
  const getStatusLabel = (statusId) => {
    const status = INTERVENTION_STATUSES.find(s => s.id === statusId);
    return status ? (
      <Chip 
        label={status.label} 
        size="small" 
        color={status.color}
        variant={status.color === 'default' ? 'outlined' : 'filled'}
      />
    ) : statusId;
  };

  const getTypeLabel = (typeId) => {
    const type = INTERVENTION_TYPES.find(t => t.id === typeId);
    return type ? type.label : typeId;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Toolbar with search and filters */}
      <Paper sx={{ mb: 2, p: 1 }}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 2, width: 300 }}
            />

            <TextField
              select
              size="small"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              displayEmpty
              label="Statut"
              sx={{ width: 150 }}
            >
              <MenuItem value="">Tous</MenuItem>
              {INTERVENTION_STATUSES.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
          >
            Nouvelle intervention
          </Button>
        </Toolbar>
      </Paper>

      {/* Interventions Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Titre</StyledTableCell>
              <StyledTableCell>Statut</StyledTableCell>
              <StyledTableCell>Date planifiée</StyledTableCell>
              <StyledTableCell>Technicien</StyledTableCell>
              <StyledTableCell>Coût</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInterventions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography sx={{ py: 2 }}>
                    Aucune intervention trouvée
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredInterventions.map((intervention) => (
                <StyledTableRow key={intervention.id}>
                  <TableCell>{getTypeLabel(intervention.type)}</TableCell>
                  <TableCell>{intervention.title}</TableCell>
                  <TableCell>{getStatusLabel(intervention.status)}</TableCell>
                  <TableCell>{intervention.scheduledDate}</TableCell>
                  <TableCell>{intervention.technician}</TableCell>
                  <TableCell>{intervention.cost ? `${intervention.cost} €` : '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Voir détails">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDetailsDialog(intervention)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenEditDialog(intervention)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(intervention.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'add' ? 'Ajouter une intervention' : 'Modifier l\'intervention'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Type d'intervention"
                name="type"
                value={interventionForm.type}
                onChange={handleInputChange}
                fullWidth
                required
              >
                {INTERVENTION_TYPES.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Statut"
                name="status"
                value={interventionForm.status}
                onChange={handleInputChange}
                fullWidth
                required
              >
                {INTERVENTION_STATUSES.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Titre"
                name="title"
                value={interventionForm.title}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={interventionForm.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date planifiée"
                  value={interventionForm.scheduledDate}
                  onChange={(date) => handleDateChange('scheduledDate', date)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date de fin"
                  value={interventionForm.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Durée (heures)"
                name="duration"
                value={interventionForm.duration}
                onChange={handleInputChange}
                fullWidth
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Coût (€)"
                name="cost"
                value={interventionForm.cost}
                onChange={handleInputChange}
                fullWidth
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Technicien"
                name="technician"
                value={interventionForm.technician}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Lieu"
                name="location"
                value={interventionForm.location}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                Pièces jointes
              </Typography>
              <Box sx={{ mb: 2 }}>
                {interventionForm.attachments.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {interventionForm.attachments.map((att) => (
                      <Chip
                        key={att.id}
                        icon={<Description />}
                        label={att.name}
                        onDelete={() => handleRemoveAttachment(att.id)}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Aucune pièce jointe
                  </Typography>
                )}
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AttachFile />}
                >
                  Ajouter des fichiers
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileUpload}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!interventionForm.title || !interventionForm.type || !interventionForm.status}
          >
            {dialogMode === 'add' ? 'Ajouter' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedIntervention && (
          <>
            <DialogTitle>
              {selectedIntervention.title}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type d'intervention
                  </Typography>
                  <Typography variant="body1">
                    {getTypeLabel(selectedIntervention.type)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Statut
                  </Typography>
                  <Typography variant="body1">
                    {getStatusLabel(selectedIntervention.status)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {selectedIntervention.description || 'Aucune description fournie'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date planifiée
                  </Typography>
                  <Typography variant="body1">
                    {selectedIntervention.scheduledDate}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date de fin
                  </Typography>
                  <Typography variant="body1">
                    {selectedIntervention.endDate || 'Non définie'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Durée (heures)
                  </Typography>
                  <Typography variant="body1">
                    {selectedIntervention.duration || 'Non définie'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Coût
                  </Typography>
                  <Typography variant="body1">
                    {selectedIntervention.cost ? `${selectedIntervention.cost} €` : 'Non défini'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Technicien
                  </Typography>
                  <Typography variant="body1">
                    {selectedIntervention.technician || 'Non assigné'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Lieu
                  </Typography>
                  <Typography variant="body1">
                    {selectedIntervention.location || 'Non spécifié'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Pièces jointes
                  </Typography>
                  {selectedIntervention.attachments.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedIntervention.attachments.map((att) => (
                        <Chip
                          key={att.id}
                          icon={<Description />}
                          label={att.name}
                          variant="outlined"
                          onClick={() => {}} // In a real app, this would open or download the file
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucune pièce jointe
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailsDialog}>Fermer</Button>
              <Button 
                onClick={() => {
                  handleCloseDetailsDialog();
                  handleOpenEditDialog(selectedIntervention);
                }} 
                variant="contained"
                startIcon={<Edit />}
              >
                Modifier
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 