import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery } from '@apollo/client';
import { GET_BENEFICIARY_DOCUMENT_RECORDS } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import BeneficiaryDocumentRecordFilter from './BeneficiaryDocumentRecordFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListBeneficiaryDocumentRecords from './TableListBeneficiaryDocumentRecords';

export default function ListBeneficiaryDocumentRecords() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [beneficiaryDocumentRecordFilter, setBeneficiaryDocumentRecordFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBeneficiaryDocumentRecordFilter(newFilter);
  };

  const [
    getBeneficiaryDocumentRecords,
    {
      loading: loadingBeneficiaryDocumentRecords,
      data: beneficiaryDocumentRecordsData,
      error: beneficiaryDocumentRecordsError,
      fetchMore: fetchMoreBeneficiaryDocumentRecords,
    },
  ] = useLazyQuery(GET_BENEFICIARY_DOCUMENT_RECORDS, {
    variables: { beneficiaryFilter: beneficiaryDocumentRecordFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getBeneficiaryDocumentRecords();
  }, [beneficiaryDocumentRecordFilter, paginator]);


  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <BeneficiaryDocumentRecordFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListBeneficiaryDocumentRecords
          loading={loadingBeneficiaryDocumentRecords}
          rows={beneficiaryDocumentRecordsData?.beneficiaries?.nodes || []}
          onFilterChange={(newFilter) => handleFilterChange({ ...beneficiaryDocumentRecordFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={beneficiaryDocumentRecordsData?.beneficiaries?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
