import 'dotenv/config';
import path from 'node:path';
import express, { type Request, type Response } from 'express';
import { env } from './env';
import { parseJsonSafely } from './http';
import type { CreatePaymentSessionRequest } from './types';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.render('index', { publicKey: env.CKO_PUBLIC_KEY });
});

app.post('/create-payment-sessions', async (_req: Request, res: Response) => {
  const paymentSession: CreatePaymentSessionRequest = {
    amount: 1000,
    currency: 'GBP',
    reference: 'ORD-123A',
    billing: {
      address: {
        country: 'GB',
      },
    },
    customer: {
      name: 'Jia Tsang',
    },
    processing_channel_id: env.CKO_PROCESSING_CHANNEL_ID,
    risk: {
      enabled: false,
    },
    success_url: 'https://example.com/payments/success',
    failure_url: 'https://example.com/payments/failure',
    enabled_payment_methods: ['card', 'applepay', 'googlepay'],
    authorization_type: 'Estimated',
    payment_method_configuration: {
      card: {
        store_payment_details: 'enabled',
      },
    },
  };

  const request = await fetch(env.CKO_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CKO_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentSession),
  });

  const parsedPayload = await parseJsonSafely(request);

  res.status(request.status).send(parsedPayload ?? {});
});

app.listen(env.PORT, () => {
  console.log(`Node server listening on port ${env.PORT}: http://localhost:${env.PORT}/`);
});
