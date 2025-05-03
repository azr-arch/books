import React from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Stack,
  Typography,
  Pagination,
} from "@mui/material";

interface ProformaPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  rowsPerPage: number;
  goToPage: (page: number) => void;
  setRowsPerPage: (value: number) => void;
}

const ProformaPagination: React.FC<any> = ({
  currentPage,
  totalPages,
  totalCount,
  rowsPerPage,
  goToPage,
  setRowsPerPage,
}) => {
  const handlePageChange = (_event: any, value: any) => {
    goToPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(Number(event.target.value));
    goToPage(1); // reset to first page on rows per page change
  };

  return (
    <Box
      mt={4}
      width="100%"
      display="flex"
      flexWrap="wrap"
      justifyContent="end"
      alignItems="center"
      gap={2}
      px={2}
    >
      {/* Pagination Controls */}
      <Stack spacing={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Stack>

      {/* Rows per page and Total Count */}
      <Box display="flex" alignItems="center" gap={2}>
        {/* <Button size="small" variant="contained" color="primary">
          Total: {totalCount}
        </Button> */}
        <Select
          size="small"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </Box>
    </Box>
  );
};

export default ProformaPagination;
