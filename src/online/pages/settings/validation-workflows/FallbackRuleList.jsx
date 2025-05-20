import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Grid, Typography } from '@mui/material';
import { getWorkflowFallbackTypeLabel } from '../../../../_shared/tools/functions';
import { DragIndicator } from '@mui/icons-material';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const FallbackRuleList = ({ fallbackRules=[] , formik, indexStep }) => {
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const reordered = reorder(
      fallbackRules,
      source.index,
      destination.index
    );

    // Met à jour l'ordre (optionnel)
    const updated = reordered.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    formik.setFieldValue(
      `validationSteps[${indexStep}].fallbackRules`,
      updated
    );
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="fallback-rules">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ marginY: 2 }}
          >
            {fallbackRules?.map((fallbackRule, index) => {
              const id = fallbackRule?.fallbackType ? fallbackRule.fallbackType.toString() : `fallback-${index}`;
              return (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, snapshot) => (
                    <Grid
                      container
                      spacing={2}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        backgroundColor: snapshot.isDragging ? '#e0e0e0' : index % 2 === 0 ? '#f9f9f9' : '#fff',
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        padding: 2,
                        marginBottom: 2,
                        cursor: 'grab',
                      }}
                    >
                      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DragIndicator sx={{ color: 'text.secondary' }} />
                        <Typography variant="h6">
                          {index + 1}. {getWorkflowFallbackTypeLabel(fallbackRule?.fallbackType)}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default FallbackRuleList;
