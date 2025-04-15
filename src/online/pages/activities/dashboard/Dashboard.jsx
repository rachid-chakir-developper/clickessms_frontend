import React from 'react';
import { Box, Grid, IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { useLazyQuery, useQuery } from '@apollo/client';
import { FileDownload, PictureAsPdf, ViewList, ViewQuilt } from '@mui/icons-material';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import DashboardFilter from './DashboardFilter';
import { GET_DASHBOARD_ACTIVITY_BENEFICIARY_ESTABLISHMENTS, GET_DASHBOARD_ACTIVITY_MONTH, GET_DASHBOARD_ACTIVITY_SYNTHESIS, GET_DASHBOARD_ACTIVITY_TRACKING_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/DashboardQueries';
import DashboardGraph from './DashboardGraph';
import DashboardTable from './DashboardTable';
import SynthesisTable from './SynthesisTable';
import ActivityTable from './ActivityTable';
import SynthesisEstablishmentsTable from './SynthesisEstablishmentsTable';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DashboardBeneficiaryTable from './DashboardBeneficiaryTable';

export default function Dashboard() {
  const componentRef = React.useRef();
  const [isExporting, setIsExporting] = React.useState(false);
  const [dashboardActivityFilter, setDashboardActivityFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    if(newFilter) newFilter.year = newFilter.year ? new Date(newFilter.year).getFullYear() : null
    if(newFilter) newFilter.month = newFilter.month ? new Date(newFilter.month).getMonth()+1 : null
    setDashboardActivityFilter(newFilter);
  };

  const [getDashboardActivityTrackingEstablishments, {
    loading: loadingDashboardActivityTrackingEstablishments,
    data: dashboardActivityTrackingEstablishmentsData,
    error: dashboardActivityTrackingEstablishmentsError,
  }] = useLazyQuery(GET_DASHBOARD_ACTIVITY_TRACKING_ESTABLISHMENTS, { variables:{dashboardActivityFilter}});

  const [getDashboardActivityBeneficiaryEstablishments, {
    loading: loadingDashboardActivityBeneficiaryEstablishments,
    data: dashboardActivityBeneficiaryEstablishmentsData,
    error: dashboardActivityBeneficiaryEstablishmentsError,
  }] = useLazyQuery(GET_DASHBOARD_ACTIVITY_BENEFICIARY_ESTABLISHMENTS, { variables:{dashboardActivityFilter}});
  
  const [getDashboardActivitySynthesis, {
    loading: loadingDashboardActivitySynthesis,
    data: dashboardActivitySynthesisData,
    error: dashboardActivitySynthesisError,
  }] = useLazyQuery(GET_DASHBOARD_ACTIVITY_SYNTHESIS, { variables:{dashboardActivityFilter}});

  const [getDashboardActivityMonth, {
    loading: loadingDashboardActivityMonth,
    data: dashboardActivityMonthData,
    error: dashboardActivityMonthError,
  }] = useLazyQuery(GET_DASHBOARD_ACTIVITY_MONTH, { variables:{dashboardActivityFilter}});


  const [view, setView] = React.useState('table');

  const handleChange = (event, nextView) => {
    if(nextView) setView(nextView);
  };
  
  React.useEffect(() => {
    switch (view) {
      case 'graph':
        getDashboardActivityTrackingEstablishments()
        break;
      case 'table':
        getDashboardActivityTrackingEstablishments()
        break;
      case 'beneficiaryTable':
        getDashboardActivityBeneficiaryEstablishments()
        break;
      case 'synthesis':
        getDashboardActivitySynthesis()
        break;
      case 'synthesisEstablishment':
        getDashboardActivitySynthesis()
        break;
      case 'activity':
        getDashboardActivityMonth()
        break;
    
      default:
        break;
    }
  }, [dashboardActivityFilter, view]);

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
      pdf.save(`${view}-export.pdf`);

      // Nettoyer le conteneur temporaire
      document.body.removeChild(tempContainer);
      setIsExporting(false)
    } catch (error) {
      setIsExporting(false)
      console.error("An error occurred while exporting the PDF:", error);
      // Vous pouvez également afficher un message d'erreur à l'utilisateur ici
    }
  }
  const exportTableToExcel = () => {
    setIsExporting(true)
    // Accéder au tableau via la référence
    const tableHTML = componentRef.current.outerHTML;

    const fileType = "application/vnd.ms-excel";
    const fileName = `${view}-table-export.xls`;

    // Encapsuler le tableau HTML dans une structure pour Excel
    const excelHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!-- Activer le style -->
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        ${tableHTML}
      </body>
      </html>
    `;

    // Créer un Blob pour le téléchargement
    const blob = new Blob([excelHTML], { type: fileType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    setIsExporting(false)
  }
  return (
    <>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <DashboardFilter onFilterChange={handleFilterChange} isDisplayMonth={view==="activity"}/>
            </Grid>
            {view!=='graph' && !isExporting && <Box>
              <Tooltip title="Exporter en PDF">
                <IconButton variant="contained" onClick={handleExportToPdf} >
                  <PictureAsPdf />
                </IconButton>
              </Tooltip>
              <Tooltip title="Exporter en Excel">
                <IconButton variant="contained" onClick={exportTableToExcel} >
                  <FileDownload />
                </IconButton>
              </Tooltip>
            </Box>}
            <Grid item xs={12}>
              <Stack justifyContent="flex-end">
                <ToggleButtonGroup
                  size="small"
                  value={view}
                  exclusive
                  onChange={handleChange}
                  sx={{justifyContent:"flex-end"}}
                > 
                  <Tooltip title="Les graphes" >
                    <ToggleButton value="graph" aria-label="quilt">
                      <ViewQuilt />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Les tableaux" >
                    <ToggleButton value="table" aria-label="list">
                      <ViewList />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Les personnes accompagnées" >
                    <ToggleButton value="beneficiaryTable" aria-label="list">
                      <ViewList />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="La synthese" >
                    <ToggleButton value="synthesis" aria-label="list">
                      <ViewList />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="La synthese des structures" >
                    <ToggleButton value="synthesisEstablishment" aria-label="list">
                      <ViewList />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="L'activité" >
                    <ToggleButton value="activity" aria-label="list">
                      <ViewList />
                    </ToggleButton>
                  </Tooltip>
                </ToggleButtonGroup>
              </Stack>
            </Grid>
          </Grid>
          
          {(loadingDashboardActivityTrackingEstablishments || loadingDashboardActivityBeneficiaryEstablishments || loadingDashboardActivitySynthesis || loadingDashboardActivityMonth) && <ProgressService type="dashboard" />}
          {(!loadingDashboardActivityTrackingEstablishments && !loadingDashboardActivityBeneficiaryEstablishments && !loadingDashboardActivitySynthesis & !loadingDashboardActivityMonth)  && (<Box ref={componentRef}>
          {view==='graph' && <DashboardGraph activityTrackingEstablishments={dashboardActivityTrackingEstablishmentsData?.dashboardActivity?.activityTrackingEstablishments}/>}
          {view==='table' && <DashboardTable activityTrackingEstablishments={dashboardActivityTrackingEstablishmentsData?.dashboardActivity?.activityTrackingEstablishments}/>}
          {view==='beneficiaryTable' && <DashboardBeneficiaryTable activityBeneficiaryEstablishments={dashboardActivityBeneficiaryEstablishmentsData?.dashboardActivity?.activityBeneficiaryEstablishments}/>}
          {view==='synthesis' && <SynthesisTable activitySynthesis={dashboardActivitySynthesisData?.dashboardActivity?.activitySynthesis}/>}
          {view==='synthesisEstablishment' && <SynthesisEstablishmentsTable activitySynthesis={dashboardActivitySynthesisData?.dashboardActivity?.activitySynthesis}/>}
          {view==='activity' && <ActivityTable activityMonth={dashboardActivityMonthData?.dashboardActivity?.activityMonth}/>}
        </Box>
      )}
    </>
  );
}
