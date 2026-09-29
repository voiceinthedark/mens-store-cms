// filepath: packages/db/src/seed.ts

import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./index";

/**
 * Seeds a default ADMIN user for local development / initial deployment.
 * Safe to re-run — skips creation if the account already exists.
 *
 * Override credentials via env vars:
 *   SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
 */
async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@avantaria.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: "Store",
      lastName: "Admin",
      role: "ADMIN",
    },
  });

  console.log(`Created admin user: ${user.email}`);
  console.log(`   Password: ${password}`);
  console.log("   Please log in and change this password immediately.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
