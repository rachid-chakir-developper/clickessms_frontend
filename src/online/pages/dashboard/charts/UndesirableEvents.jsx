import * as React from 'react';
import TableListUndesirableEvents from '../../qualities/undesirable-events/TableListUndesirableEvents';

export default function UndesirableEvents({ undesirableEvents = [] }) {
  return (
    <React.Fragment>
        <TableListUndesirableEvents
            rows={undesirableEvents || []}
        />
    </React.Fragment>
  );
}
