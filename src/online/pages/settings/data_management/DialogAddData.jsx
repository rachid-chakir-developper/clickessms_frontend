import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Grid, Stack } from '@mui/material';
import { useMutation } from '@apollo/client';

import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  POST_DATA,
  PUT_DATA,
} from '../../../../_shared/graphql/mutations/DataMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheTextField from '../../../../_shared/components/form-fields/TheTextField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DialogAddData({ open, onClose, data, dataToEdit }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom de élément')
      .required(`Le nom est obligatoire`),
  });
  const formik = useFormik({
    initialValues: { nom: '' },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleOk(values);
    },
  });
  const [createData, { loading: loadingPost }] = useMutation(POST_DATA, {
    onCompleted: (data) => {
      console.log(data);
      onClose(data?.createData?.data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
    },
    update(cache, { data: { createData } }) {
      const newData = createData.data;

      cache.modify({
        fields: {
          datas(existingDatas = []) {
            return [...existingDatas, newData];
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non Ajouté ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const [updateData, { loading: loadingPut }] = useMutation(PUT_DATA, {
    onCompleted: (data) => {
      console.log(data);
      onClose(data.updateData.data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
    },
    update(cache, { data: { updateData } }) {
      const updatedData = updateData.data;

      cache.modify({
        fields: {
          datas(existingDatas = [], { readField }) {
            const updatedDatas = existingDatas.map((data) =>
              readField('id', data) === updatedData.id ? updatedData : data,
            );

            return updatedDatas;
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non Modifié ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const [errors, setErrors] = React.useState([]);
  const handleOk = (dataForm) => {
    if (dataToEdit)
      updateData({
        variables: {
          id: dataToEdit.id,
          name: dataForm.name,
          typeData: data.type,
        },
      });
    else
      createData({
        variables: {
          name: dataForm.name,
          typeData: data.type,
        },
      });
  };
  React.useEffect(() => {
    if (open) {
      formik.setValues({ name: '' });
      if (dataToEdit) {
        formik.setValues({ ...formik.values, name: dataToEdit.name });
      }
    }
  }, [open]);
  return (
    <div>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {dataToEdit ? 'Modifer un élément' : 'Ajouter un élément'} "
          {data?.name}"
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} sm={12} md={12}>
                <Item>
                  <TheTextField
                    variant="outlined"
                    label="Nom de élément"
                    id="name"
                    value={formik.values.name}
                    required
                    onChange={(e) =>
                      formik.setFieldValue('name', e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    disabled={loadingPost || loadingPut}
                  />
                </Item>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              disabled={!formik.isValid || loadingPost || loadingPut}
            >
              Valider
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </div>
  );
}
