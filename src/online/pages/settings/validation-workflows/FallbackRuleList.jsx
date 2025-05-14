import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Grid, Typography, Input, FormControl, InputLabel } from '@mui/material';
import { getWorkflowFallbackTypeLabel } from '../../../../_shared/tools/functions';

// Fonction pour réorganiser les éléments
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const FallbackRuleList = ({ validationStep, formik, indexStep, loadingPost, loadingPut }) => {

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    // Si l'élément n'a pas bougé, on ne fait rien
    if (!destination) return;

    if (source.index !== destination.index) {
      const newFallbackRules = reorder(
        validationStep.fallbackRules,
        source.index,
        destination.index
      );

      // Mettre à jour la liste dans Formik
      formik.setFieldValue(
        `validationSteps[${indexStep}].fallbackRules`,
        newFallbackRules
      );
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="droppable-fallback-rules">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ marginY: 2 }}
          >
            {validationStep?.fallbackRules?.map((fallbackRule, indexRule) => (
              <Draggable key={indexRule} draggableId={`draggable-${indexRule}`} index={indexRule}>
                {(provided) => (
                  <Grid
                    container
                    spacing={2}
                    columns={12}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                      backgroundColor: indexRule % 2 ? '' : '#f1f1f1',
                      padding: 2,
                      marginY: 1,
                      border: '1px solid #ccc',
                    }}
                  >
                    <Grid item xs={12}>
                      <Typography variant="h6">
                        Fallback Rule {getWorkflowFallbackTypeLabel(fallbackRule?.fallbackType)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Order</InputLabel>
                        <Input
                          type="number"
                          value={fallbackRule.order}
                          onChange={(e) => {
                            const newOrder = parseInt(e.target.value, 10);
                            formik.setFieldValue(
                              `validationSteps[${indexStep}].fallbackRules[${indexRule}].order`,
                              newOrder
                            );
                          }}
                          disabled={loadingPost || loadingPut}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default FallbackRuleList;
