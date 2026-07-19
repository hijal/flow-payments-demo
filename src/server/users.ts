import { fakerEN_GB as faker } from '@faker-js/faker';
import type { Address, PhoneNumber } from './types';

export interface DemoUser {
  email: string;
  name: string;
  phone: PhoneNumber;
  address: Address;
}

function buildDemoUser(): DemoUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: { country_code: '+44', number: `7${faker.string.numeric(9)}` },
    address: {
      address_line1: faker.location.streetAddress(),
      city: faker.location.city(),
      zip: faker.location.zipCode(),
      country: 'GB',
    },
  };
}

export const DEMO_USER: DemoUser = buildDemoUser();

export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? fullName;
  return { firstName: first, lastName: parts.length > 1 ? parts.slice(1).join(' ') : first };
}
