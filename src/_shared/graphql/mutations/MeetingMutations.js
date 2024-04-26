import { gql } from '@apollo/client';
import { MEETING_BASIC_INFOS } from '../fragments/MeetingFragment';

export const POST_MEETING = gql`
  mutation CreateMeeting($meetingData: MeetingInput!) {
    createMeeting(meetingData: $meetingData) {
      meeting {
        ...MeetingBasicInfosFragment
      }
    }
  }
  ${MEETING_BASIC_INFOS}
`;

export const PUT_MEETING = gql`
  mutation UpdateMeeting($id: ID!, $meetingData: MeetingInput!) {
    updateMeeting(id: $id, meetingData: $meetingData) {
      meeting {
        ...MeetingBasicInfosFragment
      }
    }
  }
  ${MEETING_BASIC_INFOS}
`;

export const PUT_MEETING_STATE = gql`
  mutation UpdateMeetingState($id: ID!) {
    updateMeetingState(id: $id) {
      done
      success
      message
      meeting {
        ...MeetingBasicInfosFragment
      }
    }
  }
  ${MEETING_BASIC_INFOS}
`;

export const DELETE_MEETING = gql`
  mutation DeleteMeeting($id: ID!) {
    deleteMeeting(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
