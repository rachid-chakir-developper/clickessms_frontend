import * as React from 'react';
import { Box } from '@mui/material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_UNDESIRABLE_EVENT_FIELDS } from '../../../../_shared/graphql/mutations/UndesirableEventMutations';



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
        <CustomizedStatusLabelMenu 
            status={undesirableEvent?.status}
            type="undesirableEvent"
            loading={loadingPut}
            disabled={!canManageQuality}
            onChange={(status)=> {updateUndesirableEventFields({ variables: {id: undesirableEvent?.id, undesirableEventData: {status}} })}}
        />
    </Box>
  );
}