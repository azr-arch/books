import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addCustomer } from "../../api/api";
import { toast } from "react-toastify";
import { CustomerForm } from "../../component/customer/customer-form";
import { CustomerFormInputs } from "../../lib/types";

const AddCustomer: React.FC = () => {
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CustomerFormInputs> = (data) => {
    addCustomer(data)
      .then(() => {
        toast.success("Customer added successfully");
        navigate("/customers");
      })
      .catch((error) => {
        console.error("Error adding customer:", error);
        toast.error("Something went wrong while adding customer");
      });
  };

  return (
    <div className="row px-5">
      <div className="col-md-12">
        <CustomerForm onSubmit={onSubmit} formType="ADD" />
      </div>
    </div>
  );
};

export default AddCustomer;
