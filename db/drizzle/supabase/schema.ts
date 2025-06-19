import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from 'drizzle-orm/pg-core';

export const accountingTypeEnum = pgEnum('accounting_type', ['CASH', 'ACCRUALS']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['draft', 'sent', 'paid', 'overdue', 'cancelled']);
export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);
export const submissionStatusEnum = pgEnum('submission_status', ['draft', 'submitted', 'accepted', 'rejected']);
export const contributionStatusEnum = pgEnum('contribution_status', ['calculated', 'submitted', 'paid', 'overdue']);
export const paymentStatusEnum = pgEnum('payment_status', ['due', 'paid', 'overdue', 'reduced', 'cancelled']);

export const incomeCategoryEnum = pgEnum('income_category', [
  'turnover',
  'other_business_income',
  'uk_property_non_fhl_income',
  'foreign_property_fhl_eea_income',
  'foreign_property_fhl_non_eea_income'
]);

export const expenseCategoryEnum = pgEnum('expense_category', [
  'cost_of_goods_sold',
  'construction_industry_scheme',
  'staff_costs',
  'travel_costs',
  'motor_expenses',
  'premises_running_costs',
  'maintenance_costs',
  'admin_costs',
  'business_entertainment_costs',
  'advertising_costs',
  'interest_on_bank_other_loans',
  'financial_charges',
  'bad_debt',
  'professional_fees',
  'depreciation_costs',
  'other_expenses'
]);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  phone: varchar('phone', { length: 50 }),
  companyName: varchar('company_name', { length: 255 }),
  companyRegistration: varchar('company_registration', { length: 100 }),
  vatNumber: varchar('vat_number', { length: 50 }),
  utrNumber: varchar('utr_number', { length: 50 }),
  niNumber: varchar('ni_number', { length: 50 }),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('email_idx').on(table.email),
  index('phone_idx').on(table.phone),
]);

export const businessDetails = pgTable('business_details', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  businessId: varchar('business_id', { length: 100 }).unique(),
  businessName: varchar('business_name', { length: 255 }),
  businessDescription: text('business_description'),
  addressLine1: varchar('address_line1', { length: 255 }),
  addressLine2: varchar('address_line2', { length: 255 }),
  addressCity: varchar('address_city', { length: 100 }),
  addressCounty: varchar('address_county', { length: 100 }),
  addressPostcode: varchar('address_postcode', { length: 20 }),
  addressCountryCode: varchar('address_country_code', { length: 2 }).default('GB'),
  startDate: varchar('start_date', { length: 10 }),
  accountingType: accountingTypeEnum('accounting_type').default('CASH'),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const bankDetails = pgTable('bank_details', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  bankName: varchar('bank_name', { length: 255 }),
  accountName: varchar('account_name', { length: 255 }),
  accountNumber: varchar('account_number', { length: 50 }),
  sortCode: varchar('sort_code', { length: 10 }),
  iban: varchar('iban', { length: 50 }),
  swiftCode: varchar('swift_code', { length: 20 }),
  isPrimary: boolean('is_primary').default(false),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  clientName: varchar('client_name', { length: 255 }),
  companyName: varchar('company_name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  addressLine1: varchar('address_line1', { length: 255 }),
  addressLine2: varchar('address_line2', { length: 255 }),
  city: varchar('city', { length: 100 }),
  county: varchar('county', { length: 100 }),
  postcode: varchar('postcode', { length: 20 }),
  country: varchar('country', { length: 100 }).default('United Kingdom'),
  vatNumber: varchar('vat_number', { length: 50 }),
  paymentTerms: integer('payment_terms').default(30),
  notes: text('notes'),
  isActive: boolean('is_active').default(true),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('client_user_id_idx').on(table.userId),
  index('client_email_idx').on(table.email),
  index('client_company_name_idx').on(table.companyName),
  index('client_is_active_idx').on(table.isActive),
]);

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  clientId: integer('client_id').references(() => clients.id),
  invoiceNumber: varchar('invoice_number', { length: 100 }).unique(),
  issueDate: varchar('issue_date', { length: 10 }),
  dueDate: varchar('due_date', { length: 10 }),
  paymentDate: varchar('payment_date', { length: 10 }),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).default('0'),
  vatRate: numeric('vat_rate', { precision: 5, scale: 2 }).default('20'),
  vatAmount: numeric('vat_amount', { precision: 10, scale: 2 }).default('0'),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).default('0'),
  status: invoiceStatusEnum('status').default('draft'),
  isPaid: boolean('is_paid').default(false),
  paymentMethod: varchar('payment_method', { length: 100 }),
  notes: text('notes'),
  termsConditions: text('terms_conditions'),
  lateFee: numeric('late_fee', { precision: 10, scale: 2 }).default('0'),
  pdfPath: varchar('pdf_path', { length: 500 }),
  taxYear: varchar('tax_year', { length: 10 }),
  quarter: integer('quarter'),
  isSubmittedToHmrc: boolean('is_submitted_to_hmrc').default(false),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('invoice_user_id_idx').on(table.userId),
  index('invoice_client_id_idx').on(table.clientId),
  index('invoice_status_idx').on(table.status),
  index('invoice_tax_year_quarter_idx').on(table.taxYear, table.quarter),
]);

