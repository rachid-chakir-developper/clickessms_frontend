import React from 'react';
import { Box } from '@mui/material';
import FooterDocumentToPrint from './FooterDocumentToPrint';
import HeaderDocumentToPrint from './HeaderDocumentToPrint';
import TaskReport from './tasks/TaskReport';
import EmployeeContractDocument from './employes/EmployeeContractDocument';
import PurchaseOrderDocument from './purchase_orders/PurchaseOrderDocument';
import InvoiceDocument from './invoices/InvoiceDocument';

export class DocumentToPrint extends React.PureComponent {
  render() {
    return (
      <Box
        sx={{ width: '100%', background: '#fff', padding: 2, borderRadius: 2 }}
      >
        <HeaderDocumentToPrint />
        {this.props.type === 'task' && <TaskReport task={this.props.data} />}
        {this.props.type === 'EmployeeContract' && <EmployeeContractDocument employeeContract={this.props.data} />}
        {this.props.type === 'PurchaseOrder' && <PurchaseOrderDocument purchaseOrder={this.props.data} />}
        {this.props.type === 'invoice' && <InvoiceDocument invoice={this.props.data} />}
        <FooterDocumentToPrint />
      </Box>
    );
  }
}
export default DocumentToPrint;
