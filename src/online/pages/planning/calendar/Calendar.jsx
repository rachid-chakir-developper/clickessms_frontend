import React from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { Avatar, Typography, Box, Chip } from '@mui/material';
import AppLabel from '../../../../_shared/components/app/label/AppLabel';
import { useLazyQuery } from '@apollo/client';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

export default function Calendar() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [employeeFilter, setEmployeeFilter] = React.useState(null); // Correction du nom de variable
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setEmployeeFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getEmployees,
    {
      loading: loadingEmployees,
      data: employeesData,
      error: employeesError,
      fetchMore: fetchMoreEmployees,
    },
  ] = useLazyQuery(GET_EMPLOYEES, {
    variables: { employeeFilter, page: paginator.page, limit: paginator.limit },
    onCompleted: (data) => {
      console.log(data);
      if(data?.employees?.nodes){
        getEmployeeShifts({
          variables: { employeeShiftFilter: {employees: data?.employees?.nodes} },
        })
      }
    }
  });

  React.useEffect(() => {
    getEmployees();
  }, [employeeFilter, paginator]);

  const [
    getEmployeeShifts,
    {
      loading: loadingEmployeeShifts,
      data: employeeShiftsData,
      error: employeeShiftsError,
      fetchMore: fetchMoreEmployeeShifts,
    },
  ] = useLazyQuery(GET_EMPLOYEES);

  const handleDateClick = (arg) => {
    alert('Créer un événement');
  };

  const handleSelect = (selectionInfo) => {
    console.log(selectionInfo);
  };

  return (
    <FullCalendar
      schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives" // Licence trial
      plugins={[resourceTimelinePlugin, interactionPlugin]}
      initialView="resourceTimelineWeek" // Vue Timeline par semaine
      locale={frLocale}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
      }}
      editable={true}
      selectable={true}
      eventClick={(info) => alert(info.event.title)}
      eventContent={renderEventContent}
      dateClick={handleDateClick}
      select={handleSelect}
      
      // Chargez les ressources depuis les données récupérées
      resources={employeesData?.employees?.nodes?.map((employee) => ({
        id: employee.id,
        title: `${employee.firstName} ${employee.lastName}`, 
        extendedProps:{
          ...employee
        }
      }))}

      resourceAreaColumns={[
        {
          field: 'title',
          headerContent: 'Employés',
        },
      ]}

      resourceLabelContent={({resource}) => {
        return (
          <Box display="flex" alignItems="center">
            <Avatar src={resource.extendedProps.photo} alt={resource.title} sx={{ width: 40, height: 40, marginRight: 1 }} />
            <Typography variant="body2">{resource.title}</Typography>
          </Box>
        )
      }}
      
      events={[
        { title: 'Shift du Matin', start: '2024-11-05T08:00:00', end: '2024-11-05T12:00:00', resourceId: '1' },
        { title: 'Shift de l’Après-midi', start: '2024-11-05T13:00:00', end: '2024-11-05T17:00:00', resourceId: '1' },
        { title: 'Shift de Nuit', start: '2024-11-05T20:00:00', end: '2024-11-06T04:00:00', resourceId: '1' },
        // Ajoutez plus de shifts ici
      ]}
      
      height={750}
      contentHeight={550}
      aspectRatio={1.5}
      expandRows={true}
      handleWindowResize={true}
      windowResizeDelay={200}
      stickyHeaderDates={true}
      stickyFooterScrollbar={true}
    />
  );
}

function renderEventContent(eventInfo) {
  const colors = {
    'Shift du Matin': 'primary',
    'Shift de l’Après-midi': 'secondary',
    'Shift de Nuit': 'default',
  };

  return (
    <AppLabel sx={{ width: '100%', justifyContent: 'start' }} size="small" color={colors[eventInfo.event.title] || 'default'}>
      {eventInfo.event.title}
    </AppLabel>
  );
}
