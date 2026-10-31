CREATE TYPE "public"."commission_status" AS ENUM('ACCRUED', 'EARNED', 'REVERSED');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('SCHEDULED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'READY_FOR_PICKUP', 'DELIVERED', 'FAILED', 'RETURNED');--> statement-breakpoint
CREATE TYPE "public"."dispute_reason" AS ENUM('DAMAGED_ITEM', 'WRONG_ITEM', 'MISSING_ITEM', 'UNDELIVERED', 'FRAUD_SUSPECTED', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."dispute_status" AS ENUM('OPEN', 'UNDER_REVIEW', 'RESOLVED_REFUND', 'RESOLVED_REPLACEMENT', 'RESOLVED_SELLER_FAVOR', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."evidence_verification_status" AS ENUM('PENDING', 'VERIFIED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."exchange_status" AS ENUM('PROPOSED', 'ACCEPTED', 'REJECTED', 'PAYMENT_PENDING', 'FEE_CONFIRMED', 'HANDOVER_SCHEDULED', 'HANDOVER_COMPLETED', 'COMPLETED', 'CANCELLED', 'DISPUTED');--> statement-breakpoint
CREATE TYPE "public"."listing_approval_status" AS ENUM('PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."lost_found_status" AS ENUM('OPEN', 'CLAIM_SUBMITTED', 'VERIFIED_RECOVERED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."lost_found_type" AS ENUM('LOST', 'FOUND');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('REQUESTED', 'SELLER_ACCEPTED', 'SELLER_REJECTED', 'PAYMENT_PENDING', 'PAYMENT_SUBMITTED', 'PAYMENT_VERIFIED', 'IN_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."payment_channel" AS ENUM('TELEBIRR', 'CBE_BIRR', 'CBE_TRANSFER', 'AWASH_BIRR', 'BOA_TRANSFER', 'OTHER_BANK');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'PAUSED_DISPUTE');--> statement-breakpoint
CREATE TYPE "public"."product_condition" AS ENUM('NEW', 'LIKE_NEW', 'GOOD', 'FAIR');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('DRAFT', 'PENDING_VALUATION', 'VALUED', 'APPROVED', 'REJECTED', 'SOLD', 'PAUSED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."recovery_claim_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('INITIATED', 'COMPLETED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('guest', 'student', 'admin', 'campus_rep');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" uuid NOT NULL,
	"name" text NOT NULL,
	"details" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"short_code" text NOT NULL,
	"city" text NOT NULL,
	"region" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "institutions_short_code_unique" UNIQUE("short_code")
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city" text NOT NULL,
	"subcity" text,
	"zone" text,
	"specific_hub_or_gate" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "user_role" NOT NULL,
	"permission" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"full_name" text NOT NULL,
	"avatar_url" text,
	"bio" text,
	"preferred_city" text,
	"institution_id" uuid,
	"campus_id" uuid,
	"default_location_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"phone_number" text,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_phone_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"icon_name" text,
	"parent_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "educational_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"material_title" text NOT NULL,
	"author" text,
	"edition" text,
	"field_of_study" text,
	"academic_level" text,
	"isbn" text,
	"ownership_evidence_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "educational_materials_product_id_unique" UNIQUE("product_id")
);
--> statement-breakpoint
CREATE TABLE "listing_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"admin_id" text NOT NULL,
	"status" "listing_approval_status" NOT NULL,
	"feedback_message" text,
	"approved_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"submitted_by_user_id" text NOT NULL,
	"submission_notes" text,
	"status" "listing_approval_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"reporter_id" text NOT NULL,
	"reason" text NOT NULL,
	"details" text,
	"is_resolved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" text NOT NULL,
	"category_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"condition" "product_condition" NOT NULL,
	"is_exchange_eligible" boolean DEFAULT false NOT NULL,
	"is_educational_material" boolean DEFAULT false NOT NULL,
	"status" "product_status" DEFAULT 'DRAFT' NOT NULL,
	"proposed_price" numeric(12, 2) NOT NULL,
	"approved_item_value" numeric(12, 2),
	"commission_rate" numeric(5, 4) DEFAULT '0.0500' NOT NULL,
	"commission_amount" numeric(12, 2),
	"published_price" numeric(12, 2),
	"location_id" uuid,
	"institution_id" uuid,
	"campus_id" uuid,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "valuations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"admin_id" text NOT NULL,
	"proposed_price" numeric(12, 2) NOT NULL,
	"approved_value" numeric(12, 2) NOT NULL,
	"commission_rate" numeric(5, 4) DEFAULT '0.0500' NOT NULL,
	"commission_amount" numeric(12, 2) NOT NULL,
	"final_price" numeric(12, 2) NOT NULL,
	"admin_notes" text,
	"seller_confirmed" boolean DEFAULT false NOT NULL,
	"seller_confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exchange_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exchange_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"role" text NOT NULL,
	"agreed_value" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exchanges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exchange_number" text NOT NULL,
	"requester_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"offered_product_id" uuid NOT NULL,
	"requested_product_id" uuid NOT NULL,
	"status" "exchange_status" DEFAULT 'PROPOSED' NOT NULL,
	"offered_item_approved_value" numeric(12, 2),
	"requested_item_approved_value" numeric(12, 2),
	"cash_difference" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"cash_payer_id" text,
	"estud_fee" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"requester_handover_confirmed" boolean DEFAULT false NOT NULL,
	"receiver_handover_confirmed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exchanges_exchange_number_unique" UNIQUE("exchange_number")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_item_value" numeric(12, 2) NOT NULL,
	"unit_commission_amount" numeric(12, 2) NOT NULL,
	"total_price" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_timeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"status" "order_status" NOT NULL,
	"actor_id" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"buyer_id" text NOT NULL,
	"seller_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"status" "order_status" DEFAULT 'REQUESTED' NOT NULL,
	"item_value" numeric(12, 2) NOT NULL,
	"commission_rate" numeric(5, 4) DEFAULT '0.0500' NOT NULL,
	"commission_amount" numeric(12, 2) NOT NULL,
	"delivery_fee" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"seller_accepted_at" timestamp with time zone,
	"seller_rejected_at" timestamp with time zone,
	"rejection_reason" text,
	"cancelled_at" timestamp with time zone,
	"cancellation_reason" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "commission_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"exchange_id" uuid,
	"item_approved_value" numeric(12, 2) NOT NULL,
	"commission_rate" numeric(5, 4) DEFAULT '0.0500' NOT NULL,
	"commission_earned" numeric(12, 2) NOT NULL,
	"status" "commission_status" DEFAULT 'ACCRUED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"uploader_id" text NOT NULL,
	"bank_transaction_reference" text NOT NULL,
	"sender_account_or_phone" text,
	"screenshot_url" text NOT NULL,
	"notes" text,
	"verification_status" "evidence_verification_status" DEFAULT 'PENDING' NOT NULL,
	"verified_by_admin_id" text,
	"verified_at" timestamp with time zone,
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"exchange_id" uuid,
	"payment_reference" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"channel" "payment_channel" NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"receiving_account_number" text NOT NULL,
	"confirmed_by_admin_id" text,
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_payment_reference_unique" UNIQUE("payment_reference")
);
--> statement-breakpoint
CREATE TABLE "refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"exchange_id" uuid,
	"payment_id" uuid NOT NULL,
	"buyer_id" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"reason" text NOT NULL,
	"refund_channel" "payment_channel" NOT NULL,
	"refund_reference" text,
	"proof_url" text,
	"status" "refund_status" DEFAULT 'INITIATED' NOT NULL,
	"approved_by_admin_id" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"seller_id" text NOT NULL,
	"payout_reference" text NOT NULL,
	"payable_amount" numeric(12, 2) NOT NULL,
	"payout_channel" "payment_channel" NOT NULL,
	"seller_account_number" text NOT NULL,
	"seller_account_name" text NOT NULL,
	"status" "payout_status" DEFAULT 'PENDING' NOT NULL,
	"processed_by_admin_id" text,
	"payout_proof_url" text,
	"notes" text,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seller_payouts_order_id_unique" UNIQUE("order_id"),
	CONSTRAINT "seller_payouts_payout_reference_unique" UNIQUE("payout_reference")
);
--> statement-breakpoint
CREATE TABLE "deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"exchange_id" uuid,
	"tracking_number" text NOT NULL,
	"status" "delivery_status" DEFAULT 'SCHEDULED' NOT NULL,
	"assigned_rep_id" text,
	"pickup_location_id" uuid,
	"pickup_campus_id" uuid,
	"dropoff_location_id" uuid,
	"dropoff_campus_id" uuid,
	"recipient_handover_code" text,
	"delivery_notes" text,
	"failure_reason" text,
	"picked_up_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "deliveries_tracking_number_unique" UNIQUE("tracking_number")
);
--> statement-breakpoint
CREATE TABLE "delivery_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delivery_id" uuid NOT NULL,
	"assigned_agent_id" text NOT NULL,
	"assigned_by_admin_id" text NOT NULL,
	"status" text DEFAULT 'ASSIGNED' NOT NULL,
	"instructions" text,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "dispute_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dispute_id" uuid NOT NULL,
	"uploaded_by_id" text NOT NULL,
	"file_url" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction_disputes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"exchange_id" uuid,
	"dispute_number" text NOT NULL,
	"raised_by_id" text NOT NULL,
	"reason" "dispute_reason" NOT NULL,
	"description" text NOT NULL,
	"status" "dispute_status" DEFAULT 'OPEN' NOT NULL,
	"admin_resolution_summary" text,
	"resolved_by_admin_id" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transaction_disputes_dispute_number_unique" UNIQUE("dispute_number")
);
--> statement-breakpoint
CREATE TABLE "lost_found_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lost_found_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_number" text NOT NULL,
	"reporter_id" text NOT NULL,
	"type" "lost_found_type" NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"approximate_date" date NOT NULL,
	"institution_id" uuid,
	"campus_id" uuid,
	"location_id" uuid,
	"status" "lost_found_status" DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lost_found_reports_report_number_unique" UNIQUE("report_number")
);
--> statement-breakpoint
CREATE TABLE "recovery_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"claimant_id" text NOT NULL,
	"private_proof_description" text NOT NULL,
	"proof_attachment_url" text,
	"status" "recovery_claim_status" DEFAULT 'PENDING' NOT NULL,
	"reviewed_by_admin_id" text,
	"review_notes" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" text,
	"action" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"type" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campuses" ADD CONSTRAINT "campuses_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_default_location_id_locations_id_fk" FOREIGN KEY ("default_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "educational_materials" ADD CONSTRAINT "educational_materials_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_approvals" ADD CONSTRAINT "listing_approvals_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_approvals" ADD CONSTRAINT "listing_approvals_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_submissions" ADD CONSTRAINT "listing_submissions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_submissions" ADD CONSTRAINT "listing_submissions_submitted_by_user_id_users_id_fk" FOREIGN KEY ("submitted_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reports" ADD CONSTRAINT "product_reports_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reports" ADD CONSTRAINT "product_reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "valuations" ADD CONSTRAINT "valuations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "valuations" ADD CONSTRAINT "valuations_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_items" ADD CONSTRAINT "exchange_items_exchange_id_exchanges_id_fk" FOREIGN KEY ("exchange_id") REFERENCES "public"."exchanges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_items" ADD CONSTRAINT "exchange_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_offered_product_id_products_id_fk" FOREIGN KEY ("offered_product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_requested_product_id_products_id_fk" FOREIGN KEY ("requested_product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_cash_payer_id_users_id_fk" FOREIGN KEY ("cash_payer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_timeline" ADD CONSTRAINT "order_timeline_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_timeline" ADD CONSTRAINT "order_timeline_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_records" ADD CONSTRAINT "commission_records_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_records" ADD CONSTRAINT "commission_records_exchange_id_exchanges_id_fk" FOREIGN KEY ("exchange_id") REFERENCES "public"."exchanges"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_evidence" ADD CONSTRAINT "payment_evidence_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_evidence" ADD CONSTRAINT "payment_evidence_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_evidence" ADD CONSTRAINT "payment_evidence_verified_by_admin_id_users_id_fk" FOREIGN KEY ("verified_by_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_exchange_id_exchanges_id_fk" FOREIGN KEY ("exchange_id") REFERENCES "public"."exchanges"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_confirmed_by_admin_id_users_id_fk" FOREIGN KEY ("confirmed_by_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_exchange_id_exchanges_id_fk" FOREIGN KEY ("exchange_id") REFERENCES "public"."exchanges"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_approved_by_admin_id_users_id_fk" FOREIGN KEY ("approved_by_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_payouts" ADD CONSTRAINT "seller_payouts_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_payouts" ADD CONSTRAINT "seller_payouts_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_payouts" ADD CONSTRAINT "seller_payouts_processed_by_admin_id_users_id_fk" FOREIGN KEY ("processed_by_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_exchange_id_exchanges_id_fk" FOREIGN KEY ("exchange_id") REFERENCES "public"."exchanges"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_assigned_rep_id_users_id_fk" FOREIGN KEY ("assigned_rep_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_pickup_location_id_locations_id_fk" FOREIGN KEY ("pickup_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_pickup_campus_id_campuses_id_fk" FOREIGN KEY ("pickup_campus_id") REFERENCES "public"."campuses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_dropoff_location_id_locations_id_fk" FOREIGN KEY ("dropoff_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_dropoff_campus_id_campuses_id_fk" FOREIGN KEY ("dropoff_campus_id") REFERENCES "public"."campuses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_assignments" ADD CONSTRAINT "delivery_assignments_delivery_id_deliveries_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."deliveries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_assignments" ADD CONSTRAINT "delivery_assignments_assigned_agent_id_users_id_fk" FOREIGN KEY ("assigned_agent_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_assignments" ADD CONSTRAINT "delivery_assignments_assigned_by_admin_id_users_id_fk" FOREIGN KEY ("assigned_by_admin_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute_evidence" ADD CONSTRAINT "dispute_evidence_dispute_id_transaction_disputes_id_fk" FOREIGN KEY ("dispute_id") REFERENCES "public"."transaction_disputes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispute_evidence" ADD CONSTRAINT "dispute_evidence_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_disputes" ADD CONSTRAINT "transaction_disputes_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_disputes" ADD CONSTRAINT "transaction_disputes_exchange_id_exchanges_id_fk" FOREIGN KEY ("exchange_id") REFERENCES "public"."exchanges"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_disputes" ADD CONSTRAINT "transaction_disputes_raised_by_id_users_id_fk" FOREIGN KEY ("raised_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_disputes" ADD CONSTRAINT "transaction_disputes_resolved_by_admin_id_users_id_fk" FOREIGN KEY ("resolved_by_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_images" ADD CONSTRAINT "lost_found_images_report_id_lost_found_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."lost_found_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_reports" ADD CONSTRAINT "lost_found_reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_reports" ADD CONSTRAINT "lost_found_reports_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_reports" ADD CONSTRAINT "lost_found_reports_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lost_found_reports" ADD CONSTRAINT "lost_found_reports_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recovery_claims" ADD CONSTRAINT "recovery_claims_report_id_lost_found_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."lost_found_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recovery_claims" ADD CONSTRAINT "recovery_claims_claimant_id_users_id_fk" FOREIGN KEY ("claimant_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recovery_claims" ADD CONSTRAINT "recovery_claims_reviewed_by_admin_id_users_id_fk" FOREIGN KEY ("reviewed_by_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_accounts_user_id" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_accounts_provider" ON "accounts" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "idx_campuses_institution_id" ON "campuses" USING btree ("institution_id");--> statement-breakpoint
CREATE INDEX "idx_institutions_city" ON "institutions" USING btree ("city");--> statement-breakpoint
CREATE INDEX "idx_institutions_short_code" ON "institutions" USING btree ("short_code");--> statement-breakpoint
CREATE INDEX "idx_locations_city_subcity" ON "locations" USING btree ("city","subcity");--> statement-breakpoint
CREATE INDEX "idx_profiles_user_id" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_profiles_institution_campus" ON "profiles" USING btree ("institution_id","campus_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_user_id" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_token" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_phone" ON "users" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "idx_verifications_identifier" ON "verifications" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "idx_categories_slug" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_categories_parent_id" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_edu_materials_field" ON "educational_materials" USING btree ("field_of_study");--> statement-breakpoint
CREATE INDEX "idx_edu_materials_product_id" ON "educational_materials" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_listing_approvals_product_id" ON "listing_approvals" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_listing_approvals_admin_id" ON "listing_approvals" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "idx_listing_submissions_product_id" ON "listing_submissions" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_listing_submissions_status" ON "listing_submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_product_attributes_product_id" ON "product_attributes" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_product_images_product_id" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_product_reports_product_id" ON "product_reports" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_product_reports_resolved" ON "product_reports" USING btree ("is_resolved");--> statement-breakpoint
CREATE INDEX "idx_products_seller_id" ON "products" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "idx_products_category_id" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_products_status" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_products_published_price" ON "products" USING btree ("published_price");--> statement-breakpoint
CREATE INDEX "idx_products_condition" ON "products" USING btree ("condition");--> statement-breakpoint
CREATE INDEX "idx_products_created_at" ON "products" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_products_exchange_eligible" ON "products" USING btree ("is_exchange_eligible");--> statement-breakpoint
CREATE INDEX "idx_valuations_product_id" ON "valuations" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_valuations_admin_id" ON "valuations" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "idx_exchange_items_exchange_id" ON "exchange_items" USING btree ("exchange_id");--> statement-breakpoint
CREATE INDEX "idx_exchanges_exchange_number" ON "exchanges" USING btree ("exchange_number");--> statement-breakpoint
CREATE INDEX "idx_exchanges_requester_id" ON "exchanges" USING btree ("requester_id");--> statement-breakpoint
CREATE INDEX "idx_exchanges_receiver_id" ON "exchanges" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "idx_exchanges_status" ON "exchanges" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_order_items_order_id" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_order_timeline_order_id" ON "order_timeline" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_orders_order_number" ON "orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "idx_orders_buyer_id" ON "orders" USING btree ("buyer_id");--> statement-breakpoint
CREATE INDEX "idx_orders_seller_id" ON "orders" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "idx_orders_product_id" ON "orders" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_orders_created_at" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_commission_order_id" ON "commission_records" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_commission_status" ON "commission_records" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_payment_evidence_payment_id" ON "payment_evidence" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "idx_payment_evidence_status" ON "payment_evidence" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "idx_payment_evidence_bank_ref" ON "payment_evidence" USING btree ("bank_transaction_reference");--> statement-breakpoint
CREATE INDEX "idx_payments_reference" ON "payments" USING btree ("payment_reference");--> statement-breakpoint
CREATE INDEX "idx_payments_order_id" ON "payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_payments_status" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_payments_channel" ON "payments" USING btree ("channel");--> statement-breakpoint
CREATE INDEX "idx_refunds_order_id" ON "refunds" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_refunds_payment_id" ON "refunds" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "idx_refunds_status" ON "refunds" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_payouts_reference" ON "seller_payouts" USING btree ("payout_reference");--> statement-breakpoint
CREATE INDEX "idx_payouts_seller_id" ON "seller_payouts" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "idx_payouts_status" ON "seller_payouts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_deliveries_tracking" ON "deliveries" USING btree ("tracking_number");--> statement-breakpoint
CREATE INDEX "idx_deliveries_order_id" ON "deliveries" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_deliveries_status" ON "deliveries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_deliveries_assigned_rep" ON "deliveries" USING btree ("assigned_rep_id");--> statement-breakpoint
CREATE INDEX "idx_delivery_assignments_delivery_id" ON "delivery_assignments" USING btree ("delivery_id");--> statement-breakpoint
CREATE INDEX "idx_delivery_assignments_agent_id" ON "delivery_assignments" USING btree ("assigned_agent_id");--> statement-breakpoint
CREATE INDEX "idx_dispute_evidence_dispute_id" ON "dispute_evidence" USING btree ("dispute_id");--> statement-breakpoint
CREATE INDEX "idx_disputes_dispute_number" ON "transaction_disputes" USING btree ("dispute_number");--> statement-breakpoint
CREATE INDEX "idx_disputes_order_id" ON "transaction_disputes" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_disputes_raised_by" ON "transaction_disputes" USING btree ("raised_by_id");--> statement-breakpoint
CREATE INDEX "idx_disputes_status" ON "transaction_disputes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_lf_images_report_id" ON "lost_found_images" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "idx_lost_found_report_number" ON "lost_found_reports" USING btree ("report_number");--> statement-breakpoint
CREATE INDEX "idx_lost_found_type" ON "lost_found_reports" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_lost_found_reporter_id" ON "lost_found_reports" USING btree ("reporter_id");--> statement-breakpoint
CREATE INDEX "idx_lost_found_status" ON "lost_found_reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_lost_found_institution" ON "lost_found_reports" USING btree ("institution_id");--> statement-breakpoint
CREATE INDEX "idx_claims_report_id" ON "recovery_claims" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "idx_claims_claimant_id" ON "recovery_claims" USING btree ("claimant_id");--> statement-breakpoint
CREATE INDEX "idx_claims_status" ON "recovery_claims" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_actor_id" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_target" ON "audit_logs" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_id" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_is_read" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "idx_notifications_created_at" ON "notifications" USING btree ("created_at");