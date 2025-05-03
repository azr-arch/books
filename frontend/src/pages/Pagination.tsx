// // import React from "react";
// import { Box, Stack, IconButton, Button, Typography } from "@mui/material";
// import { ChevronLeft, ChevronRight } from "@mui/icons-material";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   const pageNumbers: (number | "...")[] = [];
//   const maxButtons = 5;

//   let start = Math.max(currentPage - 2, 1);
//   let end = Math.min(currentPage + 2, totalPages);

//   if (end - start < maxButtons - 1) {
//     start = Math.max(end - maxButtons + 1, 1);
//     end = Math.min(start + maxButtons - 1, totalPages);
//   }

//   if (start > 1) {
//     pageNumbers.push(1);
//     if (start > 2) pageNumbers.push("...");
//   }

//   for (let i = start; i <= end; i++) {
//     pageNumbers.push(i);
//   }

//   if (end < totalPages) {
//     if (end < totalPages - 1) pageNumbers.push("...");
//     pageNumbers.push(totalPages);
//   }

//   const handlePrev = () => {
//     if (currentPage > 1) onPageChange(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) onPageChange(currentPage + 1);
//   };

//   return (
//     <Box sx={{ mr: 3, mt: 3 }} width="100%" display="flex" justifyContent="end">
//       <Stack direction="row" spacing={1} alignItems="center">
//         <IconButton
//           onClick={handlePrev}
//           disabled={currentPage === 1}
//           color="primary"
//           size="small"
//         >
//           <ChevronLeft fontSize="small" />
//         </IconButton>

//         {pageNumbers.map((page, index) =>
//           page === "..." ? (
//             <Typography key={index} variant="body2" px={1}>
//               ...
//             </Typography>
//           ) : (
//             <Button
//               key={page}
//               variant={page === currentPage ? "contained" : "outlined"}
//               color="primary"
//               onClick={() => onPageChange(Number(page))}
//               size="small"
//             >
//               {page}
//             </Button>
//           )
//         )}

//         <IconButton
//           onClick={handleNext}
//           disabled={currentPage === totalPages}
//           color="primary"
//           size="small"
//         >
//           <ChevronRight fontSize="small" />
//         </IconButton>
//       </Stack>
//     </Box>
//   );
// };

// export default Pagination;
import React from "react";
import { Pagination as MuiPagination, Stack } from "@mui/material";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  return (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="center"
      alignItems="center"
      mt={4}
    >
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        showFirstButton
        showLastButton
        size="small"
        color="primary"
      />
    </Stack>
  );
};

export default Pagination;