export const workItems = pgTable('work_items', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }),
  description: text('description'),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).default('1'),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).default('0'),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).default('0'),
  itemOrder: integer('item_order').default(0),
  notes: text('notes'),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const income = pgTable('income', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  businessId: varchar('business_id', { length: 100 }).references(() => businessDetails.businessId),
  invoiceId: integer('invoice_id').references(() => invoices.id),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  description: text('description'),
  dateReceived: varchar('date_received', { length: 10 }),
  category: incomeCategoryEnum('category').default('turnover'),
  customerReference: varchar('customer_reference', { length: 255 }),
  receiptPath: varchar('receipt_path', { length: 500 }),
  vatAmount: numeric('vat_amount', { precision: 10, scale: 2 }).default('0'),
  paymentMethod: varchar('payment_method', { length: 100 }),
  quarter: integer('quarter'),
  taxYear: varchar('tax_year', { length: 10 }),
  isSubmitted: boolean('is_submitted').default(false),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('income_user_id_idx').on(table.userId),
  index('income_business_id_idx').on(table.businessId),
  index('income_invoice_id_idx').on(table.invoiceId),
  index('income_category_idx').on(table.category),
  index('income_date_received_idx').on(table.dateReceived),
  index('income_tax_year_quarter_idx').on(table.taxYear, table.quarter),
]);

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  businessId: varchar('business_id', { length: 100 }).references(() => businessDetails.businessId),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  description: text('description'),
  dateIncurred: varchar('date_incurred', { length: 10 }),
  category: expenseCategoryEnum('category'),
  supplierName: varchar('supplier_name', { length: 255 }),
  receiptPath: varchar('receipt_path', { length: 500 }),
  vatAmount: numeric('vat_amount', { precision: 10, scale: 2 }).default('0'),
  isAllowable: boolean('is_allowable').default(true),
  paymentMethod: varchar('payment_method', { length: 100 }),
  quarter: integer('quarter'),
  taxYear: varchar('tax_year', { length: 10 }),
  isSubmitted: boolean('is_submitted').default(false),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('expense_user_id_idx').on(table.userId),
  index('expense_business_id_idx').on(table.businessId),
  index('expense_category_idx').on(table.category),
  index('expense_date_incurred_idx').on(table.dateIncurred),
  index('expense_tax_year_quarter_idx').on(table.taxYear, table.quarter),
]);

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  description: text('description'),
  transactionDate: varchar('transaction_date', { length: 10 }),
  type: transactionTypeEnum('type'),
  category: varchar('category', { length: 100 }),
  subcategory: varchar('subcategory', { length: 100 }),
  invoiceId: integer('invoice_id').references(() => invoices.id),
  expenseId: integer('expense_id').references(() => expenses.id),
  incomeId: integer('income_id').references(() => income.id),
  paymentMethod: varchar('payment_method', { length: 100 }),
  accountReference: varchar('account_reference', { length: 255 }),
  isReconciled: boolean('is_reconciled').default(false),
  notes: text('notes'),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const quarterlySubmissions = pgTable('quarterly_submissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  businessId: varchar('business_id', { length: 100 }).references(() => businessDetails.businessId),
  taxYear: varchar('tax_year', { length: 10 }),
  quarter: integer('quarter'),
  status: submissionStatusEnum('status').default('draft'),
  submissionDate: varchar('submission_date', { length: 10 }),
  hmrcReceiptId: varchar('hmrc_receipt_id', { length: 255 }),
  totalIncome: numeric('total_income', { precision: 10, scale: 2 }).default('0'),
  totalExpenses: numeric('total_expenses', { precision: 10, scale: 2 }).default('0'),
  netProfit: numeric('net_profit', { precision: 10, scale: 2 }).default('0'),
  periodFromDate: varchar('period_from_date', { length: 10 }),
  periodToDate: varchar('period_to_date', { length: 10 }),
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').default(0),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  uniqueIndex('uniqueSubmission').on(table.userId, table.businessId, table.taxYear, table.quarter),
]);

