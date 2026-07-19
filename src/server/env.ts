function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function requireEnvironment(name: string): 'sandbox' | 'production' {
  const value = requireEnv(name);
  if (value !== 'sandbox' && value !== 'production') {
    throw new Error(`${name} must be 'sandbox' or 'production', got: ${value}`);
  }
  return value;
}

export const env = {
  CKO_SECRET_KEY: requireEnv('CKO_SECRET_KEY'),
  CKO_PUBLIC_KEY: requireEnv('CKO_PUBLIC_KEY'),
  CKO_PROCESSING_CHANNEL_ID: requireEnv('CKO_PROCESSING_CHANNEL_ID'),
  CKO_ENVIRONMENT: requireEnvironment('CKO_ENVIRONMENT'),
  CKO_API_URL: requireEnv('CKO_API_URL'),
  PORT: process.env['PORT'] ?? '3000',
} as const;
