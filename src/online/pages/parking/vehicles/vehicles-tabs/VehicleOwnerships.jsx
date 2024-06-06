import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { getFormatDate, getOwnershipTypeLabel } from '../../../../../_shared/tools/functions';
import { FileDownload, FileOpen, Home } from '@mui/icons-material';
import { Avatar, Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import { OWNERSHIP_TYPE_CHOICES } from '../../../../../_shared/tools/constants';

export default function VehicleOwnerships({vehicleOwnerships}) {
  return (
    <Timeline position="alternate">
      {vehicleOwnerships?.map((vehicleOwnership, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            {vehicleOwnership?.ownershipType === OWNERSHIP_TYPE_CHOICES.PURCHASE && <>
                <b>Date d'achat :</b> {getFormatDate(vehicleOwnership?.purchaseDate)} <br />
                <b>Prix d'achat :</b> {vehicleOwnership?.purchasePrice}€<br />
            </>}
            {vehicleOwnership?.ownershipType === OWNERSHIP_TYPE_CHOICES.SALE && <>
                <b>Date de vente :</b> {getFormatDate(vehicleOwnership?.saleDate)} <br />
                <b>Prix de vente :</b> {vehicleOwnership?.salePrice}€<br />
            </>}
            {vehicleOwnership?.ownershipType === OWNERSHIP_TYPE_CHOICES.LEASE && <>
                <b>Date de location :</b> {getFormatDate(vehicleOwnership?.rentalStartingDate)} <br />
                <b>Date de fin de location :</b> {getFormatDate(vehicleOwnership?.rentalEndingDate)}<br />
                <b>Prix de location :</b> {vehicleOwnership?.rentalPrice} €<br />
                <b>Kilométrage prévisionnel :</b> {vehicleOwnership?.expectedMileage} Km
            </>}

          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              <Home />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Stack direction="row" justifyContent={index%2 === 0 ?  "start" : "end"} spacing={1} sx={{marginY : 1}}>
                <Chip label={getOwnershipTypeLabel(vehicleOwnership?.ownershipType)} />
            </Stack>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
