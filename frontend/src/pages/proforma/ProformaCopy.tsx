import "../css/Proforma.css";
import { useEffect, useState } from "react";
import { getProducts } from "../../api/productapi";
import Select from "react-select";
import dayjs from "dayjs";
import { addProforma, getCustomer } from "../../api/api";
import useLocationData from "../../selectField/LocationData";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import numWords from "num-words";
import { log } from "console";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import { Grid } from "@mui/material";

interface IProps {
  id: any;
  product_name: string;
  product_id?: number | any;
  proforma_date?: any;
  prefix?: any;
  number?: any;
  postfix?: any;
  itemNote: string | any;
  hsn_code: string;
  qty: number;
  uom: string;
  price: number;
  discount: number;
  tax: string;
  total: number;
}

interface Product {
  product_id: number;
  product_name: string;
  value: number;
  label: string;
  company_name?: string | any;
  id?: number | any;
  price: number | any;
  hsn_code: string;
}

interface SelectOption {
  value: number;
  label: string;
  company_name?: string | any;
  id?: number | any;
  price: number | any;
}

interface FormInputs {
  id: string;
  gstin: string;
  contact_person: string;
  pan?: string;
  proforma_date: any;
  prefix: any;
  number: any;
  postfix: any;
  shipping_address1: string;
  shipping_address2: string;
  shipping_landmark: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_pincode: string;
  phone_no: string | number;
  place_of_supply: string;
}

