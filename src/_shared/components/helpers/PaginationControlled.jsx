import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationControlled({
  totalItems = 0,
  itemsPerPage = 0,
  currentPage = 1,
  onChange = null,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [page, setPage] = React.useState(currentPage);

  const handleChange = (event, value) => {
    if (onChange && value != page) onChange(value);
    setPage(value);
  };

  React.useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  return (
    <>
      {totalPages > 0 && (
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          {/* <Typography>Page: {page}</Typography> */}
          <Pagination count={totalPages} page={page} onChange={handleChange} />
        </Stack>
      )}
    </>
  );
}
