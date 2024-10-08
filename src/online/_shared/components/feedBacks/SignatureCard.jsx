import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { getFormatDateTime } from '../../../../_shared/tools/functions';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function SignatureCard({ signature, author }) {
  return (
    <Card sx={{ maxWidth: 345 }} variant="outlined">
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            src={author?.employee ? author?.employee?.photo : author?.photo}
          >
            S
          </Avatar>
        }
        title={
          author?.name
            ? author?.name
            : `${author?.firstName} ${author?.lastName}`
        }
        subheader={`signé le ${getFormatDateTime(signature?.updatedAt ? signature?.updatedAt : signature?.createdAt)}`}
      />
      <CardContent>
        {(signature?.authorName ||
          signature?.authorNumber ||
          signature?.authorEmail) && (
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Par :{' '}
            <b>
              {signature?.authorName} {signature?.authorNumber}{' '}
              {signature?.authorEmail}
            </b>
          </Typography>
        )}
      </CardContent>
      <CardMedia
        component="img"
        height="194"
        image={signature?.base64Encoded}
        alt="Signature"
        sx={{ objectFit: 'contain' }}
      />
    </Card>
  );
}