export const appSettings = pgTable('app_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  defaultPaymentTerms: integer('default_payment_terms').default(30),
  defaultVatRate: numeric('default_vat_rate', { precision: 5, scale: 2 }).default('20'),
  invoicePrefix: varchar('invoice_prefix', { length: 10 }).default('INV'),
  nextInvoiceNumber: integer('next_invoice_number').default(1),
  currency: varchar('currency', { length: 3 }).default('GBP'),
  dateFormat: varchar('date_format', { length: 20 }).default('DD/MM/YYYY'),
  numberFormat: varchar('number_format', { length: 10 }).default('en-GB'),
  autoCalculateQuarters: boolean('auto_calculate_quarters').default(true),
  mtdReminderEnabled: boolean('mtd_reminder_enabled').default(true),
  mtdReminderDays: integer('mtd_reminder_days').default(7),
  autoBackupEnabled: boolean('auto_backup_enabled').default(true),
  lastBackupDate: varchar('last_backup_date', { length: 10 }),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const fileAttachments = pgTable('file_attachments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  fileName: varchar('file_name', { length: 255 }),
  filePath: varchar('file_path', { length: 500 }),
  fileSize: integer('file_size'),
  fileType: varchar('file_type', { length: 50 }),
  mimeType: varchar('mime_type', { length: 100 }),
  invoiceId: integer('invoice_id').references(() => invoices.id),
  expenseId: integer('expense_id').references(() => expenses.id),
  incomeId: integer('income_id').references(() => income.id),
  description: text('description'),
  isReceipt: boolean('is_receipt').default(false),
  isInvoicePdf: boolean('is_invoice_pdf').default(false),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const niContributions = pgTable('ni_contributions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  businessId: varchar('business_id', { length: 100 }).references(() => businessDetails.businessId),
  taxYear: varchar('tax_year', { length: 10 }),
  quarter: integer('quarter'),
  quarterlyProfit: numeric('quarterly_profit', { precision: 10, scale: 2 }).default('0'),
  annualProfitEstimate: numeric('annual_profit_estimate', { precision: 10, scale: 2 }).default('0'),
  class2WeeksLiable: integer('class2_weeks_liable').default(0),
  class2Rate: numeric('class2_rate', { precision: 5, scale: 2 }).default('3.45'),
  class2Due: numeric('class2_due', { precision: 10, scale: 2 }).default('0'),
  class4ProfitBand1: numeric('class4_profit_band1', { precision: 10, scale: 2 }).default('0'),
  class4ProfitBand2: numeric('class4_profit_band2', { precision: 10, scale: 2 }).default('0'),
  class4RateBand1: numeric('class4_rate_band1', { precision: 5, scale: 2 }).default('9.0'),
  class4RateBand2: numeric('class4_rate_band2', { precision: 5, scale: 2 }).default('2.0'),
  class4Due: numeric('class4_due', { precision: 10, scale: 2 }).default('0'),
  totalNiDue: numeric('total_ni_due', { precision: 10, scale: 2 }).default('0'),
  amountPaid: numeric('amount_paid', { precision: 10, scale: 2 }).default('0'),
  paymentDate: varchar('payment_date', { length: 10 }),
  paymentMethod: varchar('payment_method', { length: 100 }),
  paymentReference: varchar('payment_reference', { length: 255 }),
  isPaid: boolean('is_paid').default(false),
  hmrcReference: varchar('hmrc_reference', { length: 255 }),
  submissionDate: varchar('submission_date', { length: 10 }),
  isSubmitted: boolean('is_submitted').default(false),
  status: contributionStatusEnum('status').default('calculated'),
  notes: text('notes'),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  uniqueIndex('uniqueNiContribution').on(table.userId, table.businessId, table.taxYear, table.quarter),
]);

export const incomeTaxCalculations = pgTable('income_tax_calculations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  businessId: varchar('business_id', { length: 100 }).references(() => businessDetails.businessId),
  taxYear: varchar('tax_year', { length: 10 }),
  quarter: integer('quarter'),
  totalIncome: numeric('total_income', { precision: 10, scale: 2 }).default('0'),
  totalAllowableExpenses: numeric('total_allowable_expenses', { precision: 10, scale: 2 }).default('0'),
  taxableProfit: numeric('taxable_profit', { precision: 10, scale: 2 }).default('0'),
  personalAllowance: numeric('personal_allowance', { precision: 10, scale: 2 }).default('12570'),
  taxableIncome: numeric('taxable_income', { precision: 10, scale: 2 }).default('0'),
  basicRateIncome: numeric('basic_rate_income', { precision: 10, scale: 2 }).default('0'),
  higherRateIncome: numeric('higher_rate_income', { precision: 10, scale: 2 }).default('0'),
  additionalRateIncome: numeric('additional_rate_income', { precision: 10, scale: 2 }).default('0'),
  basicRateTax: numeric('basic_rate_tax', { precision: 10, scale: 2 }).default('0'),
  higherRateTax: numeric('higher_rate_tax', { precision: 10, scale: 2 }).default('0'),
  additionalRateTax: numeric('additional_rate_tax', { precision: 10, scale: 2 }).default('0'),
  totalIncomeTaxDue: numeric('total_income_tax_due', { precision: 10, scale: 2 }).default('0'),
  amountPaid: numeric('amount_paid', { precision: 10, scale: 2 }).default('0'),
  paymentDate: varchar('payment_date', { length: 10 }),
  paymentMethod: varchar('payment_method', { length: 100 }),
  paymentReference: varchar('payment_reference', { length: 255 }),
  isPaid: boolean('is_paid').default(false),
  hmrcReference: varchar('hmrc_reference', { length: 255 }),
  submissionDate: varchar('submission_date', { length: 10 }),
  isSubmitted: boolean('is_submitted').default(false),
  status: contributionStatusEnum('status').default('calculated'),
  notes: text('notes'),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  uniqueIndex('uniqueIncomeTax').on(table.userId, table.businessId, table.taxYear, table.quarter),
]);

