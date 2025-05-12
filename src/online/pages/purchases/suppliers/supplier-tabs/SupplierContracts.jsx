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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete, Visibility, AttachFile, Article } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.palette.mode === 'dark' ? 'head' : 'head'}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${theme.palette.mode === 'dark' ? 'body' : 'body'}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Sample contract types for demonstration
const CONTRACT_TYPES = [
  { value: 'MAINTENANCE', label: 'Contrat de maintenance' },
  { value: 'SERVICE', label: 'Contrat de service' },
  { value: 'SUPPLY', label: 'Contrat de fourniture' },
  { value: 'PARTNERSHIP', label: 'Contrat de partenariat' },
  { value: 'OTHER', label: 'Autre' },
];

// Sample renewal options
const RENEWAL_OPTIONS = [
  { value: 'AUTOMATIC', label: 'Renouvellement automatique' },
  { value: 'MANUAL', label: 'Renouvellement manuel' },
  { value: 'NONE', label: 'Pas de renouvellement' },
];

// Sample contract data for demonstration
const SAMPLE_CONTRACTS = [
  {
    id: '1',
    contractType: 'MAINTENANCE',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    duration: '12 mois',
    renewal: 'AUTOMATIC',
    noticePeriod: '3 mois',
    documentUrl: null,
  },
];

export default function SupplierContracts({ supplier }) {
  const [contracts, setContracts] = useState(SAMPLE_CONTRACTS);
  const [openDialog, setOpenDialog] = useState(false);
  const [contractForm, setContractForm] = useState({
    contractType: '',
    startDate: dayjs(),
    endDate: dayjs().add(1, 'year'),
    duration: '',
    renewal: '',
    noticePeriod: '',
    documentFile: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleOpenDialog = (isEdit = false, contract = null) => {
    if (isEdit && contract) {
      setContractForm({
        contractType: contract.contractType,
        startDate: dayjs(contract.startDate),
        endDate: dayjs(contract.endDate),
        duration: contract.duration,
        renewal: contract.renewal,
        noticePeriod: contract.noticePeriod,
        documentFile: null,
      });
      setIsEditing(true);
      setEditingId(contract.id);
    } else {
      setContractForm({
        contractType: '',
        startDate: dayjs(),
        endDate: dayjs().add(1, 'year'),
        duration: '',
        renewal: '',
        noticePeriod: '',
        documentFile: null,
      });
      setIsEditing(false);
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContractForm({
      ...contractForm,
      [name]: value,
    });
  };

  const handleDateChange = (name, value) => {
    setContractForm({
      ...contractForm,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setContractForm({
      ...contractForm,
      documentFile: e.target.files[0],
    });
  };

  const handleSubmit = () => {
    // Calculate duration based on start and end dates
    const startDate = contractForm.startDate;
    const endDate = contractForm.endDate;
    const durationMonths = endDate.diff(startDate, 'month');
    const duration = `${durationMonths} mois`;

    const newContract = {
      id: isEditing ? editingId : `${Date.now()}`,
      contractType: contractForm.contractType,
      startDate: contractForm.startDate.format('YYYY-MM-DD'),
      endDate: contractForm.endDate.format('YYYY-MM-DD'),
      duration: duration,
      renewal: contractForm.renewal,
      noticePeriod: contractForm.noticePeriod,
      documentUrl: contractForm.documentFile ? URL.createObjectURL(contractForm.documentFile) : null,
    };

    if (isEditing) {
      const updatedContracts = contracts.map((contract) =>
        contract.id === editingId ? newContract : contract
      );
      setContracts(updatedContracts);
    } else {
      setContracts([...contracts, newContract]);
    }
    
    handleCloseDialog();
  };

  const handleDeleteContract = (id) => {
    const updatedContracts = contracts.filter((contract) => contract.id !== id);
    setContracts(updatedContracts);
  };

  const getContractTypeLabel = (typeValue) => {
    const contractType = CONTRACT_TYPES.find((type) => type.value === typeValue);
    return contractType ? contractType.label : typeValue;
  };

  const getRenewalLabel = (renewalValue) => {
    const renewal = RENEWAL_OPTIONS.find((option) => option.value === renewalValue);
    return renewal ? renewal.label : renewalValue;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" gutterBottom component="div" sx={{ mb: 0 }}>
            Contrats du fournisseur {supplier?.name}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter un contrat
          </Button>
        </Box>
        {contracts.length === 0 ? (
          <Typography sx={{ p: 2 }}>
            Aucun contrat disponible pour ce fournisseur
          </Typography>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label="contrats table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Type de contrat</StyledTableCell>
                  <StyledTableCell>Date de début</StyledTableCell>
                  <StyledTableCell>Date de fin</StyledTableCell>
                  <StyledTableCell>Durée</StyledTableCell>
                  <StyledTableCell>Renouvellement</StyledTableCell>
                  <StyledTableCell>Préavis</StyledTableCell>
                  <StyledTableCell>Document</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.map((contract) => (
                  <StyledTableRow key={contract.id}>
                    <StyledTableCell>{getContractTypeLabel(contract.contractType)}</StyledTableCell>
                    <StyledTableCell>{contract.startDate}</StyledTableCell>
                    <StyledTableCell>{contract.endDate}</StyledTableCell>
                    <StyledTableCell>{contract.duration}</StyledTableCell>
                    <StyledTableCell>{getRenewalLabel(contract.renewal)}</StyledTableCell>
                    <StyledTableCell>{contract.noticePeriod}</StyledTableCell>
                    <StyledTableCell>
                      {contract.documentUrl ? (
                        <Tooltip title="Voir le document">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => window.open(contract.documentUrl, '_blank')}
                          >
                            <Article />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Chip size="small" label="Aucun document" />
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(true, contract)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteContract(contract.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog for adding/editing contracts */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Modifier le contrat' : 'Ajouter un nouveau contrat'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type de contrat</InputLabel>
                <Select
                  name="contractType"
                  value={contractForm.contractType}
                  onChange={handleInputChange}
                  label="Type de contrat"
                >
                  {CONTRACT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type de renouvellement</InputLabel>
                <Select
                  name="renewal"
                  value={contractForm.renewal}
                  onChange={handleInputChange}
                  label="Type de renouvellement"
                >
                  {RENEWAL_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date de début"
                  value={contractForm.startDate}
                  onChange={(newValue) => handleDateChange('startDate', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date de fin"
                  value={contractForm.endDate}
                  onChange={(newValue) => handleDateChange('endDate', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Préavis (ex: 3 mois)"
                name="noticePeriod"
                value={contractForm.noticePeriod}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFile />}
                >
                  Document du contrat
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </Button>
                {contractForm.documentFile && (
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {contractForm.documentFile.name}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 