import * as React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { Cancel, Done, Drafts, HourglassEmpty, HourglassFull, HourglassTop, Pending, TaskAlt } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { PUT_COMPANY_FIELDS } from '../../../_shared/graphql/mutations/CompanyMutations';
import { STATUS } from '../../../_shared/tools/constants';
import { Link } from 'react-router-dom';


export default function CompanyStatusLabelMenu({company, disabled=false}) {
  const COMPANY_STATUS = [
    { value: 'ACTIVE', label: 'Active', icon: <Done />, color: 'success' },
    { value: 'INACTIVE', label: 'Inactive', icon: <HourglassFull />, color: 'default' },
    { value: 'PENDING', label: 'En attente de vérification', icon: <HourglassTop />, color: 'info' },
    { value: 'SUSPENDED', label: 'Suspendue', icon: <Pending />, color: 'warning' },
    { value: 'CLOSED', label: 'Fermée', icon: <Cancel />, color: 'error' },
    { value: 'TRIAL', label: "En période d'essai", icon: <HourglassEmpty />, color: 'primary' },
    { value: 'EXPIRED', label: 'Expiré', icon: <Drafts />, color: 'error' },
    { value: 'RENEWAL_PENDING', label: 'Renouvellement en attente', icon: <HourglassTop />, color: 'warning' },
    { value: 'ARCHIVED', label: 'Archivée', icon: <Pending />, color: 'secondary' },
    { value: 'UNDER_REVIEW', label: 'En révision', icon: <HourglassEmpty />, color: 'info' },
    { value: 'TERMINATED', label: 'Résiliée', icon: <Cancel />, color: 'error' },
    { value: 'ON_HOLD', label: 'En attente', icon: <HourglassTop />, color: 'default' },
];


    const [updateCompanyFields, { loading: loadingPut }] = useMutation(PUT_COMPANY_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
        if(data.updateCompanyFields.success) setOpenDialog(true);
      },
      update(cache, { data: { updateCompanyFields } }) {
        const updatedCompany = updateCompanyFields.company;
  
        cache.modify({
          fields: {
            companies(
              existingCompanies = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedCompanies = existingCompanies.nodes.map((company) =>
                readField('id', company) === updatedCompany.id
                  ? updatedCompany
                  : company,
              );
  
              return {
                totalCount: existingCompanies.totalCount,
                nodes: updatedCompanies,
              };
            },
          },
        });
      },
    });
  


  return (
    <Box>
        { company?.status !== STATUS.DRAFT ? <CustomizedStatusLabelMenu
            options={COMPANY_STATUS}
            status={company?.status}
            type="company"
            loading={loadingPut}
            onChange={(status)=> {updateCompanyFields({ variables: {id: company?.id, companyFields: {status}} })}}
            disabled={disabled}
        /> :
        <Tooltip title="Brouillon">
          <Box display="flex" alignItems="center">
            <Drafts color="warning" /> {/* Icône ajoutée avec couleur warning */}
            <Typography variant="body2" sx={{ color: 'warning.main', ml: 1 }}>
              Brouillon
            </Typography>
          </Box>
        </Tooltip>
      }
    </Box>
  );
}