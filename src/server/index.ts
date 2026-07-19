import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import express, { type Request, type Response } from 'express';
import { env } from './env';
import { parseJsonSafely } from './http';
import type { CreatePaymentSessionRequest } from './types';
import { DEMO_USER, splitName } from './users';

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
    customer: {},
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
