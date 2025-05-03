import { Request, Response } from "express";
import db from "../../config/db";
import dayjs from "dayjs";
import moment from "moment";

//@ts-ignore
const createProforma = (req: Request, res: Response) => {
  const {
    proforma_date,
    proforma_number,
    place_of_supply,
    customer_id,
    products,
  } = req.body;

  console.log("req.body", req.body);
  if (
    !proforma_date ||
    !proforma_number ||
    !place_of_supply ||
    !customer_id ||
    !products?.length
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Calculate totals
  let grand_total = 0;
  let total_tax = 0;

  const productValues = products.map((p: any) => {
    const price = Number(p.price);
    const quantity = Number(p.quantity);
    const discountPercentage = Number(p.discount_percentage) || 0;
    const taxPercentage = Number(p.tax_percentage) || 0;

    // Calculate values
    const subtotal = price * quantity;
    const discountAmount = (subtotal * discountPercentage) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * taxPercentage) / 100;
    const productTotal = taxableAmount + taxAmount;

    // Update totals
    grand_total += productTotal;
    total_tax += taxAmount;

    console.log({
      product_id: p.product_id,
      price,
      quantity,
      productTotal,
      taxPercentage,
      taxAmount,
      discountPercentage,
      discountAmount,
      taxableAmount,
    });

    return [
      null, // proforma_id placeholder
      p.product_id,
      price,
      quantity,
      productTotal,
      taxPercentage,
      taxAmount,
      discountPercentage,
      discountAmount,
      taxableAmount,
    ];
  });

  const created_date = moment().utc().format("YYYY-MM-DD HH:mm:ss");

  db.beginTransaction((err) => {
    if (err) {
      console.log("transaction msg", err.message, err.sqlMessage);
      return res
        .status(500)
        .json({ error: "Transaction start failed", details: err });
    }

    // updated_by,updated_date
    const insertProforma = `
      INSERT INTO proforma (
        proforma_date,proforma_number, place_of_supply
        , grand_total, tax_amount,
        customer_id,created_by,created_date
      ) VALUES (?,?,?,?,?,?,?,?)
    `;

    if (!products || !Array.isArray(products)) {
      console.log("Invalid or missing products:", products);
      return res.status(400).json({ message: "Invalid product data" });
    }
    const created_by = 123;
    const updated_by = 321;

    const updated_date = null;
    const proformaValues = [
      proforma_date,
      proforma_number,
      place_of_supply,
      grand_total,
      total_tax,
      customer_id,
      created_by,
      created_date,
      // updated_by,
      // updated_date,
    ];

    db.query(insertProforma, proformaValues, (err, result) => {
      if (err) {
        console.log("insert proforma", err.message, err.sqlMessage);
        return db.rollback(() =>
          res
            .status(500)
            .json({ error: "Failed to insert proforma", details: err.message })
        );
      }

      const proformaId = result.insertId;

      // Prepare products with proforma ID
      const finalProducts = productValues.map((p: any) => [
        proformaId,
        ...p.slice(1),
      ]);

      const insertProducts = `
        INSERT INTO proforma_product (
          proforma_id, product_id, product_price, quantity, product_total, 
          tax_percentage, tax_amount,  
          discount_percentage, discount_amount,
        product_value
        ) VALUES ?
`;
      console.log({ finalProducts });
      // const productValues = products
      //   .filter((p) => p.product.id !== undefined)
      //   .map((p) => {
      //     console.log({ p });
      //     return [
      //       proformaId,
      //       p.product.id,
      //       p.product.price,

      //       p.quantity,
      //       p.total,

      //       p.tax_percentage || 0,
      //       p.tax_percentage || 0,

      //       p.discount_percentage,
      //       p.discount_percentage,

      //       p.quantity * p.product.price,
      //     ];
      //   });
      console.log({ productValues });
      db.query(insertProducts, [finalProducts], (err2) => {
        if (err2) {
          console.log(err2.message, err2.sqlMessage);
          return db.rollback(() =>
            res.status(500).json({
              error: "Failed to insert products",
              details: err2.message,
            })
          );
        }

        db.commit((err3) => {
          if (err3) {
            console.log(err3.message, err3.sqlMessage);
            return db.rollback(() =>
              res
                .status(500)
                .json({ error: "Failed to commit", details: err3.message })
            );
          }

          res.status(201).json({ message: "Proforma created successfully!" });
        });
      });
    });
  });
};

// const getProforma = (req: Request, res: Response) => {
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 10;
//   const offset = (page - 1) * limit;

