import react, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ProformaDetails from "./proforma/ProformaDetails";
import Grid from "../Grid";
import AddCustomer from "./customer/AddCustomer";
import Customers from "./customer/Customers";
import Dashboard from "./Dashboard";
import EditCustomer from "./customer/EditCustomer";
import Proforma from "./proforma/ProformaAdd";
import ProformaEdit from "../pages/proforma/ProformaEdit";
import ProformaList from "./proforma/ProformaList";
import ViewCustomer from "./customer/ViewCustomer";

const drawerWidth = 240;

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Customer", path: "/customers" },
  { label: "Proforma", path: "/proformaList" },
  { label: "SalesInvoice", path: "" },
  { label: "Reports", path: "" },
  { label: "settings", path: "" },
];

const Navbar = (props: any) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <Button
            key={item.label}
            component={Link}
            to={item.path}
            sx={{ color: "#fff" }}
          >
            {item.label}
          </Button>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Router>
        <Box sx={{ display: "flex", mt: 5 }}>
          <CssBaseline />
          <AppBar component="nav">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                <img
                  src="https://prod-orggencrm.s3.ap-south-1.amazonaws.com/client5/public/logo.png"
                  alt="OrgGen"
                  className="bg-light-subtle border rounded-3"
                  style={{ height: "50px", width: "150px" }}
                />
              </Typography>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.path}
                    sx={{ color: "#fff" }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Toolbar>
          </AppBar>
          <nav>
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
          </nav>
        </Box>
        <Box component="main" sx={{ mt: 5 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add/customer" element={<AddCustomer />} />
            <Route path="/edit/customer/:id" element={<EditCustomer />} />
            <Route path="/view/customer/:id" element={<ViewCustomer />} />
            <Route path="/proformaList" element={<ProformaList />} />
            <Route
              path="/proforma/add-edit/:proforma_id"
              element={<Proforma />}
            />
            <Route path="/proforma/:id" element={<ProformaDetails />} />
            <Route path="/proforma/add" element={<Proforma />} />
            <Route path="/proformaEdit/:id" element={<ProformaEdit />} />
            <Route path="/customers" element={<Customers />} />
          </Routes>
        </Box>
      </Router>
    </>
  );
};

export default Navbar;
