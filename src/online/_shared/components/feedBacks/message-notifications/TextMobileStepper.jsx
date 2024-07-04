import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function TextMobileStepper({messageNotifications = [], onSlideChange}) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = messageNotifications?.length ;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    onSlideChange(messageNotifications[activeStep])
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    onSlideChange(messageNotifications[activeStep])
  };
  React.useEffect(()=>{
    onSlideChange(messageNotifications[activeStep])
  }, [])

  return (
    <Box sx={{
      flexGrow: 1,
      backgroundImage: messageNotifications[activeStep]?.image ? `url('${messageNotifications[activeStep]?.image}')` : 'initial', // Remplacez par le chemin de votre image
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Box sx={{flexGrow: 1, height: 300}} >
        {/* {messageNotifications[activeStep]?.title && messageNotifications[activeStep]?.title !=='' && <Box
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 50,
            pl: 2,
            color: messageNotifications[activeStep]?.image ? '#ffffff' : 'initial',
            bgcolor: messageNotifications[activeStep]?.image ? 'rgba(0, 0, 0, 0.5)'  : 'initial',
          }}
        >
          <Typography variant="h6" component="h6">{messageNotifications[activeStep]?.title}</Typography>
        </Box>} */}
        {messageNotifications[activeStep]?.message && messageNotifications[activeStep]?.message !=='' && <Box sx={{ height: 300, width: '100%', p: 2,
            color: messageNotifications[activeStep]?.image ? '#ffffff' : 'initial',
            bgcolor: messageNotifications[activeStep]?.image ? 'rgba(0, 0, 0, 0.5)'  : 'initial',
            }}>
          {messageNotifications[activeStep]?.message}
        </Box>}
      </Box>
      {messageNotifications?.length > 1 && <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />}
    </Box>
  );
}
