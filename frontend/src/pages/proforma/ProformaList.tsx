// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getProforma } from "../api/proformapi";
// import { toast } from "react-toastify";
// import ProformaPagination from "./ProformaPagination";
// import { deleteProforma } from "../api/proformapi";

// const ProformaList = () => {
//   const [Proformas, setProformas] = useState<any[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(10);
//   const [totalCount, setTotalCount] = useState<number>(0);

//   const proformaData = () => {
//     getProforma(currentPage, rowsPerPage)
//       .then((res) => {
//         setProformas(res.data.data);
//         setTotalPages(res.data.totalPages);
//         setTotalCount(res.data.totalItems);
//       })
//       .catch((err) => toast.error("Error fetching data", err));
//   };

//   useEffect(() => {
//     proformaData();
//   }, [currentPage, rowsPerPage]);

//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };
//   const handleDelete = (id: any) => {
//     deleteProforma(id, proformaData);
//   };
//   const handleRowsPerPageChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setRowsPerPage(Number(event.target.value));
//     setCurrentPage(1); // Reset to the first page
//   };

//   return (
//     <>
//       <div className="container">
//         <div className="row mt-2 bg-body-tertiary shadow-sm p-2 align-items-center">
//           <div className="col-md-6">
//             <ProformaPagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               goToPage={goToPage}
//               rowsPerPage={rowsPerPage}
//               setRowsPerPage={setRowsPerPage}
//               totalCount={totalCount}
//             />
//           </div>
//           <div className="col-md-6">
//             <div className="d-flex gap-2 justify-content-end">
//               <button className="btn btn-secondary">
//                 <i className="fa-solid fa-magnifying-glass"></i> Search
//               </button>
//               <button className="btn btn-success">
//                 <Link
//                   className="text-decoration-none text-white"
//                   to="/proforma/add-edit/0"
//                 >
//                   Add new
//                 </Link>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="row mt-3">
//           <div className="col-md-12 col-sm-12">
//             <div className="table-responsive">
//               <table className="table table-bordered">
//                 <thead>
//                   <tr>
//                     <th>
//                       <input type="checkbox" className="form-check-input" />
//                     </th>
//                     <th>Proforma No</th>
//                     <th>Company Name</th>
//                     <th>Contact Person</th>
//                     <th>Date</th>
//                     <th>Total</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Proformas.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="text-center">
//                         No proformas found
//                       </td>
//                     </tr>
//                   ) : (
//                     Proformas.map((val, index) => (
//                       <tr key={index}>
//                         <td>
//                           <input type="checkbox" className="form-check-input" />
//                         </td>
//                         <td>{val.id}</td>
//                         <td>{val.customer.name}</td>
//                         <td>{val.customer.contact_person}</td>
//                         <td>{val.proforma_date}</td>
//                         <td>{val.total}</td>
//                         <td>
//                           <Link to={`/proforma/${val.id}`}>
//                             <button className="btn btn-outline-secondary p-2">
//                               View
//                             </button>
//                           </Link>
//                           <Link to={`/proforma/add-edit/${val.id}`}>
//                             <button className="btn mx-1 btn-outline-secondary p-2">
//                               Edit
//                             </button>
//                           </Link>
//                           <button
//                             onClick={() => handleDelete(val.id)}
//                             className="btn btn-danger"
//                           >
//                             Delete
//                           </button>

//                           <div className="dropdown">
//                             <button
//                               className="btn btn-secondary dropdown-toggle"
//                               type="button"
//                               data-bs-toggle="dropdown"
//                               aria-expanded="false"
//                             ></button>
//                             <ul className="dropdown-menu">
//                               <li>
//                                 <button className="dropdown-item" type="button">
//                                   Action
//                                 </button>
//                               </li>
//                             </ul>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProformaList;
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProforma, deleteProforma } from "../../api/proformapi"; // update your paths
import ProformaPagination from "../../component/ProformaPagination";

import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";

const ProformaList = () => {
  const [Proformas, setProformas] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // TODO: Continue here to implement searching functionality
  const [searchParams, setSearchParams] = useSearchParams();

  const removeParam = (paramName: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set(paramName, undefined!);
      return newParams;
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name;

    if (e.target.value === "") {
      removeParam(key);
    } else {
      setSearchParams({ [key]: e.target.value });
    }
  };

  const proformaData = async () => {
    getProforma(currentPage, rowsPerPage)
      .then(({ data }) => {
        setProformas(data?.data || []);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalItems);
      })
      .catch((err) => {
        console.log({ err });
        toast.error("Error fetching data", err);
      });

    // const data = await getProforma();
    // setProformas(data.data);
  };

  useEffect(() => {
    proformaData();
  }, [currentPage, rowsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleDelete = (id: any) => {
    deleteProforma(id, () => console.log("Deleted successfully"));
  };

  return (
    <Container maxWidth={false}>
      <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {/* Left Side - Pagination */}

          {/* Company Name */}
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              label="ID"
              name="proforma_id"
              placeholder="Search by Proforma ID"
              // value={searchParams.company_name}

              onChange={handleSearchChange}
              // error={!!validationErrors.company_name}
              // helperText={validationErrors.company_name}
            />
          </Grid>

          {/* GSTIN */}
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              label="Company Name"
              name="c_name"
              placeholder="Search by Company name"
              // value={searchParams.gstin}
              // onChange={handleSearchChange}
            />
          </Grid>

          {/* Company Type */}

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              label="Contact Person"
              name="contact"
              placeholder="Search by Contact"
              // value={searchParams.gstin}
              // onChange={handleSearchChange}
            />
          </Grid>

          {/* Contact Person */}
          <Grid size={{ xs: 12, md: 2 }}>
            <DatePicker label="Select Proforma Date" name="p_date" />
          </Grid>

          {/* Right Side - Buttons */}
          <Grid size={{ md: 4 }}>
            {/* Added `component` prop */}
            <Box display="flex" justifyContent="flex-end" gap={1.5}>
              {/* <Button
                variant="outlined"
                startIcon={<i className="fa-solid fa-magnifying-glass"></i>}
              >
                Search
              </Button> */}
              <Button
                variant="contained"
                color="success"
                component={Link}
                to="/proforma/add"
              >
                Add New
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Proforma No</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Proformas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No proformas found
                </TableCell>
              </TableRow>
            ) : (
              Proformas.map((proforma, index) => {
                console.log({ proforma });
                return (
                  <TableRow key={index}>
                    <TableCell>{proforma.id}</TableCell>
                    <TableCell>{proforma.customer.company_name}</TableCell>
                    <TableCell>{proforma.customer.contact_person}</TableCell>
                    <TableCell>{proforma.proforma_date}</TableCell>
                    <TableCell>{proforma.grand_total}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        component={Link}
                        to={`/proforma/${proforma.id}`}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        sx={{ mx: 1 }}
                        variant="outlined"
                        component={Link}
                        to={`/proformaEdit/${proforma.id}`}
                      >
                        Edit
                      </Button>
                      {/* <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(proforma.id)}
                      >
                        Delete
                      </Button> */}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper>
        <Grid container spacing={0}>
          <Grid size={{ md: 12 }}>
            <Box display="flex" justifyContent="flex-end">
              <ProformaPagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                totalCount={totalCount}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProformaList;
