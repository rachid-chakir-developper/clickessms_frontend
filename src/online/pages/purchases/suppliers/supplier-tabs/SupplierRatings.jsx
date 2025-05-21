import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Rating,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Star, StarBorder, Person } from '@mui/icons-material';
import dayjs from 'dayjs';

// Custom styled rating component
const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.warning.main,
  },
  '& .MuiRating-iconHover': {
    color: theme.palette.warning.dark,
  },
}));

// Sample rating data for demonstration
const SAMPLE_RATINGS = [
  {
    id: '1',
    rating: 4,
    comment: 'Excellent fournisseur, livraison rapide et produits de qualité.',
    ratedBy: 'Jean Dupont',
    ratedAt: '2023-09-15',
    category: 'SERVICE',
  },
  {
    id: '2',
    rating: 5,
    comment: 'Très professionnel, communication claire et efficace.',
    ratedBy: 'Marie Martin',
    ratedAt: '2023-07-20',
    category: 'QUALITY',
  },
  {
    id: '3',
    rating: 3,
    comment: 'Satisfaisant mais quelques délais dans la livraison.',
    ratedBy: 'Pierre Lambert',
    ratedAt: '2023-05-10',
    category: 'DELIVERY',
  },
];

// Rating categories
const RATING_CATEGORIES = [
  { value: 'QUALITY', label: 'Qualité' },
  { value: 'PRICE', label: 'Prix' },
  { value: 'DELIVERY', label: 'Livraison' },
  { value: 'SERVICE', label: 'Service client' },
  { value: 'GENERAL', label: 'Évaluation générale' },
];

export default function SupplierRatings({ supplier }) {
  const [ratings, setRatings] = useState(SAMPLE_RATINGS);
  const [openDialog, setOpenDialog] = useState(false);
  const [ratingForm, setRatingForm] = useState({
    rating: 0,
    comment: '',
    category: '',
  });

  // Calculate average rating
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length 
    : 0;
  
  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // 5 stars, 4 stars, 3 stars, 2 stars, 1 star
  ratings.forEach(rating => {
    ratingCounts[5 - rating.rating]++;
  });
  
  const ratingPercentages = ratingCounts.map(count => 
    ratings.length > 0 ? (count / ratings.length) * 100 : 0
  );

  const handleOpenDialog = () => {
    setRatingForm({
      rating: 0,
      comment: '',
      category: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRatingForm({
      ...ratingForm,
      [name]: value,
    });
  };

  const handleRatingChange = (event, newValue) => {
    setRatingForm({
      ...ratingForm,
      rating: newValue,
    });
  };

  const handleSubmit = () => {
    const newRating = {
      id: `${Date.now()}`,
      rating: ratingForm.rating,
      comment: ratingForm.comment,
      category: ratingForm.category,
      ratedBy: 'Utilisateur actuel', // This would come from the authenticated user
      ratedAt: dayjs().format('YYYY-MM-DD'),
    };

    setRatings([newRating, ...ratings]);
    handleCloseDialog();
  };

  const getCategoryLabel = (categoryValue) => {
    const category = RATING_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {/* Summary Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Note moyenne
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h3" sx={{ mr: 1 }}>
                  {averageRating.toFixed(1)}
                </Typography>
                <StyledRating 
                  value={averageRating} 
                  precision={0.5} 
                  readOnly 
                  size="large"
                />
              </Box>
              <Typography color="text.secondary" gutterBottom>
                Basé sur {ratings.length} évaluations
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Distribution des notes
              </Typography>
              
              {[5, 4, 3, 2, 1].map((star, index) => (
                <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: 40 }}>
                    <Typography>{star}</Typography>
                    <Star fontSize="small" sx={{ color: 'warning.main', ml: 0.5 }} />
                  </Box>
                  <Box sx={{ width: '60%', mx: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={ratingPercentages[index]} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 1,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: star > 3 ? 'success.main' : star > 1 ? 'warning.main' : 'error.main',
                        }
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ width: 40 }}>
                    {ratingCounts[index]}
                  </Typography>
                </Box>
              ))}
              
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  fullWidth
                  onClick={handleOpenDialog}
                >
                  Ajouter une évaluation
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Ratings List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Historique des évaluations
            </Typography>
            
            {ratings.length === 0 ? (
              <Typography sx={{ p: 2 }}>
                Aucune évaluation disponible pour ce fournisseur
              </Typography>
            ) : (
              <List>
                {ratings.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem alignItems="flex-start">
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">
                                {item.ratedBy}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.ratedAt}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label={getCategoryLabel(item.category)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        
                        <StyledRating 
                          value={item.rating} 
                          readOnly 
                        />
                        
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {item.comment}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < ratings.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog for adding ratings */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une évaluation</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Note
            </Typography>
            <StyledRating
              name="rating"
              value={ratingForm.rating}
              onChange={handleRatingChange}
              size="large"
              precision={1}
              emptyIcon={<StarBorder fontSize="inherit" />}
            />
          </Box>
          
          <TextField
            select
            label="Catégorie"
            name="category"
            value={ratingForm.category}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value="" disabled>
              Sélectionnez une catégorie
            </option>
            {RATING_CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          
          <TextField
            label="Commentaire"
            name="comment"
            value={ratingForm.comment}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={ratingForm.rating === 0 || !ratingForm.category}
          >
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 