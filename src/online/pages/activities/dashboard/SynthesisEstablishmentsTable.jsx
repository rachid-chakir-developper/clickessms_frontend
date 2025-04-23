import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Tab,
} from "@mui/material";
import EstablishmentChip from "../../companies/establishments/EstablishmentChip";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { BENEFICIARY_ADMISSION_STATUS_CHOICES } from "../../../../_shared/tools/constants";
import { getBeneficiaryAdmissionStatusLabel, getFormatDate } from "../../../../_shared/tools/functions";
import InputSendDashboardComment from "./comments/InputDashboardComment";

const SynthesisEstablishmentsTableItem = ({ activitySynthesisEstablishment }) => {
    const {activitySynthesisMonth=[]} = activitySynthesisEstablishment

    return (
        <Box>
        <Typography variant="subtitle2" gutterBottom>
            Année : {activitySynthesisEstablishment?.year}
        </Typography>
        {activitySynthesisEstablishment?.establishment ? (
            <EstablishmentChip establishment={activitySynthesisEstablishment?.establishment} />
        ) : (
            <Typography variant="h6" gutterBottom>
            {activitySynthesisEstablishment?.title}
            </Typography>
        )}
        {activitySynthesisMonth.map((activitySynthesisMonthItem, indexM) => ( 
            <Grid container spacing={2} sx={{ padding:1, marginY: 1, backgroundColor: indexM % 2 === 0 ? "#f7f7f7" : "#e0e0e0" }} key={indexM} >
                {/* Tableau 1 : Effectif */}
                <Grid item xs={3}>
                    <TableContainer component={Paper}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", p: 1 }}
                        >
                        Effectif:  {activitySynthesisMonthItem?.month} {activitySynthesisMonthItem?.year}
                        </Typography>
                        <Table>
                        <TableBody>
                            {activitySynthesisMonthItem?.beneficiaryEntries?.map((beneficiaryEntry, index) => {
                                const beneficiary = beneficiaryEntry?.beneficiary;
                                 return (<TableRow key={index}>
                                    <TableCell>
                                        {`${
                                            beneficiary?.preferredName && beneficiary?.preferredName !== ''
                                                ? beneficiary?.preferredName
                                                : beneficiary?.lastName
                                        } ${beneficiary?.firstName}`}
                                    </TableCell>
                                </TableRow>)
                            }
                            )}
                            {activitySynthesisMonthItem?.countAvailablePlaces > 0 && <TableRow>
                                <TableCell style={{ color: "red"}}>
                                    {activitySynthesisMonthItem?.dashboardComment?.text 
                                        ? `${activitySynthesisMonthItem.dashboardComment.text} ${
                                            Number(activitySynthesisMonthItem.countAvailablePlaces) === 1 
                                                ? "place disponible" 
                                                : "places disponibles"
                                        }`
                                        : `${activitySynthesisMonthItem.countAvailablePlaces} ${
                                            activitySynthesisMonthItem.countAvailablePlaces === 1 
                                                ? "place disponible" 
                                                : "places disponibles"
                                        }`
                                    }
                                    {activitySynthesisMonthItem?.dashboardComments?.map((dashboardComment, index) =>
                                        <InputSendDashboardComment
                                            key={index}
                                            establishment={activitySynthesisEstablishment?.establishment?.id}
                                            commentType="SYNTHESIS"
                                            year={activitySynthesisMonthItem?.year}
                                            month={indexM+1}
                                            onDashboardCommentSent={()=> console.log()}
                                            defaultDashboardComment={dashboardComment}
                                        />
                                    )}
                                    {(!activitySynthesisMonthItem?.dashboardComments || activitySynthesisMonthItem?.dashboardComments?.length < 1) && <InputSendDashboardComment 
                                        establishment={activitySynthesisEstablishment?.establishment?.id}
                                        commentType="SYNTHESIS"
                                        year={activitySynthesisMonthItem?.year}
                                        month={indexM+1}
                                        onDashboardCommentSent={()=> console.log()}
                                        defaultDashboardComment={null}
                                    />}
                                </TableCell>
                            </TableRow>}
                        </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Tableau 2 : Demandes */}
                <Grid item xs={9}>
                <TableContainer component={Paper}>
                    <Typography
                    variant="subtitle1"
                    align="center"
                    sx={{ fontWeight: "bold", py: 1 }}
                    >
                    Demandes d'admission
                    </Typography>
                    <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>Date de demande</TableCell>
                        <TableCell>Date de pré-admission</TableCell>
                        <TableCell>Nom - Prénom</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Motif</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activitySynthesisMonthItem?.beneficiaryAdmissions?.map((beneficiaryAdmission, index) => {
                            const beneficiary = beneficiaryAdmission?.beneficiary ? beneficiaryAdmission?.beneficiary : beneficiaryAdmission;
                            return (<TableRow key={index}>
                                <TableCell>{getFormatDate(beneficiaryAdmission.receptionDate)}</TableCell>
                                <TableCell>{getFormatDate(beneficiaryAdmission.preAdmissionDate)}</TableCell>
                                <TableCell>
                                    {`${
                                        beneficiary?.preferredName && beneficiary?.preferredName !== ''
                                            ? beneficiary?.preferredName
                                            : beneficiary?.lastName
                                    } ${beneficiary?.firstName}`}</TableCell>
                                <TableCell style={{ color: beneficiaryAdmission?.status===BENEFICIARY_ADMISSION_STATUS_CHOICES.APPROVED ? "green" : "red" }}>
                                    {beneficiaryAdmission?.status===BENEFICIARY_ADMISSION_STATUS_CHOICES.APPROVED  && <>Admis </>}
                                    {beneficiaryAdmission?.status===BENEFICIARY_ADMISSION_STATUS_CHOICES.REJECTED  && <>Refusé </>}
                                    le {getFormatDate(beneficiaryAdmission.responseDate)}
                                </TableCell>
                                <TableCell>{beneficiaryAdmission.statusReason || ""}</TableCell>
                            </TableRow>)
                            }
                        )}
                    </TableBody>
                    </Table>
                </TableContainer>
                </Grid>
            </Grid>
        ))}
        </Box>
    );
};

const SynthesisEstablishmentsTable = ({ activitySynthesis }) => {
    const { activitySynthesisEstablishments = [] } = activitySynthesis || {};


    // État pour gérer l'onglet actif
    const [selectedEstablishment, setSelectedEstablishment] = useState(
        activitySynthesisEstablishments[0]?.id || 0
    );

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
                        {activitySynthesisEstablishments.map((establishment, index) => (
                            <Tab label={establishment.establishment?.name || `Établissement ${index + 1}`} key={index} value={`${index}`} />
                        ))}
                    </TabList>
                </Box>
                {activitySynthesisEstablishments.map((activitySynthesisEstablishment, index) => (
                    <TabPanel key={index} value={`${index}`} >
                        <SynthesisEstablishmentsTableItem activitySynthesisEstablishment={activitySynthesisEstablishment} />
                    </TabPanel>
                ))}
            </TabContext>
        </Box>
    );
};

export default SynthesisEstablishmentsTable;
