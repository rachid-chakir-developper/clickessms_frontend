import React from 'react';
import { Box } from '@mui/material';
import FooterDocumentToPrint from './FooterDocumentToPrint';
import HeaderDocumentToPrint from './HeaderDocumentToPrint';
import TaskReport from './tasks/TaskReport';
import EmployeeContractDocument from './employes/EmployeeContractDocument';

export class DocumentToPrint extends React.PureComponent {
  render() {
    return (
      <Box
        sx={{ width: '100%', background: '#fff', padding: 2, borderRadius: 2 }}
      >
        <HeaderDocumentToPrint />
        {this.props.type === 'task' && <TaskReport task={this.props.data} />}
        {this.props.type === 'EmployeeContract' && <EmployeeContractDocument employeeContract={this.props.data} />}
        <FooterDocumentToPrint />
      </Box>
    );
  }
}
export default DocumentToPrint;
