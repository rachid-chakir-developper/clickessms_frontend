import { DesktopDatePicker } from '@mui/x-date-pickers';

export default function TheDesktopDatePicker(props) {
  return <DesktopDatePicker {...props} format={props?.format ? props?.format : "DD/MM/YYYY"}/>;
}
