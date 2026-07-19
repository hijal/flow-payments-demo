// Ambient declaration for the `CheckoutWebComponents` global defined at
// runtime by https://checkout-web-components.checkout.com/index.js (loaded
// via <script> in views/index.ejs). The types come from the official
// @checkout.com/checkout-web-components package (a devDependency used for
// types only - the runtime library is still served from the CDN).
import type {
  CheckoutWebComponents as CheckoutWebComponentsInstance,
  Options,
} from '@checkout.com/checkout-web-components';

declare global {
  // The package types the window global as returning the instance directly,
  // but Checkout.com's own CDN examples `await` it - a Promise return type
  // keeps both call styles safe.
  function CheckoutWebComponents(options: Options): Promise<CheckoutWebComponentsInstance>;

  interface Window {
    __CKO_PUBLIC_KEY__: string;
    __CKO_ENVIRONMENT__: 'sandbox' | 'production';
  }
}

export {};
