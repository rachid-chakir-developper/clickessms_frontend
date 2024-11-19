import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Chip, Stack, Tooltip } from '@mui/material';
import {
  Delete,
  PauseRounded,
  PlayArrowRounded,
  Edit,
  Article,
  Folder,
  Print,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  getFormatDateTime,
  getStatusColor,
  getStatusLabel,
} from '../../../../_shared/tools/functions';

export default function ExpenseItemCard({
  expense,
  onDeleteExpense,
  onUpdateExpenseState,
}) {
  //   const theme = useTheme();
  const { setDialogListLibrary, setPrintingModal } = useFeedBacks();
  const onOpenDialogListLibrary = (folderParent) => {
    setDialogListLibrary({
      isOpen: true,
      folderParent,
      onClose: () => {
        setDialogListLibrary({ isOpen: false });
      },
    });
  };
  const onOpenModalToPrint = (expense) => {
    setPrintingModal({
      isOpen: true,
      type: 'expense',
      data: expense,
      onClose: () => {
        setPrintingModal({ isOpen: false });
      },
    });
  };
  return (
    <Card
      variant="outlined"
      sx={{ p: 1, borderColor: getStatusColor(expense?.status) }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Tooltip title={expense?.name}>
          <CardMedia
            component="img"
            width="100"
            height="100"
            alt={expense?.name}
            src={expense?.image ? expense?.image : '/default-placeholder.jpg'}
            sx={{
              borderRadius: 0.6,
              height: 100,
              width: 100,
              border: 'solid 1px #e1e1e1',
            }}
          />
        </Tooltip>
        <Stack direction="column" spacing={2} alignItems="center">
          <Stack direction="column" spacing={0.2} alignItems="center">
            <Typography color="text.primary" fontWeight="medium" fontSize={18}>
              {expense?.name}
            </Typography>
            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
              fontWeight="regular"
            >
              À {`${getFormatDateTime(expense?.startingDateTime)}`}
            </Typography>
            <Chip
              label={getStatusLabel(expense?.status)}
              sx={{
                backgroundColor: getStatusColor(expense?.status),
                color: '#ffffff',
              }}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1.5}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1.5}
        >
          <Tooltip title="Supprimer">
            <IconButton
              aria-label="delete"
              size="small"
              sx={{ flexGrow: 0 }}
              onClick={() => onDeleteExpense(expense?.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={!expense?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!expense?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateExpenseState(expense?.id)}
            >
              {!expense?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link
              to={`/online/achats/depenses-engagements/modifier/${expense?.id}`}
              className="no_style"
            >
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1.5}
        >
          {expense?.folder && (
            <Tooltip title="Pièces jointes">
              <IconButton
                aria-label="Attachment"
                size="small"
                sx={{ flexGrow: 0 }}
                onClick={() => onOpenDialogListLibrary(expense?.folder)}
              >
                <Folder fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Imprimer le compte rendu">
            <IconButton
              aria-label="print"
              size="small"
              sx={{ flexGrow: 0 }}
              onClick={() => onOpenModalToPrint(expense)}
            >
              <Print fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Détails">
            <Link
              to={`/online/achats/depenses-engagements/details/${expense?.id}`}
              className="no_style"
            >
              <IconButton aria-label="edit" size="small">
                <Article fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