//   const getPaginatedProformaIdsQuery = `
//     SELECT id FROM proforma where status=1 ORDER BY id DESC LIMIT ? OFFSET ?
//   `;

//   db.query(getPaginatedProformaIdsQuery, [limit, offset], (err, idRows) => {
//     if (err) {
//       console.log({ err });
//       return res
//         .status(500)
//         .json({ error: "Error fetching proforma IDs", details: err.message });
//     }

//     if (idRows.length === 0) {
//       return res.status(201).json({ data: [] });
//     }

//     const proformaIds = idRows.map((row: any) => row.id);

//     // TODO: tax amount ?? twice
//     const proformaQuery = `
//       SELECT
//         p.id AS proforma_id,
//         p.proforma_date,
//         p.place_of_supply,
//         p.grand_total,
//         p.tax_amount,

//         c.id AS customer_id,
//         c.company_name ,
//         c.contact_person ,
//         c.email AS customer_email,
//         c.shipping_city AS city,
//         c.shipping_state AS state,
//         c.shipping_country AS country,

//         pp.product_id ,
//         pp.product_price,
//         pp.quantity,
//         pp.product_value,
//         pp.discount_amount,
//         pp.discount_percentage,
//         pp.tax_percentage,
//         pp.tax_amount,
//         pp.product_total

//       FROM proforma p
//       LEFT JOIN customer c ON p.customer_id = c.id
//       LEFT JOIN proforma_product pp ON p.id = pp.proforma_id
//       WHERE p.id IN (?) And p.status=1
//       ORDER BY p.id DESC;
//     `;

//     db.query(proformaQuery, [proformaIds], (err, results) => {
//       if (err) {
//         console.log({ err });
//         return res
//           .status(500)
//           .json({ error: "Failed to fetch proformas", details: err.message });
//       }

//       const proformasMap: Record<number, any> = {};

//       results.forEach((row: any) => {
//         if (!proformasMap[row.proforma_id]) {
//           proformasMap[row.proforma_id] = {
//             ...row,
//             products: [],
//           };
//         }

//         if (row.product_id) {
//           proformasMap[row.proforma_id].products.push({
//             id: row.product_id,
//             quantity: row.quantity,
//             price: row.product_price,
//             total: row.product_value,
//           });
//         }
//       });

//       const allProformas = Object.values(proformasMap);
//       // Also get total count for pagination
//       db.query("SELECT COUNT(*) AS total FROM proforma", (err, countResult) => {
//         if (err) {
//           console.log({ err });
//           return res
//             .status(500)
//             .json({ error: "Failed to get count", details: err.message });
//         }
//         console.log(countResult[0].total);
//         const totalItems = countResult[0].total;
//         const totalPages = Math.ceil(totalItems / limit);

//         res.json({
//           data: allProformas,
//           currentPage: page,
//           totalPages,
//           totalItems,
//         });
//       });
//     });
//   });
// };

interface Proforma {
  id: number;
  proforma_date: string;
  proforma_number: string;
  place_of_supply: string;
  grand_total: number;
  tax_amount: number;
  customer: {
    id: number;
    company_name: string;
    contact_person: string;
    email: string;
    address: string;
  };
  products: Array<{
    product_id: number;
    product_price: number;
    quantity: number;
    discount_percentage: number;
    discount_amount: number;
    tax_percentage: number;
    tax_amount: number;
    product_total: number;
  }>;
}

