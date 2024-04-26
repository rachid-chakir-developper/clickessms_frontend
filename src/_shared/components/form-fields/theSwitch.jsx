import { FormControlLabel, Switch } from '@mui/material';

export default function TheSwitch(props) {
  return (
    <FormControlLabel control={<Switch {...props} />} label={props.label} />
  );
}
