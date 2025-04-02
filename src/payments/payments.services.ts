import prisma from '../db';
import { Prisma } from '@prisma/client';

export const createPaymentEntry = (bookingId: string, amount: number) => {
  return prisma.payment.create({ data: { amount, bookingId } });
};

export const updatePaymentById = (id: string, data: Prisma.PaymentUpdateInput) => {
  return prisma.payment.update({ where: { id }, data });
};
