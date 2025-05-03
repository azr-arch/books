// import "../css/Proforma.css";
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
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  addProforma,
  getProformaById,
  updateProforma,
} from "../../api/proformapi";
import { TaxOptions } from "./ProformaAdd";
import { UOMOptions } from "../../lib/constants";
import { ProformaForm } from "../../component/profroma/proforma-form";
import { ProformaFormInputs } from "../../lib/types";

const defaultProduct: modals.ProductRow = {
  product: null,
  description: "",
  quantity: 1,
  discount_percentage: 0,
  total: 0,
  tax_percentage: 0,
  tax: 0,
};

const calculateRowTotal = ({
  price,
  quantity,
  discount_percentage,
  tax_percentage,
}: any) => {
  const baseAmount = (price || 0) * (quantity || 0);
  const discountAmount = ((discount_percentage || 0) * baseAmount) / 100;
  const taxableAmount = baseAmount - discountAmount;
  const taxAmount = ((tax_percentage || 0) * taxableAmount) / 100;
  return { taxableAmount, taxAmount, grandTotal: taxableAmount + taxAmount };
};

const ProformaEdit: any = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dropdownProducts, setDrodownProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [defaultProforma, setDefaultProforma] = useState<any>({});

  // const alreadySelectedProductIds = watch("products")?.map(
  //   (p) => p.product?.value
  // );
  // const getAvailableProducts = () => {
  //   const data = dropdownProducts.filter(
  //     (prod) => !alreadySelectedProductIds.includes(prod.product_id)
  //   );
  //   return data;
  // };

  const onSubmit: SubmitHandler<ProformaFormInputs> = async (data) => {
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

      console.log({ payload });

      // await updateProforma(id, payload);
      // if (response.data.success) {
      toast.success("Proforma updated successfully!");
      // navigate("/proformaList");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to create proforma");
    }
  };

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

  useEffect(() => {
    if (!id) return;
    const fetchProformaData = async () => {
      try {
        const response = await getProformaById(id);
        const proformaData = response.data[0]; // Assuming array is returned

        console.log({ proformaData });

        // Transform data for form
        const defaultValues = {
          proforma_date: proformaData.proforma_date,
          proforma_number: proformaData.proforma_number,
          place_of_supply: proformaData.place_of_supply,
          company_id: {
            value: proformaData.customer.customer_id,
            label: proformaData.customer.company_name,
          },
          address: proformaData.customer.address,
          contact_person: proformaData.customer.contact_person,
          gstin: proformaData.customer.gstin,
          products: proformaData.products.map((product: any) => ({
            product: {
              value: product.id,
              label: product.product_name,
              data: {
                hsn_code: product.hsn,
                price: product.price,
                uom: product.uom,
                description: product.product_description,
              },
            },
            quantity: product.quantity,
            discount_percentage: product.discount_percentage,
            tax_percentage: product.tax_percentage,
            total: product.total,
          })),
        };

        console.log({ proformaEdit: defaultValues });

        setDefaultProforma(defaultValues);
      } catch (error) {
        toast.error("Failed to load proforma data");
      } finally {
        // setLoading(false);
      }
    };

    fetchProformaData();
  }, [id]);

  return (
    // <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
    //   <div className="container-fluid mb-5 p-3">
    //     <div className="row  mb-3 gap-3 ">
    //       <div className="col-12 text-center">
    //         <h2 className="fs-1">Update Proforma</h2>
    //       </div>
    //     </div>

    //     {/* Custoemr change */}
    //     <div className="row justify-content-between mt-4">
    //       {/* <!-- Customer Details --> */}
    //       <div className="col-md-6 mb-3 shadow-sm d-flex flex-column">
    //         <div className="border-bottom pb-3 mb-3">
    //           <div className="d-flex justify-content-between align-items-center">
    //             <div className="h3">Customer Information</div>
    //           </div>
    //         </div>

    //         {/* <!-- Customer Details Form --> */}
    //         <div className="row mb-1">
    //           <div className="col-md-4">
    //             <label htmlFor="customer">M/S.</label>
    //           </div>
    //           <div className="col-md-8">
    //             <Controller
    //               name="company_name"
    //               control={control}
    //               defaultValue={null}
    //               rules={{ required: "Please select a customer" }}
    //               render={({ field }) => (
    //                 <Select
    //                   {...field}
    //                   options={customerOptions}
    //                   isSearchable
    //                   isClearable
    //                   placeholder="Select a customer..."
    //                   className="basic-single"
    //                   classNamePrefix="select"
    //                   onChange={(selectedOption) => {
    //                     field.onChange(selectedOption);
    //                     handleCustomerChange(selectedOption);
    //                   }}
    //                 />
    //               )}
    //             />
    //           </div>
    //         </div>

    //         <div className="row mb-3">
    //           <div className="col-md-4">
    //             <label htmlFor="address">Address</label>
    //           </div>
    //           <div className="col-md-8">
    //             <Controller
    //               control={control}
    //               name="address"
    //               render={({ field }) => (
    //                 <textarea
    //                   id="address"
    //                   {...field}
    //                   className="form-control"
    //                   placeholder="Enter address"
    //                   value={
    //                     field.value ||
    //                     (formValues
    //                       ? [
    //                           formValues.shipping_address1,
    //                           formValues.shipping_address2,
    //                           formValues.shipping_city_name,
    //                           formValues.shipping_state_name,
    //                           formValues.shipping_country_name,
    //                         ]
    //                           .filter(Boolean)
    //                           .join(", ")
    //                       : "")
    //                   }
    //                   readOnly
    //                 />
    //               )}
    //             />
    //           </div>
    //         </div>

    //         <div className="row mb-3">
    //           <div className="col-md-4">
    //             <label htmlFor="contactPerson">Contact Person</label>
    //           </div>
    //           <div className="col-md-8">
    //             {/* Customer id */}
    //             <input
    //               type="hidden"
    //               {...register("id")}
    //               value={formValues.id}
    //             />
    //             <input
    //               {...register("contact_person", {
    //                 required: "contact person is required",
    //               })}
    //               placeholder="Contact person"
    //               className="form-control"
    //               readOnly
    //             />
    //             {errors.contact_person && (
    //               <small className="text-danger">
    //                 {errors.contact_person.message}
    //               </small>
    //             )}
    //           </div>
    //         </div>

    //         <div className="row mb-3">
    //           <div className="col-md-4">
    //             <label htmlFor="gstin">GSTIN/PAN</label>
    //           </div>
    //           <div className="col-md-8">
    //             <input
    //               type="text"
    //               {...register("gstin", {
    //                 required: "GSTIN is required",
    //                 // value: formValues.contact_person,
    //               })}
    //               defaultValue={formValues.gstin}
    //               className="form-control "
    //               placeholder="GSTIN/PAN"
    //               readOnly
    //               // required
    //             />

    //             {errors.gstin && (
    //               <small className="text-danger">{errors.gstin.message}</small>
    //             )}
    //           </div>
    //         </div>

    //         <div className="row mb-3">
    //           <div className="col-md-4">
    //             <label htmlFor="placeOfSupply">Place of Supply</label>
    //           </div>
    //           <div className="col-md-8">
    //             <input
    //               type="text"
    //               className="form-control"
    //               placeholder="Place of Supply"
    //               {...register("place_of_supply", {
    //                 required: "Place of supply is required",
    //               })}
    //               onChange={(e) => setValue("place_of_supply", e.target.value)}
    //             />

    //             {errors.place_of_supply && (
    //               <small className="text-danger">
    //                 {errors.place_of_supply.message}
    //               </small>
    //             )}
    //           </div>
    //         </div>
    //       </div>

    //       {/* <!-- Proforma Details --> */}
    //       <div className="col-md-6  ">
    //         <div className="h5 mb-3">Proforma Detail</div>

    //         <div className="row">
    //           {/* <!-- Left Side --> */}
    //           <div className="col-md-12">
    //             <div className="row mb-3">
    //               <div className="col-md-4">
    //                 <label htmlFor="date">Date</label>
    //               </div>
    //               <div className="col-md-8">
    //                 <input
    //                   {...register("proforma_date", {
    //                     required: "proforma date  is required",
    //                   })}
    //                   type="date"
    //                   id="date"
    //                   className="form-control form-control-sm w-50"
    //                 />
    //                 {typeof errors.proforma_date?.message === "string" && (
    //                   <small className="text-danger">
    //                     {errors.proforma_date.message}
    //                   </small>
    //                 )}
    //               </div>
    //             </div>
    //             <div className="row mb-3">
    //               <div className="col-md-4">
    //                 <label htmlFor="date">Proforma No.</label>
    //               </div>
    //               <div className="col-md-8 d-flex">
    //                 <input
    //                   readOnly
    //                   type="text"
    //                   {...register("proforma_number", {
    //                     required: "proforma number is required",
    //                   })}
    //                 />
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         <hr />
    //       </div>
    //     </div>

    //     <div className="row justify-content-start">
    //       <div className="col-3">Product Items</div>
    //     </div>

    //     <div className="row mt-4">
    //       <div className="col-md-12 col-sm-12 ">
    //         <div className="table-responsive">
    //           <table className="table table-bordered">
    //             <thead>
    //               <tr>
    //                 <th>SR.No</th>
    //                 <th scope="col">PRODUCT / OTHER CHARGES</th>
    //                 <th scope="col">HSN/SAC CODE</th>
    //                 <th scope="col">QTY.</th>
    //                 <th scope="col">UOM</th>
    //                 <th scope="col">PRICE(RS)</th>
    //                 <th scope="col">DISCOUNT</th>
    //                 <th scope="col">IGST </th>
    //                 <th style={{ width: "10%" }}>Total</th>
    //                 <th>actions</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {fields.map((profomaItem, idx) => {
    //                 console.log({ profomaItem });
    //                 return (
    //                   <tr key={idx}>
    //                     <td>{idx + 1}</td>
    //                     <td className="d-flex flex-column gap-2">
    //                       <Controller
    //                         control={control}
    //                         name={`products.${idx}.product`}
    //                         rules={{ required: "Product is required" }}
    //                         render={({ field, fieldState }) => (
    //                           <>
    //                             <Select
    //                               {...field}
    //                               options={getAvailableProducts()}
    //                               placeholder="Select a product..."
    //                               onChange={(option) =>
    //                                 handleProductSelect(option, idx)
    //                               }
    //                               classNamePrefix="select"
    //                             />

    //                             {fieldState.error && (
    //                               <p className="text-danger mt-1">
    //                                 {fieldState.error.message}
    //                               </p>
    //                             )}
    //                           </>
    //                         )}
    //                       />
    //                       <textarea
    //                         {...register(`products.${idx}.description`)}
    //                         style={{ backgroundColor: "lightyellow" }}
    //                         className="form-control mt-2"
    //                         placeholder="Item note (optional)"
    //                       ></textarea>

    //                       {errors.products?.[idx]?.product?.message && (
    //                         <small className="text-danger">
    //                           {String(errors.products[idx]?.product?.message)}
    //                         </small>
    //                       )}
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="text"
    //                         className="form-control"
    //                         {...register(`products.${idx}.product.hsn_code`)}
    //                         readOnly
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="number"
    //                         className="form-control"
    //                         {...register(`products.${idx}.quantity`, {
    //                           required: "Quantity is required",
    //                           min: { value: 1, message: "At least 1 item" },
    //                           onChange: () => updateRowTotal(idx),
    //                         })}
    //                         min={1}
    //                       />
    //                       {errors.products?.[idx]?.quantity && (
    //                         <small className="text-danger">
    //                           {errors.products[idx]?.quantity?.message}
    //                         </small>
    //                       )}
    //                     </td>
    //                     <td>
    //                       <Controller
    //                         control={control}
    //                         name={`products.${idx}.product.uom`}
    //                         rules={{ required: "uom is required" }}
    //                         render={({ field, fieldState }) => (
    //                           <>
    //                             <Select
    //                               {...field}
    //                               options={UOMOptions}
    //                               isClearable
    //                               placeholder="Select UOM"
    //                               classNamePrefix="select"
    //                               onChange={(selectedOption) =>
    //                                 field.onChange(selectedOption?.value)
    //                               }
    //                               value={UOMOptions.find(
    //                                 (option) => option.value === field.value
    //                               )}
    //                             />

    //                             {fieldState.error && (
    //                               <p className="text-danger mt-1">
    //                                 {fieldState.error.message}
    //                               </p>
    //                             )}
    //                           </>
    //                         )}
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="text"
    //                         className="form-control"
    //                         {...register(
    //                           `products.${idx}.product.price` as const
    //                         )}
    //                         readOnly
    //                       />
    //                     </td>
    //                     <td>
    //                       <input
    //                         type="number"
    //                         className="form-control"
    //                         min={0}
    //                         {...register(
    //                           `products.${idx}.discount_percentage`,
    //                           {
    //                             onChange: () => updateRowTotal(idx),
    //                           }
    //                         )}
    //                       />
    //                     </td>
    //                     <td>
    //                       <Controller
    //                         control={control}
    //                         name={`products.${idx}.tax_percentage`}
    //                         rules={{ required: "Tax is required" }}
    //                         render={({ field, fieldState }) => (
    //                           <>
    //                             <Select
    //                               {...field}
    //                               options={TaxOptions}
    //                               isClearable
    //                               placeholder="Select Tax"
    //                               classNamePrefix="select"
    //                               onChange={(option) => {
    //                                 console.log("fiel val: ", field.value);
    //                                 handleTaxSelect(option, idx, field);
    //                               }}
    //                               value={TaxOptions.find(
    //                                 (tax) => tax.value === field.value
    //                               )}
    //                             />

    //                             {fieldState.error && (
    //                               <p className="text-danger mt-1">
    //                                 {fieldState.error.message}
    //                               </p>
    //                             )}
    //                           </>
    //                         )}
    //                       />
    //                     </td>
    //                     <td>
    //                       {/* {profomaItem.total.toFixed(2)} */}
    //                       {watch(`products.${idx}.total`)?.toFixed(2)}
    //                     </td>
    //                     <td className=" flex-column gap-2">
    //                       {idx === 0 ? (
    //                         // First row - only show Add button
    //                         <button
    //                           type="button"
    //                           onClick={handleAddRow}
    //                           className="btn btn-primary border rounded"
    //                         >
    //                           Add
    //                         </button>
    //                       ) : (
    //                         // Other rows - show both Add and Delete buttons
    //                         <>
    //                           <button
    //                             type="button"
    //                             onClick={handleAddRow}
    //                             className="btn btn-primary border rounded"
    //                           >
    //                             Add
    //                           </button>
    //                           <button
    //                             type="button"
    //                             onClick={() => handleRemoveRow(idx)}
    //                             className="btn btn-danger border rounded"
    //                           >
    //                             Delete
    //                           </button>
    //                         </>
    //                       )}
    //                     </td>
    //                   </tr>
    //                 );
    //               })}
    //               <tr className="bg-warning table-warning">
    //                 <td>Total Proforma Value</td>
    //                 <td></td>
    //                 <td>0</td>

    //                 <td></td>
    //                 <td>0</td>
    //                 <td>0</td>
    //                 <td>0</td>
    //                 <td>0</td>
    //                 <td></td>
    //               </tr>
    //             </tbody>
    //           </table>
    //           {errors.products && (
    //             <div className="text-danger">
    //               At least one product must be selected and all fields are
    //               required
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>

    //     {/* updated row */}
    //     <div className="row justify-content-between">
    //       <div className="col-lg-5"></div>

    //       {/* Right Side */}
    //       <div className="col-lg-5">
    //         <div className="row mb-3 justify-content-between">
    //           <div className="col-5 fw-semibold">Total Taxable</div>
    //           <div className="col-5 text-end">₹{totalTaxable.toFixed(2)}</div>
    //         </div>

    //         <div className="row mb-3 justify-content-between">
    //           <div className="col-5 fw-semibold">Total Tax</div>
    //           <div className="col-5 text-end">₹{totalTax.toFixed(2)}</div>
    //         </div>

    //         <hr />

    //         {/* Round Off */}
    //         <div className="row mb-3 justify-content-between"></div>

    //         {/* Grand Total */}
    //         <div className="row mb-3 bg-warning p-2 rounded justify-content-between">
    //           <div className="col-6 fw-bold">Grand Total</div>
    //           <div className="col-5 fw-bold text-end">
    //             ₹{grandTotal.toFixed(2)}
    //           </div>
    //         </div>

    //         <div className="row">
    //           <div className="col-12">
    //             <div className="fw-semibold">Total in Words</div>
    //             {/* TODO: FIX OVERFLOW */}
    //             {/* <div className="text-muted">{numberToWords(grandTotal)}</div> */}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* updated row */}

    //     <hr />
    //     {/* last row button back discard */}
    //     <div className="row">
    //       <div className="col-md-12">
    //         <div className="d-flex justify-content-end gap-5">
    //           <div>
    //             <button
    //               type="submit"
    //               className="btn btn-success"
    //               disabled={!isDirty}
    //             >
    //               Save
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* <-- This closes container-fluid */}
    // </form>

    <ProformaForm
      onSubmit={onSubmit}
      formType="EDIT"
      productOptions={dropdownProducts}
      customerOptions={customers}
      defaultValues={defaultProforma}
    />
  );
};

export default ProformaEdit;
