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

interface IProps {
  product: Product | any;
  itemNote?: string;
  quantity: number;
  discount_pre: number;
  discount_percentage: number;
  discount_amount: number;
  tax_pre: number;
  tax_percentage: number;
  taxt_amount: number;
  tax: number;
  total: number;
}

interface SelectOption {
  value: number;
  label: string;
  company_name?: string | any;
  id?: number | any;
  price: number | any;
}

interface ProductRow {
  product: any;
  description?: string;
  quantity: number;
  discount_percentage: number;
  tax_percentage: number;
  total: number;
  tax: number;
}

interface FormInputs {
  id: string;
  gstin: string;
  contact_person: string;
  company_name: any; // selectable dropdown
  address: any; // com,bination of city state and country
  pan?: string;
  proforma_date: any;
  proforma_number: any;
  discount_percentage: any; // selectable of values 0 5 18 22
  phone_no: string | number;
  place_of_supply: string;
  products: ProductRow[];
  taxAmount: number;
  grandTotal: number;
}
export type { IProps, SelectOption, FormInputs, Product, ProductRow };
