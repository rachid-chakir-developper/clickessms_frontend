import { DateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";

export default function TheDateTimePicker(props) {
  return <DateTimePicker {...props}
            ampm={false}
            viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
            }}
            format="DD/MM/YYYY HH:mm"
        />
}
                                    