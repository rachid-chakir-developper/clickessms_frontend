import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Chip,
  styled,
  InputAdornment,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon, Event as EventIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, differenceInMonths } from 'date-fns';
import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { GET_SUPPLIER_CONTRACTS } from '../../../../../_shared/graphql/queries/SupplierContractQueries';
import { 
  CREATE_SUPPLIER_CONTRACT, 
  UPDATE_SUPPLIER_CONTRACT, 
  DELETE_SUPPLIER_CONTRACT,
  UPLOAD_SUPPLIER_CONTRACT_DOCUMENT,
  DELETE_SUPPLIER_CONTRACT_DOCUMENT
} from '../../../../../_shared/graphql/mutations/SupplierContractMutations';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.grey[100],
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
}));

// Contract types
const CONTRACT_TYPES = [
  'Purchase Agreement',
  'Service Level Agreement',
  'Framework Agreement',
  'Supply Contract',
  'Maintenance Contract',
  'Consulting Agreement',
  'Distribution Agreement',
  'Licensing Agreement',
  'Other'
];

// Interface for contract data
interface Contract {
  id: number;
  contractType: string;
  contractNumber: string;
  title: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in months
  renewalType: string;
  renewalDate: Date | null;
  noticePeriod: number; // in days
  value: number;
  description: string;
  documents: File[];
  documentUrls: string[]; // URLs for stored documents
}

interface ContractsTabProps {
  supplierId?: number;
}

