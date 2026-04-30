import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export type User = Prisma.UserGetPayload<object>;

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        primarySession: { include: { recommendation: true } },
      },
    });
  }

  create(data: {
    name: string;
    email: string;
    companyName: string;
    phone?: string | null;
    passwordHash: string;
    clientType?: any;
    role?: any;
    isVerified?: boolean;
    isActive?: boolean;
    onboardingDone?: boolean;
    lastLoginAt?: Date;
  }) {
    return prisma.user.create({ data });
  }

  update(id: string, data: Record<string, unknown>) {
    return prisma.user.update({ where: { id }, data });
  }

  findAll(pagination: { skip: number; limit: number }) {
    return prisma.user.findMany({ skip: pagination.skip, take: pagination.limit, orderBy: { createdAt: 'desc' } });
  }

  delete(id: string) {
    return prisma.user.delete({ where: { id } }).then(() => undefined);
  }
}
