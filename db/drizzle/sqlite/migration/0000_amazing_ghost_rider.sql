CREATE TABLE `app_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`default_payment_terms` integer DEFAULT 30,
	`default_vat_rate` real DEFAULT 20,
	`invoice_prefix` text DEFAULT 'INV',
	`next_invoice_number` integer DEFAULT 1,
	`currency` text DEFAULT 'GBP',
	`date_format` text DEFAULT 'DD/MM/YYYY',
	`number_format` text DEFAULT 'en-GB',
	`auto_calculate_quarters` integer DEFAULT true,
	`mtd_reminder_enabled` integer DEFAULT true,
	`mtd_reminder_days` integer DEFAULT 7,
	`auto_backup_enabled` integer DEFAULT true,
	`last_backup_date` text,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bank_details` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`bank_name` text,
	`account_name` text,
	`account_number` text,
	`sort_code` text,
	`iban` text,
	`swift_code` text,
	`is_primary` integer DEFAULT false,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `business_details` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`business_id` text,
	`business_name` text,
	`business_description` text,
	`address_line1` text,
	`address_line2` text,
	`address_city` text,
	`address_county` text,
	`address_postcode` text,
	`address_country_code` text DEFAULT 'GB',
	`start_date` text,
	`accounting_type` text DEFAULT 'CASH',
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `business_details_business_id_unique` ON `business_details` (`business_id`);--> statement-breakpoint
CREATE TABLE `clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`client_name` text,
	`company_name` text,
	`email` text,
	`phone` text,
	`address_line1` text,
	`address_line2` text,
	`city` text,
	`county` text,
	`postcode` text,
	`country` text DEFAULT 'United Kingdom',
	`vat_number` text,
	`payment_terms` integer DEFAULT 30,
	`notes` text,
	`is_active` integer DEFAULT true,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `client_user_id_idx` ON `clients` (`user_id`);--> statement-breakpoint
CREATE INDEX `client_email_idx` ON `clients` (`email`);--> statement-breakpoint
CREATE INDEX `client_company_name_idx` ON `clients` (`company_name`);--> statement-breakpoint
CREATE INDEX `client_is_active_idx` ON `clients` (`is_active`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`business_id` text,
	`amount` real,
	`description` text,
	`date_incurred` text,
	`category` text,
	`supplier_name` text,
	`receipt_path` text,
	`vat_amount` real DEFAULT 0,
	`is_allowable` integer DEFAULT true,
	`payment_method` text,
	`quarter` integer,
	`tax_year` text,
	`is_submitted` integer DEFAULT false,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`business_id`) REFERENCES `business_details`(`business_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `expense_user_id_idx` ON `expenses` (`user_id`);--> statement-breakpoint
CREATE INDEX `expense_business_id_idx` ON `expenses` (`business_id`);--> statement-breakpoint
CREATE INDEX `expense_category_idx` ON `expenses` (`category`);--> statement-breakpoint
CREATE INDEX `expense_date_incurred_idx` ON `expenses` (`date_incurred`);--> statement-breakpoint
CREATE INDEX `expense_tax_year_quarter_idx` ON `expenses` (`tax_year`,`quarter`);--> statement-breakpoint
CREATE TABLE `file_attachments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`file_name` text,
	`file_path` text,
	`file_size` integer,
	`file_type` text,
	`mime_type` text,
	`invoice_id` integer,
	`expense_id` integer,
	`income_id` integer,
	`description` text,
	`is_receipt` integer DEFAULT false,
	`is_invoice_pdf` integer DEFAULT false,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`income_id`) REFERENCES `income`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `income` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`business_id` text,
	`invoice_id` integer,
	`amount` real,
	`description` text,
	`date_received` text,
	`category` text DEFAULT 'turnover',
	`customer_reference` text,
	`receipt_path` text,
	`vat_amount` real DEFAULT 0,
	`payment_method` text,
	`quarter` integer,
	`tax_year` text,
	`is_submitted` integer DEFAULT false,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`business_id`) REFERENCES `business_details`(`business_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `income_user_id_idx` ON `income` (`user_id`);--> statement-breakpoint
