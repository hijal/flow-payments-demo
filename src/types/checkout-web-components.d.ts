import type {
  CheckoutWebComponents as CheckoutWebComponentsInstance,
  Options,
} from '@checkout.com/checkout-web-components';

declare global {
  function CheckoutWebComponents(options: Options): Promise<CheckoutWebComponentsInstance>;

  interface Window {
    __CKO_PUBLIC_KEY__: string;
    __CKO_ENVIRONMENT__: 'sandbox' | 'production';
  }
}

export {};
