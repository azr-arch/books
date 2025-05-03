import { Request, Response } from "express";
import db from "../../config/db";
import moment from "moment";

const getCustomer = (req: Request, res: Response) => {
  const {
    company_name = "",
    contact_person = "",
    gstin = "",
    registration_type = "",
    page = 1,
    itemsPerPage = 10,
  } = req.query;

  const offset = (Number(page) - 1) * Number(itemsPerPage);

  let sql = "SELECT * FROM customer where status=1";

  const params = [];

  if (company_name) {
    sql += " AND company_name LIKE ?";
    params.push(`%${company_name}%`);
  }
  if (contact_person) {
    sql += " AND contact_person LIKE ?";
    params.push(`%${contact_person}%`);
  }
  if (gstin) {
    sql += " AND gstin LIKE ?";
    params.push(`%${gstin}%`);
  }
  if (registration_type) {
    sql += " AND registration_type = ?";
    params.push(registration_type);
  }

  sql += " ORDER BY id DESC LIMIT ? OFFSET ?";
  params.push(Number(itemsPerPage), offset);
  db.query(sql, params, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal error" });
    }
    let countSql =
      "SELECT COUNT(*) AS totalCount FROM customer where status=1 ";
    const countParams = [];

    if (company_name) {
      countSql += " AND company_name LIKE ?";
      countParams.push(`%${company_name}%`);
    }
    if (contact_person) {
      countSql += " AND contact_person LIKE ?";
      countParams.push(`%${contact_person}%`);
    }
    if (gstin) {
      countSql += " AND gstin LIKE ?";
      countParams.push(`%${gstin}%`);
    }
    if (registration_type) {
      countSql += " AND registration_type = ?";
      countParams.push(registration_type);
    }

    db.query(countSql, countParams, (countErr, countResult: any) => {
      if (countErr) {
        return res
          .status(500)
          .json({ status: "error", message: "Count error" });
      }
      console.log({ countResult });

      const totalCount = countResult[0].totalCount;
      const totalPages = Math.ceil(totalCount / Number(itemsPerPage));

      res.status(200).json({
        status: "success",
        data: result,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages,
          itemsPerPage: parseInt(itemsPerPage as string),
          totalCount,
        },
      });
    });
  });
};

const getCustomerById = (req: Request, res: Response) => {
  const { id } = req.params;
  const query = "select * from customer where id=? And status=1";
  db.query(query, [id], (err, result: any) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: "error", message: "internal server error" });
    }
    if (result.length === 0) {
      res.status(404).json({ status: "error", message: "customer not found" });
      return;
    }

    console.log({ result });
    res.status(200).json({ status: "success", data: result[0] });
  });
};

const addCustomer = (req: Request, res: Response) => {
  const created_by = 123;
  const now = moment().utc().format("YYYY-MM-DD HH:mm:ss");

  const {
    gstin,
    company_name,
    contact_person,
    email,
    phone,
    registration_type,
    pan,
    billing_address1,
    billing_address2,
    billing_city,
    billing_state,
    billing_country,
    billing_pincode,
    shipping_address1,
    shipping_address2,
    shipping_city,
    shipping_state,
    shipping_country,
    shipping_pincode,
  } = req.body;

  // Insert customer details
  const query = `insert into customer(   
          gstin,
          company_name,
          contact_person,
          email,
          phone,
          registration_type,
          pan,
          status,
          billing_address1,
          billing_address2,
          billing_city,
          billing_state,
          billing_country,
          billing_pincode,
          shipping_address1,
          shipping_address2,
          shipping_city,
          shipping_state,
          shipping_country,
          shipping_pincode,
          created_by,
          created_date,
          updated_by,
          updated_date
        )values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  db.query(
    query,
    [
      gstin,
      company_name,
      contact_person,
      email,
      phone,
      registration_type === "registered" ? 1 : 2,
      pan,
      1,
      billing_address1,
      billing_address2,
      billing_city,
      billing_state,
      billing_country,
      billing_pincode,
      shipping_address1,
      shipping_address2,
      shipping_city,
      shipping_state,
      shipping_country,
      shipping_pincode,
      created_by,
      now,
      created_by, // updated by
      now, // updated date
    ],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add customer" });
      }

      res.status(201).json({
        status: "success",
        message: "Customer and addresses added successfully",
      });
    }
  );
};

const updateCustomer = (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    gstin,
    company_name,
    contact_person,
    email,
    phone,
    registration_type,
    pan,
    billing_address1,
    billing_address2,
    billing_city,
    billing_state,
    billing_country,
    billing_pincode,
    shipping_address1,
    shipping_address2,
    shipping_city,
    shipping_state,
    shipping_country,
    shipping_pincode,
  } = req.body;
  const query = `update customer set 
          gstin=?,
          company_name=?,
          contact_person=?,
          email=?,
          phone=?,
          registration_type=?,
          pan=?,
          billing_address1=?,
          billing_address2=?,
          billing_city=?,
          billing_state=?,
          billing_country=?,
          billing_pincode=?,
          shipping_address1=?,
          shipping_address2=?,
          shipping_city=?,
          shipping_state=?,
          shipping_country=?,
          shipping_pincode=? 
          where id=?`;
  db.query(
    query,
    [
      gstin,
      company_name,
      contact_person,
      email,
      phone,
      registration_type === "registered" ? 1 : 2,
      pan,
      billing_address1,
      billing_address2,
      billing_city,
      billing_state,
      billing_country,
      billing_pincode,
      shipping_address1,
      shipping_address2,
      shipping_city,
      shipping_state,
      shipping_country,
      shipping_pincode,
      id,
    ],
    (err, result: any) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status: "error", message: "internal server error" });
      }
      if (result.length === 0) {
        res
          .status(404)
          .json({ status: "error", message: "customer not found" });
        return;
      }
      res.status(200).json({
        status: "success",
        message: "customer updated successfully",
        result: result.affectedRow,
      });
    }
  );
};

const deleteCustomer = (req: Request, res: Response) => {
  const { id } = req.params;
  const query = "update customer set status=2 where id=?";

  db.query(query, [id], (err, result: any) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: "internal server error" });
    }
    if (result.affectedRow === 0) {
      res.status(404).json({ status: "error", message: "customer not found" });
      return;
    }

    res
      .status(200)
      .json({ status: "success", message: "customer deleted successfully" });
  });
};

export {
  getCustomer,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
