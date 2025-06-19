CREATE TYPE "public"."accounting_type" AS ENUM('CASH', 'ACCRUALS');--> statement-breakpoint
CREATE TYPE "public"."contribution_status" AS ENUM('calculated', 'submitted', 'paid', 'overdue');--> statement-breakpoint
CREATE TYPE "public"."expense_category" AS ENUM('cost_of_goods_sold', 'construction_industry_scheme', 'staff_costs', 'travel_costs', 'motor_expenses', 'premises_running_costs', 'maintenance_costs', 'admin_costs', 'business_entertainment_costs', 'advertising_costs', 'interest_on_bank_other_loans', 'financial_charges', 'bad_debt', 'professional_fees', 'depreciation_costs', 'other_expenses');--> statement-breakpoint
CREATE TYPE "public"."income_category" AS ENUM('turnover', 'other_business_income', 'uk_property_non_fhl_income', 'foreign_property_fhl_eea_income', 'foreign_property_fhl_non_eea_income');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('due', 'paid', 'overdue', 'reduced', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('draft', 'submitted', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "app_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"default_payment_terms" integer DEFAULT 30,
	"default_vat_rate" numeric(5, 2) DEFAULT '20',
	"invoice_prefix" varchar(10) DEFAULT 'INV',
	"next_invoice_number" integer DEFAULT 1,
	"currency" varchar(3) DEFAULT 'GBP',
	"date_format" varchar(20) DEFAULT 'DD/MM/YYYY',
	"number_format" varchar(10) DEFAULT 'en-GB',
	"auto_calculate_quarters" boolean DEFAULT true,
	"mtd_reminder_enabled" boolean DEFAULT true,
	"mtd_reminder_days" integer DEFAULT 7,
	"auto_backup_enabled" boolean DEFAULT true,
	"last_backup_date" varchar(10),
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bank_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"bank_name" varchar(255),
	"account_name" varchar(255),
	"account_number" varchar(50),
	"sort_code" varchar(10),
	"iban" varchar(50),
	"swift_code" varchar(20),
	"is_primary" boolean DEFAULT false,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"business_id" varchar(100),
	"business_name" varchar(255),
	"business_description" text,
	"address_line1" varchar(255),
	"address_line2" varchar(255),
	"address_city" varchar(100),
	"address_county" varchar(100),
	"address_postcode" varchar(20),
	"address_country_code" varchar(2) DEFAULT 'GB',
	"start_date" varchar(10),
	"accounting_type" "accounting_type" DEFAULT 'CASH',
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "business_details_business_id_unique" UNIQUE("business_id")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"client_name" varchar(255),
	"company_name" varchar(255),
	"email" varchar(255),
	"phone" varchar(50),
	"address_line1" varchar(255),
	"address_line2" varchar(255),
	"city" varchar(100),
	"county" varchar(100),
	"postcode" varchar(20),
	"country" varchar(100) DEFAULT 'United Kingdom',
	"vat_number" varchar(50),
	"payment_terms" integer DEFAULT 30,
	"notes" text,
	"is_active" boolean DEFAULT true,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"business_id" varchar(100),
	"amount" numeric(10, 2),
	"description" text,
	"date_incurred" varchar(10),
	"category" "expense_category",
	"supplier_name" varchar(255),
	"receipt_path" varchar(500),
	"vat_amount" numeric(10, 2) DEFAULT '0',
	"is_allowable" boolean DEFAULT true,
	"payment_method" varchar(100),
	"quarter" integer,
	"tax_year" varchar(10),
	"is_submitted" boolean DEFAULT false,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "file_attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"file_name" varchar(255),
	"file_path" varchar(500),
	"file_size" integer,
	"file_type" varchar(50),
	"mime_type" varchar(100),
	"invoice_id" integer,
	"expense_id" integer,
	"income_id" integer,
	"description" text,
	"is_receipt" boolean DEFAULT false,
	"is_invoice_pdf" boolean DEFAULT false,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "income" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"business_id" varchar(100),
	"invoice_id" integer,
	"amount" numeric(10, 2),
	"description" text,
	"date_received" varchar(10),
	"category" "income_category" DEFAULT 'turnover',
	"customer_reference" varchar(255),
	"receipt_path" varchar(500),
	"vat_amount" numeric(10, 2) DEFAULT '0',
	"payment_method" varchar(100),
	"quarter" integer,
	"tax_year" varchar(10),
	"is_submitted" boolean DEFAULT false,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "income_tax_calculations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"business_id" varchar(100),
	"tax_year" varchar(10),
	"quarter" integer,
	"total_income" numeric(10, 2) DEFAULT '0',
	"total_allowable_expenses" numeric(10, 2) DEFAULT '0',
	"taxable_profit" numeric(10, 2) DEFAULT '0',
	"personal_allowance" numeric(10, 2) DEFAULT '12570',
	"taxable_income" numeric(10, 2) DEFAULT '0',
	"basic_rate_income" numeric(10, 2) DEFAULT '0',
	"higher_rate_income" numeric(10, 2) DEFAULT '0',
	"additional_rate_income" numeric(10, 2) DEFAULT '0',
	"basic_rate_tax" numeric(10, 2) DEFAULT '0',
	"higher_rate_tax" numeric(10, 2) DEFAULT '0',
	"additional_rate_tax" numeric(10, 2) DEFAULT '0',
	"total_income_tax_due" numeric(10, 2) DEFAULT '0',
	"amount_paid" numeric(10, 2) DEFAULT '0',
	"payment_date" varchar(10),
	"payment_method" varchar(100),
	"payment_reference" varchar(255),
	"is_paid" boolean DEFAULT false,
	"hmrc_reference" varchar(255),
	"submission_date" varchar(10),
	"is_submitted" boolean DEFAULT false,
	"status" "contribution_status" DEFAULT 'calculated',
	"notes" text,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"client_id" integer,
	"invoice_number" varchar(100),
	"issue_date" varchar(10),
	"due_date" varchar(10),
	"payment_date" varchar(10),
	"subtotal" numeric(10, 2) DEFAULT '0',
	"vat_rate" numeric(5, 2) DEFAULT '20',
	"vat_amount" numeric(10, 2) DEFAULT '0',
	"total_amount" numeric(10, 2) DEFAULT '0',
	"status" "invoice_status" DEFAULT 'draft',
	"is_paid" boolean DEFAULT false,
	"payment_method" varchar(100),
	"notes" text,
	"terms_conditions" text,
	"late_fee" numeric(10, 2) DEFAULT '0',
	"pdf_path" varchar(500),
	"tax_year" varchar(10),
	"quarter" integer,
	"is_submitted_to_hmrc" boolean DEFAULT false,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "ni_contributions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"business_id" varchar(100),
	"tax_year" varchar(10),
	"quarter" integer,
	"quarterly_profit" numeric(10, 2) DEFAULT '0',
	"annual_profit_estimate" numeric(10, 2) DEFAULT '0',
	"class2_weeks_liable" integer DEFAULT 0,
	"class2_rate" numeric(5, 2) DEFAULT '3.45',
	"class2_due" numeric(10, 2) DEFAULT '0',
	"class4_profit_band1" numeric(10, 2) DEFAULT '0',
	"class4_profit_band2" numeric(10, 2) DEFAULT '0',
	"class4_rate_band1" numeric(5, 2) DEFAULT '9.0',
	"class4_rate_band2" numeric(5, 2) DEFAULT '2.0',
	"class4_due" numeric(10, 2) DEFAULT '0',
	"total_ni_due" numeric(10, 2) DEFAULT '0',
	"amount_paid" numeric(10, 2) DEFAULT '0',
	"payment_date" varchar(10),
	"payment_method" varchar(100),
	"payment_reference" varchar(255),
	"is_paid" boolean DEFAULT false,
	"hmrc_reference" varchar(255),
	"submission_date" varchar(10),
	"is_submitted" boolean DEFAULT false,
	"status" "contribution_status" DEFAULT 'calculated',
	"notes" text,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments_on_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"business_id" varchar(100),
	"tax_year" varchar(10),
	"payment_number" integer,
	"due_date" varchar(10),
	"amount_due" numeric(10, 2) DEFAULT '0',
	"previous_year_tax_bill" numeric(10, 2) DEFAULT '0',
	"percentage" numeric(5, 2) DEFAULT '50',
	"amount_paid" numeric(10, 2) DEFAULT '0',
	"payment_date" varchar(10),
	"payment_method" varchar(100),
	"payment_reference" varchar(255),
	"is_paid" boolean DEFAULT false,
	"hmrc_reference" varchar(255),
	"is_submitted" boolean DEFAULT false,
	"status" "payment_status" DEFAULT 'due',
	"notes" text,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quarterly_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"business_id" varchar(100),
	"tax_year" varchar(10),
	"quarter" integer,
	"status" "submission_status" DEFAULT 'draft',
	"submission_date" varchar(10),
	"hmrc_receipt_id" varchar(255),
	"total_income" numeric(10, 2) DEFAULT '0',
	"total_expenses" numeric(10, 2) DEFAULT '0',
	"net_profit" numeric(10, 2) DEFAULT '0',
	"period_from_date" varchar(10),
	"period_to_date" varchar(10),
	"error_message" text,
	"retry_count" integer DEFAULT 0,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tax_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"tax_year" varchar(10),
	"personal_allowance" numeric(10, 2),
	"basic_rate_threshold" numeric(10, 2),
	"higher_rate_threshold" numeric(10, 2),
	"basic_rate_percentage" numeric(5, 2),
	"higher_rate_percentage" numeric(5, 2),
	"additional_rate_percentage" numeric(5, 2),
	"class2_weekly_rate" numeric(5, 2),
	"class2_small_profits_threshold" numeric(10, 2),
	"class4_lower_threshold" numeric(10, 2),
	"class4_upper_threshold" numeric(10, 2),
	"class4_rate_lower" numeric(5, 2),
	"class4_rate_upper" numeric(5, 2),
	"vat_standard_rate" numeric(5, 2) DEFAULT '20',
	"vat_registration_threshold" numeric(10, 2) DEFAULT '85000',
	"is_current" boolean DEFAULT false,
	"effective_from" varchar(10),
	"effective_to" varchar(10),
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tax_rates_tax_year_unique" UNIQUE("tax_year")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"amount" numeric(10, 2),
	"description" text,
	"transaction_date" varchar(10),
	"type" "transaction_type",
	"category" varchar(100),
	"subcategory" varchar(100),
	"invoice_id" integer,
	"expense_id" integer,
	"income_id" integer,
	"payment_method" varchar(100),
	"account_reference" varchar(255),
	"is_reconciled" boolean DEFAULT false,
	"notes" text,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"phone" varchar(50),
	"company_name" varchar(255),
	"company_registration" varchar(100),
	"vat_number" varchar(50),
	"utr_number" varchar(50),
	"ni_number" varchar(50),
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "work_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer,
	"description" text,
	"quantity" numeric(10, 2) DEFAULT '1',
	"unit_price" numeric(10, 2) DEFAULT '0',
	"total_price" numeric(10, 2) DEFAULT '0',
	"item_order" integer DEFAULT 0,
	"notes" text,
	"last_synced_at" timestamp,
	"is_synced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "app_settings" ADD CONSTRAINT "app_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_details" ADD CONSTRAINT "bank_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_details" ADD CONSTRAINT "business_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_business_id_business_details_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_details"("business_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_income_id_income_id_fk" FOREIGN KEY ("income_id") REFERENCES "public"."income"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_business_id_business_details_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_details"("business_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income_tax_calculations" ADD CONSTRAINT "income_tax_calculations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income_tax_calculations" ADD CONSTRAINT "income_tax_calculations_business_id_business_details_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_details"("business_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ni_contributions" ADD CONSTRAINT "ni_contributions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ni_contributions" ADD CONSTRAINT "ni_contributions_business_id_business_details_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_details"("business_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments_on_account" ADD CONSTRAINT "payments_on_account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments_on_account" ADD CONSTRAINT "payments_on_account_business_id_business_details_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_details"("business_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quarterly_submissions" ADD CONSTRAINT "quarterly_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quarterly_submissions" ADD CONSTRAINT "quarterly_submissions_business_id_business_details_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_details"("business_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_income_id_income_id_fk" FOREIGN KEY ("income_id") REFERENCES "public"."income"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_user_id_idx" ON "clients" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "client_email_idx" ON "clients" USING btree ("email");--> statement-breakpoint
CREATE INDEX "client_company_name_idx" ON "clients" USING btree ("company_name");--> statement-breakpoint
CREATE INDEX "client_is_active_idx" ON "clients" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "expense_user_id_idx" ON "expenses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "expense_business_id_idx" ON "expenses" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "expense_category_idx" ON "expenses" USING btree ("category");--> statement-breakpoint
CREATE INDEX "expense_date_incurred_idx" ON "expenses" USING btree ("date_incurred");--> statement-breakpoint
CREATE INDEX "expense_tax_year_quarter_idx" ON "expenses" USING btree ("tax_year","quarter");--> statement-breakpoint
CREATE INDEX "income_user_id_idx" ON "income" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "income_business_id_idx" ON "income" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "income_invoice_id_idx" ON "income" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "income_category_idx" ON "income" USING btree ("category");--> statement-breakpoint
CREATE INDEX "income_date_received_idx" ON "income" USING btree ("date_received");--> statement-breakpoint
CREATE INDEX "income_tax_year_quarter_idx" ON "income" USING btree ("tax_year","quarter");--> statement-breakpoint
CREATE UNIQUE INDEX "uniqueIncomeTax" ON "income_tax_calculations" USING btree ("user_id","business_id","tax_year","quarter");--> statement-breakpoint
CREATE INDEX "invoice_user_id_idx" ON "invoices" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invoice_client_id_idx" ON "invoices" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "invoice_status_idx" ON "invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invoice_tax_year_quarter_idx" ON "invoices" USING btree ("tax_year","quarter");--> statement-breakpoint
CREATE UNIQUE INDEX "uniqueNiContribution" ON "ni_contributions" USING btree ("user_id","business_id","tax_year","quarter");--> statement-breakpoint
CREATE UNIQUE INDEX "uniquePaymentOnAccount" ON "payments_on_account" USING btree ("user_id","business_id","tax_year","payment_number");--> statement-breakpoint
CREATE UNIQUE INDEX "uniqueSubmission" ON "quarterly_submissions" USING btree ("user_id","business_id","tax_year","quarter");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "phone_idx" ON "users" USING btree ("phone");