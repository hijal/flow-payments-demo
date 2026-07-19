export interface CreatePaymentSessionRequest {
  amount: number;
  currency: string;
  reference: string;
  billing: {
    address: {
      country: string;
    };
  };
  customer: {
    name: string;
    email: string;
  };
  processing_channel_id: string;
  risk: {
    enabled: boolean;
  };
  success_url: string;
  failure_url: string;
  enabled_payment_methods: string[];
  authorization_type: string;
  payment_method_configuration: {
    card: {
      store_payment_details: string;
    };
  };
}
