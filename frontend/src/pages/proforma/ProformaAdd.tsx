import { useEffect, useState } from "react";
import { getProducts } from "../../api/productapi";
import Select from "react-select";
import { getCustomer } from "../../api/api";
import useLocationData from "../../selectField/LocationData";
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from "react-hook-form";

import * as modals from "../../modals/Proforma";
import { Uom, Tax } from "../../utils/Constants";
import { calculateRowTotal, numberToWords } from "../../lib/util";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ProformaForm } from "../../component/profroma/proforma-form";
import { ProformaFormInputs } from "../../lib/types";
import { addProforma } from "../../api/proformapi";

export const TaxOptions = [
  {
    label: "0",
    value: 0,
  },
  { label: "5", value: 5 },
  {
    label: "18",
    value: 18,
  },
  {
    label: "22",
    value: 22,
  },
];

const defaultProduct: modals.ProductRow = {
  product: null,
  description: "",
  quantity: 0,
  discount_percentage: 0,
  total: 0,
  tax_percentage: 0,
  tax: 0,
};

export interface SelectOption {
  value: number;
  label: string;
  data?: any;
}

const Proforma: any = () => {
  const navigate = useNavigate();

  const [dropdownProducts, setDrodownProducts] = useState<SelectOption[]>([]);
  const [customers, setCustomers] = useState<SelectOption[]>([]);

  //Fetching Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: rawProducts } = await getProducts();
        const { data: rawCustomers } = await getCustomer();

        const productOptions = rawProducts.map((product: any) => ({
          value: product.id,
          label: product.name,
          data: product, // Include full product details
        }));

        const customerOptions = rawCustomers.map((customer: any) => ({
          value: customer.id,
          label: customer.company_name,
          data: customer,
        }));

        setDrodownProducts(productOptions);
        setCustomers(customerOptions);
      } catch (error: any) {
        console.log({ error });
        // toast.error("Failed to fetch products or customers:", error);
      }
    };

    fetchProducts();
  }, []);

  const onSubmit: SubmitHandler<ProformaFormInputs> = async (data) => {
    console.log({ data });
    try {
      // Prepare products payload
      const productsPayload = data.products.map((product) => ({
        product_id: product.product.id,
        quantity: Number(product.quantity),
        discount_percentage: Number(product.discount_percentage) || 0,
        tax_percentage: Number(product.tax_percentage) || 0,
        price: Number(product.product.price),
      }));

      // Prepare main payload
      const payload = {
        proforma_date: data.proforma_date,
        proforma_number: data.proforma_number,
        place_of_supply: data.place_of_supply,
        customer_id: data.company_id.value,
        products: productsPayload,
      };

      await addProforma(payload);

      // if (response.data.success) {
      toast.success("Proforma created successfully!");
      navigate("/proformaList");
      // }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.error || "Failed to create proforma");
    }
  };

  return (
    <ProformaForm
      onSubmit={onSubmit}
      formType="ADD"
      productOptions={dropdownProducts}
      customerOptions={customers}
    />
  );
};

export default Proforma;
