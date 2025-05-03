import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { addCustomer, updateCustomer } from "../../api/api";
import useLocationData from "../../selectField/LocationData";
import LocationSelect from "../../selectField/LocationSelects";
import { getCustomerById } from "../../api/api";
import { toast } from "react-toastify";
import { CustomerForm } from "../../component/customer/customer-form";
import { CustomerFormInputs } from "../../lib/types";

interface FormInputs {
  gstin: string;
  company_name: string;
  contact_person: string;
  email: string;
  registration_type: string;
  pan: string;
  billing_address1: string;
  billing_address2: string;
  billing_landmark: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  billing_pincode: string;
  shipping_address1: string;
  shipping_address2: string;
  shipping_landmark: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_pincode: string;
}

interface CountryOption {
  value: string;
  label: string;
}

const EditCustomer: React.FC = () => {
  const [formDefaultValues, setFormDefaultValues] = useState<
    Partial<CustomerFormInputs>
  >({});

  const { id } = useParams();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CustomerFormInputs> = (data) => {
    updateCustomer(id, data)
      .then(() => {
        toast.success("Customer updated successfully");
        navigate("/customers");
      })
      .catch((error) => {
        console.error("Error updating customer:", error);
        toast.error("Something went wrong while editing customer");
      });
  };

  // Remove the second useEffect and modify the first one
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await getCustomerById(id);
        const customerData = response.data.data;
        setFormDefaultValues(customerData);
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  return (
    <div className="row px-5">
      <div className="col-md-12">
        <CustomerForm
          onSubmit={onSubmit}
          defaultValues={formDefaultValues}
          formType="EDIT"
        />
      </div>
    </div>
  );
};

export default EditCustomer;
