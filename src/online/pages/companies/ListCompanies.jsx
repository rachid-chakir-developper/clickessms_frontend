import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import CompanyItemCard from './CompanyItemCard';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_COMPANY,
  PUT_COMPANY_STATE,
} from '../../../_shared/graphql/mutations/CompanyMutations';
import { GET_COMPANIES } from '../../../_shared/graphql/queries/CompanyQueries';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, List } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProgressService from '../../../_shared/services/feedbacks/ProgressService';
import CompanyFilter from './CompanyFilter';
import PaginationControlled from '../../../_shared/components/helpers/PaginationControlled';
import TableListCompanies from './TableListCompanies';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListCompanies() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [companyFilter, setCompanyFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setCompanyFilter(newFilter);
  };
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();

  const [
    getCompanies,
    {
      loading: loadingCompanies,
      data: companiesData,
      error: companiesError,
      fetchMore: fetchMoreCompanies,
    },
  ] = useLazyQuery(GET_COMPANIES, {
    variables: { companyFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getCompanies();
  }, [companyFilter, paginator]);

  const [deleteCompany, { loading: loadingDelete }] = useMutation(DELETE_COMPANY, {
    onCompleted: (datas) => {
      if (datas.deleteCompany.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non Supprimé ! ${datas.deleteCompany.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteCompany } }) {
      console.log('Updating cache after deletion:', deleteCompany);

      const deletedCompanyId = deleteCompany.id;

      cache.modify({
        fields: {
          companies(existingCompanies = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedCompanies = existingCompanies.nodes.filter(
              (company) => readField('id', company) !== deletedCompanyId,
            );

            console.log('Updated companies:', updatedCompanies);

            return {
              totalCount: existingCompanies.totalCount - 1,
              nodes: updatedCompanies,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non Supprimé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

  const onDeleteCompany = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteCompany({ variables: { id: id } });
      },
    });
  };
  const [updateCompanyState, { loading: loadingPutState }] = useMutation(
    PUT_COMPANY_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateCompanyState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateCompanyState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_COMPANIES }],
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non changée ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

  const onUpdateCompanyState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateCompanyState({ variables: { id: id } });
      },
    });
  };
  
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
            <Link to="/online/associations/ajouter" className="no_style">
              <Button variant="contained" endIcon={<Add />}>
                Ajouter une association
              </Button>
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <CompanyFilter onFilterChange={handleFilterChange} />
        </Grid>
        <Grid item xs={12}>
          <TableListCompanies
            loading={loadingCompanies}
            rows={companiesData?.companies?.nodes || []}
            onDeleteCompany={onDeleteCompany}
          />
        </Grid>
        <Grid item xs={12}>
          <PaginationControlled
            totalItems={companiesData?.companies?.totalCount} // Nombre total d'éléments
            itemsPerPage={paginator.limit} // Nombre d'éléments par page
            currentPage={1}
            onChange={(page) => setPaginator({ ...paginator, page })}
          />
        </Grid>
      </Grid>
    </>
  );
}
