import { z } from "zod"

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
const timestampSchema = z.string().optional()
const positiveNumberSchema = z.number().min(0)
const booleanIntSchema = z
  .union([z.literal(0), z.literal(1)])
  .transform(val => Boolean(val))

export const userSchema = z.object({
  id: z.number().int().positive().optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  companyName: z.string().max(200).optional(),
  companyRegistration: z.string().max(50).optional(),
  vatNumber: z.string().max(20).optional(),
  utrNumber: z.string().max(20).optional(),
  niNumber: z.string().max(15).optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const businessDetailsSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  businessId: z.string().max(50).optional(),
  businessName: z.string().max(200).optional(),
  businessDescription: z.string().optional(),
  addressLine1: z.string().max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  addressCity: z.string().max(100).optional(),
  addressCounty: z.string().max(100).optional(),
  addressPostcode: z.string().max(20).optional(),
  addressCountryCode: z.string().length(2).default("GB"),
  startDate: dateStringSchema,
  accountingType: z.enum(["CASH", "ACCRUALS"]).default("CASH"),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const bankDetailsSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  bankName: z.string().max(100).optional(),
  accountName: z.string().max(100).optional(),
  accountNumber: z.string().max(20).optional(),
  sortCode: z.string().max(10).optional(),
  iban: z.string().max(50).optional(),
  swiftCode: z.string().max(20).optional(),
  isPrimary: booleanIntSchema.default(0),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const clientSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  clientName: z.string().max(200).optional(),
  companyName: z.string().max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  addressLine1: z.string().max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  county: z.string().max(100).optional(),
  postcode: z.string().max(20).optional(),
  country: z.string().max(100).default("United Kingdom"),
  vatNumber: z.string().max(20).optional(),
  paymentTerms: z.number().int().min(0).default(30),
  notes: z.string().optional(),
  isActive: booleanIntSchema.default(1),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const invoiceSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  clientId: z.number().int().positive(),
  invoiceNumber: z.string().max(50),
  issueDate: dateStringSchema,
  dueDate: dateStringSchema,
  paymentDate: dateStringSchema,
  subtotal: positiveNumberSchema.default(0),
  vatRate: positiveNumberSchema.default(20),
  vatAmount: positiveNumberSchema.default(0),
  totalAmount: positiveNumberSchema.default(0),
  status: z
    .enum(["draft", "sent", "paid", "overdue", "cancelled"])
    .default("draft"),
  isPaid: booleanIntSchema.default(0),
  paymentMethod: z.string().max(50).optional(),
  notes: z.string().optional(),
  termsConditions: z.string().optional(),
  lateFee: positiveNumberSchema.default(0),
  pdfPath: z.string().max(500).optional(),
  taxYear: z.string().max(10).optional(),
  quarter: z.number().int().min(1).max(4).optional(),
  isSubmittedToHmrc: booleanIntSchema.default(0),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const workItemSchema = z.object({
  id: z.number().int().positive().optional(),
  invoiceId: z.number().int().positive(),
  description: z.string().optional(),
  quantity: positiveNumberSchema.default(1),
  unitPrice: positiveNumberSchema.default(0),
  totalPrice: positiveNumberSchema.default(0),
  itemOrder: z.number().int().min(0).default(0),
  notes: z.string().optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

const incomeCategories = [
  "turnover",
  "other_business_income",
  "uk_property_non_fhl_income",
  "foreign_property_fhl_eea_income",
  "foreign_property_fhl_non_eea_income",
] as const

export const incomeSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  businessId: z.string().max(50).optional(),
  invoiceId: z.number().int().positive().optional(),
  amount: positiveNumberSchema,
  description: z.string().optional(),
  dateReceived: dateStringSchema,
  category: z.enum(incomeCategories).default("turnover"),
  customerReference: z.string().max(100).optional(),
  receiptPath: z.string().max(500).optional(),
  vatAmount: positiveNumberSchema.default(0),
  paymentMethod: z.string().max(50).optional(),
  quarter: z.number().int().min(1).max(4).optional(),
  taxYear: z.string().max(10).optional(),
  isSubmitted: booleanIntSchema.default(0),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

const expenseCategories = [
  "cost_of_goods_sold",
  "construction_industry_scheme",
  "staff_costs",
  "travel_costs",
  "motor_expenses",
  "premises_running_costs",
  "maintenance_costs",
  "admin_costs",
  "business_entertainment_costs",
  "advertising_costs",
  "interest_on_bank_other_loans",
  "financial_charges",
  "bad_debt",
  "professional_fees",
  "depreciation_costs",
  "other_expenses",
] as const

export const expenseSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  businessId: z.string().max(50).optional(),
  amount: positiveNumberSchema,
  description: z.string().optional(),
  dateIncurred: dateStringSchema,
  category: z.enum(expenseCategories),
  supplierName: z.string().max(200).optional(),
  receiptPath: z.string().max(500).optional(),
  vatAmount: positiveNumberSchema.default(0),
  isAllowable: booleanIntSchema.default(1),
  paymentMethod: z.string().max(50).optional(),
  quarter: z.number().int().min(1).max(4).optional(),
  taxYear: z.string().max(10).optional(),
  isSubmitted: booleanIntSchema.default(0),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const transactionSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  amount: z.number(),
  description: z.string().optional(),
  transactionDate: dateStringSchema,
  type: z.enum(["income", "expense"]),
  category: z.string().max(100).optional(),
  subcategory: z.string().max(100).optional(),
  invoiceId: z.number().int().positive().optional(),
  expenseId: z.number().int().positive().optional(),
  incomeId: z.number().int().positive().optional(),
  paymentMethod: z.string().max(50).optional(),
  accountReference: z.string().max(100).optional(),
  isReconciled: booleanIntSchema.default(0),
  notes: z.string().optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const quarterlySubmissionSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  businessId: z.string().max(50),
  taxYear: z.string().max(10),
  quarter: z.number().int().min(1).max(4),
  status: z
    .enum(["draft", "submitted", "accepted", "rejected"])
    .default("draft"),
  submissionDate: dateStringSchema,
  hmrcReceiptId: z.string().max(100).optional(),
  totalIncome: positiveNumberSchema.default(0),
  totalExpenses: positiveNumberSchema.default(0),
  netProfit: z.number().default(0),
  periodFromDate: dateStringSchema,
  periodToDate: dateStringSchema,
  errorMessage: z.string().optional(),
  retryCount: z.number().int().min(0).default(0),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const niContributionSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  businessId: z.string().max(50),
  taxYear: z.string().max(10),
  quarter: z.number().int().min(1).max(4),
  quarterlyProfit: z.number().default(0),
  annualProfitEstimate: z.number().default(0),
  class2WeeksLiable: z.number().int().min(0).default(0),
  class2Rate: positiveNumberSchema.default(3.45),
  class2Due: positiveNumberSchema.default(0),
  class4ProfitBand1: positiveNumberSchema.default(0),
  class4ProfitBand2: positiveNumberSchema.default(0),
  class4RateBand1: positiveNumberSchema.default(9.0),
  class4RateBand2: positiveNumberSchema.default(2.0),
  class4Due: positiveNumberSchema.default(0),
  totalNiDue: positiveNumberSchema.default(0),
  amountPaid: positiveNumberSchema.default(0),
  paymentDate: dateStringSchema,
  paymentMethod: z.string().max(50).optional(),
  paymentReference: z.string().max(100).optional(),
  isPaid: booleanIntSchema.default(0),
  hmrcReference: z.string().max(100).optional(),
  submissionDate: dateStringSchema,
  isSubmitted: booleanIntSchema.default(0),
  status: z
    .enum(["calculated", "submitted", "paid", "overdue"])
    .default("calculated"),
  notes: z.string().optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const incomeTaxCalculationSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  businessId: z.string().max(50),
  taxYear: z.string().max(10),
  quarter: z.number().int().min(1).max(4),
  totalIncome: positiveNumberSchema.default(0),
  totalAllowableExpenses: positiveNumberSchema.default(0),
  taxableProfit: z.number().default(0),
  personalAllowance: positiveNumberSchema.default(12570),
  taxableIncome: z.number().default(0),
  basicRateIncome: positiveNumberSchema.default(0),
  higherRateIncome: positiveNumberSchema.default(0),
  additionalRateIncome: positiveNumberSchema.default(0),
  basicRateTax: positiveNumberSchema.default(0),
  higherRateTax: positiveNumberSchema.default(0),
  additionalRateTax: positiveNumberSchema.default(0),
  totalIncomeTaxDue: positiveNumberSchema.default(0),
  amountPaid: positiveNumberSchema.default(0),
  paymentDate: dateStringSchema,
  paymentMethod: z.string().max(50).optional(),
  paymentReference: z.string().max(100).optional(),
  isPaid: booleanIntSchema.default(0),
  hmrcReference: z.string().max(100).optional(),
  submissionDate: dateStringSchema,
  isSubmitted: booleanIntSchema.default(0),
  status: z
    .enum(["calculated", "submitted", "paid", "overdue"])
    .default("calculated"),
  notes: z.string().optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const paymentOnAccountSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  businessId: z.string().max(50),
  taxYear: z.string().max(10),
  paymentNumber: z.number().int().positive(),
  dueDate: dateStringSchema,
  amountDue: positiveNumberSchema.default(0),
  previousYearTaxBill: positiveNumberSchema.default(0),
  percentage: positiveNumberSchema.default(50),
  amountPaid: positiveNumberSchema.default(0),
  paymentDate: dateStringSchema,
  paymentMethod: z.string().max(50).optional(),
  paymentReference: z.string().max(100).optional(),
  isPaid: booleanIntSchema.default(0),
  hmrcReference: z.string().max(100).optional(),
  isSubmitted: booleanIntSchema.default(0),
  status: z
    .enum(["due", "paid", "overdue", "reduced", "cancelled"])
    .default("due"),
  notes: z.string().optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const taxRateSchema = z.object({
  id: z.number().int().positive().optional(),
  taxYear: z.string().max(10),
  personalAllowance: positiveNumberSchema.optional(),
  basicRateThreshold: positiveNumberSchema.optional(),
  higherRateThreshold: positiveNumberSchema.optional(),
  basicRatePercentage: positiveNumberSchema.optional(),
  higherRatePercentage: positiveNumberSchema.optional(),
  additionalRatePercentage: positiveNumberSchema.optional(),
  class2WeeklyRate: positiveNumberSchema.optional(),
  class2SmallProfitsThreshold: positiveNumberSchema.optional(),
  class4LowerThreshold: positiveNumberSchema.optional(),
  class4UpperThreshold: positiveNumberSchema.optional(),
  class4RateLower: positiveNumberSchema.optional(),
  class4RateUpper: positiveNumberSchema.optional(),
  vatStandardRate: positiveNumberSchema.default(20),
  vatRegistrationThreshold: positiveNumberSchema.default(85000),
  isCurrent: booleanIntSchema.default(0),
  effectiveFrom: dateStringSchema,
  effectiveTo: dateStringSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const fileAttachmentSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  fileName: z.string().max(255).optional(),
  filePath: z.string().max(500).optional(),
  fileSize: z.number().int().positive().optional(),
  fileType: z.string().max(50).optional(),
  mimeType: z.string().max(100).optional(),
  invoiceId: z.number().int().positive().optional(),
  expenseId: z.number().int().positive().optional(),
  incomeId: z.number().int().positive().optional(),
  description: z.string().optional(),
  isReceipt: booleanIntSchema.default(0),
  isInvoicePdf: booleanIntSchema.default(0),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export const appSettingSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int().positive(),
  defaultPaymentTerms: z.number().int().min(0).default(30),
  defaultVatRate: positiveNumberSchema.default(20),
  invoicePrefix: z.string().max(10).default("INV"),
  nextInvoiceNumber: z.number().int().positive().default(1),
  currency: z.string().length(3).default("GBP"),
  dateFormat: z.string().max(20).default("DD/MM/YYYY"),
  numberFormat: z.string().max(20).default("en-GB"),
  autoCalculateQuarters: booleanIntSchema.default(1),
  mtdReminderEnabled: booleanIntSchema.default(1),
  mtdReminderDays: z.number().int().min(1).default(7),
  autoBackupEnabled: booleanIntSchema.default(1),
  lastBackupDate: dateStringSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  isSynced: z.boolean().default(false),
  lastSyncedAt: z.string().optional(),
})

export type User = z.infer<typeof userSchema>
export type BusinessDetail = z.infer<typeof businessDetailsSchema>
export type Client = z.infer<typeof clientSchema>
export type Invoice = z.infer<typeof invoiceSchema>
export type WorkItem = z.infer<typeof workItemSchema>
export type Income = z.infer<typeof incomeSchema>
export type Expense = z.infer<typeof expenseSchema>
export type Transaction = z.infer<typeof transactionSchema>
export type QuarterlySubmission = z.infer<typeof quarterlySubmissionSchema>
export type NiContribution = z.infer<typeof niContributionSchema>
export type IncomeTaxCalculation = z.infer<typeof incomeTaxCalculationSchema>
export type PaymentOnAccount = z.infer<typeof paymentOnAccountSchema>
export type TaxRate = z.infer<typeof taxRateSchema>
export type BankDetail = z.infer<typeof bankDetailsSchema>
export type FileAttachment = z.infer<typeof fileAttachmentSchema>
export type AppSetting = z.infer<typeof appSettingSchema>
