import React, { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

const DashboardBeneficiaryTableItem = ({ activityBeneficiaryEstablishment }) => {
  const { year, months, activityBeneficiaries } = activityBeneficiaryEstablishment
  const data = [
    {
      name: "Rachid CHAKIR",
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Jean Paul",
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Année : {year}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1200 }} aria-label="tableau bénéficiaires">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#003366", color: "#fff" }}>
                Année : {year}
              </TableCell>
              {months?.map((month, index) => (
                <TableCell key={index} align="center" sx={{ fontWeight: "bold", backgroundColor: "#003366", color: "#fff" }}>
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activityBeneficiaries?.map((activityBeneficiary, rowIndex) => {
              const { beneficiary, activityBeneficiaryMonths }= activityBeneficiary
              return (
                <TableRow key={rowIndex}>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: rowIndex % 2 === 0 ? "#f3f3f3" : "#e0e0e0",
                    }}
                  >
                    {`${
                        beneficiary?.preferredName && beneficiary?.preferredName !== ''
                            ? beneficiary?.preferredName
                            : beneficiary?.lastName
                    } ${beneficiary?.firstName}`}
                  </TableCell>
                  {activityBeneficiaryMonths?.map((activityBeneficiaryMonth, colIndex) => { 
                    const { daysCount, isFutureMonth, isCurrentMonth } = activityBeneficiaryMonth
                    return (
                      <TableCell
                        key={colIndex}
                        align="center"
                        sx={{
                          color: daysCount < 0 ? "red" : "inherit",
                          backgroundColor: isCurrentMonth ? "#efefef" : "",  // Fond foncé pour le mois courant
                          opacity: isFutureMonth ? 0.1 : 1,  // Opacité réduite pour les mois futurs
                          fontSize: isFutureMonth ? 12 : '',  // Opacité réduite pour les mois futurs
                        }}
                      >
                        {daysCount}
                      </TableCell>
                    )}
                  )}
                </TableRow>
              )}
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const DashboardBeneficiaryTable = ({ activityBeneficiaryEstablishments=[] }) => {


    // État pour gérer l'onglet actif
    const [selectedEstablishment, setSelectedEstablishment] = useState(0);

    const handleChange = (event, newValue) => {
        setSelectedEstablishment(newValue);
    };

    return (
        <Box sx={{ flexGrow: 1, marginTop: 2 }}>
            <TabContext value={`${selectedEstablishment}`}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example" 
                        variant="scrollable"
                        scrollButtons="auto">
                        {activityBeneficiaryEstablishments.map((establishment, index) => (
                            <Tab label={establishment.establishment?.name || `Établissement ${index + 1}`} key={index} value={`${index}`} />
                        ))}
                    </TabList>
                </Box>
                {activityBeneficiaryEstablishments.map((activityBeneficiaryEstablishment, index) => (
                    <TabPanel key={index} value={`${index}`} >
                        <DashboardBeneficiaryTableItem activityBeneficiaryEstablishment={activityBeneficiaryEstablishment} />
                    </TabPanel>
                ))}
            </TabContext>
        </Box>
    );
};

export default DashboardBeneficiaryTable;