const ContractsTab: React.FC<ContractsTabProps> = ({ supplierId }) => {
  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  
  // Form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // GraphQL Queries
  const { loading, error, data, refetch } = useQuery(GET_SUPPLIER_CONTRACTS, {
    variables: {
      supplierId,
      offset: (page - 1) * limit,
      limit,
      page,
      searchTerm: searchTerm || undefined,
      filterType: filterType || undefined
    },
    skip: !supplierId,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only'
  });

  // GraphQL Mutations
  const [createContract, { loading: createLoading }] = useMutation(CREATE_SUPPLIER_CONTRACT);
  const [updateContract, { loading: updateLoading }] = useMutation(UPDATE_SUPPLIER_CONTRACT);
  const [deleteContract, { loading: deleteLoading }] = useMutation(DELETE_SUPPLIER_CONTRACT);
  const [uploadDocument, { loading: uploadLoading }] = useMutation(UPLOAD_SUPPLIER_CONTRACT_DOCUMENT);
  const [deleteDocument, { loading: deleteDocLoading }] = useMutation(DELETE_SUPPLIER_CONTRACT_DOCUMENT);

  // Derived values
  const contracts = data?.supplierContracts?.nodes || [];
  const totalCount = data?.supplierContracts?.totalCount || 0;
  const isSaving = createLoading || updateLoading || uploadLoading;
  const isDeleting = deleteLoading || deleteDocLoading;

  // Empty form template
  const emptyContract: Contract = {
    id: 0,
    contractType: '',
    contractNumber: '',
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    duration: 0,
    renewalType: '',
    renewalDate: null,
    noticePeriod: 30,
    value: 0,
    description: '',
    documents: [],
    documentUrls: []
  };

  // Handler for opening add dialog
  const handleAddContract = () => {
    setIsEditing(false);
    setCurrentContract({ ...emptyContract, id: Date.now() });
    setSelectedFiles([]);
    setFormErrors({});
    setOpenDialog(true);
  };

  // Handler for opening edit dialog
  const handleEditContract = (contract: Contract) => {
    // Convert string dates to Date objects if necessary
    const editContract = {
      ...contract,
      startDate: contract.startDate instanceof Date ? contract.startDate : new Date(contract.startDate),
      endDate: contract.endDate instanceof Date ? contract.endDate : new Date(contract.endDate),
      renewalDate: contract.renewalDate ? 
        (contract.renewalDate instanceof Date ? contract.renewalDate : new Date(contract.renewalDate)) 
        : null
    };
    
    setIsEditing(true);
    setCurrentContract(editContract);
    setSelectedFiles([]);
    setFormErrors({});
    setOpenDialog(true);
  };

  // Handler for deleting a contract
  const handleDeleteContract = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        const { data } = await deleteContract({
          variables: { id }
        });
        
        if (data?.deleteSupplierContract?.success) {
          refetch();
          setNotification({
            open: true,
            message: 'Contract deleted successfully',
            severity: 'success'
          });
        } else {
          throw new Error(data?.deleteSupplierContract?.message || 'Failed to delete contract');
        }
      } catch (err) {
        const errorMessage = err instanceof ApolloError ? 
          err.message : 'Failed to delete contract';
        
        setNotification({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    }
  };

  // Handler for dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handler for form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name && currentContract) {
      setCurrentContract({
        ...currentContract,
        [name]: value
      });
    }
  };

  // Handler for date changes
  const handleDateChange = (name: string, date: Date | null) => {
    if (currentContract && date) {
      const updates: Partial<Contract> = { [name]: date };
      
      // Automatically calculate duration if both dates are set
      if (name === 'startDate' && currentContract.endDate) {
        const duration = differenceInMonths(currentContract.endDate, date);
        updates.duration = duration > 0 ? duration : 0;
      } else if (name === 'endDate' && currentContract.startDate) {
        const duration = differenceInMonths(date, currentContract.startDate);
        updates.duration = duration > 0 ? duration : 0;
      }
      
      setCurrentContract({
        ...currentContract,
        ...updates
      });
    }
  };

  // Handler for file selection
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
      
      if (currentContract) {
        setCurrentContract({
          ...currentContract,
          documents: [...currentContract.documents, ...newFiles]
        });
      }
    }
  };

  // Handler for removing a file
  const handleRemoveFile = async (fileIndex: number, isUploadedFile: boolean) => {
    if (currentContract) {
      if (isUploadedFile) {
        // Remove from selected files
        setSelectedFiles(selectedFiles.filter((_, index) => index !== fileIndex));
        
        // Remove from current contract documents
        setCurrentContract({
          ...currentContract,
          documents: currentContract.documents.filter((_, index) => index !== fileIndex)
        });
      } else {
        // Delete from server if it's an existing document
        try {
          const documentUrl = currentContract.documentUrls[fileIndex];
          
          const { data } = await deleteDocument({
            variables: {
              contractId: currentContract.id,
              documentUrl
            }
          });
          
          if (data?.deleteSupplierContractDocument?.success) {
            // Update current contract documentUrls
            setCurrentContract({
              ...currentContract,
              documentUrls: currentContract.documentUrls.filter((_, index) => index !== fileIndex)
            });
            
            setNotification({
              open: true,
              message: 'Document deleted successfully',
              severity: 'success'
            });
          } else {
            throw new Error(data?.deleteSupplierContractDocument?.message || 'Failed to delete document');
          }
        } catch (err) {
          const errorMessage = err instanceof ApolloError ? 
            err.message : 'Failed to delete document';
          
          setNotification({
            open: true,
            message: errorMessage,
            severity: 'error'
          });
        }
      }
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!currentContract?.contractType) errors.contractType = 'Contract type is required';
    if (!currentContract?.contractNumber) errors.contractNumber = 'Contract number is required';
    if (!currentContract?.title) errors.title = 'Title is required';
    if (!currentContract?.startDate) errors.startDate = 'Start date is required';
    if (!currentContract?.endDate) errors.endDate = 'End date is required';
    if (currentContract?.startDate && currentContract?.endDate && 
        currentContract.startDate > currentContract.endDate) {
      errors.endDate = 'End date must be after start date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Transform contract data for API
  const transformContractForApi = (contract: Contract) => {
    // Format dates as ISO strings
    return {
      contractType: contract.contractType,
      contractNumber: contract.contractNumber,
      title: contract.title,
      startDate: contract.startDate.toISOString(),
      endDate: contract.endDate.toISOString(),
      duration: contract.duration,
      renewalType: contract.renewalType,
      renewalDate: contract.renewalDate ? contract.renewalDate.toISOString() : null,
      noticePeriod: contract.noticePeriod,
      value: contract.value,
      description: contract.description,
      // Don't include documentUrls, they are handled separately
    };
  };

  // Handler for form submission
  const handleSaveContract = async () => {
    if (!validateForm() || !currentContract || !supplierId) return;
    
    try {
      const contractInput = transformContractForApi(currentContract);
      let result;
      
      if (isEditing) {
        // Update existing contract
        result = await updateContract({
          variables: {
            id: currentContract.id,
            contractData: contractInput
          }
        });
        
        const updatedContract = result.data?.updateSupplierContract?.supplierContract;
        
        if (!updatedContract) {
          throw new Error('Failed to update contract');
        }
        
        setNotification({
          open: true,
          message: 'Contract updated successfully',
          severity: 'success'
        });
      } else {
        // Add new contract
        result = await createContract({
          variables: {
            supplierId,
            contractData: contractInput
          }
        });
        
        const newContract = result.data?.createSupplierContract?.supplierContract;
        
        if (!newContract) {
          throw new Error('Failed to create contract');
        }
        
        setNotification({
          open: true,
          message: 'Contract added successfully',
          severity: 'success'
        });
      }
      
      // Get the created/updated contract ID
      const contractId = isEditing ? 
        currentContract.id : 
        result.data?.createSupplierContract?.supplierContract.id;
      
      // Upload any selected files
      if (selectedFiles.length > 0 && contractId) {
        for (const file of selectedFiles) {
          await uploadDocument({
            variables: {
              contractId,
              file
            }
          });
        }
      }
      
      // Refetch contracts to update the list
      refetch();
      
      setOpenDialog(false);
    } catch (err) {
      const errorMessage = err instanceof ApolloError ? 
        err.message : `Failed to ${isEditing ? 'update' : 'add'} contract`;
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Handle search and filter changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setPage(1); // Reset to first page
  };

  // Get unique contract types for filter
  const uniqueContractTypes = Array.from(
    new Set(contracts.map((contract: Contract) => contract.contractType))
  ).filter(Boolean);

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Supplier Contracts</Typography>
        
        {/* Search and Filter Controls */}
        <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
          <TextField
            label="Search Contracts"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e: SelectChangeEvent<string>) => handleFilterChange(e.target.value as string)}
              label="Filter by Type"
            >
              <MenuItem value="">All Types</MenuItem>
              {uniqueContractTypes.map((type) => (
                <MenuItem key={type as string} value={type as string}>{type as string}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddContract}
          >
            Add Contract
          </Button>
        </Box>
        
        {/* Loading and Error States */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
            <Button 
              size="small" 
              onClick={() => refetch()} 
              sx={{ ml: 2 }}
            >
              Try Again
            </Button>
          </Alert>
        ) : (
          // Contracts Table
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell>Contract Number</StyledTableHeadCell>
                  <StyledTableHeadCell>Type</StyledTableHeadCell>
                  <StyledTableHeadCell>Title</StyledTableHeadCell>
                  <StyledTableHeadCell>Start Date</StyledTableHeadCell>
                  <StyledTableHeadCell>End Date</StyledTableHeadCell>
                  <StyledTableHeadCell>Duration</StyledTableHeadCell>
                  <StyledTableHeadCell>Renewal</StyledTableHeadCell>
                  <StyledTableHeadCell>Notice Period</StyledTableHeadCell>
                  <StyledTableHeadCell>Value</StyledTableHeadCell>
                  <StyledTableHeadCell>Documents</StyledTableHeadCell>
                  <StyledTableHeadCell>Actions</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.length > 0 ? (
                  contracts.map((contract: Contract) => (
                    <StyledTableRow key={contract.id}>
                      <TableCell>{contract.contractNumber}</TableCell>
                      <TableCell>{contract.contractType}</TableCell>
                      <TableCell>{contract.title}</TableCell>
                      <TableCell>{format(new Date(contract.startDate), 'MM/dd/yyyy')}</TableCell>
                      <TableCell>{format(new Date(contract.endDate), 'MM/dd/yyyy')}</TableCell>
                      <TableCell>{contract.duration} months</TableCell>
                      <TableCell>
                        {contract.renewalType}
                        {contract.renewalDate && (
                          <Typography variant="caption" display="block">
                            Renewal: {format(new Date(contract.renewalDate), 'MM/dd/yyyy')}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{contract.noticePeriod} days</TableCell>
                      <TableCell>${contract.value?.toLocaleString()}</TableCell>
                      <TableCell>
                        {contract.documentUrls?.length > 0 ? (
                          <Chip 
                            icon={<AttachFileIcon />} 
                            label={`${contract.documentUrls.length} files`} 
                            size="small" 
                            color="primary"
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No documents
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEditContract(contract)}
                            disabled={isDeleting}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteContract(contract.id)}
                            disabled={isDeleting}
                          >
                            {deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon fontSize="small" />}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      No contracts found. Add a new contract to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Contract Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEditing ? 'Edit Contract' : 'Add New Contract'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Contract Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Contract Type</InputLabel>
                <Select
                  name="contractType"
                  value={currentContract?.contractType || ''}
                  onChange={(e: SelectChangeEvent) => handleFormChange(e)}
                  label="Contract Type"
                  required
                >
                  <MenuItem value="Service">Service</MenuItem>
                  <MenuItem value="Product Supply">Product Supply</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Licensing">Licensing</MenuItem>
                  <MenuItem value="Consulting">Consulting</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Contract Number */}
            <Grid item xs={12} md={6}>
              <TextField
                name="contractNumber"
                label="Contract Number"
                fullWidth
                required
                value={currentContract?.contractNumber || ''}
                onChange={handleFormChange}
                error={!!formErrors.contractNumber}
                helperText={formErrors.contractNumber}
              />
            </Grid>

            {/* Contract Title */}
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Contract Title"
                fullWidth
                required
                value={currentContract?.title || ''}
                onChange={handleFormChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>

            {/* Dates and Duration */}
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={currentContract?.startDate || null}
                  onChange={(date) => handleDateChange('startDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!formErrors.startDate,
                      helperText: formErrors.startDate
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={currentContract?.endDate || null}
                  onChange={(date) => handleDateChange('endDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!formErrors.endDate,
                      helperText: formErrors.endDate
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                name="duration"
                label="Duration (months)"
                type="number"
                fullWidth
                InputProps={{ readOnly: true }}
                value={currentContract?.duration || 0}
              />
            </Grid>

            {/* Renewal Information */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Auto Renewal</InputLabel>
                <Select
                  name="renewalType"
                  value={currentContract?.renewalType || ''}
                  onChange={(e: SelectChangeEvent) => handleFormChange(e)}
                  label="Auto Renewal"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Renewal Date"
                  value={currentContract?.renewalDate}
                  onChange={(date) => handleDateChange('renewalDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      disabled: currentContract?.renewalType === 'No'
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                name="noticePeriod"
                label="Notice Period (days)"
                type="number"
                fullWidth
                value={currentContract?.noticePeriod || 0}
                onChange={handleFormChange}
              />
            </Grid>

            {/* Value */}
            <Grid item xs={12} md={6}>
              <TextField
                name="value"
                label="Contract Value"
                type="number"
                fullWidth
                value={currentContract?.value || 0}
                onChange={handleFormChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={3}
                fullWidth
                value={currentContract?.description || ''}
                onChange={handleFormChange}
              />
            </Grid>

            {/* Document Upload */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Contract Documents</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  disabled={isSaving}
                >
                  Attach Files
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileSelection}
                  />
                </Button>
                
                {/* Display selected files */}
                {selectedFiles.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {selectedFiles.map((file, index) => (
                      <Chip
                        key={`upload-${index}`}
                        label={file.name}
                        onDelete={() => handleRemoveFile(index, true)}
                        color="primary"
                        variant="outlined"
                        size="small"
                        disabled={isSaving}
                      />
                    ))}
                  </Box>
                )}
                
                {/* Display existing document URLs */}
                {currentContract?.documentUrls && currentContract.documentUrls.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {currentContract.documentUrls.map((doc, index) => (
                      <Chip
                        key={`doc-${index}`}
                        label={doc}
                        onDelete={() => handleRemoveFile(index, false)}
                        color="secondary"
                        variant="outlined"
                        size="small"
                        disabled={isSaving || deleteDocLoading}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSaving}>Cancel</Button>
          <Button 
            onClick={handleSaveContract} 
            variant="contained" 
            color="primary"
            disabled={isSaving}
          >
            {isSaving ? <CircularProgress size={24} /> : isEditing ? 'Update' : 'Save'} Contract
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContractsTab; 