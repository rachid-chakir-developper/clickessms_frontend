import React from 'react';
import { Box, Grid, IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Assessment, BarChart, EventNote, FileDownload, Group, PictureAsPdf, Summarize, TableChart, ViewList, ViewQuilt } from '@mui/icons-material';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import DashboardFilter from './DashboardFilter';
import { GET_DASHBOARD_ACTIVITY_BENEFICIARY_ESTABLISHMENTS, GET_DASHBOARD_ACTIVITY_MONTH, GET_DASHBOARD_ACTIVITY_SYNTHESIS, GET_DASHBOARD_ACTIVITY_TRACKING_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/DashboardQueries';
import DashboardGraph from './DashboardGraph';
import DashboardTable from './DashboardTable';
import SynthesisTable from './SynthesisTable';
import ActivityTable from './ActivityTable';
import SynthesisEstablishmentsTable from './SynthesisEstablishmentsTable';
import DashboardBeneficiaryTable from './DashboardBeneficiaryTable';
import GeneratePdfButton from '../../../_shared/components/printing/GeneratePdfButton';

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
      case 'activity_month':
        getDashboardActivityMonth()
        break;
    
      default:
        break;
    }
  }, [dashboardActivityFilter, view]);

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
              <DashboardFilter onFilterChange={handleFilterChange} isDisplayMonth={view==="activity_month"}/>
            </Grid>
            {view!=='graph' && !isExporting && <Box>
              <Tooltip title="Exporter en Excel">
                <IconButton variant="contained" onClick={exportTableToExcel} >
                  <FileDownload />
                </IconButton>
              </Tooltip>
              <GeneratePdfButton apparence="iconButtonExport" documentType={view} />
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
                      <BarChart  />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Reporting " >
                    <ToggleButton value="table" aria-label="list">
                      <TableChart />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Recap " >
                    <ToggleButton value="beneficiaryTable" aria-label="list">
                      <Group />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Suivi des demandes d'admission en journées" >
                    <ToggleButton value="synthesis" aria-label="list">
                      <Summarize />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Suivi des demandes d'admission par mois et par groupe" >
                    <ToggleButton value="synthesisEstablishment" aria-label="list">
                      <EventNote />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Tableau des effectifs" >
                    <ToggleButton value="activity_month" aria-label="list">
                      <Assessment />
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
          {view==='activity_month' && <ActivityTable activityMonth={dashboardActivityMonthData?.dashboardActivity?.activityMonth}/>}
        </Box>
      )}
    </>
  );
}
