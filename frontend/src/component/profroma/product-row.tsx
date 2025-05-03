import { Control, Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import {
  ProformaProductRow,
  SelectOption,
  SelectOptionProduct,
} from "../../lib/types";
import { TaxOptions, UOMOptions } from "../../lib/constants";
import { useEffect } from "react";

interface ProductRowProps {
  index: number;
  control: any;
  register: any;
  watch: any;
  setValue: any;
  remove: any;
  productOptions: SelectOptionProduct[];
  addRow: any;
  defaultProduct?: ProformaProductRow;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  index,
  control,
  register,
  watch,
  setValue,
  remove,
  addRow,
  productOptions,
  defaultProduct,
}) => {
  const selectedProduct = watch(`products.${index}.product`);

  const watchedValues = useWatch({
    control,
    name: [
      `products.${index}.quantity`,
      `products.${index}.discount_percentage`,
      `products.${index}.tax_percentage`,
      `products.${index}.product.price`,
    ],
  });

  const updateRowTotal = (index: number) => {
    const price = parseFloat(watch(`products.${index}.product.price`)) || 0;
    const quantity = parseFloat(watch(`products.${index}.quantity`)) || 0;
    const discount =
      parseFloat(watch(`products.${index}.discount_percentage`)) || 0;
    const tax = parseFloat(watch(`products.${index}.tax_percentage`)) || 0;

    const subtotal = price * quantity;
    const discountAmount = (subtotal * discount) / 100;
    const taxable = subtotal - discountAmount;
    const taxAmount = (taxable * tax) / 100;
    const total = taxable + taxAmount;

    setValue(`products.${index}.total`, total);
  };

  useEffect(() => {
    updateRowTotal(index);
  }, [watchedValues]); // Only runs when watched values change

  // Auto-fill product details
  useEffect(() => {
    if (defaultProduct || selectedProduct) {
      setValue(
        `products.${index}.hsn`,
        defaultProduct?.product?.data?.hsn_code ||
          selectedProduct?.data?.hsn_code
      );
      setValue(`products.${index}.product.price`, selectedProduct?.data?.price);
      setValue(`products.${index}.product.uom`, selectedProduct?.data?.uom);
      setValue(`products.${index}.quantity`, defaultProduct?.quantity || 1);
    }
  }, [selectedProduct, index, setValue]);

  const taxValue = watch(`products.${index}.tax_percentage`);
  const selectedTaxOption = TaxOptions.find((opt) => opt.value === taxValue);

  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td className="d-flex flex-column gap-2">
        <Controller
          control={control}
          name={`products.${index}.product`}
          rules={{ required: "Product is required" }}
          render={({ field, fieldState }) => (
            <>
              <Select
                {...field}
                options={productOptions}
                placeholder="Select a product..."
                onChange={(val) => {
                  field.onChange(val);
                  // updateRowTotal(index);
                }}
                classNamePrefix="select"
              />

              {fieldState.error && (
                <p className="text-danger mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
        <textarea
          {...register(`products.${index}.product.description`)}
          style={{ backgroundColor: "lightyellow" }}
          className="form-control mt-2"
          placeholder="Item note (optional)"
        ></textarea>
      </td>
      <td>
        <input
          {...register(`products.${index}.hsn`)}
          className="form-control"
          readOnly
        />
      </td>
      <td>
        <input
          type="number"
          {...register(`products.${index}.quantity`, { min: 1 })}
          className="form-control"
        />
      </td>
      <td>
        <Controller
          control={control}
          name={`products.${index}.product.uom`}
          rules={{ required: "UOM is required" }}
          render={({ field, fieldState }) => (
            <>
              <input className="form-control" {...field} readOnly />
              {fieldState.error && (
                <p className="text-danger mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          {...register(`products.${index}.product.price`)}
          step="0.01"
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          min="0"
          max="100"
          {...register(`products.${index}.discount_percentage`)}
        />
      </td>
      <td>
        <Controller
          name={`products.${index}.tax_percentage`}
          control={control}
          rules={{ required: "Tax is required" }}
          render={({ field, fieldState }) => (
            <>
              <Select
                {...field}
                value={selectedTaxOption || null}
                options={TaxOptions}
                placeholder="Select Tax"
                classNamePrefix="select"
                onChange={(val) => {
                  field.onChange(val?.value);
                }}
              />

              {fieldState.error && (
                <p className="text-danger mt-1">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </td>
      <td>
        {/* {profomaItem.total.toFixed(2)} */}₹
        {watch(`products.${index}.total`)?.toFixed(2) || 0.0}
      </td>
      <td className=" flex-column gap-2">
        {index === 0 ? (
          // First row - only show Add button
          <button
            type="button"
            onClick={() => addRow()}
            className="btn btn-primary border rounded"
          >
            Add
          </button>
        ) : (
          // Other rows - show both Add and Delete buttons
          <>
            <button
              type="button"
              //   onClick={handleAddRow}
              className="btn btn-primary border rounded"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => remove(index)}
              className="btn btn-danger border rounded"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
};
