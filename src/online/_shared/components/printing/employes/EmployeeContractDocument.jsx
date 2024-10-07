import React from 'react';
import {  Box, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import { GET_CONTRACT_TEMPLATES } from '../../../../../_shared/graphql/queries/ContractTemplateQueries';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GENERATE_CONTRACT_CONTENT } from '../../../../../_shared/graphql/mutations/ContractTemplateMutations';

export default function EmployeeContractDocument({ employeeContract }) {
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const [contractTemplate, setContractTemplate]= React.useState("")
    const [contractContent, setContractContent]= React.useState("")
    const [
        getContractTemplates,
        {
          loading: loadingContractTemplates,
          data: contractTemplatesData,
          error: contractTemplatesError,
          fetchMore: fetchMoreContractTemplates,
        },
      ] = useLazyQuery(GET_CONTRACT_TEMPLATES, {
        variables: { contractTemplateFilter: {contractType : employeeContract.contractType} },
      });
    React.useEffect(() => {
        if (employeeContract?.id) {
            getContractTemplates();
        }
    }, [employeeContract]);

    const [generateContractContent, { loading: loadingGenerate, data: generateContractContentData }] = useMutation(
        GENERATE_CONTRACT_CONTENT,
        {
          onCompleted: (data) => {
            console.log(data);
            setContractContent(data.generateContractContent.contractContent);
          },
          onError: (err) => {
            console.error(err);
            setNotifyAlert({
              isOpen: true,
              message: 'Erreur lors de la génération du contrat ! Veuillez réessayer.',
              type: 'error',
            });
          },
        }
      );
      

    if (loadingContractTemplates) return <ProgressService type="form" />;
    return (
        <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center' }} >
            {!generateContractContentData?.generateContractContent?.contractContent && <Paper sx={{width: 320}}>
                <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">
                        Models des contrats
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        label="Models des contrats"
                        value={contractTemplate || ""}
                        onChange={(e) =>{
                                setContractTemplate(e.target.value)
                                console.log('contractTemplate', e.target.value)
                                const value = e.target.value
                                setContractContent("")
                                if(value){
                                    generateContractContent({ 
                                        variables: {
                                            employeeContractId: employeeContract.id,
                                            contractTemplateId: value,
                                        }})
                                }
                            }
                        }
                    >
                        <MenuItem value={null}>
                        <em>Choisissez une model</em>
                        </MenuItem>
                        {contractTemplatesData?.contractTemplates?.nodes?.map((contractTemplate, index) => {
                        return (
                            <MenuItem key={index} value={contractTemplate.id}>
                            {contractTemplate.title}
                            </MenuItem>
                        );
                        })}
                    </Select>
                </FormControl>
            </Paper>}
            <Box sx={{width: '100%'}}>
                <Typography
                    gutterBottom
                    component="div"
                    dangerouslySetInnerHTML={{ __html: generateContractContentData?.generateContractContent?.contractContent || '' }}
                />
            </Box>
        </Stack>
    );
}
