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

/** Card-only: also allows `collect_consent` (used for Remember Me). Verified against `PaymentSessionsStorePaymentDetailsCard`. */
export type StorePaymentDetailsCard = 'disabled' | 'enabled' | 'collect_consent';

/** For `applepay`/`googlepay` (no `collect_consent`). Verified against `PaymentSessionsStorePaymentDetails`. */
export type StorePaymentDetails = 'disabled' | 'enabled';

/** Verified against Checkout.com's `Address` schema. */
export interface Address {
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country: string;
}

/** Verified against `PaymentInterfacesPhoneNumber`. */
export interface PhoneNumber {
  country_code?: string;
  number?: string;
}

/**
 * `sender` on a payment session. Verified against `PaymentInterfacesSender`
 * (discriminated on `type`) and its 3 variants:
 * `01_PaymentInterfacesIndividualSender`, `02_PaymentInterfacesCorporateSender`,
 * `03_PaymentInterfacesInstrumentSender`.
 */
export interface PaymentSessionIndividualSender {
  type: 'individual';
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  address?: Address;
  identification?: {
    type?: 'passport' | 'driving_licence' | 'national_id';
    number?: string;
    issuing_country?: string;
  };
}

export interface PaymentSessionCorporateSender {
  type: 'corporate';
  company_name: string;
  address?: Address;
}

export interface PaymentSessionInstrumentSender {
  type: 'instrument';
  reference?: string;
}

export type PaymentSessionSender =
  PaymentSessionIndividualSender | PaymentSessionCorporateSender | PaymentSessionInstrumentSender;

/**
 * `recipient` on a payment session. Required alongside `sender` and
 * `processing.aft` when the processing channel is configured account-wide
 * for Account Funding Transactions — Visa's AFT mandate declines with
 * `43102` (surfaced as `invalid_customer_data`) without them.
 * Verified against `PaymentRecipient`.
 */
export interface PaymentSessionRecipient {
  first_name: string;
  last_name: string;
  account_number: string;
  address?: Address;
  dob?: string;
}

/**
 * `account_holder` inside `payment_method_configuration.{card,applepay,googlepay}`.
 * Verified against the 3 variants: `01_PaymentSessionRequest_AccountHolderIndividual`,
 * `02_PaymentSessionRequest_AccountHolderCorporate`,
 * `03_PaymentSessionRequest_AccountHolderGovernment` (discriminated on `type`).
 */
export interface AccountHolderIndividual {
  type: 'individual';
  first_name: string;
  last_name: string;
  middle_name?: string;
  account_name_inquiry?: boolean;
}

export interface AccountHolderCorporate {
  type: 'corporate';
  company_name: string;
  account_name_inquiry?: boolean;
}

export interface AccountHolderGovernment {
  type: 'government';
  company_name: string;
  account_name_inquiry?: boolean;
}

export type AccountHolder =
  AccountHolderIndividual | AccountHolderCorporate | AccountHolderGovernment;

/**
 * `payment_method_configuration.stored_card`.
 * Verified against the inline `stored_card` schema on `CreatePaymentSessionsRequest`.
 */
export interface StoredCardConfig {
  customer_id?: string;
  instrument_ids?: string[];
  default_instrument_id?: string;
}

/**
 * `3ds` on a payment session. Verified against `PaymentSessions3DS`
 * (`anyOf` integrated/third-party, discriminated on `enabled`).
 */
export interface PaymentSessions3DSIntegrated {
  enabled: boolean;
  challenge_indicator?:
    | 'no_preference'
    | 'no_challenge_requested'
    | 'challenge_requested'
    | 'challenge_requested_mandate';
}

export interface PaymentSessions3DSThirdParty {
  enabled: true;
  eci: string;
  cryptogram: string;
  xid: string;
  version: string;
  exemption?:
    | 'low_value'
    | 'secure_corporate_payment'
    | 'trusted_listing'
    | 'transaction_risk_assessment'
    | '3ds_outage'
    | 'sca_delegation'
    | 'out_of_sca_scope'
    | 'other'
    | 'low_risk_program'
    | 'recurring_operation';
}

export type PaymentSessions3DS = PaymentSessions3DSIntegrated | PaymentSessions3DSThirdParty;

/** Verified against `PaymentInterfacesCustomerSummary` (used for Tamara risk assessment). */
export interface CustomerSummary {
  registration_date?: string;
  first_transaction_date?: string;
  last_payment_date?: string;
  total_order_count?: number;
  last_payment_amount?: number;
  is_premium_customer?: boolean;
  is_returning_customer?: boolean;
  lifetime_value?: number;
}

/** Verified against `PaymentSessionCustomer`. */
export interface PaymentSessionCustomer {
  email?: string;
  name?: string;
  id?: string;
  phone?: PhoneNumber;
  tax_number?: string;
  summary?: CustomerSummary;
}

/** Verified against `PaymentSessionsBillingDescriptor`. */
export interface PaymentSessionBillingDescriptor {
  name: string;
  city: string;
  reference?: string;
}

