import axios from "axios";
import { toast } from "react-toastify";
const baseURL = `http://localhost:4500/api/proforma`;

const getProforma = (page: number = 1, limit: number = 10) => {
  return axios.get(`${baseURL}?page=${page}&limit=${limit}`);
};

const getProformaById = (id: any) => {
  return axios.get(`${baseURL}/${id}`);
};

const updateProforma = async (id: any, formData: any) => {
  try {
    const response = await axios.post(`${baseURL}/${id}`, formData);
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast.error(
      "Failed to update proforma:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const deleteProforma = (id: any, onSuccess: any) => {
  axios
    .post(`${baseURL}/delete/${id}`)
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const addProforma = (data: any) => {
  axios
    .post(`${baseURL}`, data)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error.message);
      throw error;
    });
};

export {
  getProforma,
  getProformaById,
  updateProforma,
  deleteProforma,
  addProforma,
};

// proforma.api.ts
// import { db, getFullProforma } from "../db";

// const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

// const getProforma = async (page: number = 1, limit: number = 10) => {
//   await simulateDelay();
//   return Promise.resolve({
//     data: db.proforma.map((proforma) => ({
//       ...proforma,
//       customer: db.customer.find((c) => c.id === proforma.customer_id),
//     })),
//   });
// };

// const getProformaById = async (id: any) => {
//   await simulateDelay();
//   // const proforma = db.proforma.find((p) => p.id === id);
//   const fullProforma = getFullProforma(Number(id));
//   // if (proforma) {
//   //   proforma.products = db.proforma_product.filter(
//   //     (pp) => pp.proforma_id === id
//   //   );
//   // }
//   return Promise.resolve({ data: fullProforma });
// };

// // Create new proforma with products
// const addProforma = async (data: any) => {
//   await simulateDelay();

//   // Create proforma entry
//   const newProforma = {
//     id: Math.max(...db.proforma.map((p) => p.id)) + 1,
//     ...data,
//     status: 1,
//     created_date: new Date().toISOString(),
//   };
//   db.proforma.push(newProforma);

//   // Create product relationships
//   data.products.forEach((product: any) => {
//     db.proforma_product.push({
//       id: Math.max(...db.proforma_product.map((pp) => pp.id)) + 1,
//       proforma_id: newProforma.id,
//       ...product,
//     });
//   });

//   return Promise.resolve({ data: getFullProforma(newProforma.id) });
// };

// // Update proforma mock
// const updateProforma = async (id: any, formData: any) => {
//   await simulateDelay();

//   // Update proforma details
//   const index = db.proforma.findIndex((p) => p.id === Number(id));
//   if (index >= 0) {
//     db.proforma[index] = { ...db.proforma[index], ...formData };
//   }

//   // Update products
//   db.proforma_product = db.proforma_product.filter(
//     (pp) => pp.proforma_id !== Number(id)
//   );
//   formData.products.forEach((product: any) => {
//     db.proforma_product.push({
//       id: Math.max(...db.proforma_product.map((pp) => pp.id)) + 1,
//       proforma_id: Number(id),
//       ...product,
//     });
//   });

//   return Promise.resolve({ data: getFullProforma(Number(id)) });
// };

// // Delete proforma mock
// const deleteProforma = async (id: any) => {
//   await simulateDelay();
//   db.proforma = db.proforma.filter((p) => p.id !== Number(id));
//   db.proforma_product = db.proforma_product.filter(
//     (pp) => pp.proforma_id !== Number(id)
//   );
//   return Promise.resolve();
// };

// export {
//   getProforma,
//   getProformaById,
//   updateProforma,
//   deleteProforma,
//   addProforma,
// };
