interface PaymentSessionResponse {
  id: string;
  [key: string]: unknown;
}

async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

function triggerToast(id: string): void {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  element.classList.add('show');

  setTimeout(() => {
    element.classList.remove('show');
  }, 5000);
}

void (async () => {
  const publicKey = window.__CKO_PUBLIC_KEY__;

  const response = await fetch('/create-payment-sessions', { method: 'POST' });
  const paymentSession = await parseJson<PaymentSessionResponse>(response);

  if (!response.ok) {
    console.error('Error creating payment session', paymentSession);
    return;
  }

  const checkout = await CheckoutWebComponents({
    publicKey,
    environment: 'sandbox',
    locale: 'en-GB',
    paymentSession,
    onReady: () => {
      console.log('onReady');
    },
    onPaymentCompleted: (_component, paymentResponse) => {
      console.log('Create Payment with PaymentId: ', paymentResponse['id']);
    },
    onChange: (component) => {
      console.log(
        `onChange() -> isValid: "${String(component.isValid())}" for "${component.type}"`,
      );
    },
    onError: (component, error) => {
      console.log('onError', error, 'Component', component.type);
    },
  });

  const flowComponent = checkout.create('flow');

  const authenticationComponent = checkout.create('authentication', {
    onChange: (_self: unknown, data: unknown) => {
      console.log(_self);
      console.log(data);
    },
  });

  const authenticationContainer = document.getElementById('authentication-container');
  if (authenticationContainer) {
    authenticationComponent.mount(authenticationContainer);
  }

  const flowContainer = document.getElementById('flow-container');
  if (flowContainer) {
    flowComponent.mount(flowContainer);
  }
})();

const urlParams = new URLSearchParams(window.location.search);
const paymentStatus = urlParams.get('status');
const paymentId = urlParams.get('cko-payment-id');

if (paymentStatus === 'succeeded') {
  triggerToast('successToast');
}

if (paymentStatus === 'failed') {
  triggerToast('failedToast');
}

if (paymentId) {
  console.log('Create Payment with PaymentId: ', paymentId);
}
