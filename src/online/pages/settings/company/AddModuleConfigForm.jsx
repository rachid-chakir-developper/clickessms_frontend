import React from 'react';
import { modules } from '../../../navigation/modules';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { GET_MY_COMPANY } from '../../../../_shared/graphql/queries/CompanyQueries';
import { useLazyQuery, useMutation } from '@apollo/client';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { PUT_COMPANY_FIELDS } from '../../../../_shared/graphql/mutations/CompanyMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { Dashboard } from '@mui/icons-material';

export default function AddModuleConfigForm({ title='' }) {
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const navigate = useNavigate();
    const [selectedModules, setSelectedModules] = React.useState([]);
    const handleCheckboxChange = (id) => {
        const newValues = selectedModules?.includes(id)
        ? selectedModules.filter((val) => val !== id)
        : [...selectedModules, id];
        setSelectedModules(newValues)
        console.log(newValues)
    };

    const [updateCompanyFields, { loading: loadingPut }] = useMutation(PUT_COMPANY_FIELDS, {
          onCompleted: (data) => {
            console.log(data);
            if(data.updateCompanyFields.success){
                setNotifyAlert({
                  isOpen: true,
                  message: 'Modifié avec succès',
                  type: 'success',
                });
                navigate('/online/parametres/');
            };
          },
          onError: (err) => {
            console.log(err);
            setNotifyAlert({
              isOpen: true,
              message: 'Non modifié ! Veuillez réessayer.',
              type: 'error',
            });
          },
        });
    
    const onUpdateCompanyFields = () => {
        setConfirmDialog({
            isOpen: true,
            title: 'ATTENTION',
            subTitle: 'Voulez vous vraiment modifier ?',
            onConfirm: () => {
            setConfirmDialog({ isOpen: false });
            updateCompanyFields({variables : {companyFields: {hiddenModules: selectedModules}}})
            },
        });
        };

    const [getCompany, { loading: loadingCompany }] = useLazyQuery(GET_MY_COMPANY, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            let { __typename, companyMedia, hiddenModules, companyHiddenModules, ...companyCopy } = data.company;
            setSelectedModules(companyHiddenModules);
        },
        onError: (err) => console.log(err),
        });
        React.useEffect(() => {
        getCompany();
        }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography component="div" variant="h5" sx={{ mb: 3 }}>
                {title}
            </Typography>
            {loadingCompany && <ProgressService type="form" />}
            {!loadingCompany && (<>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                          <Dashboard />
                              <FormControlLabel
                                control={
                                    <Checkbox
                                    checked={!selectedModules?.includes('dashboard')}
                                    onChange={() => handleCheckboxChange('dashboard')}
                                    disabled={loadingPut}
                                    />
                                }
                                label="Tableau de bord"
                              />
                      </Typography>
                </Box>
                {modules.map((module) => (
                    <Box key={module.id} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        {module.icon}
                            <FormControlLabel
                              control={
                                  <Checkbox
                                  checked={!selectedModules?.includes(module.id)}
                                  onChange={() => handleCheckboxChange(module.id)}
                                  disabled={loadingPut}
                                  />
                              }
                              label={module.name}
                              sx={{opacity: module?.disabled ? 0.7 : 1}}
                            />
                    </Typography>
                    <FormGroup sx={{ml: 6}}>
                        {module.entries.map((entry) => (
                        <React.Fragment key={entry.id}>
                            <FormControlLabel
                            control={
                                <Checkbox
                                checked={!selectedModules?.includes(entry.id)}
                                onChange={() => handleCheckboxChange(entry.id)}
                                disabled={loadingPut}
                                />
                            }
                            label={entry.name}
                            sx={{opacity: entry?.disabled ? 0.7 : 1}}
                            />
                            {entry.pages?.map((page) => (
                            <Box key={page.id} ml={4}>
                                <FormControlLabel
                                control={
                                    <Checkbox
                                    checked={!selectedModules?.includes(page.id)}
                                    onChange={() => handleCheckboxChange(page.id)}
                                    disabled={loadingPut}
                                    />
                                }
                                label={page.name}
                                sx={{opacity: page?.disabled ? 0.7 : 1}}
                                />
                            </Box>
                            ))}
                        </React.Fragment>
                        ))}
                    </FormGroup>
                    </Box>
                ))}
                  <Box sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                    <Link to="/online/parametres/" className="no_style">
                      <Button variant="outlined" sx={{ marginRight: '10px' }}>
                        Annuler
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      disabled={loadingPut}
                      onClick={onUpdateCompanyFields}
                    >
                      Valider
                    </Button>
                  </Box>
            </>
        )}
        </Box>
    );
}
