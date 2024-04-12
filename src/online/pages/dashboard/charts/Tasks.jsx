import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import { Alert, Avatar, Chip } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { getFormatTime, getStatusColor, getStatusLabel } from '../../../../_shared/tools/functions';

export default function Tasks({ tasks = [] }) {
  return (
    <React.Fragment>
      <Title>Événements à traiter</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Titre</TableCell>
            <TableCell>Échéance</TableCell>
            <TableCell>Établissement</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Etat</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks?.map((task) => (
            <TableRow key={task?.id}>
              <TableCell>{task?.name}</TableCell>
              <TableCell>À {`${getFormatTime(task?.startingDateTime)}`}</TableCell>
              <TableCell>
                {task?.client && <Chip
                  avatar={<Avatar alt={task?.client?.name} src={task?.client?.photo} />}
                  label={task?.client?.name}
                  variant="outlined"
                />}
                {!task?.client && <Chip
                  label={task?.clientName}
                  variant="outlined"
                />}
              </TableCell>
              <TableCell>{task?.address}</TableCell>
              <TableCell align="right">
                <Chip label={getStatusLabel(task?.status)} sx={{ backgroundColor : getStatusColor(task?.status), color : '#ffffff'}}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      { tasks?.length < 1 && <Alert severity="warning">Aucun événement pour aujourd'hui.</Alert> }
    </React.Fragment>
  );
}