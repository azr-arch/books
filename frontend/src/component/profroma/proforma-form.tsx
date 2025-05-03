import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  ProformaFormInputs,
  ProformaProductRow,
  SelectOptionProduct,
} from "../../lib/types";
import { useNavigate } from "react-router-dom";
import useLocationData from "../../selectField/LocationData";
import { useEffect, useState } from "react";
import { calculateRowTotal, isObjectEmpty } from "../../lib/util";
import Select from "react-select";
import { SelectOption } from "../../pages/proforma/ProformaAdd";
import { ProductRow } from "./product-row";
import { DatePicker } from "@mui/x-date-pickers";

const defaultProduct: ProformaProductRow = {
  product: {
    price: 0,
  },
  quantity: 0,
  discount_percentage: 0,
  total: 0,
  tax_percentage: 0,
};

interface ProformaFormProps {
  onSubmit: SubmitHandler<ProformaFormInputs>;
  defaultValues?: Partial<ProformaFormInputs>;
  formType: "EDIT" | "ADD";
  productOptions: SelectOptionProduct[];
  customerOptions?: any[];
}

export const ProformaForm: React.FC<ProformaFormProps> = ({
  onSubmit,
  defaultValues = {},
  formType,
  productOptions,
  customerOptions,
}) => {
  const [totalSummary, setTotalSummary] = useState({
    totalTax: 0,
    grandTotal: 0,
  });

  const { getLocationNames } = useLocationData();
  const isEditForm = !isObjectEmpty(defaultValues);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<ProformaFormInputs>({
    defaultValues: {
      ...defaultValues,
      // products: defaultValues.products! || [defaultProduct],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  console.log({ fields });

  // const handleCustomerSelect = (option: any) => {
  //   if (!customerOptions) return;
  //   console.log({ option, customerOptions });
  //   const selectedCustomer = customerOptions.find(
  //     (customer) => customer.data.id === option.value
  //   );

  //   if (!selectedCustomer) {
  //     console.log("Selected customer doenst exists in Customer data");
  //   }

  //   // Set address (combination of shipping address city country state and pincode) and other fields when customer changes
  // };

  const handleCustomerSelect = (option: any) => {
    if (!customerOptions) return;

    const { cityName, stateName, countryName } = getLocationNames(
      option.data.shipping_city,
      option.data.shipping_state,
      option.data.shipping_country
    );
    const address = `${option.data.shipping_address1}, ${
      option.data.shipping_address2
    }, ${cityName || ""}, ${stateName || ""}, ${countryName || ""}, ${
      option.data.shipping_pincode
    }`;

    console.log({ address });

    setValue("address", address);
    setValue("contact_person", option.data.contact_person);
    setValue("gstin", option.data.gstin || option.data.pan);
  };

  // const alreadySelectedProductIds = watch("products")?.map((p) => p.product.id);
  // const getAvailableProducts = () => {
  //   const data = productDropdownOptions.filter(
  //     (prod) => !alreadySelectedProductIds.includes(prod)
  //   );
  //   return data;
  // };

  // Not working properly
  // const handleTaxSelect = (selectedOption: any, index: number, field: any) => {
  //   console.log(selectedOption?.value);
  //   field.onChange(selectedOption?.value);
  //   if (selectedOption) {
  //     setValue(`products.${index}.tax_percentage`, selectedOption?.value);
  //   } else {
  //     setValue(`products.${index}.tax_percentage`, 0);
  //   }
  //   updateRowTotal(index);
  // };

  const handleAddRow = () => {
    append(defaultProduct);
  };

  // To be implemented
  // const handleProductSelect = (option: any, idx: number) => {};
  // const handleRemoveRow = (index: number) => {
  //   if (fields.length > 1) {
  //     remove(index);
  //   }
  // };

  // The calculation isnt correct, it doesnt change when changing select the very first thing
  // const updateRowTotal = (index: number) => {
  //   const product = watch(`products.${index}.product`) || {};
  //   const quantity = watch(`products.${index}.quantity`) || 1;
  //   const discount_percentage =
  //     watch(`products.${index}.discount_percentage`) || 0;
  //   // const taxObj = product.tax || { value: 0 };
  //   const tax_percentage = watch(`products.${index}.tax_percentage`) || 0;
  //   console.log({ tax_percentage });

  //   const { grandTotal } = calculateRowTotal({
  //     price: product.price || 0,
  //     quantity,
  //     discount_percentage,
  //     tax_percentage,
  //   });

  //   console.log({ grandTotal });

  //   setValue(`products.${index}.total`, grandTotal);
  // };

  useEffect(() => {
    if (!isObjectEmpty(defaultValues)) {
      console.log({ proformaForm: defaultValues.products });
      reset({
        ...defaultValues,
        products: defaultValues.products,
      });
    }
  }, [defaultValues, formType]);

  const calculateTotals = () => {
    const products = watch("products") || [];

    return products.reduce(
      (acc, product) => {
        const price = parseFloat(product.product?.price) || 0;
        const quantity = parseFloat(product.quantity) || 0;
        const discount = parseFloat(product.discount_percentage) || 0;
        const tax = parseFloat(product.tax_percentage) || 0;

        const subtotal = price * quantity;
        const discountAmount = (subtotal * discount) / 100;
        const taxable = subtotal - discountAmount;
        const taxAmount = (taxable * tax) / 100;

        acc.totalTaxable += taxable;
        acc.totalDiscount += discountAmount;
        acc.totalTax += taxAmount;
        acc.grandTotal += taxable + taxAmount;

        return acc;
      },
      {
        totalTaxable: 0,
        totalDiscount: 0,
        totalTax: 0,
        grandTotal: 0,
      }
    );
  };

  const summary = calculateTotals();

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="container-fluid mb-5 p-3">
        <div className="row  mb-3 gap-3 ">
          <div className="col-12 text-center">
            <h2 className="fs-1">
              {formType === "ADD" ? "Create Proforma" : "Edit Proforma"}
            </h2>
          </div>
        </div>

        {/* Custoemr change */}
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
                <Controller
                  name="company_id"
                  control={control}
                  defaultValue={undefined}
                  rules={{ required: "Please select a customer" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        options={customerOptions as never[]}
                        isDisabled={isEditForm}
                        placeholder="Select a customer..."
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption);
                          handleCustomerSelect(selectedOption);
                        }}
                      />

                      {fieldState.error && (
                        <p className="text-danger mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="address">Address</label>
              </div>
              <div className="col-md-8">
                {/* <Controller
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <textarea
                      id="address"
                      {...field}
                      className="form-control"
                      placeholder="Enter address"
                      readOnly={isEditForm}
                    />
                  )}
                /> */}
                {/* <input type="text" /> */}
                <textarea
                  className="form-control"
                  placeholder="Address"
                  cols={5}
                  {...register("address")}
                  readOnly
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="contactPerson">Contact Person</label>
              </div>
              <div className="col-md-8">
                <input
                  {...register("contact_person", {
                    required: "contact person is required",
                  })}
                  placeholder="Contact person"
                  className="form-control"
                  // readOnly={isEditForm}
                  readOnly
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
                <label htmlFor="gstin">GSTIN/PAN</label>
              </div>
              <div className="col-md-8">
                <input
                  type="text"
                  {...register("gstin", {
                    required: "GSTIN is required",
                    // value: formValues.contact_person,
                  })}
                  //   defaultValue={formValues.gstin}
                  className="form-control "
                  placeholder="GSTIN/PAN"
                  // readOnly={isEditForm}
                  readOnly
                  // required
                />

                {errors.gstin && (
                  <small className="text-danger">{errors.gstin.message}</small>
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
                  onChange={(e) => setValue("place_of_supply", e.target.value)}
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
                      className="form-control form-control-sm w-50"
                    />
                    {typeof errors.proforma_date?.message === "string" && (
                      <small className="text-danger">
                        {errors.proforma_date.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="date">Proforma No.</label>
                  </div>
                  <div className="col-md-8 d-flex">
                    <input
                      {...register("proforma_number", {
                        required: "proforma number is required",
                      })}
                      type="text"
                      className="form-control w-25"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr />
          </div>
        </div>

        <div className="row justify-content-start">
          <div className="col-3">Product Items</div>
        </div>

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
                  {fields.map((field, idx) => (
                    <ProductRow
                      key={idx}
                      index={idx}
                      control={control}
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      remove={remove}
                      addRow={handleAddRow}
                      productOptions={productOptions}
                      defaultProduct={field}
                    />
                  ))}
                  <tr className="bg-warning table-warning">
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
              {errors.products && (
                <div className="text-danger">
                  At least one product must be selected.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* updated row */}
        <div className="row justify-content-between">
          <div className="col-lg-5"></div>

          {/* Right Side */}
          <div className="col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col-6">Total Taxable:</div>
                  <div className="col-6 text-end">
                    ₹{summary.totalTaxable.toFixed(2)}
                  </div>
                </div>

                <div className="row mb-2 text-danger">
                  <div className="col-6">Total Discount:</div>
                  <div className="col-6 text-end">
                    -₹{summary.totalDiscount.toFixed(2)}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-6">Total Tax:</div>
                  <div className="col-6 text-end">
                    ₹{summary.totalTax.toFixed(2)}
                  </div>
                </div>

                <hr />

                <div className="row mb-2 fw-bold fs-5">
                  <div className="col-6">Grand Total:</div>
                  <div className="col-6 text-end text-success">
                    ₹{summary.grandTotal.toFixed(2)}
                  </div>
                </div>

                <div className="text-muted small">
                  {/* In Words: {numberToWords(summary.grandTotal)} Rupees */}
                </div>
              </div>
            </div>
          </div>
        </div>

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
    </form>
  );
};
