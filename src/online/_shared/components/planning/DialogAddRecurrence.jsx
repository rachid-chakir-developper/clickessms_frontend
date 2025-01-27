import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  InputLabel,
  Grid,
  Chip,
  Box,
  MenuItem,
  Typography,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from "@mui/material";
import { RECURRENCE_FREQUENCIES } from "../../../../_shared/tools/constants";
import TheTextField from "../../../../_shared/components/form-fields/TheTextField";
import TheDesktopDatePicker from "../../../../_shared/components/form-fields/TheDesktopDatePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc); // Extend dayjs with UTC support

const daysOfWeek = [
  { label: "Lundi", value: "MO" },
  { label: "Mardi", value: "TU" },
  { label: "Mercredi", value: "WE" },
  { label: "Jeudi", value: "TH" },
  { label: "Vendredi", value: "FR" },
  { label: "Samedi", value: "SA" },
  { label: "Dimanche", value: "SU" },
];
const daysOfWeekMap = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const DialogAddRecurrence = ({ open, onClose, onSave, onCancel, rrule }) => {
  const [frequency, setFrequency] = useState("WEEKLY");
  const [interval, setInterval] = useState(1);
  const todayDay = daysOfWeekMap[dayjs().day()]
  const [selectedDays, setSelectedDays] = useState([todayDay]);
  const [endType, setEndType] = useState("NEVER"); // NEVER, ON_DATE, AFTER_OCCURRENCES
  const [endDate, setEndDate] = useState(dayjs(new Date()).add(3, 'month').day() === 6 // Si c'est samedi
  ? dayjs(new Date()).add(3, 'month').add(2, 'day') // Ajouter 2 jours pour obtenir lundi
  : dayjs(new Date()).add(3, 'month').day() === 0 // Si c'est dimanche
  ? dayjs(new Date()).add(3, 'month').add(1, 'day') // Ajouter 1 jour pour obtenir lundi
  : dayjs(new Date()).add(3, 'month'),);
  const [occurrences, setOccurrences] = useState(10);

  // Parse rrule if provided
  React.useEffect(() => {
    if (open && rrule) {
      const rruleParts = rrule.split(";").reduce((acc, part) => {
        const [key, value] = part.split("=");
        acc[key] = value;
        return acc;
      }, {});
      // Set the frequency
      if (rruleParts.FREQ) setFrequency(rruleParts.FREQ);

      // Set the interval
      if (rruleParts.INTERVAL) setInterval(parseInt(rruleParts.INTERVAL, 10));

      // Set the selected days (for WEEKLY frequency)
      if (rruleParts.BYDAY) setSelectedDays(rruleParts.BYDAY.split(","));

      // Set the end type
      if (rruleParts.UNTIL) {
        setEndType("ON_DATE");
        setEndDate(dayjs(rruleParts.UNTIL, "YYYYMMDDTHHmmssZ"));
      } else if (rruleParts.COUNT) {
        setEndType("AFTER_OCCURRENCES");
        setOccurrences(parseInt(rruleParts.COUNT, 10));
      } else {
        setEndType("NEVER");
      }
    }
  }, [open]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const handleSave = () => {
    let theRrule = `FREQ=${frequency};INTERVAL=${interval}`;
    if (selectedDays.length > 0) {
      theRrule += `;BYDAY=${selectedDays.join(",")}`;
    }
    if (endType === "ON_DATE" && endDate) {
      const formattedDate = dayjs(endDate).utc().format("YYYYMMDD[T]HHmmss[Z]");
      theRrule += `;UNTIL=${formattedDate}`;
    } else if (endType === "AFTER_OCCURRENCES" && occurrences) {
      theRrule += `;COUNT=${occurrences}`;
    }
  
    onSave(`RRULE:${theRrule};WKST=MO`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Récurrence personnalisée</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Typography component="div" variant="span">Répéter tou(te)s les</Typography>
              <TheTextField
                sx={{ width: 60, marginLeft: 6, marginRight: 2 }}
                type="number"
                value={interval}
                onChange={(e) => {if(e.target.value > 0) setInterval(e.target.value)}}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <Select
                    value={frequency}
                    onChange={(e) => {
                        setFrequency(e.target.value)
                        if(e.target.value !== RECURRENCE_FREQUENCIES.WEEKLY) setSelectedDays([])
                        else setSelectedDays([todayDay])
                      }
                    }
                >
                    {RECURRENCE_FREQUENCIES.ALL.map((state, index )=>{
                        return <MenuItem key={index} value={state.value}>{state.label}</MenuItem>
                    })}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* Jours de la semaine */}
          {frequency === "WEEKLY" && (
            <Grid item xs={12}>
              <Box>
                <Typography component="div" variant="span">Répéter le :</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {daysOfWeek.map((day) => (
                    <Chip
                      key={day.value}
                      label={day.label}
                      color={selectedDays.includes(day.value) ? "primary" : "default"}
                      onClick={() => toggleDay(day.value)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          )}
          <Grid item xs={12} sx={{ marginTop: 4 }}>
            <Typography component="div" variant="span">Se termine:</Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={endType}
                onChange={(e) => setEndType(e.target.value)}
                name="radio-buttons-group"
              >
                <Box display="flex" alignItems="center" sx={{ marginTop: 1 }}><FormControlLabel value="NEVER" control={<Radio />} label="Jamais" /></Box>
                <Box display="flex" alignItems="center" sx={{ marginTop: 2 }}>
                  <Box sx={{ minWidth: 120 }}><FormControlLabel value="ON_DATE" control={<Radio />} label="Le" /></Box>
                  <TheDesktopDatePicker
                    sx={{ maxWidth: 200 }}
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    disabled={endType !== "ON_DATE"}
                  />
                </Box>
                <Box display="flex" alignItems="center" sx={{ marginTop: 2 }}>
                  <Box sx={{ minWidth: 120 }}><FormControlLabel value="AFTER_OCCURRENCES" control={<Radio />} label="Après" /></Box>
                  <TheTextField
                    sx={{ maxWidth: 200 }}
                    type="number"
                    value={occurrences}
                    onChange={(e) => setOccurrences(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">occurrences</InputAdornment>
                      ),
                    }}
                    disabled={endType !== "AFTER_OCCURRENCES"}
                  />
                </Box>
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Terminé
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAddRecurrence;
