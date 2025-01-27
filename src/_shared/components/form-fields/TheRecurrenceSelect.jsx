import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import DialogAddRecurrence from '../../../online/_shared/components/planning/DialogAddRecurrence';
import { RECURRENCE_OPTIONS } from '../../tools/constants';
import dayjs from 'dayjs';

export default function TheRecurrenceSelect(props) {
    let {onChange, value} = props
    const [dialogAddRecurrenceOpen, setDialogAddRecurrenceOpen] = React.useState(false);
    const [otherRecurrenceOptions, setOtherRecurrenceOptions] = React.useState(RECURRENCE_OPTIONS.ALL);
    const [rruleCopy, setRruleCopy] = React.useState(RECURRENCE_OPTIONS.ONCE);

    const generateReadableLabel = (rrule) => {
        const daysMap = {
          MO: "lundi",
          TU: "mardi",
          WE: "mercredi",
          TH: "jeudi",
          FR: "vendredi",
          SA: "samedi",
          SU: "dimanche",
        };
      
        const frequencyMap = {
          DAILY: { singular: "jour", plural: "jours", gender: "m" },
          WEEKLY: { singular: "semaine", plural: "semaines", gender: "f" },
          MONTHLY: { singular: "mois", plural: "mois", gender: "m" },
          YEARLY: { singular: "année", plural: "années", gender: "f" },
        };
      
        // Supprimer le préfixe "RRULE:"
        const rule = rrule.replace("RRULE:", "");
      
        // Convertir en objet clé-valeur
        const params = Object.fromEntries(
          rule.split(";").map((part) => part.split("="))
        );
      
        // Récupérer les paramètres importants
        const frequency = params.FREQ;
        const interval = params.INTERVAL ? parseInt(params.INTERVAL, 10) : 1;
        const byDay = params.BYDAY ? params.BYDAY.split(",") : [];
        const count = params.COUNT ? parseInt(params.COUNT, 10) : null;
        const until = params.UNTIL ? dayjs(params.UNTIL, "YYYYMMDDTHHmmssZ").format("DD/MM/YYYY") : null;
      
        const { singular, plural, gender } = frequencyMap[frequency] || {};
        const tousOuToutes = gender === "f" ? "Toutes" : "Tous";
      
        // Construire la description
        const intervalText =
          interval === 1
            ? `${tousOuToutes} les ${singular}`
            : `${tousOuToutes} les ${interval} ${plural}`;
      
        const daysText =
          byDay.length > 0
            ? `le ${byDay.map((day) => daysMap[day] || day).join(", ")}`
            : "";
      
        let endText = "";
        if (count) {
          endText = `pendant ${count} occurrence${count > 1 ? "s" : ""}`;
        } else if (until) {
          endText = `jusqu'au ${until}`;
        } else {
          endText = "indéfiniment";
        }
      
        // Combiner toutes les parties
        return `${intervalText} ${daysText} ${endText}`.trim();
      };

    const addRecurrence = (rrule) => {
        const newOption = { value: rrule, label: generateReadableLabel(rrule) };

        // Vérifier si la valeur existe déjà dans la liste
        const exists = otherRecurrenceOptions.some(option => option.value === newOption.value);

        if (!exists) {
            setOtherRecurrenceOptions(prevOptions => {
                // Insérer la nouvelle option avant la dernière
                return [
                    ...prevOptions.slice(0, -1), // Toutes les options sauf la dernière
                    newOption,                   // Nouvelle option
                    prevOptions[prevOptions.length - 1] // La dernière option (COSTUM)
                ];
            });
        }
    };
    const handleSaveRecurrence = (rrule) => {
        onChange(rrule)
    };

    
    const onCancel = (rrule) => {
        setDialogAddRecurrenceOpen(false)
        onChange(rruleCopy)
    };

    React.useEffect(()=>{
        if(value) addRecurrence(value)
    },[value])
    
  return (
    <>
        <FormControl fullWidth>
            {props?.label && <InputLabel>{props?.label}</InputLabel>}
            <Select
                value={value && value!=='' ? value : RECURRENCE_OPTIONS.ONCE}
                onChange={(e) => {
                        if(e.target.value===RECURRENCE_OPTIONS.CUSTOM) {
                            setRruleCopy(value);
                            setDialogAddRecurrenceOpen(true)
                        }
                        onChange(e.target.value!==RECURRENCE_OPTIONS.ONCE ? e.target.value : "")
                    }
                }
            >
                {otherRecurrenceOptions.map((state, index )=>{
                    return <MenuItem key={index} value={state.value}>{state.label}</MenuItem>
                })}
            </Select>
        </FormControl>
        <DialogAddRecurrence 
                open={dialogAddRecurrenceOpen}
                onClose={()=>setDialogAddRecurrenceOpen(false)}
                onCancel={onCancel}
                onSave={handleSaveRecurrence}
                rrule={value && value!=='' && value!==RECURRENCE_OPTIONS.CUSTOM ? value : rruleCopy}
            />
    </>
  );
}
