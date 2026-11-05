import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";
import {
  createHttpClient,
  users,
  sessions,
  accounts,
  verifications,
} from "@estud/db";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_dev");

const db = createHttpClient();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
      },
      isPhoneVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    async sendResetPassword(data) {
      if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_dummy")) {
        console.log(`[Dev] Password reset URL for ${data.user.email}: ${data.url}`);
        return;
      }
      try {
        await resend.emails.send({
          from: "Estud Security <no-reply@estud.et>",
          to: data.user.email,
          subject: "Reset your Estud Password",
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Reset Your Password</h2>
              <p>Click the link below to securely reset your Estud student account password:</p>
              <p><a href="${data.url}" style="background: #16a34a; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Reset Password</a></p>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">If you did not request this, please ignore this email.</p>
            </div>
          `,
        });
      } catch (err) {
        console.error("[Auth] Resend email send failed gracefully:", err);
      }
    },
  },
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},
  emailVerification: {
    sendOnSignUp: false, // Don't block student access on unconfigured email servers
    async sendVerificationEmail(data) {
      if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_dummy")) {
        console.log(`[Dev] Verification URL for ${data.user.email}: ${data.url}`);
        return;
      }
      try {
        await resend.emails.send({
          from: "Estud Marketplace <verify@estud.et>",
          to: data.user.email,
          subject: "Verify your Estud Student Account",
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Welcome to Estud Ethiopia!</h2>
              <p>Please confirm your email address by clicking the link below:</p>
              <p><a href="${data.url}" style="background: #16a34a; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Verify My Account</a></p>
            </div>
          `,
        });
      } catch (err) {
        console.error("[Auth] Resend verification email failed gracefully:", err);
      }
    },
  },
});
