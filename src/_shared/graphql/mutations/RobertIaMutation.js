
import { gql } from '@apollo/client';

export const USER_QUESTION = gql`
    mutation UserQuestion($question: String!) {
        userQuestion(question: $question) {
            answer
            tokens
        }
    }
`;