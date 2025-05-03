// db.js
export const db = {
  // Reference Tables
  countries: [
    {
      id: 1,
      sortname: "IN",
      name: "India",
      status: 1,
      created_date: "2023-10-01T10:00:00Z",
      modified_date: "2023-10-01T10:00:00Z",
    },
    {
      id: 2,
      sortname: "US",
      name: "United States",
      status: 1,
      created_date: "2023-10-01T10:00:00Z",
      modified_date: "2023-10-01T10:00:00Z",
    },
  ],

  states: [
    {
      id: 1,
      name: "Maharashtra",
      country_id: 1,
      zone: "west",
      code: "MH",
      status: 1,
      created_date: "2023-10-01T10:00:00Z",
      modified_date: "2023-10-01T10:00:00Z",
    },
    {
      id: 2,
      name: "California",
      country_id: 2,
      zone: "north",
      code: "CA",
      status: 1,
      created_date: "2023-10-01T10:00:00Z",
      modified_date: "2023-10-01T10:00:00Z",
    },
  ],

  cities: [
    {
      id: 1,
      name: "Mumbai",
      state_id: 1,
      status: 1,
      created_date: "2023-10-01T10:00:00Z",
      updated_date: "2023-10-01T10:00:00Z",
    },
    {
      id: 2,
      name: "San Francisco",
      state_id: 2,
      status: 1,
      created_date: "2023-10-01T10:00:00Z",
      updated_date: "2023-10-01T10:00:00Z",
    },
  ],

  // Customers
  customer: [
    {
      id: 1,
      company_name: "Tech Corp",
      contact_person: "John Doe",
      email: "john@techcorp.com",
      billing_city: 1, // Refers to Mumbai (id:1 in cities)
      billing_state: 1, // Refers to Maharashtra (id:1 in states)
      billing_country: 1, // Refers to India (id:1 in countries)
      billing_pincode: "400001",
      status: 1,
    },
    {
      id: 2,
      company_name: "Global Solutions",
      contact_person: "Jane Smith",
      email: "jane@globalsolutions.com",
      billing_city: 2, // Refers to San Francisco (id:2 in cities)
      billing_state: 2, // Refers to California (id:2 in states)
      billing_country: 2, // Refers to USA (id:2 in countries)
      billing_pincode: "94105",
      status: 1,
    },
  ],

  // Products
  product: [
    {
      id: 1,
      name: "Laptop",
      hsn_code: "84713000",
      uom: "PCS",
      price: 50000.0,
      status: 1,
    },
    {
      id: 2,
      name: "Mouse",
      hsn_code: "84716070",
      uom: "PCS",
      price: 500.0,
      status: 1,
    },
  ],

  // Proforma Invoices
  proforma: [
    {
      id: 1,
      proforma_number: "PRO-2023-001",
      proforma_date: "2023-10-01",
      customer_id: 1, // Tech Corp
      grand_total: 101500.0,
      tax_amount: 1500.0,
      status: 1,
    },
  ],

  // Proforma Line Items
  proforma_product: [
    {
      id: 1,
      proforma_id: 1, // Links to proforma.id=1
      product_id: 1, // Laptop
      quantity: 2,
      product_price: 50000.0,
      tax_percentage: 18.0,
      tax_amount: 18000.0,
      product_total: 118000.0,
    },
    {
      id: 2,
      proforma_id: 1, // Links to proforma.id=1
      product_id: 2, // Mouse
      quantity: 3,
      product_price: 500.0,
      tax_percentage: 18.0,
      tax_amount: 270.0,
      product_total: 1770.0,
    },
  ],
};

// Helper function to get full proforma data
export const getFullProforma = (proformaId: number) => {
  const proforma = db.proforma.find((p) => p.id === proformaId);
  if (!proforma) return null;

  const products = db.proforma_product
    .filter((pp) => pp.proforma_id === proformaId)
    .map((pp) => ({
      ...pp,
      product: db.product.find((p) => p.id === pp.product_id),
    }));

  return {
    ...proforma,
    customer: db.customer.find((c) => c.id === proforma.customer_id),
    products,
  };
};
