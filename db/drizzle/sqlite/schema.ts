import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email').unique(),
  phone: text('phone'),
  companyName: text('company_name'),
  companyRegistration: text('company_registration'),
  vatNumber: text('vat_number'),
  utrNumber: text('utr_number'),
  niNumber: text('ni_number'),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('email_idx').on(table.email),
  index('phone_idx').on(table.phone),
]);

export const businessDetails = sqliteTable('business_details', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  businessId: text('business_id').unique(),
  businessName: text('business_name'),
  businessDescription: text('business_description'),
  addressLine1: text('address_line1'),
  addressLine2: text('address_line2'),
  addressCity: text('address_city'),
  addressCounty: text('address_county'),
  addressPostcode: text('address_postcode'),
  addressCountryCode: text('address_country_code').default('GB'),
  startDate: text('start_date'),
  accountingType: text('accounting_type', { enum: ['CASH', 'ACCRUALS'] }).default('CASH'),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const bankDetails = sqliteTable('bank_details', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  bankName: text('bank_name'),
  accountName: text('account_name'),
  accountNumber: text('account_number'),
  sortCode: text('sort_code'),
  iban: text('iban'),
  swiftCode: text('swift_code'),
  isPrimary: integer('is_primary', { mode: 'boolean' }).default(false),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const clients = sqliteTable('clients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  clientName: text('client_name'),
  companyName: text('company_name'),
  email: text('email'),
  phone: text('phone'),
  addressLine1: text('address_line1'),
  addressLine2: text('address_line2'),
  city: text('city'),
  county: text('county'),
  postcode: text('postcode'),
  country: text('country').default('United Kingdom'),
  vatNumber: text('vat_number'),
  paymentTerms: integer('payment_terms').default(30),
  notes: text('notes'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('client_user_id_idx').on(table.userId),
  index('client_email_idx').on(table.email),
  index('client_company_name_idx').on(table.companyName),
  index('client_is_active_idx').on(table.isActive),
]);

export const invoices = sqliteTable('invoices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  clientId: integer('client_id').references(() => clients.id),
  invoiceNumber: text('invoice_number').unique(),
  issueDate: text('issue_date'),
  dueDate: text('due_date'),
  paymentDate: text('payment_date'),
  subtotal: real('subtotal').default(0),
  vatRate: real('vat_rate').default(20),
  vatAmount: real('vat_amount').default(0),
  totalAmount: real('total_amount').default(0),
  status: text('status', { enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'] }).default('draft'),
  isPaid: integer('is_paid', { mode: 'boolean' }).default(false),
  paymentMethod: text('payment_method'),
  notes: text('notes'),
  termsConditions: text('terms_conditions'),
  lateFee: real('late_fee').default(0),
  pdfPath: text('pdf_path'),
  taxYear: text('tax_year'),
  quarter: integer('quarter'),
  isSubmittedToHmrc: integer('is_submitted_to_hmrc', { mode: 'boolean' }).default(false),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('invoice_user_id_idx').on(table.userId),
  index('invoice_client_id_idx').on(table.clientId),
  index('invoice_status_idx').on(table.status),
  index('invoice_tax_year_quarter_idx').on(table.taxYear, table.quarter),
]);

export const workItems = sqliteTable('work_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  invoiceId: integer('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }),
  description: text('description'),
  quantity: real('quantity').default(1),
  unitPrice: real('unit_price').default(0),
  totalPrice: real('total_price').default(0),
  itemOrder: integer('item_order').default(0),
  notes: text('notes'),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});


export const income = sqliteTable('income', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  businessId: text('business_id').references(() => businessDetails.businessId),
  invoiceId: integer('invoice_id').references(() => invoices.id),
  amount: real('amount'),
  description: text('description'),
  dateReceived: text('date_received'),
  category: text('category', {
    enum: [
      'turnover',
      'other_business_income',
      'uk_property_non_fhl_income',
      'foreign_property_fhl_eea_income',
      'foreign_property_fhl_non_eea_income'
    ]
  }).default('turnover'),
  customerReference: text('customer_reference'),
  receiptPath: text('receipt_path'),
  vatAmount: real('vat_amount').default(0),
  paymentMethod: text('payment_method'),
  quarter: integer('quarter'),
  taxYear: text('tax_year'),
  isSubmitted: integer('is_submitted', { mode: 'boolean' }).default(false),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('income_user_id_idx').on(table.userId),
  index('income_business_id_idx').on(table.businessId),
  index('income_invoice_id_idx').on(table.invoiceId),
  index('income_category_idx').on(table.category),
  index('income_date_received_idx').on(table.dateReceived),
  index('income_tax_year_quarter_idx').on(table.taxYear, table.quarter),
]);


