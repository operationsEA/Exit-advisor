import * as yup from "yup";

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

  min_price: yup.number().min(0, "Minimum price must be positive").nullable(),

  max_price: yup
    .number()
    .min(0, "Maximum price must be positive")
    .nullable()
    .test(
      "max-greater-than-min",
      "Max price must be greater than min price",
      function (value) {
        const { min_price } = this.parent;
        if (!value || !min_price) return true;
        return value >= min_price;
      },
    ),

  min_revenue: yup
    .number()
    .min(0, "Minimum revenue must be positive")
    .nullable(),

  max_revenue: yup
    .number()
    .min(0, "Maximum revenue must be positive")
    .nullable()
    .test(
      "max-greater-than-min",
      "Max revenue must be greater than min revenue",
      function (value) {
        const { min_revenue } = this.parent;
        if (!value || !min_revenue) return true;
        return value >= min_revenue;
      },
    ),

  min_cashflow: yup
    .number()
    .min(0, "Minimum cashflow must be positive")
    .nullable(),

  max_cashflow: yup
    .number()
    .min(0, "Maximum cashflow must be positive")
    .nullable()
    .test(
      "max-cashflow-greater-than-min",
      "Max cashflow must be greater than min cashflow",
      function (value) {
        const { min_cashflow } = this.parent;
        if (!value || !min_cashflow) return true;
        return value >= min_cashflow;
      },
    ),

  no_of_employees: yup
    .number()
    .integer("Number of employees must be a whole number")
    .min(0, "Number of employees cannot be negative")
    .nullable(),

  reference_no: yup
    .string()
    .max(100, "Reference number must not exceed 100 characters")
    .nullable(),

  country: yup.string().nullable(),

  state: yup.string().nullable(),

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
