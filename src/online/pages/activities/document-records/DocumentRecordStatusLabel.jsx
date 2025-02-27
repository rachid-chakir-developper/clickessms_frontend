import { useState } from "react";
import { Box, Popover, Typography } from "@mui/material";
import AppLabel from "../../../../_shared/components/app/label/AppLabel";
import { getExpirationStatusDetails, getFormatDate, getNotificationPeriodUnitLabel } from "../../../../_shared/tools/functions";
import { Link } from "react-router-dom";

const DocumentRecordStatusLabel = ({ documentRecord }) => {
    const { document, startingDate, endingDate, description, isNotificationEnabled, notificationPeriodUnit, notificationPeriodValue, expirationStatus } = documentRecord;
    const { color, label } = getExpirationStatusDetails(expirationStatus);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMouseEnter = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMouseLeave = () => {
        setTimeout(() => {
            setAnchorEl(null);
        }, 200); // Petite attente pour éviter une fermeture instantanée
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{ display: "inline-block", cursor: "pointer" }}
        >
            <AppLabel aria-describedby={id} color={color}>{label}</AppLabel>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleMouseLeave}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                disableRestoreFocus
                sx={{
                    pointerEvents: "auto", // Permet d'interagir avec le Popover
                }}
            >
                <Box 
                    sx={{ p: 2, minWidth: 200 }}
                    onMouseEnter={() => clearTimeout()} // Annule la fermeture si survolé
                    onMouseLeave={handleMouseLeave} // Ferme si la souris sort complètement
                >
                    {document && (
                        <Typography variant="body2">
                            <strong>Fichier :</strong>{" "}
                            <Link to={document} target="_blank" rel="noopener noreferrer">
                                Télécharger
                            </Link>
                        </Typography>
                    )}
                    {startingDate && (
                        <Typography variant="body2">
                            <strong>Début :</strong> {getFormatDate(startingDate)}
                        </Typography>
                    )}
                    {endingDate && (
                        <Typography variant="body2">
                            <strong>Valide jusqu'à :</strong> {getFormatDate(endingDate)}
                        </Typography>
                    )}
                    <Typography variant="body2">
                        <strong>Notification :</strong> {isNotificationEnabled ? `Oui avant ${notificationPeriodValue} ${getNotificationPeriodUnitLabel(notificationPeriodUnit)}` : "Non"}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Description :</strong> {description || "Aucune description"}
                    </Typography>
                </Box>
            </Popover>
        </Box>
    );
};

export default DocumentRecordStatusLabel;
