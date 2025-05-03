import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCustomer, deleteCustomer } from "../../api/api";
import Pagination from "../Pagination";

import axios from "axios";

import {
  Container,
  FormControl,
  InputLabel,
  Select,
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
  TextField,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid";

// TODO: add delete modal confirmation and refactor dry

function Customers() {
  //pagination
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({
    company_name: "",
    contact_person: "",
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<any>();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<any>({});

  const handleSearchChange = (e: any) => {
    const { name, value } = e.target;

    // Always update the input value
    setSearchParams((prev) => ({ ...prev, [name]: value }));

    // Validate fields
    if (name === "company_name" || name === "contact_person") {
      setValidationErrors((prev) => ({
        ...prev,
        [name]:
          value.length > 0 && value.length < 3
            ? "Minimum 3 characters required for search"
            : "",
      }));
    }
  };

  const [pgcustomers, setpgCustomers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 5,
    totalCount: 0,
  });

  // Combined search parameters
  const [searchParams, setSearchParams] = useState({
    company_name: "",
    contact_person: "",
    gstin: "",
    registration_type: "",
  });

  // Fetch customers with search parameters
  const fetchCustomers = async (page = 1) => {
    try {
      const queryParams = new URLSearchParams({
        ...searchParams,
        page: page.toString(),
        itemsPerPage: pagination.itemsPerPage.toString(),
      });

      const response = await axios.get(
        `http://localhost:4500/api/customer?${queryParams.toString()}`
      );

      // const { data } = await getCustomer();

      setpgCustomers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Handle individual search field changes
  // (Removed duplicate declaration of handleSearchChange)
  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const isValidSearch =
        (searchParams.company_name.length === 0 ||
          searchParams.company_name.length >= 3) &&
        (searchParams.contact_person.length === 0 ||
          searchParams.contact_person.length >= 3);

      if (isValidSearch) {
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        fetchCustomers(1);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    fetchCustomers(newPage);
  };

  // Initial fetch
  useEffect(() => {
    fetchCustomers(1);
  }, []);

  const [customers, setCustomers] = useState([]);
  const [Error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Added searchTerm state

  const formatDateTime = (dateString: any) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const fetchCustomer = async (page = 1) => {
    try {
      const queryParams = new URLSearchParams({
        ...searchParams,
        page: page.toString(),
        itemsPerPage: "10",
      });

      const response = await axios.get(
        `http://localhost:4500/api/customer?${queryParams.toString()}`
      );

      setCustomers(response.data.data);
      setPagination(response.data.pagination);
      // Removed as setCurrentPage is not defined
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  // Fetch data when page changes
  useEffect(() => {
    if (searchTerm === "") {
      fetchCustomers(pagination.currentPage);
    }
  }, [pagination.currentPage]);

  const handleDelete = (id: any) => {
    deleteCustomer(id, () => console.log("Done"));
    fetchCustomers(pagination.currentPage);
  };

  // Add this function after your other handler functions
  const handleShowAll = () => {
    // Reset all search parameters
    setSearchParams({
      company_name: "",
      contact_person: "",
      gstin: "",
      registration_type: "",
    });

    // Reset pagination to first page
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));

    // Fetch all customers
    fetchCustomers(1);
  };

  return (
    <>
      <Box mt={3} px={4}>
        <Grid container alignItems="center" spacing={2}>
          <Grid size={12} justifyContent={"end"} sx={{ mb: 2 }}>
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button
                component={Link}
                to="/add/customer"
                variant="contained"
                color="success"
                startIcon={<i className="fa-solid fa-plus"></i>}
              >
                Add Customer
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleShowAll}
              >
                View All
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2, paddingInline: 2 }}>
        {/* Company Name */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Name"
            name="company_name"
            placeholder="Search by Company Name"
            value={searchParams.company_name}
            onChange={handleSearchChange}
            error={!!validationErrors.company_name}
            helperText={validationErrors.company_name}
          />
        </Grid>

        {/* GSTIN */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="GSTIN"
            name="gstin"
            placeholder="Search by GSTIN"
            value={searchParams.gstin}
            onChange={handleSearchChange}
          />
        </Grid>

        {/* Company Type */}

        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Company Type</InputLabel>
            <Select
              name="registration_type"
              value={searchParams.registration_type}
              label="Company Type"
              onChange={handleSearchChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="registered">Registered</MenuItem>
              <MenuItem value="unregistered">Unregistered</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Contact Person */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Contact Person"
            name="contact_person"
            placeholder="Search by Contact Person"
            value={searchParams.contact_person}
            onChange={handleSearchChange}
            error={!!validationErrors.contact_person}
            helperText={validationErrors.contact_person}
          />
        </Grid>
      </Grid>

      {/* customer table */}

      <TableContainer sx={{ paddingInline: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pgcustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Customer found
                </TableCell>
              </TableRow>
            ) : (
              pgcustomers.map((val: any) => (
                <TableRow key={val.id}>
                  <TableCell>{val.id}</TableCell>
                  <TableCell>{val.company_name}</TableCell>
                  <TableCell>{val.contact_person}</TableCell>
                  <TableCell>{val.created_by}</TableCell>
                  <TableCell>{formatDateTime(val.created_date)}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      component={Link}
                      to={`/view/customer/${val.id}`}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      sx={{ mx: 1 }}
                      component={Link}
                      variant="contained"
                      color="success"
                      to={`/edit/customer/${val.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(val.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper sx={{ paddingInline: 2 }}>
        <Grid container>
          <Grid size={12}>
            <Box
              display="flex"
              justifyContent={"flex-end"}
              alignItems={"center"}
              sx={{ mb: 1 }}
            >
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />

              {/* <Button variant="contained" color="primary" sx={{ mr: 2 }}>
              Total: {pagination.totalCount}
            </Button> */}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default Customers;
