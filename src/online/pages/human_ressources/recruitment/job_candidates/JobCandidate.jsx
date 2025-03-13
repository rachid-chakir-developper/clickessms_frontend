import { Chip, Avatar } from '@mui/material';

export default function JobCandidateChip({ jobCandidate }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={`${jobCandidate?.firstName} ${jobCandidate?.preferredName && jobCandidate?.preferredName !== ''  ? jobCandidate?.preferredName : jobCandidate?.lastName}`}
          src={jobCandidate?.photo ? jobCandidate?.photo : '/default-placeholder.jpg'}
        />
      }
      label={`${jobCandidate?.firstName} ${jobCandidate?.preferredName && jobCandidate?.preferredName !== ''  ? jobCandidate?.preferredName : jobCandidate?.lastName}`}
      variant="outlined"
    />
  );
}
