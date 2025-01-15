import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import LetterItemCard from './LetterItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_LETTER,
  PUT_LETTER_STATE,
} from '../../../../_shared/graphql/mutations/LetterMutations';
import { GET_LETTERS } from '../../../../_shared/graphql/queries/LetterQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import LetterFilter from './LetterFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListLetters from './TableListLetters';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListLetters() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [letterFilter, setLetterFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setLetterFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getLetters,
    {
      loading: loadingLetters,
      data: lettersData,
      error: lettersError,
      fetchMore: fetchMoreLetters,
    },
  ] = useLazyQuery(GET_LETTERS, {
    variables: { letterFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getLetters();
  }, [letterFilter, paginator]);

  const [deleteLetter, { loading: loadingDelete }] = useMutation(
    DELETE_LETTER,
    {
      onCompleted: (datas) => {
        if (datas.deleteLetter.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteLetter.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteLetter } }) {
        console.log('Updating cache after deletion:', deleteLetter);

        const deletedLetterId = deleteLetter.id;

        cache.modify({
          fields: {
            letters(
              existingLetters = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedLetters = existingLetters.nodes.filter(
                (letter) => readField('id', letter) !== deletedLetterId,
              );

              console.log('Updated letters:', updatedLetters);

              return {
                totalCount: existingLetters.totalCount - 1,
                nodes: updatedLetters,
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
    },
  );

  const onDeleteLetter = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteLetter({ variables: { id: id } });
      },
    });
  };

  const [updateLetterState, { loading: loadingPutState }] = useMutation(
    PUT_LETTER_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateLetterState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateLetterState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_LETTERS }],
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

  const onUpdateLetterState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateLetterState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/administratif/courriers/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un courrier
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <LetterFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingLetters && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {lettersData?.letters?.nodes?.length < 1 && !loadingLetters && (
              <Alert severity="warning">Aucun courrier trouvé.</Alert>
            )}
            {lettersData?.letters?.nodes?.map((letter, index) => (
              <Grid item xs={2} sm={4} md={3} key={index}>
                <Item>
                  <LetterItemCard
                    letter={letter}
                    onDeleteLetter={onDeleteLetter}
                    onUpdateLetterState={onUpdateLetterState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <TableListLetters
          loading={loadingLetters}
          rows={lettersData?.letters?.nodes || []}
          onDeleteLetter={onDeleteLetter}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={lettersData?.letters?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
