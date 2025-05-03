import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import db from "./config/db";
import { router as customerRoutes } from "./src/routes/customerRoutes";
import { router as productRoutes } from "./src/routes/productRoutes";
import { router as proformaRoutes } from "./src/routes/proformaRoutes";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ ping: "pong" });
});

app.get("/api/cities", (req: Request, res: Response) => {
  const sql = "select * from cities";
  db.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "internal server error" });
    }

    res.status(200).json({ status: "success", data: result });
  });
});

app.get("/api/countries", (req: Request, res: Response) => {
  const sql = "select * from countries";
  db.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "internal server error" });
    }
    res.status(200).json({ status: "success", data: result });
  });
});

app.get("/api/states", (req: Request, res: Response) => {
  const sql = "select * from states";
  db.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "internal server error" });
    }
    res.status(200).json({ status: "success", data: result });
  });
});

// Backend API endpoint (Node.js/Express example)
app.get("/api/cities/:cityId/details", (req: Request, res: Response) => {
  try {
    const { cityId } = req.params;
    const query = `
      SELECT 
        c.id as cityId,
        c.name as cityName,
        s.id as stateId,
        s.name as stateName,
        co.id as countryId,
        co.name as countryName
      FROM cities c
      JOIN states s ON c.state_id = s.id
      JOIN countries co ON s.country_id = co.id
      WHERE c.id = ?
    `;

    db.query(query, [cityId], (err, result: any) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Database error occurred",
        });
      }

      if (!result || result?.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "City not found",
        });
      }

      // Send first result since we're querying by ID
      res.status(200).json({
        status: "success",
        data: result[0],
      });
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch city details",
    });
  }
});

app.use("/api/customer", customerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/proforma", proformaRoutes);

app.listen(4500, () => {
  console.log("Server started on 4500");
});