export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  businessId: text('business_id').references(() => businessDetails.businessId),
  amount: real('amount'),
  description: text('description'),
  dateIncurred: text('date_incurred'),
  category: text('category', {
    enum: [
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
    ]
  }),
  supplierName: text('supplier_name'),
  receiptPath: text('receipt_path'),
  vatAmount: real('vat_amount').default(0),
  isAllowable: integer('is_allowable', { mode: 'boolean' }).default(true),
  paymentMethod: text('payment_method'),
  quarter: integer('quarter'),
  taxYear: text('tax_year'),
  isSubmitted: integer('is_submitted', { mode: 'boolean' }).default(false),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('expense_user_id_idx').on(table.userId),
  index('expense_business_id_idx').on(table.businessId),
  index('expense_category_idx').on(table.category),
  index('expense_date_incurred_idx').on(table.dateIncurred),
  index('expense_tax_year_quarter_idx').on(table.taxYear, table.quarter),
]);


export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  amount: real('amount'),
  description: text('description'),
  transactionDate: text('transaction_date'),
  type: text('type', { enum: ['income', 'expense'] }),
  category: text('category'),
  subcategory: text('subcategory'),
  invoiceId: integer('invoice_id').references(() => invoices.id),
  expenseId: integer('expense_id').references(() => expenses.id),
  incomeId: integer('income_id').references(() => income.id),
  paymentMethod: text('payment_method'),
  accountReference: text('account_reference'),
  isReconciled: integer('is_reconciled', { mode: 'boolean' }).default(false),
  notes: text('notes'),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});


export const quarterlySubmissions = sqliteTable('quarterly_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  businessId: text('business_id').references(() => businessDetails.businessId),
  taxYear: text('tax_year'),
  quarter: integer('quarter'),
  status: text('status', { enum: ['draft', 'submitted', 'accepted', 'rejected'] }).default('draft'),
  submissionDate: text('submission_date'),
  hmrcReceiptId: text('hmrc_receipt_id'),
  totalIncome: real('total_income').default(0),
  totalExpenses: real('total_expenses').default(0),
  netProfit: real('net_profit').default(0),
  periodFromDate: text('period_from_date'),
  periodToDate: text('period_to_date'),
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').default(0),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex('uniqueSubmission').on(table.userId, table.businessId, table.taxYear, table.quarter),
]);


export const appSettings = sqliteTable('app_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  defaultPaymentTerms: integer('default_payment_terms').default(30),
  defaultVatRate: real('default_vat_rate').default(20),
  invoicePrefix: text('invoice_prefix').default('INV'),
  nextInvoiceNumber: integer('next_invoice_number').default(1),
  currency: text('currency').default('GBP'),
  dateFormat: text('date_format').default('DD/MM/YYYY'),
  numberFormat: text('number_format').default('en-GB'),
  autoCalculateQuarters: integer('auto_calculate_quarters', { mode: 'boolean' }).default(true),
  mtdReminderEnabled: integer('mtd_reminder_enabled', { mode: 'boolean' }).default(true),
  mtdReminderDays: integer('mtd_reminder_days').default(7),
  autoBackupEnabled: integer('auto_backup_enabled', { mode: 'boolean' }).default(true),
  lastBackupDate: text('last_backup_date'),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});


export const fileAttachments = sqliteTable('file_attachments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  fileName: text('file_name'),
  filePath: text('file_path'),
  fileSize: integer('file_size'),
  fileType: text('file_type'),
  mimeType: text('mime_type'),
  invoiceId: integer('invoice_id').references(() => invoices.id),
  expenseId: integer('expense_id').references(() => expenses.id),
  incomeId: integer('income_id').references(() => income.id),
  description: text('description'),
  isReceipt: integer('is_receipt', { mode: 'boolean' }).default(false),
  isInvoicePdf: integer('is_invoice_pdf', { mode: 'boolean' }).default(false),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});


