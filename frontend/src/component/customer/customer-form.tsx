import { SubmitHandler, useForm } from "react-hook-form";
import { CustomerFormInputs } from "../../lib/types";
import { useNavigate } from "react-router-dom";
import useLocationData from "../../selectField/LocationData";
import LocationSelect from "../../selectField/LocationSelects";
import { useEffect } from "react";
import { isObjectEmpty } from "../../lib/util";
import { REGISTRATION_TYPE } from "../../lib/constants";

interface CustomerFormProps {
  onSubmit: SubmitHandler<CustomerFormInputs>;
  defaultValues?: Partial<CustomerFormInputs>;
  formType: "EDIT" | "ADD";
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  onSubmit,
  defaultValues = {},
  formType,
}) => {
  const navigate = useNavigate();
  const { countries, states, cities } = useLocationData();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<CustomerFormInputs>({ defaultValues });

  const formatOptions = (items: any[]) =>
    items.map((item) => ({ value: item.id, label: item.name }));

  const handleCitySelect = (cityData: any, fieldName?: string) => {
    if (!fieldName) return;
    if (fieldName === "billing_city") {
      setValue("billing_state", cityData.stateId);
      setValue("billing_country", cityData.countryId);
    } else if (fieldName === "shipping_city") {
      setValue("shipping_state", cityData.stateId);
      setValue("shipping_country", cityData.countryId);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const billingData = getValues();
      setValue("shipping_address1", billingData.billing_address1);
      setValue("shipping_address2", billingData.billing_address2);
      setValue("shipping_city", billingData.billing_city);
      setValue("shipping_state", billingData.billing_state);
      setValue("shipping_country", billingData.billing_country);
      setValue("shipping_pincode", billingData.billing_pincode);
    } else {
      setValue("shipping_address1", "");
      setValue("shipping_address2", "");
      setValue("shipping_city", "");
      setValue("shipping_state", "");
      setValue("shipping_country", "");
      setValue("shipping_pincode", "");
    }
  };

  useEffect(() => {
    if (!isObjectEmpty(defaultValues)) {
      console.log({ defaultValues });
      reset({
        ...defaultValues,
        registration_type:
          REGISTRATION_TYPE[defaultValues.registration_type || 0] || "",
        phone: defaultValues.phone,
      });
    }
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-12 d-flex justify-content-center">
          <h1 className="fw-bold">
            {formType === "ADD" ? "Add New Customer" : "Edit Customer"}
          </h1>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-3">
          <label htmlFor="gstin" className="form-label fw-bold text-dark">
            GSTIN
          </label>
        </div>
        <div className="col-md-6">
          <input
            {...register("gstin", {
              pattern: {
                value: /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
                message: "Invalid GSTIN",
              },
            })}
            className="form-control"
            placeholder="Enter GSTIN"
          />
          {errors.gstin && (
            <small className="text-danger">{errors.gstin.message}</small>
          )}
        </div>
      </div>

      {/* Company Name */}
      <div className="row mt-3 mb-3">
        <div className="col-12 col-md-3">
          <label
            htmlFor="company_name"
            className="form-label fw-bold text-dark"
          >
            Company Name
          </label>
        </div>
        <div className="col-12 col-md-6">
          <input
            {...register("company_name", {
              required: "Company Name is required",
            })}
            type="text"
            className="form-control"
            id="company_name"
            placeholder="Enter Company Name"
          />
          {errors.company_name && (
            <small className="text-danger">{errors.company_name.message}</small>
          )}
        </div>
      </div>

      {/* Contact Person */}
      <div className="row mb-3">
        <div className="col-12 col-md-3">
          <label
            htmlFor="contact_person"
            className="form-label fw-bold text-dark"
          >
            Contact Person
          </label>
        </div>
        <div className="col-12 col-md-6">
          <input
            {...register("contact_person", {
              required: "Contact Person is required",
            })}
            type="text"
            className="form-control"
            id="contact_person"
            placeholder="Enter Contact Person Name"
            // onChange={handleChange}
          />
          {errors.contact_person && (
            <small className="text-danger">
              {errors.contact_person.message}
            </small>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="row mb-3">
        <div className="col-12 col-md-3">
          <label htmlFor="email" className="form-label fw-bold text-dark">
            Email
          </label>
        </div>
        <div className="col-12 col-md-6">
          <input
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
              required: "Email is required",
            })}
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter Email"
            name="email"
            // onChange={handleChange}
          />
          {errors.email && (
            <small className="text-danger">{errors.email.message}</small>
          )}
        </div>
      </div>
      {/* Phone */}
      <div className="row mb-3">
        <div className="col-12 col-md-3">
          <label htmlFor="phone" className="form-label fw-bold text-dark">
            Phone No
          </label>
        </div>
        <div className=" col-12 col-md-6">
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Phone number must be exactly 10 digits",
              },
            })}
            type="text"
            className="form-control "
            placeholder="Phone No"
            // required
          />

          {errors.phone && (
            <small className="text-danger">{errors.phone.message}</small>
          )}
        </div>
      </div>

      {/* Registration Type */}
      <div className="row mb-3">
        <div className="col-12 col-md-3">
          <label
            htmlFor="registration_type"
            className="form-label fw-bold text-dark"
          >
            Registration Type
          </label>
        </div>
        <div className="col-12 col-md-6">
          <select
            className="form-select form-select-md"
            aria-label="Small select example"
            {...register("registration_type", {})}
          >
            <option value="" selected>
              Select Registration Type
            </option>
            <option value="unregistered">unregistered</option>
            <option value="registered">registered</option>
          </select>
        </div>
      </div>

      {/* PAN */}
      <div className="row mb-3">
        <div className="col-12 col-md-3">
          <label htmlFor="pan" className="form-label fw-bold text-dark">
            PAN
          </label>
        </div>

        <div className="col-12 col-md-6">
          <input
            {...register("pan", {
              pattern: {
                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // PAN format: 5 letters, 4 digits, 1 letter
                message:
                  "PAN must be in the format: 5 capital letters, 4 digits, 1 capital letter",
              },
            })}
            type="text"
            // onChange={handleChange}
            className="form-control"
            placeholder="Enter PAN"
          />
          {errors.pan && (
            <small className="text-danger">{errors.pan.message}</small>
          )}
        </div>
      </div>

      {/* Billing Address Section */}
      <div className="row mt-5 mb-5">
        <div className="col-12">
          <span className="text-muted fw-bold h3">
            <i className="fa-solid fa-location-dot fa-1x"></i> Billing Address
          </span>
        </div>
      </div>

      {/* Billing Address Fields */}
      <div className="row mb-3">
        <div className="col-12 col-md-3">
          <label
            htmlFor="billing_address_1"
            className="form-label fw-bold text-dark"
          >
            Address Line 1
          </label>
        </div>

        <div className="col-12 col-md-6">
          <input
            {...register("billing_address1", {})}
            type="text"
            // onChange={handleChange}
            className="form-control"
            id="billing_address_1"
            placeholder="Enter Billing Address Line 1"
          />
          {errors.billing_address1 && (
            <small className="text-danger">
              {errors.billing_address1.message}
            </small>
          )}
        </div>
      </div>

      {/* address line 2 */}
      <div className="row mb-3">
        <div className="col-12 col-md-3">
          <label
            htmlFor="billing_address_2"
            className="form-label fw-bold text-dark"
          >
            Address Line 2
          </label>
        </div>
        <div className="col-12 col-md-6">
          <input
            {...register("billing_address2", {})}
            type="text"
            //   value={form.billing_address_2}
            // onChange={handleChange}
            className="form-control"
            id="billing_address_2"
            placeholder="Enter Billing Address Line 2"
          />
          {errors.billing_address2 && (
            <small className="text-danger">
              {errors.billing_address2.message}
            </small>
          )}
        </div>
      </div>

      {/* Location Selects */}
      <LocationSelect
        name="billing_city"
        label="Billing City"
        control={control}
        options={formatOptions(cities)}
        error={errors.billing_city?.message}
        onLocationSelect={handleCitySelect}
        isRequired
      />

      <LocationSelect
        name="billing_state"
        label="State"
        control={control}
        options={formatOptions(states)}
        error={errors.billing_state?.message}
        isRequired
      />

      <LocationSelect
        name="billing_country"
        label="Country"
        control={control}
        options={formatOptions(countries)}
        error={errors.billing_country?.message}
        isRequired
      />

      {/* billing pincode  */}
      <div className="row mb-3">
        <div className="col-12 col-md-3">
          <label
            htmlFor="billing_pincode"
            className="form-label fw-bold text-dark"
          >
            Pincode
          </label>
        </div>
        <div className="col-12 col-md-6">
          <input
            {...register("billing_pincode", {
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Pincode must be exactly 6 digits",
              },
              required: "Pincode is required",
            })}
            type="text"
            className="form-control"
            placeholder="Enter Billing Pincode"
          />
          {errors.billing_pincode && (
            <small className="text-danger">
              {errors.billing_pincode.message}
            </small>
          )}
        </div>
      </div>

      {/* Address Copy Checkbox */}
      <div className="form-check mt-4">
        <input
          type="checkbox"
          className="form-check-input"
          id="copyBilling"
          onChange={handleCheckboxChange}
        />
        <label className="form-check-label" htmlFor="copyBilling">
          Shipping same as Billing
        </label>
      </div>

      {/* Shipping Address Section */}
      <div className="row mt-5 mb-5">
        <div className="col-md-12">
          <span className="text-muted fw-bold h3">
            <i className="fa-solid fa-location-dot fa-1x"></i> Shipping Address
          </span>
        </div>
      </div>

      {/* Shipping Address Fields */}
      <div className="row mb-3">
        <div className=" col-md-3">
          <label
            htmlFor="shipping_address_1"
            className="form-label fw-bold text-dark"
          >
            Address Line 1
          </label>
        </div>
        <div className=" col-md-6">
          <input
            {...register("shipping_address1", {})}
            type="text"
            className="form-control"
            placeholder="Enter Shipping Address Line 1"
            // onChange={handleChange}
          />
          {errors.shipping_address1 && (
            <small className="text-danger">
              {errors.shipping_address1.message}
            </small>
          )}
        </div>
      </div>

      {/* shipping address line 2 */}
      <div className="row mb-3">
        <div className=" col-md-3">
          <label
            htmlFor="shipping_address_2"
            className="form-label fw-bold text-dark"
          >
            Address Line 2
          </label>
        </div>

        <div className=" col-md-6">
          <input
            {...register("shipping_address2")}
            type="text"
            className="form-control"
            placeholder="Enter Shipping Address Line 2"
            // onChange={handleChange}
          />
        </div>
      </div>

      <LocationSelect
        name="shipping_city"
        label="City"
        control={control}
        options={formatOptions(cities)}
        error={errors.shipping_city?.message}
        isRequired
        onLocationSelect={handleCitySelect}
      />

      <LocationSelect
        name="shipping_state"
        label="State"
        control={control}
        options={formatOptions(states)}
        error={errors.shipping_state?.message}
        isRequired
      />

      <LocationSelect
        name="shipping_country"
        label="Country"
        control={control}
        options={formatOptions(countries)}
        error={errors.shipping_country?.message}
        isRequired
      />

      {/* shipping pincode  */}
      <div className="row mb-3">
        <div className="col-12 col-md-3">
          <label
            htmlFor="shipping_pincode"
            className="form-label fw-bold text-dark"
          >
            Pincode
          </label>
        </div>
        <div className="col-12 col-md-6">
          <input
            {...register("shipping_pincode", {
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Pincode must be exactly 6 digits",
              },
            })}
            type="text"
            className="form-control"
            placeholder="Enter Shipping Pincode"
            // onChange={handleChange}
          />
          {errors.shipping_pincode && (
            <small className="text-danger">
              {errors.shipping_pincode.message}
            </small>
          )}
        </div>
      </div>

      <div className="text-center mt-5">
        <button type="submit" className="btn btn-primary w-25">
          {formType === "ADD" ? "Create" : "Submit"}
        </button>
      </div>
    </form>
  );
};
