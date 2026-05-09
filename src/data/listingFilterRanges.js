export const PRICE_LIMITS = [0, 50000000];
export const REVENUE_LIMITS = [0, 150000000];
export const CASHFLOW_LIMITS = [0, 150000000];
export const EMPLOYEE_LIMITS = [0, 1000];

export const PRICE_PRESETS = [
  { label: "Under $1M", min: 0, max: 1000000 },
  { label: "$1M - $5M", min: 1000000, max: 5000000 },
  { label: "$5M - $10M", min: 5000000, max: 10000000 },
  { label: "$10M - $20M", min: 10000000, max: 20000000 },
  { label: "$20M - $35M", min: 20000000, max: 35000000 },
  { label: "$35M - $50M", min: 35000000, max: 50000000 },
];

export const REVENUE_PRESETS = [
  { label: "Under $5M", min: 0, max: 5000000 },
  { label: "$5M - $15M", min: 5000000, max: 15000000 },
  { label: "$15M - $30M", min: 15000000, max: 30000000 },
  { label: "$30M - $60M", min: 30000000, max: 60000000 },
  { label: "$60M - $100M", min: 60000000, max: 100000000 },
  { label: "$100M - $150M", min: 100000000, max: 150000000 },
];

export const CASHFLOW_PRESETS = [
  { label: "Under $1M", min: 0, max: 1000000 },
  { label: "$1M - $5M", min: 1000000, max: 5000000 },
  { label: "$5M - $15M", min: 5000000, max: 15000000 },
  { label: "$15M - $30M", min: 15000000, max: 30000000 },
  { label: "$30M - $75M", min: 30000000, max: 75000000 },
  { label: "$75M - $150M", min: 75000000, max: 150000000 },
];

export const EMPLOYEE_PRESETS = [
  { label: "1 - 10", min: 1, max: 10 },
  { label: "11 - 50", min: 11, max: 50 },
  { label: "51 - 200", min: 51, max: 200 },
  { label: "201 - 500", min: 201, max: 500 },
  { label: "500+", min: 500, max: 1000 },
];
