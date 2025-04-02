import { createHmac } from 'node:crypto';
import env from '../env';
import { unauthorized } from '@hapi/boom';

export function calculateBookingPrice(
  ratePerDay: number,
  numTourists: number,
  distance: number,
  numDays: number
): number {
  const basePrice = ratePerDay * numDays; // Base price for guide service
  const perTouristCost = basePrice * 0.05 * numTourists; // Each tourist adds 20% of base price
  const distanceCost = Math.min(distance * 0.005, 500); // 0.005 per meter, capped at 500
  // console.log({ basePrice, perTouristCost, distanceCost });

  const total = basePrice + perTouristCost + distanceCost;

  return Math.ceil(total);
}

export const generateEsewasignature = (message: string) => {
  return createHmac('sha256', env.ESEWA_SECRET).update(message).digest().toString('base64');
};

interface EsewaResponse {
  transaction_code: string;
  status: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
  signature: string;
}

export const decodeEsewaToken = (token: string): EsewaResponse | null => {
  try {
    const decodedData = Buffer.from(token, 'base64').toString('utf-8');

    return JSON.parse(decodedData);
  } catch (error) {
    throw unauthorized('Invalid token provided');
  }
};

export const verifyEsewaSignature = (response: EsewaResponse): boolean => {
  // Extract signed field names in the exact order
  const signedFields = response.signed_field_names.split(',');
  const dataToSign = signedFields
    .map((field) => {
      const value = response[field as keyof EsewaResponse];

      return `${field}=${value}`;
    })
    .join(',');

  // Generate HMAC-SHA256 signature
  const hmac = createHmac('sha256', env.ESEWA_SECRET);
  hmac.update(dataToSign);
  const generatedSignature = hmac.digest('base64');

  // Compare generated signature with the one in response
  return generatedSignature === response.signature;
};

// Example usage
export const processEsewaToken = (token: string) => {
  const response = decodeEsewaToken(token);
  if (!response) {
    throw unauthorized('Invalid token data');
  }

  if (verifyEsewaSignature(response)) {
    return response;
  } else {
    throw unauthorized('Invalid token');
  }
};
