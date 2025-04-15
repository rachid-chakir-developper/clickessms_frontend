import { DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export default function TheDesktopDatePicker(props) {
  const { onChange, value, format = "DD/MM/YYYY", ...rest } = props;

  const handleChange = (newValue) => {
    if (onChange && newValue) {
      // Fixe une heure "neutre" pour éviter le décalage UTC
      const safeDate = dayjs(newValue).hour(12).minute(0).second(0);
      onChange(safeDate);
    }
  };

  return (
    <DesktopDatePicker
      {...rest}
      value={value}
      format={format}
      onChange={handleChange}
    />
  );
}
