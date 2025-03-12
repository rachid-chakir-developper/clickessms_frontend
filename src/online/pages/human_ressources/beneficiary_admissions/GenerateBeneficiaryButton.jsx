import React from 'react';
import {
  IconButton,
  Tooltip,
} from '@mui/material';
import { PermContactCalendar } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GENERATE_BENEFICIARY_FROM_BENEFICIARY_ADMISSION } from '../../../../_shared/graphql/mutations/BeneficiaryAdmissionMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

export default function GenerateBeneficiaryButton({ beneficiaryAdmission }) {
  const navigate = useNavigate();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();

  const onGenerateBeneficiary = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez-vous vraiment générer une personne accompagnée ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        generateBeneficiary({
          variables: { idBeneficiaryAdmission: beneficiaryAdmission.id },
        });
      },
    });
  };

  const [generateBeneficiary, { loading: loadingPost }] = useMutation(
    GENERATE_BENEFICIARY_FROM_BENEFICIARY_ADMISSION,
    {
      onCompleted: (data) => {
        console.log(data);
        if (data.generateBeneficiary.success) {
          setNotifyAlert({
            isOpen: true,
            message: 'Ajouté avec succès',
            type: 'success',
          });
          let { __typename, ...beneficiaryCopy } = data.generateBeneficiary.beneficiary;
          navigate(`/online/ressources-humaines/beneficiaires/details/${beneficiaryCopy.id}`);
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non ajouté ! Veuillez réessayer. ${data.generateBeneficiary.message}`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { generateBeneficiary } }) {
        if (generateBeneficiary.success) {
          const newBeneficiary = generateBeneficiary.beneficiary;

          cache.modify({
            fields: {
              beneficiaries(existingBeneficiaries = { totalCount: 0, nodes: [] }) {
                const existingBeneficiaryIndex = existingBeneficiaries.nodes.findIndex(
                  (beneficiary) => beneficiary.id === newBeneficiary.id
                );

                let updatedBeneficiaries;

                if (existingBeneficiaryIndex > -1) {
                  updatedBeneficiaries = [...existingBeneficiaries.nodes];
                  updatedBeneficiaries[existingBeneficiaryIndex] = newBeneficiary;
                } else {
                  updatedBeneficiaries = [newBeneficiary, ...existingBeneficiaries.nodes];
                }

                return {
                  totalCount: updatedBeneficiaries.length,
                  nodes: updatedBeneficiaries,
                };
              },
              beneficiaryAdmissions(
                existingBeneficiaryAdmissions = { totalCount: 0, nodes: [] },
                { readField }
              ) {
                const updatedBeneficiaryAdmissions = existingBeneficiaryAdmissions.nodes.map((beneficiaryAdmission) => {
                  const beneficiaryAdmissionId = readField('id', beneficiaryAdmission);
              
                  if (beneficiaryAdmissionId === newBeneficiary?.beneficiaryAdmission?.id) {
                    const existingBeneficiary = readField('beneficiary', beneficiaryAdmission);
              
                    // Mise à jour du champ `beneficiary` si nécessaire
                    if (existingBeneficiary && readField('id', existingBeneficiary) === newBeneficiary.id) {
                      return {
                        ...beneficiaryAdmission,
                        beneficiary: newBeneficiary, // Mise à jour du bénéficiaire existant
                      };
                    } else {
                      return {
                        ...beneficiaryAdmission,
                        beneficiary: newBeneficiary, // Ajout du nouveau bénéficiaire
                      };
                    }
                  }
              
                  return beneficiaryAdmission; // Pas de modification
                });
              
                return {
                  totalCount: updatedBeneficiaryAdmissions.length,
                  nodes: updatedBeneficiaryAdmissions,
                };
              }
              ,
            },
          });
        }
      },
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non ajouté ! Veuillez réessayer.',
          type: 'error',
        });
      },
    }
  );


  return (
    <>
        <Tooltip title="Générer une personne accompagnée">
            <IconButton
                onClick={onGenerateBeneficiary}
                >
                <PermContactCalendar />
            </IconButton>
        </Tooltip>
    </>
  );
}
