export interface EsewaPaymentDetails {
  amount: number;
  tax_amount: number;
  product_service_charge: number;
  product_delivery_charge: number;
  product_code: string;
  total_amount: number;
  transaction_uuid: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}
