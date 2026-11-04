import { auth } from "../src/core/auth";
import { createHttpClient, users, eq } from "@estud/db";

async function seedAdmin() {
  const db = createHttpClient();
  const adminEmail = "murad@gmail.com";

  console.log(`Starting seed/upsert for admin user: ${adminEmail}...`);

  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, adminEmail),
  });

  if (existingUser) {
    console.log(`User ${adminEmail} already exists. Elevating role to 'admin'...`);
    await db
      .update(users)
      .set({
        role: "admin",
        emailVerified: true,
        isActive: true,
      })
      .where(eq(users.id, existingUser.id));
    console.log(`Successfully elevated ${adminEmail} to admin.`);
  } else {
    console.log(`Creating new admin user via Better Auth internal API...`);
    try {
      const res = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: "12345678",
          name: "Murad Admin",
        },
      });

      if (res?.user) {
        await db
          .update(users)
          .set({
            role: "admin",
            emailVerified: true,
            isActive: true,
          })
          .where(eq(users.id, res.user.id));
        console.log(`Successfully registered and granted admin role to ${adminEmail}.`);
      }
    } catch (err: any) {
      console.error("Error signing up through Better Auth API:", err?.message || err);
    }
  }

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
