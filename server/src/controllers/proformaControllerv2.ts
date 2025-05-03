import { Request, Response } from "express";
import db from "../../config/db";
import dayjs from "dayjs";
import moment from "moment";

export const createProforma = (req: Request, res: Response) => {
  const { proforma_date, place_of_supply, customer, products } = req.body;

  // 1. Enhanced Validation
  if (!proforma_date || !place_of_supply || !customer?.id) {
    return res.status(400).json({ error: "Missing required header fields" });
  }

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Invalid or empty products array" });
  }

  // 2. Validate product structure
  const invalidProducts = products.filter(
    (p) => !p.product?.id || !p.quantity || !p.product.price
  );

  if (invalidProducts.length > 0) {
    return res.status(400).json({
      error:
        "Invalid product structure in items: " + invalidProducts.join(", "),
    });
  }

  // 3. Calculate totals
  let grand_total = 0;
  let tax_amount = 0;

  const productValues = products.map((p) => {
    const unitPrice = parseFloat(p.product.price);
    const quantity = parseInt(p.quantity);
    const discountPercentage = parseFloat(p.discount_percentage) || 0;
    const taxPercentage = parseFloat(p.tax_percentage) || 0;

    // Calculate values based on schema requirements
    const discountAmount = (unitPrice * quantity * discountPercentage) / 100;
    const taxableAmount = unitPrice * quantity - discountAmount;
    const taxAmount = (taxableAmount * taxPercentage) / 100;
    const productTotal = taxableAmount + taxAmount;

    // Update totals
    grand_total += productTotal;
    tax_amount += taxAmount;

    return [
      null, // proforma_id will be set later
      p.product.id,
      unitPrice,
      quantity,
      productTotal,
      taxPercentage,
      taxAmount,
      discountPercentage,
      discountAmount,
      taxableAmount,
    ];
  });

  // 4. Database operations
  db.beginTransaction((err: any) => {
    if (err) return res.status(500).json({ error: "Transaction start failed" });

    // Insert proforma header
    const proformaQuery = `
        INSERT INTO proforma (
            proforma_date, place_of_supply, grand_total, tax_amount,
            customer_id, created_by, created_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)
        `;

    const userId = 123; // For dummy usage

    const proformaParams = [
      proforma_date,
      place_of_supply,
      grand_total,
      tax_amount,
      customer.id,
      userId, // Assuming authenticated user
    ];

    db.query(proformaQuery, proformaParams, (err, result) => {
      if (err) {
        return db.rollback(() =>
          res.status(500).json({
            error: "Proforma creation failed",
            details: err.sqlMessage,
          })
        );
      }

      // Add proforma_id to product values
      const proformaId = result.insertId;
      const finalProductValues = productValues.map((p) => [
        proformaId,
        ...p.slice(1),
      ]);

      // TODO add product_value -> quantity * price
      // Insert products
      const productsQuery = `
            INSERT INTO proforma_product (
            proforma_id, product_id, product_price, quantity,
            product_total, tax_percentage, tax_amount,
            discount_percentage, discount_amount, taxable_amount
            ) VALUES ?
        `;

      db.query(productsQuery, [finalProductValues], (err) => {
        if (err) {
          return db.rollback(() =>
            res.status(500).json({
              error: "Product insertion failed",
              details: err.sqlMessage,
            })
          );
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() =>
              res.status(500).json({
                error: "Commit failed",
                details: err.sqlMessage,
              })
            );
          }

          res.status(201).json({
            success: true,
            proforma_id: proformaId,
            grand_total,
            tax_amount,
          });
        });
      });
    });
  });
};
