import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { getFormatDateTime } from '../../../_shared/tools/functions';

const ListChatItem = ({conversation}) => {
    const [title, setTitle] = React.useState('');
    const [showActions, setShowActions] = React.useState(false);
    const {creator, participants}= conversation
    React.useEffect(()=>{
        let titleAux = ''
        participants?.filter((p)=> p.user.id != creator.id).map((participant, index) => {
            titleAux += `${participant?.user?.firstName} ${participant?.user?.lastName}`
        })
        if(titleAux == '') setTitle('Discusion sans nom')
        else setTitle(titleAux)
    }, [participants])
  return (
        <ListItem  button>
          <ListItemAvatar>
            
            {participants?.filter((p)=> p.user.id != creator.id)?.map((participant, index) => (
                    <Avatar key={index} src={participant.user.photo ? participant.user?.photo : "/default-placeholder.jpg"}>
                        {/* Vous pouvez ajouter une image d'utilisateur ici */}
                        {title}
                    </Avatar>
                ))
            }
          </ListItemAvatar>
          <ListItemText
            primary={title}
            secondary={conversation?.lastMessage?.text}
            secondaryTypographyProps={{ noWrap: true }} // Limite la longueur du texte
          />
          <ListItemText primary={`${getFormatDateTime(conversation?.createdAt)}`} align="right" />
        </ListItem>
  );
};

export default ListChatItem;
