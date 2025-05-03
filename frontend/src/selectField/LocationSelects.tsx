import React from "react";
import Select from "react-select";
import { Control, Controller } from "react-hook-form";
import axios from "axios";

interface Option {
  value: number;
  label: string;
}

interface LocationSelectProps {
  name: string;
  label: string;
  control: Control<any>;
  options: Option[];
  error?: string;
  placeholder?: string;
  isRequired?: boolean;
  defaultValue?: number;
  onLocationSelect?: (locationData: any, name?: string) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  name,
  label,
  control,
  options,
  error,
  onLocationSelect,
  placeholder,
  isRequired = false,
}) => {
  return (
    <div className="row mb-3">
      <div className="col-md-3">
        <label className="form-label fw-bold">
          {label} {isRequired && <span className="text-danger">*</span>}
        </label>
      </div>
      <div className="col-md-6">
        <Controller
          name={name}
          control={control}
          rules={{
            required: isRequired ? `${label} is required` : false,
            validate: (value) => {
              if (isRequired && !value) {
                return `${label} is required`;
              }
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <>
              <Select
                {...field}
                options={options}
                value={options.find(
                  (option) => Number(option.value) === Number(field.value)
                )}
                // onChange={async (option) => {
                //   field.onChange(option?.value);
                //   if (name === "billing_city" && option?.value) {
                //     try {
                //       const response = await axios.get(
                //         `http://localhost:4500/api/cities/${option.value}/details`
                //       );
                //       if (response.data.status === "success") {
                //         onLocationSelect?.(response.data.data);
                //       }
                //     } catch (error) {
                //       console.error("Error fetching city details:", error);
                //     }
                //   }
                // }}
                onChange={async (option) => {
                  field.onChange(option?.value);
                  if (
                    (name === "billing_city" || name === "shipping_city") &&
                    option?.value
                  ) {
                    try {
                      const response = await axios.get(
                        `http://localhost:4500/api/cities/${option.value}/details`
                      );
                      if (response.data.status === "success") {
                        onLocationSelect?.(response.data.data, name);
                      }
                    } catch (error) {
                      console.error("Error fetching city details:", error);
                    }
                  }
                }}
                className="basic-single"
                classNamePrefix="select"
                placeholder={placeholder || `Select ${label}...`}
                isClearable
                isSearchable
              />
              {fieldState?.error && !field.value && (
                <div className="invalid-feedback d-block">
                  {fieldState.error.message}
                </div>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default LocationSelect;
