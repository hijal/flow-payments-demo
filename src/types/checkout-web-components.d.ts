export {};

type CheckoutPaymentSession = {
  id: string;
} & Record<string, unknown>;

type CheckoutComponentEventPayload = Record<string, unknown>;

interface TokenizeResult {
  data: { token: string };
}

interface CheckoutComponent {
  mount(elementOrSelector: HTMLElement | string): void;
  isAvailable(): Promise<boolean>;
  isValid(): boolean;
  tokenize(): Promise<TokenizeResult>;
  type: string;
}

type ComponentType = 'flow' | 'card' | 'authentication' | (string & {});

interface CheckoutWebComponentsInstance {
  create(componentType: ComponentType, options?: Record<string, unknown>): CheckoutComponent;
}

interface CheckoutWebComponentsOptions {
  publicKey: string;
  environment: 'sandbox' | 'production';
  locale?: string;
  paymentSession: CheckoutPaymentSession;
  onReady?: () => void;
  onPaymentCompleted?: (
    component: CheckoutComponent,
    payload: CheckoutComponentEventPayload,
  ) => void;
  onChange?: (component: CheckoutComponent, payload: CheckoutComponentEventPayload) => void;
  onError?: (component: CheckoutComponent, error: unknown) => void;
}

declare global {
  function CheckoutWebComponents(
    options: CheckoutWebComponentsOptions,
  ): Promise<CheckoutWebComponentsInstance>;

  interface Window {
    __CKO_PUBLIC_KEY__: string;
  }
}
