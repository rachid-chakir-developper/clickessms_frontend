import { gql } from '@apollo/client';

// Mutation GraphQL pour générer un PDF
export const GENERATE_PDF_MUTATION = gql`
  mutation GeneratePdf($documentType: String!, $id: ID, $data: JSONString) {
    generatePdf(documentType: $documentType, id: $id, data: $data) {
      pdfFile
    }
  }
`;
