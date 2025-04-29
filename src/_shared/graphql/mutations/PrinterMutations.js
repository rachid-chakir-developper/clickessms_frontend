import { gql } from '@apollo/client';

// Mutation GraphQL pour générer un PDF
export const GENERATE_PDF_MUTATION = gql`
  mutation GeneratePdf($documentType: String!, $id: ID, $data: JSONString) {
    generatePdf(documentType: $documentType, id: $id, data: $data) {
      pdfFile
    }
  }
`;

export const EXPORT_EXCEL_MUTATION = gql`
    mutation ExportExcel($dashboardActivityFilter: DashboardActivityFilterInput, $documentType: String, $id: ID, $data: JSONString) {
        exportExcel(dashboardActivityFilter: $dashboardActivityFilter, documentType: $documentType, id: $id, data: $data) {
            success
            fileBase64
        }
    }
`;