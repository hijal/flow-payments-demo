import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import express, { type Request, type Response } from 'express';
import { env } from './env';
import { parseJsonSafely } from './http';
import type { CreatePaymentSessionRequest } from './types';
import { DEMO_USER, splitName } from './users';

// This processing channel is configured account-wide for Account Funding
// Transactions, so every card payment is a Visa AFT. Visa's AFT mandate
// requires `sender` and `recipient` (with a valid card `account_number`) on
// the request, or it declines with 43102 ("invalid_customer_data" via Flow).
// The payer's card isn't known server-side before tokenization, so the
// recipient is a separate, already-known funded account/card standing in
// for the real destination - swap it for your actual funded account.
const DEMO_RECIPIENT_CARD = '5436031030606378';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.render('index', {
    publicKey: env.CKO_PUBLIC_KEY,
    environment: env.CKO_ENVIRONMENT,
  });
});

app.post('/create-payment-sessions', async (_req: Request, res: Response) => {
  const appBaseUrl = `http://localhost:${env.PORT}`;
  const { firstName, lastName } = splitName(DEMO_USER.name);

  const paymentSession: CreatePaymentSessionRequest = {
    amount: 1000,
    currency: 'GBP',
    reference: `ORD-${randomUUID().slice(0, 8).toUpperCase()}`,
    // Remember Me matches returning customers on `customer.email` and sends
    // the OTP to the phone/email - both come from server-side user data, not
    // the page UI. Omitting `customer` declines remember_me payments with
    // "invalid_payment_session_data".
    customer: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      phone: DEMO_USER.phone,
    },
    billing: {
      address: DEMO_USER.address,
      phone: DEMO_USER.phone,
    },
    shipping: {
      address: DEMO_USER.address,
      phone: DEMO_USER.phone,
    },
    sender: {
      type: 'individual',
      first_name: firstName,
      last_name: lastName,
      address: DEMO_USER.address,
    },
    recipient: {
      first_name: firstName,
      last_name: lastName,
      account_number: DEMO_RECIPIENT_CARD,
      address: DEMO_USER.address,
    },
    processing: {
      aft: true,
    },
    processing_channel_id: env.CKO_PROCESSING_CHANNEL_ID,
    risk: {
      enabled: false,
    },
    success_url: `${appBaseUrl}/?status=succeeded`,
    failure_url: `${appBaseUrl}/?status=failed`,
    enabled_payment_methods: ['card', 'applepay', 'googlepay'],
    authorization_type: 'Estimated',
    // `collect_consent` shows the "Save card details" opt-in for new
    // customers; returning Remember Me customers are recognized via
    // `customer.email` above.
    payment_method_configuration: {
      card: {
        store_payment_details: 'collect_consent',
      },
    },
  };

  let request: globalThis.Response;
  try {
    request = await fetch(env.CKO_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.CKO_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentSession),
    });
  } catch (error) {
    console.error('Failed to reach the Checkout.com API', error);
    res.status(502).send({ error: 'Failed to reach the Checkout.com API' });
    return;
  }

  const parsedPayload = await parseJsonSafely(request);

  res.status(request.status).send(parsedPayload ?? {});
});

app.listen(env.PORT, () => {
  console.log(`Node server listening on port ${env.PORT}: http://localhost:${env.PORT}/`);
});
