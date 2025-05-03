import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProformaById } from "../../api/proformapi";
import useLocationData from "../../selectField/LocationData";
import { getProducts } from "../../api/productapi";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button,
} from "@mui/material";

const ProformaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proforma, setProforma] = useState<any>(null);
  const { cities, states, countries } = useLocationData();

  const cityname = cities.find((val: any) => val.id === proforma?.city);
  const stateName = states.find((val: any) => val.id === proforma?.state);
  const countryName = countries.find(
    (val: any) => val.id === proforma?.country
  );

  useEffect(() => {
    if (id) {
      getProformaById(id)
        .then((res) => {
          console.log({ res });
          console.log(res.data[0].products);
          setProforma(res.data[0]);
        })
        .catch((error) => {
          alert("Error fetching proforma: " + error.message);
        });
    }

    getProducts();
  }, [id]);

  if (!proforma)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Box sx={{ px: 3, py: 4 }}>
        <Typography variant="h4" textAlign={"center"} gutterBottom>
          Proforma Details
        </Typography>

        <Grid container spacing={2}>
          {/* Customer Info */}
          <Grid size={6}>
            <Card variant="outlined">
              <CardHeader
                title="Customer Info"
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                  px: 1,
                  py: 1,
                }}
              />
              <CardContent>
                <Grid container spacing={0}>
                  <Grid size={4}>
                    <strong>Company Name:</strong>
                  </Grid>
                  <Grid size={8}>
                    <Typography variant="body1" gutterBottom>
                      {proforma.customer.company_name}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={0}>
                  <Grid size={4}>
                    <Typography variant="body1">
                      <strong>Contact Person:</strong>
                    </Typography>
                  </Grid>
                  <Grid size={8}>
                    <Typography variant="body1" gutterBottom>
                      {proforma.customer.contact_person}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={0}>
                  <Grid size={4}>
                    <Typography variant="body1">
                      <strong>Email:</strong>
                    </Typography>
                  </Grid>
                  <Grid size={8}>
                    <Typography variant="body1" gutterBottom>
                      {proforma.customer.email || "N/A"}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={0}>
                  <Grid size={4}>
                    {/* TODO Fix address */}
                    <Typography variant="body1">
                      <strong>Address</strong>
                    </Typography>
                  </Grid>
                  <Grid size={8}>
                    <Typography variant="body1" gutterBottom>
                      {proforma.customer.address || "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Proforma Info */}

          <Grid size={6}>
            <Card variant="outlined">
              <CardHeader
                title="Proforma Info"
                sx={{
                  backgroundColor: "success.main",
                  color: "white",
                  fontWeight: "bold",
                  px: 1,
                  py: 1,
                }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Grid container spacing={1}>
                      <Grid size={5}>
                        <strong>Proforma ID:</strong>
                      </Grid>
                      <Grid size={7}>{proforma.proforma_id}</Grid>

                      <Grid size={5}>
                        <strong>Date:</strong>
                      </Grid>
                      <Grid size={7}>{proforma.proforma_date}</Grid>

                      <Grid size={5}>
                        <strong>Place of Supply:</strong>
                      </Grid>
                      <Grid size={7}>{proforma.place_of_supply}</Grid>

                      <Grid size={5}>
                        <strong>City:</strong>
                      </Grid>
                      <Grid size={7}>{cityname?.name || "N/A"}</Grid>
                    </Grid>
                  </Grid>

                  <Grid size={6}>
                    <Grid container spacing={1}>
                      <Grid size={5}>
                        <strong>State:</strong>
                      </Grid>
                      <Grid size={7}>{stateName?.name || "N/A"}</Grid>

                      <Grid size={5}>
                        <strong>Country:</strong>
                      </Grid>
                      <Grid size={7}>{countryName?.name || "N/A"}</Grid>

                      <Grid size={5}>
                        <strong>Grand Total:</strong>
                      </Grid>
                      <Grid size={7}>₹ {proforma.total}</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Products Table */}
        <Card variant="outlined" sx={{ mt: 5 }}>
          <CardHeader
            title="Product Summary"
            sx={{
              backgroundColor: "secondary.main",
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              px: 1,
              py: 1,
            }}
          />
          <Divider />
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Product Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>HSN</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Qty</strong>
                    </TableCell>
                    <TableCell>
                      <strong>UOM</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Price</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Discount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Tax</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {proforma.products.map((product: any, index: number) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>{product.hsn}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.uom}</TableCell>
                      <TableCell>₹ {product.price}</TableCell>
                      <TableCell>₹{product.discount_amount || 0}</TableCell>
                      <TableCell>₹{product.tax_amount || 0}</TableCell>
                      <TableCell>₹ {product.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
      <Box textAlign={"center"}>
        <Button
          sx={{ p: 2, backgroundColor: "primary.main", color: "white" }}
          onClick={() => navigate("/proformaList")}
        >
          Go Back
        </Button>
      </Box>
    </>
  );
};

export default ProformaDetails;
