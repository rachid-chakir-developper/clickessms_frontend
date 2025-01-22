import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_BANK_CARD,
} from '../../../../../_shared/graphql/mutations/BankCardMutations';
import { GET_BANK_CARDS } from '../../../../../_shared/graphql/queries/BankCardQueries';
import BankCardFilter from './BankCardFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListBankCards from './TableListBankCards';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListBankCards() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [bankCardFilter, setBankCardFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBankCardFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getBankCards,
    {
      loading: loadingBankCards,
      data: bankCardsData,
      error: bankCardsError,
      fetchMore: fetchMoreBankCards,
    },
  ] = useLazyQuery(GET_BANK_CARDS, {
    variables: { bankCardFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getBankCards();
  }, [bankCardFilter, paginator]);

  const [deleteBankCard, { loading: loadingDelete }] = useMutation(DELETE_BANK_CARD, {
    onCompleted: (datas) => {
      if (datas.deleteBankCard.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteBankCard.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteBankCard } }) {
      console.log('Updating cache after deletion:', deleteBankCard);

      const deletedBankCardId = deleteBankCard.id;

      cache.modify({
        fields: {
          bankCards(existingBankCards = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedBankCards = existingBankCards.nodes.filter(
              (bankCard) => readField('id', bankCard) !== deletedBankCardId,
            );

            console.log('Updated bankCards:', updatedBankCards);

            return {
              totalCount: existingBankCards.totalCount - 1,
              nodes: updatedBankCards,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non supprimé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

  const onDeleteBankCard = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteBankCard({ variables: { id: id } });
      },
    });
  };



  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/finance/tresorerie/cartes-bancaires/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un logiciel
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <BankCardFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListBankCards
          loading={loadingBankCards}
          rows={bankCardsData?.bankCards?.nodes || []}
          onDeleteBankCard={onDeleteBankCard}
          onFilterChange={(newFilter) => handleFilterChange({ ...bankCardFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={bankCardsData?.bankCards?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
