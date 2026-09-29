// filepath: packages/api/src/services/auth.service.ts

import bcrypt from 'bcryptjs';
import { prisma } from '@store/db'; // Imported from workspace package
import { generateToken } from '../utils/jwt';

export class AuthService {
  static async register(email: string, password: string, firstName: string, lastName: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName },
      select: { id: true, email: true, role: true, firstName: true, lastName: true },
    });

    const token = generateToken({ userId: user.id, role: user.role });
    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({ userId: user.id, role: user.role });
    const { passwordHash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  /**
   * Creates the very first ADMIN user. Intended as a one-time bootstrap
   * step for a fresh deployment — refuses to run if any ADMIN already
   * exists, so it's safe to leave the route registered temporarily.
   */
  static async bootstrapAdmin(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });
    if (existingAdmin) {
      throw new Error('An admin account already exists');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, role: 'ADMIN' },
      select: { id: true, email: true, role: true, firstName: true, lastName: true },
    });

    const token = generateToken({ userId: user.id, role: user.role });
    return { user, token };
  }
}