CREATE INDEX `income_business_id_idx` ON `income` (`business_id`);--> statement-breakpoint
CREATE INDEX `income_invoice_id_idx` ON `income` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `income_category_idx` ON `income` (`category`);--> statement-breakpoint
CREATE INDEX `income_date_received_idx` ON `income` (`date_received`);--> statement-breakpoint
CREATE INDEX `income_tax_year_quarter_idx` ON `income` (`tax_year`,`quarter`);--> statement-breakpoint
CREATE TABLE `income_tax_calculations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`business_id` text,
	`tax_year` text,
	`quarter` integer,
	`total_income` real DEFAULT 0,
	`total_allowable_expenses` real DEFAULT 0,
	`taxable_profit` real DEFAULT 0,
	`personal_allowance` real DEFAULT 12570,
	`taxable_income` real DEFAULT 0,
	`basic_rate_income` real DEFAULT 0,
	`higher_rate_income` real DEFAULT 0,
	`additional_rate_income` real DEFAULT 0,
	`basic_rate_tax` real DEFAULT 0,
	`higher_rate_tax` real DEFAULT 0,
	`additional_rate_tax` real DEFAULT 0,
	`total_income_tax_due` real DEFAULT 0,
	`amount_paid` real DEFAULT 0,
	`payment_date` text,
	`payment_method` text,
	`payment_reference` text,
	`is_paid` integer DEFAULT false,
	`hmrc_reference` text,
	`submission_date` text,
	`is_submitted` integer DEFAULT false,
	`status` text DEFAULT 'calculated',
	`notes` text,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`business_id`) REFERENCES `business_details`(`business_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniqueIncomeTax` ON `income_tax_calculations` (`user_id`,`business_id`,`tax_year`,`quarter`);--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`client_id` integer,
	`invoice_number` text,
	`issue_date` text,
	`due_date` text,
	`payment_date` text,
	`subtotal` real DEFAULT 0,
	`vat_rate` real DEFAULT 20,
	`vat_amount` real DEFAULT 0,
	`total_amount` real DEFAULT 0,
	`status` text DEFAULT 'draft',
	`is_paid` integer DEFAULT false,
	`payment_method` text,
	`notes` text,
	`terms_conditions` text,
	`late_fee` real DEFAULT 0,
	`pdf_path` text,
	`tax_year` text,
	`quarter` integer,
	`is_submitted_to_hmrc` integer DEFAULT false,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE INDEX `invoice_user_id_idx` ON `invoices` (`user_id`);--> statement-breakpoint
CREATE INDEX `invoice_client_id_idx` ON `invoices` (`client_id`);--> statement-breakpoint
CREATE INDEX `invoice_status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE INDEX `invoice_tax_year_quarter_idx` ON `invoices` (`tax_year`,`quarter`);--> statement-breakpoint
CREATE TABLE `ni_contributions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`business_id` text,
	`tax_year` text,
	`quarter` integer,
	`quarterly_profit` real DEFAULT 0,
	`annual_profit_estimate` real DEFAULT 0,
	`class2_weeks_liable` integer DEFAULT 0,
	`class2_rate` real DEFAULT 3.45,
	`class2_due` real DEFAULT 0,
	`class4_profit_band1` real DEFAULT 0,
	`class4_profit_band2` real DEFAULT 0,
	`class4_rate_band1` real DEFAULT 9,
	`class4_rate_band2` real DEFAULT 2,
	`class4_due` real DEFAULT 0,
	`total_ni_due` real DEFAULT 0,
	`amount_paid` real DEFAULT 0,
	`payment_date` text,
	`payment_method` text,
	`payment_reference` text,
	`is_paid` integer DEFAULT false,
	`hmrc_reference` text,
	`submission_date` text,
	`is_submitted` integer DEFAULT false,
	`status` text DEFAULT 'calculated',
	`notes` text,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`business_id`) REFERENCES `business_details`(`business_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniqueNiContribution` ON `ni_contributions` (`user_id`,`business_id`,`tax_year`,`quarter`);--> statement-breakpoint
CREATE TABLE `payments_on_account` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`business_id` text,
	`tax_year` text,
	`payment_number` integer,
	`due_date` text,
	`amount_due` real DEFAULT 0,
	`previous_year_tax_bill` real DEFAULT 0,
	`percentage` real DEFAULT 50,
	`amount_paid` real DEFAULT 0,
	`payment_date` text,
	`payment_method` text,
	`payment_reference` text,
	`is_paid` integer DEFAULT false,
	`hmrc_reference` text,
	`is_submitted` integer DEFAULT false,
	`status` text DEFAULT 'due',
	`notes` text,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`business_id`) REFERENCES `business_details`(`business_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniquePaymentOnAccount` ON `payments_on_account` (`user_id`,`business_id`,`tax_year`,`payment_number`);--> statement-breakpoint
CREATE TABLE `quarterly_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`business_id` text,
	`tax_year` text,
	`quarter` integer,
	`status` text DEFAULT 'draft',
	`submission_date` text,
	`hmrc_receipt_id` text,
	`total_income` real DEFAULT 0,
	`total_expenses` real DEFAULT 0,
	`net_profit` real DEFAULT 0,
	`period_from_date` text,
	`period_to_date` text,
	`error_message` text,
	`retry_count` integer DEFAULT 0,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`business_id`) REFERENCES `business_details`(`business_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniqueSubmission` ON `quarterly_submissions` (`user_id`,`business_id`,`tax_year`,`quarter`);--> statement-breakpoint
CREATE TABLE `tax_rates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tax_year` text,
	`personal_allowance` real,
	`basic_rate_threshold` real,
	`higher_rate_threshold` real,
	`basic_rate_percentage` real,
	`higher_rate_percentage` real,
	`additional_rate_percentage` real,
	`class2_weekly_rate` real,
	`class2_small_profits_threshold` real,
	`class4_lower_threshold` real,
	`class4_upper_threshold` real,
	`class4_rate_lower` real,
	`class4_rate_upper` real,
	`vat_standard_rate` real DEFAULT 20,
	`vat_registration_threshold` real DEFAULT 85000,
	`is_current` integer DEFAULT false,
	`effective_from` text,
	`effective_to` text,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tax_rates_tax_year_unique` ON `tax_rates` (`tax_year`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`amount` real,
	`description` text,
	`transaction_date` text,
	`type` text,
	`category` text,
	`subcategory` text,
	`invoice_id` integer,
	`expense_id` integer,
	`income_id` integer,
	`payment_method` text,
	`account_reference` text,
	`is_reconciled` integer DEFAULT false,
	`notes` text,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`income_id`) REFERENCES `income`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text,
	`last_name` text,
	`email` text,
	`phone` text,
	`company_name` text,
	`company_registration` text,
	`vat_number` text,
	`utr_number` text,
	`ni_number` text,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `phone_idx` ON `users` (`phone`);--> statement-breakpoint
CREATE TABLE `work_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoice_id` integer,
	`description` text,
	`quantity` real DEFAULT 1,
	`unit_price` real DEFAULT 0,
	`total_price` real DEFAULT 0,
	`item_order` integer DEFAULT 0,
	`notes` text,
	`last_synced_at` integer,
	`is_synced` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE cascade
);
