interface IProps {
  // id: any;
  product_name: string;
  product_id?: number | any;
  proforma_date?: any;
  prefix?: any;
  number?: any;
  postfix?: any;
  itemNote: string | any;
  hsn_code: string;
  qty: number;
  uom: any;
  price: any;
  discount: any;
  tax: any;
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
  UOM: number;
  tax: number;
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
  company_name: any;
  address: any;
  pan?: string;
  proforma_date: any;
  proforma_no: any;
  prefix: any;
  number: any;
  postfix: any;
  tax: any;
  discount: any;
  shipping_address1: string;
  shipping_address2: string;
  shipping_landmark: string;
  shipping_city: string | any;
  shipping_state: string | any;
  shipping_country: string | any;
  shippingCountryId: any;
  shippingStateId: any;
  shippingCityId: any;
  shipping_pincode: string;
  phone_no: string | number;
  place_of_supply: string;
}

export type { FormInputs, SelectOption, Product, IProps };
