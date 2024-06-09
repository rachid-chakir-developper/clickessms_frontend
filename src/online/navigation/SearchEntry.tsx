import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

export interface SearchEntryProps {
  searchTerm: string;
  onSearch(searchTerm: string): void;
}

/**
 * A component to renders an input as navigation entry to be used for search.
 * Does not include any logic to handle the search itself.
 */
export default function SearchEntry({
  searchTerm,
  onSearch,
}: SearchEntryProps) {
  function handleChange(event) {
    onSearch(event.target.value);
  }

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <Stack sx={{ px: 2.5, py: 1 }} direction="row" alignItems="center">
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <InputBase
          placeholder="Rechercher..."
          inputProps={{ 'aria-label': 'search' }}
          value={searchTerm}
          onChange={handleChange}
        />
      </Stack>
    </ListItem>
  );
}
