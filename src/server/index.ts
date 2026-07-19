import 'dotenv/config';
import path from 'node:path';
import express, { type Request, type Response } from 'express';
import { env } from './env';
import { parseJsonSafely } from './http';
import type { CreatePaymentSessionRequest } from './types';

interface CustomerRequestBody {
  name: string;
  email: string;
}

function isCustomerRequestBody(body: unknown): body is CustomerRequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as Record<string, unknown>)['name'] === 'string' &&
    typeof (body as Record<string, unknown>)['email'] === 'string'
  );
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const [firstName, ...rest] = fullName.split(' ');
  const first = firstName ?? fullName;
  return { firstName: first, lastName: rest.join(' ') || first };
}

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
  // Demo defaults only - a real integration would render the logged-in
  // shopper's actual name/email here instead.
  res.render('index', {
    publicKey: env.CKO_PUBLIC_KEY,
    customerName: 'Jia Tsang',
    customerEmail: 'jia.tsang@example.com',
  });
});

app.post('/create-payment-sessions', async (req: Request, res: Response) => {
  const body: unknown = req.body;

  if (!isCustomerRequestBody(body)) {
    res.status(400).send({
      error_type: 'validation_error',
      error_codes: ['customer_name_and_email_required'],
    });
    return;
  }

  const { firstName, lastName } = splitName(body.name);

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
      name: body.name,
      email: body.email,
    },
    sender: {
      type: 'individual',
      first_name: firstName,
      last_name: lastName,
      address: {
        country: 'GB',
      },
    },
    recipient: {
      first_name: firstName,
      last_name: lastName,
      account_number: DEMO_RECIPIENT_CARD,
      address: {
        country: 'GB',
      },
    },
    processing: {
      aft: true,
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
