export type PaymentStatus =
  | "paid"
  | "upcoming"
  | "due_now"
  | "pending_confirmation"
  | "overdue";

export type PaymentType =
  | "deposit"
  | "balance_1"
  | "balance_2"
  | "balance_3"
  | "balance_4"
  | "other";

export type PaymentCurrency = "USD" | "EUR";

export type PaymentInstallmentTemplate = {
  payment_label: string;
  payment_type: PaymentType;
  base_amount: number;
  upgrade_portion: number;
  discount_amount: number;
  total_amount: number;
  currency: PaymentCurrency;
  due_date: string | null;
  status: PaymentStatus;
};

export type PortalPackageTemplate = {
  package_type: string;
  package_name: string;
  total_trip_price: number;
  deposit_amount: number;
  balance_remaining: number;
  room_upgrade_enabled?: boolean;
  room_upgrade_name?: string;
  room_upgrade_total?: number;
  installments: PaymentInstallmentTemplate[];
};

const depositInstallment = (amount: number): PaymentInstallmentTemplate => ({
  payment_label: "Deposit",
  payment_type: "deposit",
  base_amount: amount,
  upgrade_portion: 0,
  discount_amount: 0,
  total_amount: amount,
  currency: "USD",
  due_date: null,
  status: "paid",
});

const balanceDueDates = [
  "2026-11-03",
  "2027-01-18",
] as const;

const balances = (
  amounts: number[],
  firstUpgradePortion = 0,
): PaymentInstallmentTemplate[] =>
  amounts.map((amount, index) => ({
    payment_label: `Balance Payment ${index + 1}`,
    payment_type: `balance_${index + 1}` as PaymentType,
    base_amount: amount,
    upgrade_portion: index === 0 ? firstUpgradePortion : 0,
    discount_amount: 0,
    total_amount: amount + (index === 0 ? firstUpgradePortion : 0),
    currency: "USD",
    due_date: balanceDueDates[index] ?? null,
    status: "upcoming",
  }));

export const PORTAL_PACKAGE_TEMPLATES: PortalPackageTemplate[] = [
  {
    package_type: "early_bird",
    package_name: "Vietnam with Amigas y Más Social – Early Bird",
    total_trip_price: 1800,
    deposit_amount: 350,
    balance_remaining: 1450,
    installments: [depositInstallment(350), ...balances([725, 725])],
  },
  {
    package_type: "early_bird_single_room",
    package_name: "Vietnam with Amigas y Más Social – Early Bird + Single Room",
    total_trip_price: 2265,
    deposit_amount: 350,
    balance_remaining: 1915,
    room_upgrade_enabled: true,
    room_upgrade_name: "Single Room Supplement",
    room_upgrade_total: 465,
    installments: [depositInstallment(350), ...balances([725, 725], 465)],
  },
  {
    package_type: "standard",
    package_name: "Vietnam with Amigas y Más Social – Regular",
    total_trip_price: 1950,
    deposit_amount: 400,
    balance_remaining: 1550,
    installments: [depositInstallment(400), ...balances([775, 775])],
  },
  {
    package_type: "standard_single_room",
    package_name: "Vietnam with Amigas y Más Social – Regular + Single Room",
    total_trip_price: 2415,
    deposit_amount: 400,
    balance_remaining: 2015,
    room_upgrade_enabled: true,
    room_upgrade_name: "Single Room Supplement",
    room_upgrade_total: 465,
    installments: [depositInstallment(400), ...balances([775, 775], 465)],
  },
];

export const getPortalPackageTemplate = (packageType: string) =>
  PORTAL_PACKAGE_TEMPLATES.find((template) => template.package_type === packageType);
