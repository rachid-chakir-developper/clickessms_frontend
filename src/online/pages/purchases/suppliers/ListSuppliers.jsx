import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import SupplierItemCard from './SupplierItemCard';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_SUPPLIER, PUT_SUPPLIER_STATE } from '../../../../_shared/graphql/mutations/SupplierMutations';
import { GET_SUPPLIERS } from '../../../../_shared/graphql/queries/SupplierQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import SupplierFilter from './SupplierFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListSuppliers from './TableListSuppliers';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListSuppliers() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [supplierFilter, setSupplierFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter)
    setSupplierFilter(newFilter);
  };
  
  const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
  const [getSuppliers, { 
          loading: loadingSuppliers, 
          data: suppliersData, 
          error: suppliersError, 
          fetchMore:  fetchMoreSuppliers 
        }] = useLazyQuery(GET_SUPPLIERS, { variables: { supplierFilter, page: paginator.page, limit: paginator.limit }})
        
  React.useEffect(() =>{
    getSuppliers()
  }, [supplierFilter, paginator])

  const [deleteSupplier, { loading : loadingDelete }] = useMutation(DELETE_SUPPLIER, {
    onCompleted: (datas) => {
      if(datas.deleteSupplier.deleted){
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success'
        })
      }else{
        setNotifyAlert({
          isOpen: true,
          message: `Non Supprimé ! ${datas.deleteSupplier.message}.`,
          type: 'error'
        })
      } 
    },
    update(cache, { data: { deleteSupplier } }) {
      console.log('Updating cache after deletion:', deleteSupplier);
    
      const deletedSupplierId = deleteSupplier.id;
    
      cache.modify({
        fields: {
          suppliers(existingSuppliers = { totalCount: 0, nodes: [] }, { readField }) {
    
            const updatedSuppliers = existingSuppliers.nodes.filter((supplier) =>
              readField('id', supplier) !== deletedSupplierId
            );
    
            console.log('Updated suppliers:', updatedSuppliers);
    
            return {
              totalCount: existingSuppliers.totalCount - 1,
              nodes: updatedSuppliers,
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
  
  const onDeleteSupplier = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: "Voulez vous vraiment supprimer ?",
      onConfirm: () => { setConfirmDialog({isOpen: false})
                    deleteSupplier({ variables: { id : id }})
                  }
    })
  }
  const [updateSupplierState, { loading : loadingPutState }] = useMutation(PUT_SUPPLIER_STATE, {
    onCompleted: (datas) => {
      if(datas.updateSupplierState.done){
        setNotifyAlert({
          isOpen: true,
          message: 'Changée avec succès',
          type: 'success'
        })
      }else{
        setNotifyAlert({
          isOpen: true,
          message: `Non changée ! ${datas.updateSupplierState.message}.`,
          type: 'error'
        })
      } 
    },
    refetchQueries :[{query : GET_SUPPLIERS}],
    onError: (err) => {
      console.log(err)
      setNotifyAlert({
        isOpen: true,
        message: 'Non changée ! Veuillez réessayer.',
        type: 'error'
      })
    },
  })
  
  const onUpdateSupplierState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: "Voulez vous vraiment changer ?",
      onConfirm: () => { setConfirmDialog({isOpen: false})
                        updateSupplierState({ variables: { id : id }})
                  }
    })
  }
  return (
    <Grid container spacing={2} >
        <Grid item="true" xs={12}>
            <Box sx={{display : 'flex', justifyContent : 'flex-end', my : 3}}>
              <Link to="/online/achats/fournisseurs/ajouter" className="no_style">
                <Button variant="contained" endIcon={<Add />} >
                    Ajouter un fournisseur
                </Button>
              </Link>
            </Box>
        </Grid>
        <Grid item="true" xs={12}>
          <SupplierFilter onFilterChange={handleFilterChange} />
        </Grid>
        {/* <Grid item="true" xs={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {loadingSuppliers && <Grid key={'pgrs'}  item="true" xs={12} sm={6} md={4}><ProgressService type="mediaCard" /></Grid>}
              {suppliersData?.suppliers?.nodes.length < 1 && !loadingSuppliers && <Alert severity="warning">Aucun supplier trouvé.</Alert>}
              {suppliersData?.suppliers?.nodes?.map((supplier, index) => (
                <Grid  xs={12} sm={6} md={4} key={index}>
                  <Item>
                    <SupplierItemCard 
                                    supplier={supplier} 
                                    onDeleteSupplier={onDeleteSupplier} 
                                    onUpdateSupplierState={onUpdateSupplierState} 
                    />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid> */}
        
        <Grid item xs={12}>
          <TableListSuppliers
            loading={loadingSuppliers}
            rows={suppliersData?.suppliers?.nodes || []}
            onDeleteSupplier={onDeleteSupplier}
            onFilterChange={(newFilter) => handleFilterChange({ ...supplierFilter, ...newFilter })}
            paginator={paginator}
          />
        </Grid>
        <Grid item="true" xs={12}>
          <PaginationControlled
            totalItems={suppliersData?.suppliers?.totalCount}  // Nombre total d'éléments
            itemsPerPage={paginator.limit} // Nombre d'éléments par page
            currentPage={paginator.page}
            onChange={(page) => setPaginator({ ...paginator, page })}
          />
        </Grid>
    </Grid>
  );
}
