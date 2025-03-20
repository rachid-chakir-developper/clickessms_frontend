import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from "@mui/material";
import EmailForm from "./EmailForm"; // Assurez-vous que EmailForm est bien importé
import { GET_DEFAULT_SENT_EMAIL } from "../../../../_shared/graphql/queries/SentEmailQueries";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SEND_THE_EMAIL } from "../../../../_shared/graphql/mutations/SentEmailMutations";
import { useFeedBacks } from "../../../../_shared/context/feedbacks/FeedBacksProvider";

const DialogSendMail = ({ open, onClose, onSend, jobCandidateApplication }) => {
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const [formValues, setFormValues] = useState({
        recipient: "",
        subject: "",
        body: "",
    });

    const [sendTheEmail, { loading: loadingSend }] = useMutation(SEND_THE_EMAIL, {
        onCompleted: (data) => {
            console.log(data);
            if(data.sendTheEmail.success){
                setNotifyAlert({
                    isOpen: true,
                    message: 'Ajouté avec succès',
                    type: 'success',
                });
                onClose(formValues)
                onSend(formValues)
            }else{
                setNotifyAlert({
                  isOpen: true,
                  message: `Non ajouté ! Veuillez réessayer. ${data.sendTheEmail.message}`,
                  type: 'error',
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
      });
      
    const [getDefaultSentEmail, { loading: loadingDefaultSentEmail, data: DefaultSentEmailData }] = useLazyQuery(GET_DEFAULT_SENT_EMAIL);

    useEffect(()=>{
        if(open){
            getDefaultSentEmail({ variables: { defaultSentEmailFilter : {jobCandidateApplication: jobCandidateApplication?.id} }, fetchPolicy: 'network-only'});
        }
    }, [open])
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Envoyer un Email</DialogTitle>
        <DialogContent>
            <Box sx={{paddingTop: 2}}>
                <EmailForm onChange={setFormValues} 
                    defaultEmail={DefaultSentEmailData?.defaultSentEmail} 
                    loading={loadingDefaultSentEmail || loadingSend}/>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary">Annuler</Button>
            <Button onClick={() => sendTheEmail({variables: { sentEmailData: formValues }})} color="primary" variant="contained"
                disabled={loadingSend|| loadingDefaultSentEmail || formValues?.recipient ==="" || formValues?.subject ==="" || formValues?.body ===""}>
            Envoyer
            </Button>
        </DialogActions>
        </Dialog>
    );
};

export default DialogSendMail;
