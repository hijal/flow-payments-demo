export type PaymentMethod =
  | 'alipay_cn'
  | 'alipay_hk'
  | 'alma'
  | 'applepay'
  | 'bancontact'
  | 'benefit'
  | 'bizum'
  | 'card'
  | 'dana'
  | 'eps'
  | 'gcash'
  | 'googlepay'
  | 'ideal'
  | 'kakaopay'
  | 'klarna'
  | 'knet'
  | 'mbway'
  | 'mobilepay'
  | 'multibanco'
  | 'octopus'
  | 'p24'
  | 'paynow'
  | 'paypal'
  | 'plaid'
  | 'qpay'
  | 'sepa'
  | 'stcpay'
  | 'stored_card'
  | 'tabby'
  | 'tamara'
  | 'tng'
  | 'truemoney'
  | 'twint'
  | 'vipps'
  | 'wechatpay';

export type StorePaymentDetailsCard = 'disabled' | 'enabled' | 'collect_consent';

/**
 * Request body for `POST /payment-sessions`.
 * Field shape/optionality verified against Checkout.com's
 * `CreatePaymentSessionsRequest`/`CreatePaymentSessionsBaseRequest` schemas.
 */
export interface CreatePaymentSessionRequest {
  amount: number;
  currency: string;
  reference?: string;
  billing: {
    address: {
      country: string;
    };
  };
  customer?: {
    name?: string;
    email?: string;
  };
  processing_channel_id: string;
  risk?: {
    enabled: boolean;
  };
  success_url: string;
  failure_url: string;
  enabled_payment_methods?: PaymentMethod[];
  authorization_type?: 'Final' | 'Estimated';
  payment_method_configuration?: {
    card?: {
      store_payment_details?: StorePaymentDetailsCard;
    };
  };
}
