import axios from "axios";

const baseURL = "http://localhost:4500/api";

export const getProducts = () => {
  return axios
    .get(`${baseURL}/product`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      throw error;
    });
};

// import { db } from "../db";

// const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

// export const getProducts = async () => {
//   await simulateDelay();
//   const data = [...db.product];
//   return Promise.resolve({
//     data,
//   });
// };