const getProforma = (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 10)
  );
  const offset = (page - 1) * limit;

  const baseQuery = `
    SELECT
      p.id,
      p.proforma_date,
      p.proforma_number,
      p.place_of_supply,
      p.grand_total,
      p.tax_amount,
      c.id AS customer_id,
      c.company_name,
      c.contact_person,
      c.email AS customer_email,
      CONCAT(
        c.shipping_address1,
        IFNULL(CONCAT(', ', c.shipping_address2), ''),
        ', ',
        ci.name,
        ', ',
        s.name,
        ', ',
        co.name,
        ' - ',
        c.shipping_pincode
      ) AS customer_address,
      pp.product_id,
      pp.product_price,
      pp.quantity,
      pp.discount_percentage,
      pp.discount_amount,
      pp.tax_percentage,
      pp.tax_amount,
      pp.product_total
    FROM proforma p
    LEFT JOIN customer c ON p.customer_id = c.id
    LEFT JOIN proforma_product pp ON p.id = pp.proforma_id
    LEFT JOIN cities ci ON c.shipping_city = ci.id
    LEFT JOIN states s ON c.shipping_state = s.id
    LEFT JOIN countries co ON c.shipping_country = co.id
    WHERE p.status = 1
    ORDER BY p.id DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM proforma 
    WHERE status = 1
  `;

  db.query(countQuery, (countErr, countResult) => {
    if (countErr) {
      console.error("Count query error:", countErr);
      return res.status(500).json({
        error: "Failed to get proforma count",
        details: countErr.message,
      });
    }

    const totalItems = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limit);

    db.query(baseQuery, [limit, offset], (err, results) => {
      if (err) {
        console.error("Main query error:", err);
        return res.status(500).json({
          error: "Failed to fetch proformas",
          details: err.message,
        });
      }

      const proformasMap = new Map<number, Proforma>();

      results.forEach((row: any) => {
        if (!proformasMap.has(row.id)) {
          proformasMap.set(row.id, {
            id: row.id,
            proforma_date: row.proforma_date,
            proforma_number: row.proforma_number,
            place_of_supply: row.place_of_supply,
            grand_total: row.grand_total,
            tax_amount: row.tax_amount,
            customer: {
              id: row.customer_id,
              company_name: row.company_name,
              contact_person: row.contact_person,
              email: row.customer_email,
              address: row.customer_address,
            },
            products: [],
          });
        }

        if (row.product_id) {
          proformasMap.get(row.id)?.products.push({
            product_id: row.product_id,
            product_price: row.product_price,
            quantity: row.quantity,
            discount_percentage: row.discount_percentage,
            discount_amount: row.discount_amount,
            tax_percentage: row.tax_percentage,
            tax_amount: row.tax_amount,
            product_total: row.product_total,
          });
        }
      });

      res.json({
        data: Array.from(proformasMap.values()),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
        },
      });
    });
  });
};

const getProformaById = (req: Request, res: Response) => {
  const { id } = req.params; // Ensure you're getting id from the request body
  if (!id) {
    return res.status(400).json({ error: "ID is required" }); // Validate ID
  }
  const proformaQuery = `
  SELECT 
    p.id AS proforma_id,
    p.proforma_date,
    p.place_of_supply,
    p.grand_total,
    p.proforma_number,
    p.customer_id, 

    c.id AS customer_id,
    c.company_name ,
    c.contact_person ,
    c.email AS customer_email,
    CONCAT(
        c.shipping_address1,
        IFNULL(CONCAT(', ', c.shipping_address2), ''),
        ', ',
        ci.name,
        ', ',
        s.name,
        ', ',
        co.name,
        ' - ',
        c.shipping_pincode
      ) AS customer_address,
    c.gstin,
   
    pp.product_id ,
    pp.product_price,
    pp.quantity,
    pp.product_value, 
    pp.discount_amount,
    pp.discount_percentage,
    pp.tax_percentage,
    pp.tax_amount,
    pp.product_total,

    pr.name AS product_name,
    pr.description,
    pr.hsn_code,
    pr.uom

  FROM proforma p
  LEFT JOIN customer c ON p.customer_id = c.id
  LEFT JOIN proforma_product pp ON p.id = pp.proforma_id 
  LEFT JOIN product pr ON pp.product_id = pr.id
  LEFT JOIN cities ci ON c.shipping_city = ci.id
  LEFT JOIN states s ON c.shipping_state = s.id
  LEFT JOIN countries co ON c.shipping_country = co.id
  WHERE p.id = ? And p.status=1
  ORDER BY p.id desc;
`;

  db.query(proformaQuery, [id], (err, results) => {
    if (err) {
      console.log({ err });
      return res
        .status(500)
        .json({ error: "Failed to fetch proformas", details: err.message });
    }

    if (!results.length) {
      return res.status(404).json({ error: "No proformas found" });
    }

    console.log({ results });

    const proformasMap: Record<any, any> = {};

    results.forEach((row: any) => {
      console.log("resulsts row: ", row);
      if (!proformasMap[row.proforma_id]) {
        // proformasMap[row.proforma_id] = {
        //   ...row,
        //   products: [],
        // };
        proformasMap[row.proforma_id] = {
          proforma_id: row.proforma_id,
          proforma_date: row.proforma_date,
          place_of_supply: row.place_of_supply,
          grand_total: row.grand_total,
          proforma_number: row.proforma_number,
          customer: {
            customer_id: row.customer_id,
            company_name: row.company_name,
            contact_person: row.contact_person,
            email: row.customer_email,
            city: row.city,
            state: row.state,
            country: row.country,
            address: row.customer_address,
            gstin: row.gstin,
          },
          products: [],
        };
      }
      console.log({ row });
      if (row.product_id) {
        proformasMap[row.proforma_id].products.push({
          id: row.product_id,
          hsn: row.hsn_code,
          product_name: row.product_name,
          product_description: row.description,
          quantity: row.quantity,
          price: row.product_price,
          product_value: row.product_value,
          uom: row.uom,
          discount_amount: row.discount_amount,
          discount_percentage: row.discount_percentage,
          tax_percentage: row.tax_percentage,
          tax_amount: row.tax_amount,
          total: row.product_total,
        });
      }
    });

    console.log({ proformasMap });

    const allProformas = Object.values(proformasMap);

    res.json(allProformas);
  });
};