export const paymentsOnAccount = pgTable('payments_on_account', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  businessId: varchar('business_id', { length: 100 }).references(() => businessDetails.businessId),
  taxYear: varchar('tax_year', { length: 10 }),
  paymentNumber: integer('payment_number'),
  dueDate: varchar('due_date', { length: 10 }),
  amountDue: numeric('amount_due', { precision: 10, scale: 2 }).default('0'),
  previousYearTaxBill: numeric('previous_year_tax_bill', { precision: 10, scale: 2 }).default('0'),
  percentage: numeric('percentage', { precision: 5, scale: 2 }).default('50'),
  amountPaid: numeric('amount_paid', { precision: 10, scale: 2 }).default('0'),
  paymentDate: varchar('payment_date', { length: 10 }),
  paymentMethod: varchar('payment_method', { length: 100 }),
  paymentReference: varchar('payment_reference', { length: 255 }),
  isPaid: boolean('is_paid').default(false),
  hmrcReference: varchar('hmrc_reference', { length: 255 }),
  isSubmitted: boolean('is_submitted').default(false),
  status: paymentStatusEnum('status').default('due'),
  notes: text('notes'),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  uniqueIndex('uniquePaymentOnAccount').on(table.userId, table.businessId, table.taxYear, table.paymentNumber),
]);

