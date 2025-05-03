export interface CustomerFormInputs {
  gstin: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  registration_type: string;
  pan: string;
  billing_address1: string;
  billing_address2: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  billing_pincode: string;
  shipping_address1: string;
  shipping_address2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_pincode: string;
}

export interface Product {
  id?: string;
  name?: string;
  description?: string;
  hsn?: string | number;
  uom?: any;
  price: number;
}

export interface ProformaProductRow {
  product: SelectOptionProduct | Product;
  quantity: number;
  discount_percentage: number;
  tax_percentage: number;
  total: number;
}

export interface ProformaFormInputs {
  // proforma_id?: string;
  // company_id: string;
  // contact_person: string;
  // gstin: string;
  // place_of_supply: string;
  // proforma_date: string;
  // proforma_number: string;
  // address: string;
  // products: ProformaProductRow[];

  proforma_date: string;
  proforma_number: string;
  company_id: SelectOption;
  address: string;
  contact_person: string;
  gstin: string;
  place_of_supply: string;
  products: Array<{
    product: Product;
    quantity: number;
    discount_percentage: number;
    tax_percentage: number;
    total: number;
  }>;
}

export interface SelectOption {
  value: number;
  label: string;
}

// export interface SelectOption {
//   value: number;
//   label: string;
//   data?: any;
// }

export interface SelectOptionProduct extends SelectOption {
  data: Product;
}

/*


totalTaxable
totalTax
grandTotal
*/
