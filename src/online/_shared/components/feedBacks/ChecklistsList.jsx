import { Alert, List, Typography } from "@mui/material";
import ChecklistListItem from "./ChecklistItem";
import { Dangerous, Done, EditRoad } from "@mui/icons-material";

export default function ChecklistsList({checklist = [], isFromQuote=false, loading=false}) {
    return (
      <>
          {isFromQuote && <Typography sx={{fontSize : 16}} variant="h6" component="div">
            <em>Utiliser le Devis</em> <Done />
          </Typography>}
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {checklist?.length < 1 && !loading && <Alert severity="warning">La liste est vide pour le moment !</Alert>}
              {checklist?.map((checklistItem, index) => (
                  <ChecklistListItem key={index} checklistItem={checklistItem}/>
              ))}
          </List>
      </>
    );
  }