export const niContributions = sqliteTable('ni_contributions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  businessId: text('business_id').references(() => businessDetails.businessId),
  taxYear: text('tax_year'),
  quarter: integer('quarter'),
  quarterlyProfit: real('quarterly_profit').default(0),
  annualProfitEstimate: real('annual_profit_estimate').default(0),
  class2WeeksLiable: integer('class2_weeks_liable').default(0),
  class2Rate: real('class2_rate').default(3.45),
  class2Due: real('class2_due').default(0),
  class4ProfitBand1: real('class4_profit_band1').default(0),
  class4ProfitBand2: real('class4_profit_band2').default(0),
  class4RateBand1: real('class4_rate_band1').default(9.0),
  class4RateBand2: real('class4_rate_band2').default(2.0),
  class4Due: real('class4_due').default(0),
  totalNiDue: real('total_ni_due').default(0),
  amountPaid: real('amount_paid').default(0),
  paymentDate: text('payment_date'),
  paymentMethod: text('payment_method'),
  paymentReference: text('payment_reference'),
  isPaid: integer('is_paid', { mode: 'boolean' }).default(false),
  hmrcReference: text('hmrc_reference'),
  submissionDate: text('submission_date'),
  isSubmitted: integer('is_submitted', { mode: 'boolean' }).default(false),
  status: text('status', { enum: ['calculated', 'submitted', 'paid', 'overdue'] }).default('calculated'),
  notes: text('notes'),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex('uniqueNiContribution').on(table.userId, table.businessId, table.taxYear, table.quarter),
]);


export const incomeTaxCalculations = sqliteTable('income_tax_calculations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  businessId: text('business_id').references(() => businessDetails.businessId),
  taxYear: text('tax_year'),
  quarter: integer('quarter'),
  totalIncome: real('total_income').default(0),
  totalAllowableExpenses: real('total_allowable_expenses').default(0),
  taxableProfit: real('taxable_profit').default(0),
  personalAllowance: real('personal_allowance').default(12570),
  taxableIncome: real('taxable_income').default(0),
  basicRateIncome: real('basic_rate_income').default(0),
  higherRateIncome: real('higher_rate_income').default(0),
  additionalRateIncome: real('additional_rate_income').default(0),
  basicRateTax: real('basic_rate_tax').default(0),
  higherRateTax: real('higher_rate_tax').default(0),
  additionalRateTax: real('additional_rate_tax').default(0),
  totalIncomeTaxDue: real('total_income_tax_due').default(0),
  amountPaid: real('amount_paid').default(0),
  paymentDate: text('payment_date'),
  paymentMethod: text('payment_method'),
  paymentReference: text('payment_reference'),
  isPaid: integer('is_paid', { mode: 'boolean' }).default(false),
  hmrcReference: text('hmrc_reference'),
  submissionDate: text('submission_date'),
  isSubmitted: integer('is_submitted', { mode: 'boolean' }).default(false),
  status: text('status', { enum: ['calculated', 'submitted', 'paid', 'overdue'] }).default('calculated'),
  notes: text('notes'),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex('uniqueIncomeTax').on(table.userId, table.businessId, table.taxYear, table.quarter),
]);


export const paymentsOnAccount = sqliteTable('payments_on_account', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  businessId: text('business_id').references(() => businessDetails.businessId),
  taxYear: text('tax_year'),
  paymentNumber: integer('payment_number'),
  dueDate: text('due_date'),
  amountDue: real('amount_due').default(0),
  previousYearTaxBill: real('previous_year_tax_bill').default(0),
  percentage: real('percentage').default(50),
  amountPaid: real('amount_paid').default(0),
  paymentDate: text('payment_date'),
  paymentMethod: text('payment_method'),
  paymentReference: text('payment_reference'),
  isPaid: integer('is_paid', { mode: 'boolean' }).default(false),
  hmrcReference: text('hmrc_reference'),
  isSubmitted: integer('is_submitted', { mode: 'boolean' }).default(false),
  status: text('status', { enum: ['due', 'paid', 'overdue', 'reduced', 'cancelled'] }).default('due'),
  notes: text('notes'),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex('uniquePaymentOnAccount').on(table.userId, table.businessId, table.taxYear, table.paymentNumber),
]);


export const taxRates = sqliteTable('tax_rates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  taxYear: text('tax_year').unique(),
  personalAllowance: real('personal_allowance'),
  basicRateThreshold: real('basic_rate_threshold'),
  higherRateThreshold: real('higher_rate_threshold'),
  basicRatePercentage: real('basic_rate_percentage'),
  higherRatePercentage: real('higher_rate_percentage'),
  additionalRatePercentage: real('additional_rate_percentage'),
  class2WeeklyRate: real('class2_weekly_rate'),
  class2SmallProfitsThreshold: real('class2_small_profits_threshold'),
  class4LowerThreshold: real('class4_lower_threshold'),
  class4UpperThreshold: real('class4_upper_threshold'),
  class4RateLower: real('class4_rate_lower'),
  class4RateUpper: real('class4_rate_upper'),
  vatStandardRate: real('vat_standard_rate').default(20),
  vatRegistrationThreshold: real('vat_registration_threshold').default(85000),
  isCurrent: integer('is_current', { mode: 'boolean' }).default(false),
  effectiveFrom: text('effective_from'),
  effectiveTo: text('effective_to'),
  last_synced_at: integer('last_synced_at', { mode: 'timestamp' }),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
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