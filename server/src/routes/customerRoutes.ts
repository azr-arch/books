import express from "express";
const router = express.Router();
import {
  getCustomer,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController";

router.get("/", getCustomer).post("/", addCustomer);
router.get("/:id", getCustomerById);
// router.post("/", addCustomer);
router.put("/:id", updateCustomer);
router.post("/:id", deleteCustomer);

export { router };
