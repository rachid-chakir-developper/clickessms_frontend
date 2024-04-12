import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import EstablishmentServiceItemCard from './EstablishmentServiceItemCard';
import { useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_ESTABLISHMENT_SERVICE, PUT_ESTABLISHMENT_SERVICE_STATE } from '../../../../_shared/graphql/mutations/EstablishmentServiceMutations';
import { GET_ESTABLISHMENT_SERVICES } from '../../../../_shared/graphql/queries/EstablishmentServiceQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import EstablishmentServiceFilter from './EstablishmentServiceFilter';
import { useLazyQuery } from '@apollo/client';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListEstablishmentServices() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [establishmentServiceFilter, setEstablishmentServiceFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter)
    setEstablishmentServiceFilter(newFilter);
  };
  
  const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
  const [getEstablishmentServices, { 
          loading: loadingEstablishmentServices, 
          data: establishmentServicesData, 
          error: establishmentServicesError, 
          fetchMore:  fetchMoreEstablishmentServices 
        }] = useLazyQuery(GET_ESTABLISHMENT_SERVICES, { variables: { establishmentServiceFilter, page: paginator.page, limit: paginator.limit }})

  React.useEffect(() =>{
    getEstablishmentServices()
  }, [establishmentServiceFilter, paginator])

  const [deleteEstablishmentService, { loading : loadingDelete }] = useMutation(DELETE_ESTABLISHMENT_SERVICE, {
    onCompleted: (datas) => {
      if(datas.deleteEstablishmentService.deleted){
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success'
        })
      }else{
        setNotifyAlert({
          isOpen: true,
          message: `Non Supprimé ! ${datas.deleteEstablishmentService.message}.`,
          type: 'error'
        })
      } 
    },
    update(cache, { data: { deleteEstablishmentService } }) {
      console.log('Updating cache after deletion:', deleteEstablishmentService);
    
      const deletedEstablishmentServiceId = deleteEstablishmentService.id;
    
      cache.modify({
        fields: {
          establishmentServices(existingEstablishmentServices = { totalCount: 0, nodes: [] }, { readField }) {
    
            const updatedEstablishmentServices = existingEstablishmentServices.nodes.filter((establishmentService) =>
              readField('id', establishmentService) !== deletedEstablishmentServiceId
            );
    
            console.log('Updated establishmentServices:', updatedEstablishmentServices);
    
            return {
              totalCount: existingEstablishmentServices.totalCount - 1,
              nodes: updatedEstablishmentServices,
            };
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
  
  const onDeleteEstablishmentService = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: "Voulez vous vraiment supprimer ?",
      onConfirm: () => { setConfirmDialog({isOpen: false})
                    deleteEstablishmentService({ variables: { id : id }})
                  }
    })
  }

  const [updateEstablishmentServiceState, { loading : loadingPutState }] = useMutation(PUT_ESTABLISHMENT_SERVICE_STATE, {
    onCompleted: (datas) => {
      if(datas.updateEstablishmentServiceState.done){
        setNotifyAlert({
          isOpen: true,
          message: 'Changée avec succès',
          type: 'success'
        })
      }else{
        setNotifyAlert({
          isOpen: true,
          message: `Non changée ! ${datas.updateEstablishmentServiceState.message}.`,
          type: 'error'
        })
      } 
    },
    refetchQueries :[{query : GET_ESTABLISHMENT_SERVICES}],
    onError: (err) => {
      console.log(err)
      setNotifyAlert({
        isOpen: true,
        message: 'Non changée ! Veuillez réessayer.',
        type: 'error'
      })
    },
  })
  
  const onUpdateEstablishmentServiceState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: "Voulez vous vraiment changer ?",
      onConfirm: () => { setConfirmDialog({isOpen: false})
                        updateEstablishmentServiceState({ variables: { id : id }})
                  }
    })
  }


  return (
    <Grid container spacing={2} >
        <Grid item="true" xs={12}>
            <Box sx={{display : 'flex', justifyContent : 'flex-end', my : 3}}>
              <Link to="/online/associations/services/ajouter" className="no_style">
                <Button variant="contained" endIcon={<Add />} >
                    Ajouter un service
                </Button>
              </Link>
            </Box>
        </Grid>
        <Grid item="true" xs={12}>
          <EstablishmentServiceFilter onFilterChange={handleFilterChange} />
        </Grid>
        <Grid item="true" xs={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {loadingEstablishmentServices && <Grid key={'pgrs'}  item xs={2} sm={4} md={3}><ProgressService type="mediaCard" /></Grid>}
              {establishmentServicesData?.establishmentServices?.nodes.length < 1 && !loadingEstablishmentServices && <Alert severity="warning">Aucun service trouvé.</Alert>}
              {establishmentServicesData?.establishmentServices?.nodes?.map((establishmentService, index) => (
                <Grid xs={2} sm={4} md={3} key={index}>
                  <Item>
                    <EstablishmentServiceItemCard 
                                      establishmentService={establishmentService} 
                                      onDeleteEstablishmentService={onDeleteEstablishmentService} 
                                      onUpdateEstablishmentServiceState={onUpdateEstablishmentServiceState}
                    />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item="true" xs={12}>
          <PaginationControlled
            totalItems={establishmentServicesData?.establishmentServices?.totalCount}  // Nombre total d'éléments
            itemsPerPage={paginator.limit} // Nombre d'éléments par page
            currentPage={1}
            onChange={(page) => setPaginator({ ...paginator, page })}
          />
        </Grid>
    </Grid>
  );
}
