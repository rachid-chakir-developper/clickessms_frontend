import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Stack, Tooltip } from '@mui/material';
import { Delete, PauseRounded, PlayArrowRounded, Edit, Folder, AccountBox } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

export default function BeneficiaryItemCard({beneficiary, onDeleteBeneficiary, onUpdateBeneficiaryState }) {
//   const theme = useTheme();
  const  { setDialogListLibrary } = useFeedBacks();
  const onOpenDialogListLibrary = (folderParent) => {
      setDialogListLibrary({
        isOpen: true,
        folderParent,
        onClose: () => { 
            setDialogListLibrary({isOpen: false})
          }
      })
  }
  return (
    <Card variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, }} >
      <Tooltip title={`${beneficiary?.firstName} ${beneficiary?.lastName}`}>
        <CardMedia component="img" width="100" height="100" alt={`${beneficiary?.firstName} ${beneficiary?.lastName}`}
          src={ beneficiary?.photo ? beneficiary?.photo : "/default-placeholder.jpg"}
          sx={{ borderRadius: 0.6, height: 100, width: 100}}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {`${beneficiary?.firstName} ${beneficiary?.lastName}`}
          </Typography>
          <Typography component="div" variant="caption" color="text.secondary" fontWeight="regular" >
            {`${beneficiary?.email}`}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {onDeleteBeneficiary && <Tooltip title="Supprimer">
            <IconButton aria-label="delete" size="small" sx={{ flexGrow: 0 }}
              onClick={()=> onDeleteBeneficiary(beneficiary?.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>}
          {onUpdateBeneficiaryState && <Tooltip title={!beneficiary?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!beneficiary?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateBeneficiaryState(beneficiary?.id)}
            >
              {!beneficiary?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>}
          <Tooltip title="Modifier">
            <Link to={`/online/ressources-humaines/beneficiaires/modifier/${beneficiary?.id}`} className="no_style">
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          {beneficiary?.folder && <Tooltip title="Pièces jointes">
            <IconButton aria-label="Attachment" size="small" sx={{ flexGrow: 0 }}
              onClick={()=> onOpenDialogListLibrary(beneficiary?.folder)}>
              <Folder fontSize="small" />
            </IconButton>
          </Tooltip>}
          <Tooltip title="Détails">
            <Link to={`/online/ressources-humaines/beneficiaires/details/${beneficiary?.id}`} className="no_style">
              <IconButton aria-label="edit" size="small">
                <AccountBox fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
