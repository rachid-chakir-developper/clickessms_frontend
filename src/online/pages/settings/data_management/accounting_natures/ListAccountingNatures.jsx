import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_ACCOUNTING_NATURE, PUT_ACCOUNTING_NATURE_STATE } from '../../../../../_shared/graphql/mutations/DataMutations';
import { GET_ACCOUNTING_NATURES } from '../../../../../_shared/graphql/queries/DataQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import AccountingNatureFilter from './AccountingNatureFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListAccountingNatures from './TableListAccountingNatures';
import DatasImportField from '../../../../_shared/components/data_tools/import/DatasImportField';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import DialogAddAccountingNature from './DialogAddAccountingNature';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListAccountingNatures() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [accountingNatureFilter, setAccountingNatureFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter)
    setAccountingNatureFilter(newFilter);
  };

  const authorizationSystem = useAuthorizationSystem();
    const canManageAccountingNatures = authorizationSystem.requestAuthorization({
      type: 'manageAccountingNatures',
    }).authorized;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [accountingNatureParent, setAccountingNatureParent] = React.useState();
  const [accountingNatureToEdit, setAccountingNatureToEdit] = React.useState();

  const handleClickAdd = (accountingNatureParent=null) => {
    setAccountingNatureToEdit(null);
    setAccountingNatureParent(accountingNatureParent)
    setOpenDialog(true);
  };

  const handleClickEdit = (data) => {
    setAccountingNatureParent(null)
    setAccountingNatureToEdit(data);
    setOpenDialog(true);
  };

  const closeDialog = (value) => {
    setOpenDialog(false);
    if (value) {
      // console.log('value', value);
    }
  };
  
  const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
  const [getAccountingNatures, { 
          loading: loadingAccountingNatures, 
          data: accountingNaturesData, 
          error: accountingNaturesError, 
          fetchMore:  fetchMoreAccountingNatures 
        }] = useLazyQuery(GET_ACCOUNTING_NATURES, { variables: { accountingNatureFilter, page: paginator.page, limit: paginator.limit }})
        
  React.useEffect(() =>{
    getAccountingNatures()
  }, [accountingNatureFilter, paginator])

  const [deleteAccountingNature, { loading : loadingDelete }] = useMutation(DELETE_ACCOUNTING_NATURE, {
    onCompleted: (datas) => {
      if(datas.deleteAccountingNature.deleted){
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success'
        })
      }else{
        setNotifyAlert({
          isOpen: true,
          message: `Non Supprimé ! ${datas.deleteAccountingNature.message}.`,
          type: 'error'
        })
      } 
    },
    update(cache, { data: { deleteAccountingNature } }) {
      console.log('Updating cache after deletion:', deleteAccountingNature);
    
      const deletedAccountingNatureId = deleteAccountingNature.id;
    
      cache.modify({
        fields: {
          accountingNatures(existingAccountingNatures = { totalCount: 0, nodes: [] }, { readField }) {
    
            const updatedAccountingNatures = existingAccountingNatures.nodes.filter((accountingNature) =>
              readField('id', accountingNature) !== deletedAccountingNatureId
            );
    
            console.log('Updated accountingNatures:', updatedAccountingNatures);
    
            return {
              totalCount: existingAccountingNatures.totalCount - 1,
              nodes: updatedAccountingNatures,
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
  
  const onDeleteAccountingNature = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: "Voulez vous vraiment supprimer ?",
      onConfirm: () => { setConfirmDialog({isOpen: false})
                    deleteAccountingNature({ variables: { id : id }})
                  }
    })
  }
  const [updateAccountingNatureState, { loading : loadingPutState }] = useMutation(PUT_ACCOUNTING_NATURE_STATE, {
    onCompleted: (datas) => {
      if(datas.updateAccountingNatureState.done){
        setNotifyAlert({
          isOpen: true,
          message: 'Changée avec succès',
          type: 'success'
        })
      }else{
        setNotifyAlert({
          isOpen: true,
          message: `Non changée ! ${datas.updateAccountingNatureState.message}.`,
          type: 'error'
        })
      } 
    },
    refetchQueries :[{query : GET_ACCOUNTING_NATURES}],
    onError: (err) => {
      console.log(err)
      setNotifyAlert({
        isOpen: true,
        message: 'Non changée ! Veuillez réessayer.',
        type: 'error'
      })
    },
  })
  
  const onUpdateAccountingNatureState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: "Voulez vous vraiment changer ?",
      onConfirm: () => { setConfirmDialog({isOpen: false})
                        updateAccountingNatureState({ variables: { id : id }})
                  }
    })
  }
  return (<>
      <Grid container spacing={2} >
          <Grid item="true" xs={12}>
            {canManageAccountingNatures && <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', my: 3 }}>
              <DatasImportField
                title="Importer" 
                entity="AccountingNature" 
                label="Importer" 
                fields={['code', 'name', 'description']}
                refetchQueries={[{ query: GET_ACCOUNTING_NATURES }]} />
              <Button onClick={handleClickAdd} variant="contained" endIcon={<Add />} sx={{marginLeft: 1}}>
                Ajouter une nature
              </Button>
            </Box>}
          </Grid>
          <Grid item="true" xs={12}>
            <AccountingNatureFilter onFilterChange={handleFilterChange} />
          </Grid>
          <Grid item xs={12}>
            <TableListAccountingNatures
              loading={loadingAccountingNatures}
              rows={accountingNaturesData?.accountingNatures?.nodes || []}
              handleClickEdit={handleClickEdit}
              onDeleteAccountingNature={onDeleteAccountingNature}
              onFilterChange={(newFilter) => handleFilterChange({ ...accountingNatureFilter, ...newFilter })}
              paginator={paginator}
            />
          </Grid>
          <Grid item="true" xs={12}>
            <PaginationControlled
              totalItems={accountingNaturesData?.accountingNatures?.totalCount}  // Nombre total d'éléments
              itemsPerPage={paginator.limit} // Nombre d'éléments par page
              currentPage={paginator.page}
              onChange={(page) => setPaginator({ ...paginator, page })}
            />
          </Grid>
      </Grid>
      <DialogAddAccountingNature
        open={openDialog}
        onClose={closeDialog}
        accountingNatureParent={accountingNatureParent}
        accountingNatureToEdit={accountingNatureToEdit}
      />
    </>
  );
}