/** Verified against the `PaymentSessionsItems` array item schema. */
export interface PaymentSessionItem {
  name: string;
  quantity: number;
  unit_price: number;
  reference?: string;
  commodity_code?: string;
  unit_of_measure?: string;
  total_amount?: number;
  tax_amount?: number;
  discount_amount?: number;
  url?: string;
  image_url?: string;
}

/** Verified against the `amount_allocations` array item schema. */
export interface PaymentSessionAmountAllocation {
  id: string;
  amount: number;
  reference?: string;
  commission?: {
    amount?: number;
    percentage?: number;
  };
}

/** Verified against `PaymentSessionPaymentPlanRecurring`. */
export interface PaymentSessionPaymentPlanRecurring {
  amount_variability?: 'Fixed' | 'Variable';
  days_between_payments?: number;
  total_number_of_payments?: number;
  current_payment_number?: number;
  expiry?: string;
  name?: string;
  start_date?: string;
  amount?: number;
}

/** Verified against `PaymentSessionPaymentType` (session-specific: no `PayLater`, unlike `/payments`). */
export type PaymentSessionPaymentType =
  'Regular' | 'Recurring' | 'MOTO' | 'Installment' | 'Unscheduled';

/** Verified against the `locale` enum on `CreatePaymentSessionsBaseRequest`. */
export type PaymentSessionLocale =
  | 'ar'
  | 'da-DK'
  | 'de-DE'
  | 'el'
  | 'en-GB'
  | 'es-ES'
  | 'fi-FI'
  | 'fil-PH'
  | 'fr-FR'
  | 'hi-IN'
  | 'id-ID'
  | 'it-IT'
  | 'ja-JP'
  | 'ko-KR'
  | 'ms-MY'
  | 'nb-NO'
  | 'nl-NL'
  | 'pt-PT'
  | 'sv-SE'
  | 'th-TH'
  | 'vi-VN'
  | 'zh-CN'
  | 'zh-HK'
  | 'zh-TW';

/** Verified against `Purpose` (`instruction.purpose`). */
export type PaymentPurpose =
  | 'donations'
  | 'education'
  | 'emergency_need'
  | 'expatriation'
  | 'family_support'
  | 'financial_services'
  | 'gifts'
  | 'income'
  | 'insurance'
  | 'investment'
  | 'it_services'
  | 'leisure'
  | 'loan_payment'
  | 'medical_treatment'
  | 'other'
  | 'pension'
  | 'royalties'
  | 'savings'
  | 'travel_and_tourism';

/**
 * Request body for `POST /payment-sessions`.
 * Field shape/optionality verified field-by-field against Checkout.com's
 * `CreatePaymentSessionsRequest`/`CreatePaymentSessionsBaseRequest` schemas
 * (fetched from Checkout.com's docs MCP). Only `amount`, `currency`, `billing`,
 * `success_url`, `failure_url` are actually required by the API - everything
 * else here is optional and kept for future use/autocomplete.
 */
export interface CreatePaymentSessionRequest {
  amount: number;
  currency: string;
  payment_type?: PaymentSessionPaymentType;
  authorization_type?: 'Final' | 'Estimated';
  billing: {
    address: Address;
    phone?: PhoneNumber;
  };
  billing_descriptor?: PaymentSessionBillingDescriptor;
  reference?: string;
  description?: string;
  customer?: PaymentSessionCustomer;
  shipping?: {
    address?: Address;
    phone?: PhoneNumber;
  };
  /**
   * Required by some processing channels to satisfy card-scheme
   * (e.g. Visa/Mastercard) AFT/domestic-transaction mandate compliance,
   * even for otherwise-Regular payments.
   */
  sender?: PaymentSessionSender;
  recipient?: PaymentSessionRecipient;
  /**
   * Officially unconstrained (`PaymentInterfacesProcessing` has no defined
   * properties in the schema) - `aft` is the field actually needed/used here.
   */
  processing?: {
    aft?: boolean;
  };
  instruction?: {
    purpose?: PaymentPurpose;
  };
  processing_channel_id: string;
  items?: PaymentSessionItem[];
  amount_allocations?: PaymentSessionAmountAllocation[];
  risk?: {
    enabled: boolean;
  };
  display_name?: string;
  success_url: string;
  failure_url: string;
  metadata?: Record<string, string | number | boolean>;
  locale?: PaymentSessionLocale;
  '3ds'?: PaymentSessions3DS;
  capture?: boolean;
  capture_on?: string;
  payment_plan?: PaymentSessionPaymentPlanRecurring;
  expires_on?: string;
  enabled_payment_methods?: PaymentMethod[];
  disabled_payment_methods?: PaymentMethod[];
  payment_method_configuration?: {
    card?: {
      store_payment_details?: StorePaymentDetailsCard;
      account_holder?: AccountHolder;
    };
    applepay?: {
      store_payment_details?: StorePaymentDetails;
      account_holder?: AccountHolder;
      total_type?: 'pending' | 'final';
    };
    googlepay?: {
      store_payment_details?: StorePaymentDetails;
      account_holder?: AccountHolder;
      total_price_status?: 'estimated' | 'final';
    };
    stored_card?: StoredCardConfig;
  };
  customer_retry?: {
    max_attempts: number;
  };
  /** @deprecated Use `risk.device.network.ipv4`/`ipv6` instead. */
  ip_address?: string;
}
