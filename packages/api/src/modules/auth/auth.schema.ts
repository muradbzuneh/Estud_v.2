import { z } from "zod";

// Ethiopian phone regex: +251 9... / +251 7... or 09... / 07...
export const ethiopianPhoneRegex = /^(\+251|0)?[97]\d{8}$/;

export const registerSchema = z.object({
  phoneNumber: z
    .string()
    .regex(ethiopianPhoneRegex, "Enter a valid Ethiopian phone number (e.g. 0911223344 or +251911223344)"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  institutionId: z.string().uuid().optional(),
  campusId: z.string().uuid().optional(),
  preferredCity: z.string().optional(),
});

export const loginSchema = z.object({
  phoneNumber: z.string().min(9, "Enter your phone number"),
  password: z.string().min(1, "Enter your password"),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  preferredCity: z.string().optional(),
  institutionId: z.string().uuid().optional(),
  campusId: z.string().uuid().optional(),
  defaultLocationId: z.string().uuid().optional(),
});

export const adminCreateInstitutionSchema = z.object({
  name: z.string().min(3),
  shortCode: z.string().min(2).max(10),
  city: z.string().min(2),
  region: z.string().optional(),
});

export const adminCreateCampusSchema = z.object({
  institutionId: z.string().uuid(),
  name: z.string().min(2),
  details: z.string().optional(),
});

