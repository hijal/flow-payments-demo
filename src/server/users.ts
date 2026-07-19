import type { Address, PhoneNumber } from './types';

export interface DemoUser {
  email: string;
  name: string;
  phone: PhoneNumber;
  address: Address;
}

// Server-side demo customer. Remember Me needs a real `customer.email` (and
// ideally a phone) in the payment session so Checkout can recognize a
// returning customer and deliver the OTP; without it a `remember_me` payment
// declines with "invalid_payment_session_data". This never appears in the
// page UI - a real integration would use the logged-in shopper's details.
// The email matches the Remember Me reference project on this same sandbox
// account, so a card saved there is recognized here too.
export const DEMO_USER: DemoUser = {
  email: 'lehin15988@gicont.com',
  name: 'Checkout Demo',
  phone: { country_code: '+880', number: '1733430951' },
  address: {
    address_line1: 'Flat 3C, House 45, Dhanmondi 11',
    city: 'Dhaka',
    zip: '1212',
    country: 'BD',
  },
};

export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? fullName;
  // The AFT sender requires a last name, so single-word names duplicate the
  // first name into it rather than sending an empty string.
  return { firstName: first, lastName: parts.length > 1 ? parts.slice(1).join(' ') : first };
}
