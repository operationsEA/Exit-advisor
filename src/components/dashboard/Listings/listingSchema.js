import * as yup from "yup";

const parseNullableNumber = (value, originalValue) => {
  if (
    originalValue === "" ||
    originalValue === null ||
    typeof originalValue === "undefined"
  ) {
    return null;
  }

  if (typeof originalValue === "string") {
    const normalizedValue = originalValue.replace(/,/g, "").trim();
    if (!normalizedValue) {
      return null;
    }

    const parsedValue = Number(normalizedValue);
    return Number.isNaN(parsedValue) ? Number.NaN : parsedValue;
  }

  return value;
};

const numberField = (label) =>
  yup
    .number()
    .transform(parseNullableNumber)
    .typeError(`${label} must be a valid number`)
    .min(0, `${label} must be positive`)
    .nullable();

export const CURRENCY_OPTIONS = [
  { code: "USD", currency_name: "US Dollar", symbol: "$" },
  { code: "EUR", currency_name: "Euro", symbol: "EUR" },
  { code: "GBP", currency_name: "British Pound", symbol: "GBP" },
  { code: "AED", currency_name: "UAE Dirham", symbol: "AED" },
  { code: "SAR", currency_name: "Saudi Riyal", symbol: "SAR" },
  { code: "INR", currency_name: "Indian Rupee", symbol: "Rs" },
  { code: "CAD", currency_name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", currency_name: "Australian Dollar", symbol: "A$" },
  { code: "JPY", currency_name: "Japanese Yen", symbol: "JPY" },
  { code: "SGD", currency_name: "Singapore Dollar", symbol: "S$" },
];

export const listingEditSchema = yup.object().shape({
  title: yup
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(80, "Title must not exceed 80 characters")
    .required("Title is required"),

  description: yup
    .string()
    .min(500, "Description must be at least 500 characters")
    .max(5000, "Description must not exceed 5000 characters")
    .required("Description is required"),

  business_category: yup.string().required("Business category is required"),

  status: yup
    .string()
    .oneOf(["draft", "available", "loi", "sold"], "Invalid status")
    .required("Status is required"),

  currency: yup
    .string()
    .oneOf(
      CURRENCY_OPTIONS.map((currency) => currency.code),
      "Invalid currency",
    )
    .default("USD")
    .required("Currency is required"),

  min_price: numberField("Price"),

  min_revenue: numberField("Revenue"),

  min_cashflow: numberField("Cashflow"),

  no_of_employees: yup
    .number()
    .integer("Number of employees must be a whole number")
    .min(0, "Number of employees cannot be negative")
    .nullable(),

  reference_no: yup
    .string()
    .trim()
    .max(6, "Reference number must not exceed 6 characters")
    .nullable(),

  country: yup.string().required("Country is required"),

  state: yup.string().nullable(),

  city: yup.string().nullable(),

  is_sba_approved: yup.boolean(),
  has_seller_financing: yup.boolean(),
  is_distressed: yup.boolean(),
  is_remote: yup.boolean(),
  is_featured: yup.boolean(),

  tags: yup
    .array()
    .of(yup.string())
    .max(8, "Maximum 8 tags allowed")
    .default([]),

  links: yup
    .array()
    .of(
      yup.object({
        text: yup.string().trim().required("Link text is required"),
        link: yup
          .string()
          .trim()
          .url("Please enter a valid URL")
          .required("URL is required"),
      }),
    )
    .max(10, "Maximum 10 links allowed")
    .default([]),
});

export const BUSINESS_CATEGORIES = [
  "Retail Store",
  "Restaurant & Café",
  "Technology Startup",
  "Consulting Firm",
  "E-commerce Business",
  "Fitness & Wellness",
  "Real Estate Agency",
  "Marketing Agency",
  "Manufacturing",
  "Professional Services",
  "Software Development",
  "Accounting & Bookkeeping",
  "Travel Agency",
  "Hotel & Lodging",
  "Barbershop & Hair Salon",
  "Cleaning Services",
  "Event Planning",
  "Photography Studio",
  "Automotive Repair",
  "Home Improvement",
  "Insurance Agency",
  "Education & Tutoring",
  "Pet Grooming & Care",
  "Catering Service",
  "Web Design Agency",
  "Dental Clinic",
  "Gym & Fitness Center",
  "Bookkeeping Service",
  "Graphic Design Studio",
  "Landscaping Service",
];

export const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "available", label: "Available" },
  { value: "loi", label: "LOI" },
  { value: "sold", label: "Sold" },
];