export const taxRates = pgTable('tax_rates', {
  id: serial('id').primaryKey(),
  taxYear: varchar('tax_year', { length: 10 }).unique(),
  personalAllowance: numeric('personal_allowance', { precision: 10, scale: 2 }),
  basicRateThreshold: numeric('basic_rate_threshold', { precision: 10, scale: 2 }),
  higherRateThreshold: numeric('higher_rate_threshold', { precision: 10, scale: 2 }),
  basicRatePercentage: numeric('basic_rate_percentage', { precision: 5, scale: 2 }),
  higherRatePercentage: numeric('higher_rate_percentage', { precision: 5, scale: 2 }),
  additionalRatePercentage: numeric('additional_rate_percentage', { precision: 5, scale: 2 }),
  class2WeeklyRate: numeric('class2_weekly_rate', { precision: 5, scale: 2 }),
  class2SmallProfitsThreshold: numeric('class2_small_profits_threshold', { precision: 10, scale: 2 }),
  class4LowerThreshold: numeric('class4_lower_threshold', { precision: 10, scale: 2 }),
  class4UpperThreshold: numeric('class4_upper_threshold', { precision: 10, scale: 2 }),
  class4RateLower: numeric('class4_rate_lower', { precision: 5, scale: 2 }),
  class4RateUpper: numeric('class4_rate_upper', { precision: 5, scale: 2 }),
  vatStandardRate: numeric('vat_standard_rate', { precision: 5, scale: 2 }).default('20'),
  vatRegistrationThreshold: numeric('vat_registration_threshold', { precision: 10, scale: 2 }).default('85000'),
  isCurrent: boolean('is_current').default(false),
  effectiveFrom: varchar('effective_from', { length: 10 }),
  effectiveTo: varchar('effective_to', { length: 10 }),
  last_synced_at: timestamp('last_synced_at'),
  is_synced: boolean('is_synced').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type BusinessDetail = typeof businessDetails.$inferSelect;
export type NewBusinessDetail = typeof businessDetails.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type WorkItem = typeof workItems.$inferSelect;
export type NewWorkItem = typeof workItems.$inferInsert;
export type Income = typeof income.$inferSelect;
export type NewIncome = typeof income.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type QuarterlySubmission = typeof quarterlySubmissions.$inferSelect;
export type NewQuarterlySubmission = typeof quarterlySubmissions.$inferInsert;
export type NiContribution = typeof niContributions.$inferSelect;
export type NewNiContribution = typeof niContributions.$inferInsert;
export type IncomeTaxCalculation = typeof incomeTaxCalculations.$inferSelect;
export type NewIncomeTaxCalculation = typeof incomeTaxCalculations.$inferInsert;
export type PaymentOnAccount = typeof paymentsOnAccount.$inferSelect;
export type NewPaymentOnAccount = typeof paymentsOnAccount.$inferInsert;
export type TaxRate = typeof taxRates.$inferSelect;
export type NewTaxRate = typeof taxRates.$inferInsert;
export type BankDetail = typeof bankDetails.$inferSelect;
export type NewBankDetail = typeof bankDetails.$inferInsert;
export type FileAttachment = typeof fileAttachments.$inferSelect;
export type NewFileAttachment = typeof fileAttachments.$inferInsert;
export type AppSetting = typeof appSettings.$inferSelect;
export type NewAppSetting = typeof appSettings.$inferInsert;