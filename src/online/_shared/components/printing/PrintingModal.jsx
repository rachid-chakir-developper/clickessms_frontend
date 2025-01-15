import React from 'react';
import {
  useTheme,
  Stack,
  Box,
  IconButton,
  Dialog,
  DialogContent,
  Tooltip,
} from '@mui/material';
import { Close, PictureAsPdf, Print } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import DocumentToPrint from './DocumentToPrint';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  const handleExportToPdf = async () => {
    try {
        const input = componentRef.current;
        if (!input) {
            throw new Error("Component reference is not available.");
        }

        // Créer un conteneur temporaire pour l'en-tête et le pied de page
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        document.body.appendChild(tempContainer);

        // Créer l'en-tête et le pied de page
        const headerHtml = `
            <div style="text-align: center; font-size: 12px; border-bottom: 1px solid #000; padding: 10px;">
                Titre de l'En-tête
            </div>
        `;
        const footerHtml = `
            <div style="text-align: center; font-size: 12px; border-top: 1px solid #000; padding: 10px;">
                Footer Content
            </div>
        `;

        // tempContainer.innerHTML = input.outerHTML + footerHtml;
        tempContainer.innerHTML = input.outerHTML;

        // Convertir le conteneur en image via html2canvas
        const canvas = await html2canvas(tempContainer, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        // Créer un PDF à partir de l'image
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = pdf.internal.pageSize.getWidth(); // Largeur A4 en mm
        const pageHeight = pdf.internal.pageSize.getHeight(); // Hauteur A4 en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        console.log('imgWidth', imgWidth)
        console.log('pageHeight', pageHeight)
        console.log('imgHeight', imgHeight)
        console.log('canvas', canvas.height)
        let position = 0;
        let pageCount = Math.ceil(imgHeight / pageHeight);

        // Ajouter l'image par page
        for (let i = 0; i < pageCount; i++) {
            if (i > 0) {
                pdf.addPage(); // Ajouter une nouvelle page après la première
            }
            pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
            position += pageHeight; // Avancer pour la prochaine page
        }

        // Sauvegarder le PDF
        pdf.save(`${type}-${data?.number}-export.pdf`);

        // Nettoyer le conteneur temporaire
        document.body.removeChild(tempContainer);
    } catch (error) {
        console.error("An error occurred while exporting the PDF:", error);
        // Vous pouvez également afficher un message d'erreur à l'utilisateur ici
    }
};

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
            <Tooltip title="Imprimer">
              <IconButton
                variant="contained"
                sx={{ backgroundColor: '#e1e1e1', marginRight: 2 }}
                aria-label="next"
                onClick={handlePrint}
              >
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exporter en PDF">
              <IconButton
                variant="contained"
                sx={{ backgroundColor: "#e1e1e1" }}
                aria-label="export to pdf"
                onClick={handleExportToPdf}
              >
                <PictureAsPdf />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <Box ref={componentRef} sx={{ width: '290mm'}}>
              <DocumentToPrint data={data} type={type} />
            </Box>
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
