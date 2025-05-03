import { Request, Response } from "express";
import db from "../../config/db";

const getProducts = (req: Request, res: Response) => {
  const sql =
    "select *,  name AS 'label', id AS value from product WHERE status = 1";
  db.query(sql, (err, result) => {
    if (err) {
      console.log("err", err);
      return res
        .status(500)
        .json({ status: "error", message: "internal server error" });
    }
    res.status(200).json(result);
  });
};

export { getProducts };
