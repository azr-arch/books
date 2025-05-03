import axios from "axios";

const url = "http://localhost:4500";

const addCustomer = (data: any) => {
  return axios.post(`${url}/api/customer`, data);
};

const getCustomer = () => {
  return axios
    .get(`${url}/api/customer`)
    .then((res) => res.data)
    .catch((err) => {
      console.log("GET_CUSTOMER: ", err);
      throw err;
    });
};

// return axios
//     .get(`${baseURL}/product`)
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       console.error("Error fetching products:", error);
//       throw error;
//     });

const getCustomerById = (id: any) => {
  return axios.get(`${url}/api/customer/${id}`);
};

const updateCustomer = (id: any, data: any) => {
  return axios.put(`${url}/api/customer/${id}`, data);
};

const deleteCustomer = (id: any, onSuccess: any) => {
  axios
    .post(`${url}/api/customer/${id}`)
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const addProforma = (data: any) => {
  return axios.post(`${url}/api/proforma`, data);
};

export {
  getCustomer,
  addCustomer,
  deleteCustomer,
  getCustomerById,
  updateCustomer,
  url,
  addProforma,
};

// const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

// // Customer API
// const getCustomer = async () => {
//   await simulateDelay();
//   return Promise.resolve({
//     data: {
//       data: db.customer.map((customer) => ({
//         ...customer,
//         // Resolve address IDs to actual names
//         billing_city: db.cities.find((c) => c.id === customer.billing_city)
//           ?.name,
//         billing_state: db.states.find((s) => s.id === customer.billing_state)
//           ?.name,
//       })),
//     },
//   });
// };

// const addCustomer = async (data: any) => {
//   await simulateDelay();
//   const newCustomer = {
//     id: Math.max(...db.customer.map((c) => c.id)) + 1,
//     ...data,
//     status: 1,
//     created_date: new Date().toISOString(),
//   };
//   db.customer.push(newCustomer);
//   return Promise.resolve({ data: newCustomer });
// };

// const getCustomerById = async (id: any) => {
//   await simulateDelay();
//   const customer = db.customer.find((c) => c.id === id);
//   return Promise.resolve({ data: customer });
// };

// const updateCustomer = async (id: any, data: any) => {
//   await simulateDelay();
//   const index = db.customer.findIndex((c) => c.id === id);
//   if (index >= 0) {
//     db.customer[index] = { ...db.customer[index], ...data };
//   }
//   return Promise.resolve({ data: db.customer[index] });
// };

// const deleteCustomer = async (id: any) => {
//   await simulateDelay();
//   db.customer = db.customer.filter((c) => c.id !== id);
//   return Promise.resolve();
// };

// Proforma API (Add later)
// const addProforma = async (data: any) => {
//   // We'll implement this in next step
// };

// export {
//   getCustomer,
//   addCustomer,
//   deleteCustomer,
//   getCustomerById,
//   updateCustomer,
//   // addProforma,
// };
