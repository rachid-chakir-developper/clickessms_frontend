import * as React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_UNDESIRABLE_EVENT_FIELDS } from '../../../../_shared/graphql/mutations/UndesirableEventMutations';
import { Drafts, HourglassEmpty, Pending, TaskAlt } from '@mui/icons-material';
import { EI_STATUS } from '../../../../_shared/tools/constants';
import { Link } from 'react-router-dom';

 // MenuOptions with icons for each status
 const STATUS_EI = [
  { value: 'NEW', label: 'Déclaré', icon: <HourglassEmpty />, color: 'default'},
  { value: "IN_PROGRESS", label: "En cours de traitement", icon: <Pending />, color: 'info'},
  { value: "DONE", label: "Traité", icon: <TaskAlt />, color: 'success'},
];

export default function UndesirableEventStatusLabelMenu({undesirableEvent, disabled}) {
    const authorizationSystem = useAuthorizationSystem();
    const canManageQuality = authorizationSystem.requestAuthorization({
      type: 'manageQuality',
    }).authorized;
    const [updateUndesirableEventFields, { loading: loadingPut }] = useMutation(PUT_UNDESIRABLE_EVENT_FIELDS, {
      update(cache, { data: { updateUndesirableEventFields } }) {
        const updatedUndesirableEvent = updateUndesirableEventFields.undesirableEvent;
  
        cache.modify({
          fields: {
            undesirableEvents(
              existingUndesirableEvents = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedUndesirableEvents = existingUndesirableEvents.nodes.map((undesirableEvent) =>
                readField('id', undesirableEvent) === updatedUndesirableEvent.id
                  ? updatedUndesirableEvent
                  : undesirableEvent,
              );
  
              return {
                totalCount: existingUndesirableEvents.totalCount,
                nodes: updatedUndesirableEvents,
              };
            },
          },
        });
      },
    });
  return (
    <Box>
        { undesirableEvent?.status !== EI_STATUS.DRAFT ? <CustomizedStatusLabelMenu 
            status={undesirableEvent?.status}
            option={STATUS_EI}
            loading={loadingPut}
            disabled={!canManageQuality}
            onChange={(status)=> {updateUndesirableEventFields({ variables: {id: undesirableEvent?.id, undesirableEventData: {status}} })}}
        /> :
        <Tooltip title="Cliquer pour continer">
          <Link
            to={`/online/qualites/evenements-indesirables/modifier/${undesirableEvent?.id}`}
            className="no_style"
          >
            <Box display="flex" alignItems="center">
              <Drafts color="warning" /> {/* Icône ajoutée avec couleur warning */}
              <Typography variant="body2" sx={{ color: 'warning.main', ml: 1 }}>
                Brouillon
              </Typography>
            </Box>
          </Link>
        </Tooltip>
      }
    </Box>
  );
}