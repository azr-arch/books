import express from "express";
import {
  createProforma,
  deleteProforma,
  getProforma,
  getProformaById,
  postUpdateProforma,
} from "../controllers/proformaController";

const router = express.Router();

router.post("/delete/:id", deleteProforma);
//@ts-ignore
router.get("/:id", getProformaById);
//@ts-ignore
router.post("/:id", postUpdateProforma);
router.get("/", getProforma);
//@ts-ignore
router.post("/", createProforma);
export { router };