const Proforma: any = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm<FormInputs>();

  const [product, setProduct] = useState({
    product_id: "",
    product_name: "",
    value: "",
    label: "",
    company_name: "",
    id: "",
    price: "",
    hsn_code: "",
  });

  const [productsWithInfo, setProductsWithInfo] = useState<Product[]>([]);
  const [products, setProducts] = useState<SelectOption[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [optcustomer, setoptcustomer] = useState<SelectOption[]>([]);
  const [prefix, setPrefix] = useState("");
  const [number, setNumber] = useState("");
  const [postfix, setPostfix] = useState("");
  const [grandTotal, setGrandTotal] = useState(0);
  const grandTotalInWords = numWords(grandTotal);

  const [data, setData] = useState<any>({
    proforma_id: "",
    profarma_date: "",
    customer: {
      id: "",
      address: "",
      phone_no: "",
      place_of_supply: "",
    },
    products: [
      {
        product_id: "",
        hsn: "",
        qty: "",
        uom_id: "",
        price: "",
        discount: "",
        tax_id: "",
        total: "",
      },
    ],
  });

  const [formValues, setFormValues] = useState({
    id: "",
    company_name: "",
    contact_person: "",
    gstin: "",
    pan: "",
    proforma_date: "",
    proforma_no: "",
    prefix: "",
    postfix: "",
    number: "",
    shipping_country_name: "",
    shipping_state_name: "",
    shipping_city_name: "",
    shipping_address1: "",
    shipping_address2: "",
    phone_no: "",
    place_of_supply: "",
    address: "",
  });

  const [customerData, setCustomerData] = useState({
    address: "",
    customer_id: "",
    phone_no: "",
    place_of_supply: "",
    gstin: "",
    contact_person: "",
    company_name: "",
  });

  const [rows, setRows] = useState<IProps[]>([
    {
      id: "",
      product_name: "",
      hsn_code: "",
      itemNote: "",
      proforma_date: "",
      prefix: "",
      postfix: "",
      number: "",
      qty: 0,
      uom: "",
      price: 0,
      discount: 0,
      tax: "",
      total: 0,
    },
  ]);

  const { countries, states, cities } = useLocationData();

  const handleCustomerChange = (selectedOption: any) => {
    if (!selectedOption) return;

    const selectedCustomer = customers.find(
      (cust: any) => String(cust.id) === String(selectedOption.value)
    );

    if (!selectedCustomer) return;

    const shippingCountryName =
      countries.find((c) => String(c.id) === selectedCustomer.shipping_country)
        ?.name || "";

    const shippingStateName =
      states.find((s) => String(s.id) === selectedCustomer.shipping_state)
        ?.name || "";

    const shippingCityName =
      cities.find((ct) => String(ct.id) === selectedCustomer.shipping_city)
        ?.name || "";

    const fullAddress = `${selectedCustomer.shipping_address1 || ""}, ${
      selectedCustomer.shipping_address2 || ""
    }, ${shippingCityName}, ${shippingStateName}, ${shippingCountryName}`;

    // Update form values dynamically
    setValue("id", selectedCustomer.id); // 👈 Add this
    setValue("phone_no", selectedCustomer.phone_no || "");
    setValue("contact_person", selectedCustomer.contact_person || "");
    setValue("gstin", selectedCustomer.gstin || "");

    // Optional: Store form values locally if needed for rendering
    console.log({ selectedCustomer });
    setFormValues({
      ...selectedCustomer,
      shipping_country_name: shippingCountryName,
      shipping_state_name: shippingStateName,
      shipping_city_name: shippingCityName,
      shipping_address1: selectedCustomer.shipping_address1 || "",
      shipping_address2: selectedCustomer.shipping_address2 || "",
      address: fullAddress,
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await getProducts();
        const rawProducts = productsResponse.data;
        setProduct(rawProducts);
        const formattedProductsOptions = rawProducts.map(
          (product: Product) => ({
            value: product.product_id,
            label: product.product_name,
            price: product.price,
            hsn_code: product.hsn_code,
          })
        );
        console.log("formatted", formattedProductsOptions);
        setProductsWithInfo(rawProducts);
        setProducts(formattedProductsOptions);

        const customerResponse = await getCustomer();
        const rawCustomers = customerResponse.data.data;
        console.log("cr", customerResponse);
        const formattedCustomers = rawCustomers.map((customer: any) => ({
          value: customer.id,
          label: customer.company_name,
        }));
        setCustomers(rawCustomers);
        setoptcustomer(formattedCustomers);
      } catch (error) {
        console.error("Failed to fetch products or customers:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: "",
        product_name: "",
        hsn_code: "",
        itemNote: "",
        qty: 0,
        uom: "",
        price: 0,
        discount: 0,
        tax: "",
        total: 0,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (index === 0) return;
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const handleProductSelect = (selectedOption: any, idx: number) => {
    console.log(selectedOption);
    const updatedRows = [...rows];
    updatedRows[idx].product_id = selectedOption ? selectedOption.value : null;

    if (selectedOption) {
      console.log({ selectedOption, productsWithInfo });
      // Fill price and HSN code based on selected product
      const selectedProduct = productsWithInfo.find(
        (product) => product.product_id === selectedOption.value
      );
      updatedRows[idx].price = selectedProduct ? selectedProduct.price : 0;
      updatedRows[idx].hsn_code = selectedProduct?.hsn_code
        ? selectedProduct.hsn_code
        : "";
      updatedRows[idx].qty = 1;

      // Recalculate total
      updatedRows[idx].total = updatedRows[idx].price * updatedRows[idx].qty;

      console.log({ updatedRows });
    }

    setRows(updatedRows);
  };

  const handleQtyChange = (e: any, idx: number) => {
    const updatedRows = [...rows];
    updatedRows[idx].qty = parseInt(e.target.value) || 0;
    updatedRows[idx].total = updatedRows[idx].price * updatedRows[idx].qty;
    setRows(updatedRows);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formattedWords = grandTotalInWords.replace(/\b\w/g, (c) =>
    c.toUpperCase()
  );

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const selectedRows = rows.filter((row) => row.product_id);
    console.log("selected", selectedRows);
    const selectedProducts = selectedRows
      .filter((row) => row.product_id)
      .map((row) => row.product_id);
    const proformaNo = `${data.prefix}${data.number}${data.postfix}`;

    // Calculate grand total
    const grandTotal = selectedRows.reduce(
      (acc, row) => acc + (row.price || 0) * (row.qty || 0),
      0
    );
    setGrandTotal(grandTotal);

    const newValues = {
      customer_id: data.id,
      phone_no: data.phone_no,
      place_of_supply: data.place_of_supply,
      proforma_date: data.proforma_date,
      proforma_no: proformaNo,
      total_tax: 10,
      grand_total: grandTotal,
      products: selectedProducts,
    };

    const userData = {
      proforma_date: data.proforma_date,
      place_of_supply: data.place_of_supply,
      grand_total: grandTotal,
      total_tax: newValues.total_tax,
      customer: {
        id: customerData.customer_id,
        phone_no: data.phone_no,
        place_of_supply: data.place_of_supply,
      },
      products: [
        {
          product_id: product.id,
          product_name: product.product_name,

          hsn_code: product.hsn_code,
          UOM: 0,
          price: product.price,

          status: 1,
        },
      ],
    };
    console.log("ur in submit");
    addProforma(userData)
      .then((res) => {
        console.log(res);
        console.log(userData);
        alert("proforma added successfully!");
        reset();
      })
      .catch((error) => {
        console.error("Error adding proforma:", error);
        alert(error);
      });
  };
  console.log("product", product);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="container-fluid mb-5 p-3">
          <div className="row  mb-3 gap-3 ">
            <div className="col-12 text-center">
              <h2 className="fs-1">Create Proforma</h2>
            </div>
          </div>

          <div className="row justify-content-between mt-4">
            {/* <!-- Customer Details --> */}
            <div className="col-md-6 mb-3 shadow-sm d-flex flex-column">
              <div className="border-bottom pb-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="h3">Customer Information</div>
                </div>
              </div>

              {/* <!-- Customer Details Form --> */}
              <div className="row mb-1">
                <div className="col-md-4">
                  <label htmlFor="customer">M/S.</label>
                </div>
                <div className="col-md-8">
                  <Select
                    options={optcustomer}
                    // value={
                    //   customers.map((option: any) => option.company_name) || null
                    // }
                    onChange={(selectedOption: any) => {
                      console.log("Selected option:", selectedOption); //
                      handleCustomerChange(selectedOption);
                    }}
                    isSearchable
                    isClearable
                    placeholder="Select a customer..."
                    className="basic-single"
                    classNamePrefix="select"
                    // required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="address">Address</label>
                </div>
                <div className="col-md-8">
                  <textarea
                    id="address"
                    className="form-control "
                    placeholder="Enter address"
                    value={
                      formValues &&
                      `${formValues.shipping_address1},${formValues.shipping_address2},${formValues.shipping_city_name}, ${formValues.shipping_state_name}, ${formValues.shipping_country_name}`
                    }
                    // required
                  ></textarea>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="contactPerson">Contact Person</label>
                </div>
                <div className="col-md-8">
                  {/* Customer id */}
                  <input
                    type="hidden"
                    {...register("id")}
                    value={formValues.id}
                  />
                  <input
                    {...register("contact_person", {
                      required: "contact person is required",
                      // value: formValues.contact_person,
                    })}
                    placeholder="Contact person"
                    className="form-control"
                  />
                  {errors.contact_person && (
                    <small className="text-danger">
                      {errors.contact_person.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="phone2">Phone No</label>
                </div>
                <div className="col-md-8">
                  <input
                    {...register("phone_no", {
                      required: "Phone number is required",
                      // value: formValues.contact_person,
                    })}
                    type="text"
                    className="form-control "
                    placeholder="Phone No"
                    // required
                  />

                  {errors.phone_no && (
                    <small className="text-danger">
                      {errors.phone_no.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="gstin">GSTIN/PAN</label>
                </div>
                <div className="col-md-8">
                  <input
                    type="text"
                    {...register("gstin", {
                      required: "GSTIN is required",
                      // value: formValues.contact_person,
                    })}
                    defaultValue={formValues.gstin}
                    className="form-control "
                    placeholder="GSTIN/PAN"
                    // required
                  />

                  {errors.gstin && (
                    <small className="text-danger">
                      {errors.gstin.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label htmlFor="placeOfSupply">Place of Supply</label>
                </div>
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Place of Supply"
                    {...register("place_of_supply", {
                      required: "Place of supply is required",
                    })}
                    onChange={(e) =>
                      setValue("place_of_supply", e.target.value)
                    }
                  />

                  {errors.place_of_supply && (
                    <small className="text-danger">
                      {errors.place_of_supply.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* <!-- Proforma Details --> */}
            <div className="col-md-6  ">
              <div className="h5 mb-3">Proforma Detail</div>

              <div className="row">
                {/* <!-- Left Side --> */}
                <div className="col-md-12">
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="date">Date</label>
                    </div>
                    <div className="col-md-8">
                      <input
                        {...register("proforma_date", {
                          required: "proforma date  is required",
                        })}
                        type="date"
                        id="date"
                        className="form-control form-control-sm w-50"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="date">Proforma No.</label>
                    </div>
                    <div className="col-md-8 d-flex">
                      <input
                        type="text"
                        {...register("prefix", {
                          required: "proforma number is required",
                        })}
                        className="form-control form-control-sm w-25 "
                        placeholder="prefix"
                      />
                      <input
                        {...register("number", {
                          required: "proforma number is required",
                        })}
                        type="text"
                        className="form-control w-25"
                      />
                      <input
                        {...register("postfix", {
                          required: "proforma number is required",
                        })}
                        type="text"
                        className=" form-control w-25"
                        placeholder="postfix"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr />
            </div>
          </div>

          {/* proforma calculartion table */}

          {/* proforma calculation end */}

          <div className="row justify-content-start">
            <div className="col-3">Product Items</div>
          </div>

          {/* proforma detail second table */}

          <div className="row mt-4">
            <div className="col-md-12 col-sm-12 ">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>SR.No</th>
                      <th scope="col">PRODUCT / OTHER CHARGES</th>
                      <th scope="col">HSN/SAC CODE</th>
                      <th scope="col">QTY.</th>
                      <th scope="col">UOM</th>
                      <th scope="col">PRICE(RS)</th>
                      <th scope="col">DISCOUNT</th>
                      <th scope="col">IGST </th>
                      <th style={{ width: "10%" }}>Total</th>
                      <th>actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td className="d-flex flex-column gap-2">
                          <Select
                            options={products}
                            value={
                              products.find(
                                (option) => option.value === row.product_id
                              ) || null
                            }
                            onChange={(option) =>
                              handleProductSelect(option, idx)
                            }
                            isSearchable
                            isClearable
                            placeholder="Select a product..."
                            className="basic-single"
                            classNamePrefix="select"
                          />
                          <textarea
                            style={{ backgroundColor: "lightyellow" }}
                            className="form-control"
                            placeholder="item note"
                          ></textarea>
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="HSN/SAC CODE"
                            defaultValue={row.hsn_code}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="quantity"
                            value={row.qty}
                            onChange={(e) => handleQtyChange(e, idx)}
                          />
                        </td>
                        <td>
                          <Select
                            onChange={(selectedOption: any) => {
                              console.log("Selected option:", selectedOption); //
                              handleCustomerChange(selectedOption);
                            }}
                            isSearchable
                            isClearable
                            placeholder="Select a customer..."
                            className="basic-single"
                            classNamePrefix="select"
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="price"
                            value={row.price}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="discount"
                          />
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            aria-label=".form-select-sm example"
                          >
                            <option selected>...</option>
                            <option value="1">CGST + SGST</option>
                            <option value="2">IGST</option>
                          </select>
                        </td>
                        <td>{row.total.toFixed(2)}</td>
                        <td className=" flex-column gap-2">
                          {idx === 0 ? (
                            // First row - only show Add button
                            <button
                              type="button"
                              onClick={handleAddRow}
                              className="btn btn-primary border rounded"
                            >
                              Add
                            </button>
                          ) : (
                            // Other rows - show both Add and Delete buttons
                            <>
                              <button
                                type="button"
                                onClick={handleAddRow}
                                className="btn btn-primary border rounded"
                              >
                                Add
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(idx)}
                                className="btn btn-danger border rounded"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-warning table-warning">
                      <td></td>
                      <td>Total Proforma Value</td>
                      <td></td>
                      <td>0</td>

                      <td></td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* updated row */}
          <div className="row justify-content-between">
            {/* Left Side: Proforma Calculation */}
            <div className="col-lg-5">
              {/* Completion Date */}

              {/* Select Menu */}

              {/* Notes Section */}
            </div>

            {/* Right Side */}
            <div className="col-lg-5">
              <div className="row mb-3 justify-content-between">
                <div className="col-5 fw-semibold">Total Taxable</div>
                <div className="col-5 text-end">0</div>
              </div>

              <div className="row mb-3 justify-content-between">
                <div className="col-5 fw-semibold">Total Tax</div>
                <div className="col-5 text-end">0</div>
              </div>

              <hr />

              {/* Round Off */}
              <div className="row mb-3 justify-content-between"></div>

              {/* Grand Total */}
              <div className="row mb-3 bg-warning p-2 rounded justify-content-between">
                <div className="col-6 fw-bold">Grand Total</div>
                <div className="col-5 fw-bold text-end">{grandTotal}</div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="fw-semibold">Total in Words</div>
                  <div className="text-muted">{formattedWords}</div>
                </div>
              </div>
            </div>
          </div>

          {/* updated row */}

          <hr />
          {/* last row button back discard */}
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex justify-content-end gap-5">
                <div>
                  <button type="submit" className="btn btn-success">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <-- This closes container-fluid */}
      </form>
      <FormControl>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input
          id="my-input"
          aria-describedby="my-helper-text"
          sx={{ width: 4 / 4 }}
        />
        <FormHelperText id="my-helper-text">
          We'll never share your email.
        </FormHelperText>
      </FormControl>
    </>
  );
};

export default Proforma;
