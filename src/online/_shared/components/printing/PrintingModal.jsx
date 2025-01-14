import React from 'react';
import {
  useTheme,
  Stack,
  Box,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material';
import { Close, Print } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import DocumentToPrint from './DocumentToPrint';

export default function PrintingModal({ printingModal, setPrintingModal }) {
  let { isOpen, onClose, type, data } = printingModal;
  const componentRef = React.useRef();
  const pageStyle = `
    @page{ 
      size: auto;  margin: 5mm ; } @media print { body { -webkit-print-color-adjust: exact; } }
      @media print {
        div.page-footer {
          position: fixed;
          bottom:0mm;
          width: 100%;
          height: 110px;
          /*font-size: 15px;*/
          /*color: #fff;*/
          /* For testing */
          /*background: red; */
          opacity: 0.7;
          
          page-break-after: always;
        }
        .page-number:before {
          /* counter-increment: page; */
          content: "Pagina "counter(page);
        }
      }
      body {
        marginBottom:125px
      }
    `;
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    removeAfterPrint: true,
    copyStyles: true,
    pageStyle: pageStyle,
  });

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg">
      <DialogContent>
        <Stack
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <IconButton
              variant="contained"
              sx={{ backgroundColor: '#e1e1e1', marginRight: 2 }}
              aria-label="next"
              onClick={handlePrint}
            >
              <Print />
            </IconButton>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <DocumentToPrint ref={componentRef} data={data} type={type} />
          </Box>
        </Stack>
      </DialogContent>
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          padding: 2,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <IconButton
          variant="contained"
          sx={{ backgroundColor: '#e1e1e1', marginRight: 2 }}
          aria-label="next"
          onClick={handlePrint}
        >
          <Print />
        </IconButton>
        <IconButton
          variant="contained"
          sx={{ backgroundColor: '#e1e1e1' }}
          aria-label="next"
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </Box>
    </Dialog>
  );
}
