import * as React from 'react';
import TableListTasks from '../../works/tasks/TableListTasks';

export default function Tasks({ tasks = [] }) {
  return (
    <React.Fragment>
        <TableListTasks
            rows={tasks || []}
        />
    </React.Fragment>
  );
}
