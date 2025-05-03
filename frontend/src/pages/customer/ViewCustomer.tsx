import React from "react";
import { useParams, Link } from "react-router-dom";
import { getCustomerById } from "../../api/api";
import { useState, useEffect } from "react";
import useLocationData from "../../selectField/LocationData";
import { REGISTRATION_TYPE } from "../../lib/constants";

const ViewCustomer = () => {
  const { id } = useParams();
  const { cities, states, countries } = useLocationData();
  const [customer, setCustomer] = useState({
    gstin: "",
    company_name: "",
    contact_person: "",
    email: "",
    registration_type: 0,
    pan: "",
    billing_address1: "",
    billing_address2: "",
    billing_landmark: "",
    billing_city: 0,
    billing_state: 0,
    billing_country: 0,
    billing_pincode: "",
    shipping_address1: "",
    shipping_address2: "",
    shipping_landmark: "",
    shipping_city: 0,
    shipping_state: 0,
    shipping_country: 0,
    shipping_pincode: "",
    created_by: "",
    created_date: "",
  });

  // Helper functions to get location names
  const getCityName = (cityId: number) => {
    const city = cities.find((city) => city.id == cityId);
    console.log();
    return city ? city.name : "N/A";
  };

  const getStateName = (stateId: number) => {
    const state = states.find((state) => state.id == stateId);
    return state ? state.name : "N/A";
  };

  const getCountryName = (countryId: number) => {
    const country = countries.find((country) => country.id == countryId);
    return country ? country.name : "N/A";
  };

  useEffect(() => {
    getCustomerById(id).then(({ data }) => {
      setCustomer(data.data);
    });
  }, [id]);
  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Customer Details</h2>

      {/* Basic Information */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0 text-center">Basic Information</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <p>
                <strong>Company Name:</strong> {customer.company_name}
              </p>
              <p>
                <strong>Contact Person:</strong> {customer.contact_person}
              </p>
              <p>
                <strong>Email:</strong> {customer.email || "N/A"}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>GSTIN:</strong> {customer.gstin}
              </p>
              <p>
                <strong>PAN:</strong> {customer.pan || "N/A"}
              </p>
              <p>
                <strong>Registration Type:</strong>{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {REGISTRATION_TYPE[customer.registration_type] || "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing & Shipping Addresses */}
      <div className="row">
        {/* Billing Address */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0 text-center">Billing Address</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Address Line 1:</strong>{" "}
                {customer.billing_address1 || "N/A"}
              </p>
              <p>
                <strong>Address Line 2:</strong>{" "}
                {customer.billing_address2 || "N/A"}
              </p>
              <p>
                <strong>Landmark:</strong> {customer.billing_landmark || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {getCityName(customer.billing_city)}
              </p>
              <p>
                <strong>State:</strong> {getStateName(customer.billing_state)}
              </p>
              <p>
                <strong>Country:</strong>{" "}
                {getCountryName(customer.billing_country)}
              </p>
              <p>
                <strong>Pincode:</strong> {customer.billing_pincode || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0 text-center">Shipping Address</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Address Line 1:</strong>
                {customer.shipping_address1 || "N/A"}
              </p>
              <p>
                <strong>Address Line 2:</strong>
                {customer.shipping_address2 || "N/A"}
              </p>
              <p>
                <strong>Landmark:</strong> {customer.shipping_landmark || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {getCityName(customer.shipping_city)}
              </p>
              <p>
                <strong>State:</strong> {getStateName(customer.shipping_state)}
              </p>
              <p>
                <strong>Country:</strong>
                {getCountryName(customer.shipping_country)}
              </p>
              <p>
                <strong>Pincode:</strong> {customer.shipping_pincode || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="card">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0 text-center">Additional Information</h5>
        </div>
        <div className="card-body d-flex justify-content-around">
          <p>
            <strong>Created By:</strong> {customer.created_by}
          </p>
          <p>
            <strong>Created Date:</strong>
            {new Date(customer.created_date).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-12 text-center">
          <Link to={"/customers"}>
            <button className="btn btn-primary w-25 ">Go Back</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomer;
