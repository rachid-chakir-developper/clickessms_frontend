import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { CheckBoxOutlineBlank, DoneAll } from '@mui/icons-material';
import { ListItemIcon } from '@mui/material';
import { STATUS } from '../../../../_shared/tools/constants';

export default function ChecklistListItem({checklistItem}) {
  return (
    <>
      <ListItem alignItems="flex-start" sx={{opacity : checklistItem?.status == STATUS.FINISHED ? 1 : 0.6}}>
        <ListItemIcon>
          {checklistItem?.status == STATUS.FINISHED ? <DoneAll /> : <CheckBoxOutlineBlank />}
        </ListItemIcon>
        <ListItemText
          primary={checklistItem?.name}
          secondary={
            <React.Fragment>
              <Typography gutterBottom variant="p" component="p">
                <b>Localisation : </b>{checklistItem?.localisation}
              </Typography>
              <Typography gutterBottom variant="p" component="p">
                <b>Déscription : </b>{checklistItem?.description}
              </Typography>
              <Typography gutterBottom variant="p" component="p">
                <b>Commentaire : </b>{checklistItem?.comment}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
