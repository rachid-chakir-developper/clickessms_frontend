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

export default function BeneficiaryAdmissionItemCard({
  beneficiaryAdmission,
  onDeleteBeneficiaryAdmission,
  onUpdateBeneficiaryAdmissionState,
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
  const onOpenModalToPrint = (beneficiaryAdmission) => {
    setPrintingModal({
      isOpen: true,
      type: 'beneficiaryAdmission',
      data: beneficiaryAdmission,
      onClose: () => {
        setPrintingModal({ isOpen: false });
      },
    });
  };
  return (
    <Card
      variant="outlined"
      sx={{ p: 1, borderColor: getStatusColor(beneficiaryAdmission?.status) }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Tooltip title={beneficiaryAdmission?.name}>
          <CardMedia
            component="img"
            width="100"
            height="100"
            alt={beneficiaryAdmission?.name}
            src={beneficiaryAdmission?.image ? beneficiaryAdmission?.image : '/default-placeholder.jpg'}
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
              {beneficiaryAdmission?.name}
            </Typography>
            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
              fontWeight="regular"
            >
              À {`${getFormatDateTime(beneficiaryAdmission?.startingDateTime)}`}
            </Typography>
            <Chip
              label={getStatusLabel(beneficiaryAdmission?.status)}
              sx={{
                backgroundColor: getStatusColor(beneficiaryAdmission?.status),
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
              onClick={() => onDeleteBeneficiaryAdmission(beneficiaryAdmission?.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={!beneficiaryAdmission?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!beneficiaryAdmission?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateBeneficiaryAdmissionState(beneficiaryAdmission?.id)}
            >
              {!beneficiaryAdmission?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link
              to={`/online/ressources-humaines/admissions-beneficiaires/modifier/${beneficiaryAdmission?.id}`}
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
          {beneficiaryAdmission?.folder && (
            <Tooltip title="Pièces jointes">
              <IconButton
                aria-label="Attachment"
                size="small"
                sx={{ flexGrow: 0 }}
                onClick={() => onOpenDialogListLibrary(beneficiaryAdmission?.folder)}
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
              onClick={() => onOpenModalToPrint(beneficiaryAdmission)}
            >
              <Print fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Détails">
            <Link
              to={`/online/ressources-humaines/admissions-beneficiaires/details/${beneficiaryAdmission?.id}`}
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
