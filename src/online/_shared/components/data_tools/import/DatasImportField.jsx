import * as React from 'react';
import { Tooltip } from '@mui/material';
import { useMutation } from '@apollo/client';
import TheFileField from '../../../../../_shared/components/form-fields/TheFileField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { IMPORT_DATAS } from '../../../../../_shared/graphql/mutations/DataMutations';

export default function DatasImportField(props) {
    const {title = 'Importer', entity, label='Importer', fields=[], refetchQueries=[]} = props
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const [importData, { loading: loadingImport }] = useMutation(
        IMPORT_DATAS,
          {
            onCompleted: (datas) => {
              if (datas.importData.done) {
                setNotifyAlert({
                  isOpen: true,
                  message: 'Importé avec succès',
                  type: 'success',
                });
              } else {
                setNotifyAlert({
                  isOpen: true,
                  message: `Non importé ! ${datas.importData.message}.`,
                  type: 'error',
                });
              }
            },
            refetchQueries: refetchQueries,
            onError: (err) => {
              console.log(err);
              setNotifyAlert({
                isOpen: true,
                message: 'Non importé ! Veuillez réessayer.',
                type: 'error',
              });
            },
          },
        );
      const [file, setFile] = React.useState(null);
      const onImportData = (file) => {
        setConfirmDialog({
          isOpen: true,
          title: 'ATTENTION',
          subTitle: 'Voulez vous vraiment importer ?',
          onConfirm: () => {
            setConfirmDialog({ isOpen: false });
            importData({ variables: { entity: entity, file: file, fields: fields}});
          },
        });
      };
  return (
    <Tooltip title={title}>
      <TheFileField variant="outlined" label={label}
        fileValue={file}
        onChange={(file) => {
        setFile(file)
        if(file) onImportData(file);
        }}
        />
    </Tooltip>
  );
}
