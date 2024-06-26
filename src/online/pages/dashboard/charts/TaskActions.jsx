import * as React from 'react';
import TableListTaskActions from '../../works/actions/TableListTaskActions';

export default function TaskActions({ taskActions = [] }) {
  return (
    <React.Fragment>
        <TableListTaskActions
            rows={taskActions || []}
        />
    </React.Fragment>
  );
}
