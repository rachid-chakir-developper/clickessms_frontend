import { gql } from '@apollo/client';
import { MEETING_BASIC_INFOS, MEETING_DETAILS, MEETING_RECAP_DETAILS } from '../fragments/MeetingFragment';

export const GET_MEETING = gql`
  query GetMeeting($id: ID!) {
    meeting(id: $id) {
      ...MeetingDetailsFragment
    }
  }
  ${MEETING_DETAILS}
`;

export const GET_MEETINGS = gql`
  query GetMeetings($meetingFilter: MeetingFilterInput, $offset: Int, $limit: Int, $page: Int){
    meetings(meetingFilter : $meetingFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...MeetingBasicInfosFragment
      }
    }
  }
  ${MEETING_BASIC_INFOS}
`;


export const MEETING_RECAP = gql`
  query GetMeeting($id: ID!) {
    meeting(id: $id) {
      ...MeetingRecapDetailsFragment
    }
  }
  ${MEETING_RECAP_DETAILS}
`;
// Add more meeting-related queries here