const calculateProformaTotals = (products: any) => {
  return products.reduce(
    (acc: any, item: any) => {
      const unitPrice = item.price;
      const quantity = item.quantity;
      const discount = item.discount_percentage;
      const tax = item.tax_percentage;

      const discountAmount = (unitPrice * quantity * discount) / 100;
      const taxableAmount = unitPrice * quantity - discountAmount;
      const taxAmount = (taxableAmount * tax) / 100;
      const productTotal = taxableAmount + taxAmount;

      acc.lineItems.push({
        product_id: item.product_id,
        unit_price: unitPrice,
        quantity,
        discount_percentage: discount,
        discount_amount: discountAmount,
        taxable_amount: taxableAmount,
        tax_percentage: tax,
        tax_amount: taxAmount,
        product_total: productTotal,
      });

      acc.grand_total += productTotal;
      acc.tax_amount += taxAmount;

      return acc;
    },
    { grand_total: 0, tax_amount: 0, lineItems: [] }
  );
};
const postUpdateProforma = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    proforma_date,
    proforma_number,
    place_of_supply,
    customer_id,
    products,
  } = req.body;

  // Validation
  if (
    !id ||
    !proforma_date ||
    !place_of_supply ||
    !customer_id ||
    !products?.length
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Calculate totals
  let grand_total = 0;
  let tax_amount = 0;
  const lineItems = products.map((p: any) => {
    const price = Number(p.price);
    const quantity = Number(p.quantity);
    const discount = Number(p.discount_percentage) || 0;
    const tax = Number(p.tax_percentage) || 0;

    const discountAmount = (price * quantity * discount) / 100;
    const taxableAmount = price * quantity - discountAmount;
    const taxAmount = (taxableAmount * tax) / 100;
    const productTotal = taxableAmount + taxAmount;

    grand_total += productTotal;
    tax_amount += taxAmount;

    return [
      id,
      p.product_id,
      price,
      quantity,
      productTotal,
      tax,
      taxAmount,
      discount,
      discountAmount,
      taxableAmount,
    ];
  });

  db.beginTransaction(async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Transaction start failed", details: err.message });
    }

    try {
      // Update proforma header
      // TODO fix this!!!!
      const [updateResult] = db.query(
        `UPDATE proforma SET
          proforma_date = ?,
          proforma_number = ?,
          place_of_supply = ?,
          grand_total = ?,
          tax_amount = ?,
          customer_id = ?,
          updated_by = ?,
          updated_date = ?
        WHERE id = ?`,
        [
          proforma_date,
          proforma_number,
          place_of_supply,
          grand_total,
          tax_amount,
          customer_id,
          123,
          new Date().toISOString().slice(0, 19).replace("T", " "),
          id,
        ],
        (req) => {}
      );

      if (updateResult.affectedRows === 0) {
        await db.rollback();
        return res.status(404).json({ error: "Proforma not found" });
      }

      // Delete existing products
      await db.query("DELETE FROM proforma_product WHERE proforma_id = ?", [
        id,
      ]);

      // Insert new products
      if (lineItems.length > 0) {
        await db.query(
          `INSERT INTO proforma_product (
            proforma_id, product_id, product_price, quantity,
            product_total, tax_percentage, tax_amount,
            discount_percentage, discount_amount, taxable_amount
          ) VALUES ?`,
          [lineItems]
        );
      }

      // Commit transaction
      db.commit();

      res.json({
        success: true,
        message: "Proforma updated successfully",
        proforma_id: id,
        grand_total,
        tax_amount,
      });
    } catch (error) {
      db.rollback();
      console.error("Proforma update error:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: "Something went wrong",
      });
    }
  });
};

const deleteProforma = (req: Request, res: Response) => {
  const { id } = req.params;
  const query = "update proformas set status=2 where id=?";
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
  createProforma,
  getProforma,
  getProformaById,
  postUpdateProforma,
  deleteProforma,
};
