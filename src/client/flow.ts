interface PaymentSessionResponse {
  id: string;
  [key: string]: unknown;
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isPaymentSessionResponse(payload: unknown): payload is PaymentSessionResponse {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof (payload as Record<string, unknown>)['id'] === 'string'
  );
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

async function mountFlow(): Promise<void> {
  const response = await fetch('/create-payment-sessions', {
    method: 'POST',
  });
  const payload = await parseJsonSafely(response);

  if (!response.ok || !isPaymentSessionResponse(payload)) {
    console.error('Error creating payment session', payload);
    triggerToast('failedToast');
    return;
  }

  const checkout = await CheckoutWebComponents({
    publicKey: window.__CKO_PUBLIC_KEY__,
    environment: window.__CKO_ENVIRONMENT__,
    locale: 'en-GB',
    paymentSession: payload,
    onReady: () => {
      console.log('onReady');
    },
    onPaymentCompleted: (_component, paymentResponse) => {
      console.log('Create Payment with PaymentId: ', paymentResponse.id);
      triggerToast('successToast');
    },
    onChange: (component) => {
      console.log(
        `onChange() -> isValid: "${String(component.isValid())}" for "${component.type}"`,
      );
    },
    onError: (component, error) => {
      console.log('onError', error, 'Component', component.type);
      triggerToast('failedToast');
    },
  });

  const flowContainer = document.getElementById('flow-container');
  if (flowContainer) {
    checkout.create('flow').mount(flowContainer);
  }
}

void mountFlow().catch((error: unknown) => {
  console.error('Error mounting Flow', error);
  triggerToast('failedToast');
});

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
