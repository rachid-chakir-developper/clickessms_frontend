import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import timeGridPlugin from '@fullcalendar/timegrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import frLocale from '@fullcalendar/core/locales/fr'; 
import listPlugin from '@fullcalendar/list';
import { Chip } from '@mui/material';
import AppLabel from '../../../../_shared/components/app/label/AppLabel';

export default function Calendar() {
  const handleDateClick = (arg) => {
    alert('Créer un événement');
  };

  const handleSelect = (selectionInfo) => {
    console.log(selectionInfo);
  };
  

  return (
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth" // Vue par défaut : mois
        locale={frLocale}  // Définit la locale en français
        headerToolbar={{
          left: 'prev,next today', // Boutons de navigation
          center: 'title', // Titre du calendrier
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek', // Options de vue
        }}
        editable={true} // Permet de déplacer et redimensionner les événements
        selectable={true} // Permet de sélectionner des dates
        eventClick={(info) => alert(info.event.title)} // Action au clic sur un événement
        eventContent={renderEventContent} // Fonction pour le contenu des événements
        dateClick={handleDateClick} // Action au clic sur une date
        select={handleSelect} // Action lors de la sélection d'une plage de dates
        eventResizableFromStart={true} // Permet le redimensionnement à gauche
        events={[ // Liste d'événements
          { title: 'Événement 1', date: '2024-10-15' },
          { title: 'Événement 2', date: '2024-10-20' },
        ]}
        eventColor="transparent" // Couleur de fond pour tous les événements
        eventTextColor="transparent" // Couleur du texte pour tous les événements
        eventBackgroundColor="transparent" // Couleur de fond personnalisée pour les événements
        eventBorderColor="transparent" // Couleur de bordure personnalisée pour les événements
        eventDisplay="block" // Style d'affichage des événements
        displayEventTime={true} // Affiche l'heure des événements
        eventOrder="start" // Ordre des événements par date de début
        nextDayThreshold="00:00:00" // Minimum de temps pour qu'un événement soit affiché sur le jour suivant
        
        // Propriétés supplémentaires
        height={750} // Définit la hauteur de l'ensemble du calendrier, y compris l'en-tête et le pied
        contentHeight={550} // Définit la hauteur de la zone de visualisation du calendrier
        aspectRatio={1.5} // Définit le rapport largeur-hauteur du calendrier
        expandRows={true} // Les lignes d'une vue donnée s'étendent pour occuper toute la hauteur
        updateSize={true} // Force immédiatement le calendrier à réajuster sa taille
        handleWindowResize={true} // Redimensionne automatiquement le calendrier lors du redimensionnement de la fenêtre du navigateur
        windowResizeDelay={200} // Délai en millisecondes avant que le calendrier n'ajuste sa taille après un redimensionnement de fenêtre
        stickyHeaderDates={true} // Fixe les en-têtes de date en haut du calendrier lors du défilement
        stickyFooterScrollbar={true} // Fixe la barre de défilement horizontale en bas de la vue lors du défilement
      />
  );
}

function renderEventContent(eventInfo) {
  // Exemple de couleurs pour les Chip
  const colors = {
    'Événement 1': 'primary',
    'Événement 2': 'secondary',
  };

  return (
    <>
      <AppLabel sx={{width: '100%', justifyContent: 'start'}} size="small" color={colors[eventInfo.event.title] || 'default'} >
        {eventInfo.event.title}
      </AppLabel>
    </>
  );
}
