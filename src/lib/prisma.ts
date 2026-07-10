/* In-memory mock Prisma client for the frontend-only replica.
   No database, no @prisma/client dependency. */

type AnyObj = Record<string, any>;

function matches(rec: AnyObj, where: AnyObj | undefined): boolean {
  if (!where) return true;
  for (const key of Object.keys(where)) {
    const cond = where[key];
    if (
      cond &&
      typeof cond === "object" &&
      !(cond instanceof Date) &&
      !Array.isArray(cond)
    ) {
      for (const op of Object.keys(cond)) {
        if (op === "not") {
          if (rec[key] === cond[op]) return false;
        }
      }
    } else if (rec[key] !== cond) {
      return false;
    }
  }
  return true;
}

function makeModel(data: AnyObj[]) {
  const store: AnyObj[] = data.map((d) => ({ ...d }));
  return {
    findMany: async (args?: AnyObj) => store.filter((r) => matches(r, args?.where)),
    findUnique: async (args?: AnyObj) =>
      store.find((r) => matches(r, args?.where)) ?? null,
    findFirst: async (args?: AnyObj) =>
      store.find((r) => matches(r, args?.where)) ?? null,
    create: async (args?: AnyObj) => {
      const id =
        args?.data?.id ??
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
      const rec = { id, ...(args?.data ?? {}) };
      store.push(rec);
      return rec;
    },
    update: async (args?: AnyObj) => {
      const idx = store.findIndex((r) => matches(r, args?.where));
      if (idx === -1) return { ...(args?.data ?? {}) };
      store[idx] = { ...store[idx], ...(args?.data ?? {}) };
      return store[idx];
    },
    delete: async (args?: AnyObj) => {
      const idx = store.findIndex((r) => matches(r, args?.where));
      const rec = idx === -1 ? { id: args?.where?.id ?? "deleted" } : store[idx];
      if (idx !== -1) store.splice(idx, 1);
      return rec;
    },
    count: async (args?: AnyObj) =>
      store.filter((r) => matches(r, args?.where)).length,
    aggregate: async () => ({
      _sum: {
        amount: store.reduce((s, r) => s + (Number(r.amount) || 0), 0),
      },
    }),
  };
}

const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * 86400000);

const members: AnyObj[] = [
  {
    id: "m1",
    membershipNo: "COOP-001",
    name: "Chanda Banda",
    phone: "+260977123001",
    email: "chanda.banda@example.com",
    passwordHash: "mock-hash",
    farmLocation: "Chongwe",
    status: "ACTIVE",
    joinedAt: daysAgo(420),
  },
  {
    id: "m2",
    membershipNo: "COOP-002",
    name: "Mwape Lungu",
    phone: "+260977123002",
    email: "mwape.lungu@example.com",
    passwordHash: "mock-hash",
    farmLocation: "Mazabuka",
    status: "ACTIVE",
    joinedAt: daysAgo(360),
  },
  {
    id: "m3",
    membershipNo: "COOP-003",
    name: "Grace Mwanza",
    phone: "+260977123003",
    email: "grace.mwanza@example.com",
    passwordHash: "mock-hash",
    farmLocation: "Monze",
    status: "ACTIVE",
    joinedAt: daysAgo(300),
  },
  {
    id: "m4",
    membershipNo: "COOP-004",
    name: "Tobias Phiri",
    phone: "+260977123004",
    email: "tobias.phiri@example.com",
    passwordHash: "mock-hash",
    farmLocation: "Chipata",
    status: "PENDING",
    joinedAt: daysAgo(40),
  },
  {
    id: "m5",
    membershipNo: "COOP-005",
    name: "Naomi Sakala",
    phone: "+260977123005",
    email: "naomi.sakala@example.com",
    passwordHash: "mock-hash",
    farmLocation: "Kafue",
    status: "ACTIVE",
    joinedAt: daysAgo(120),
  },
];

const adminUsers: AnyObj[] = [
  {
    id: "admin-1",
    name: "Demo Admin",
    email: "admin@coop.example",
    role: "SUPER_ADMIN",
    passwordHash: "mock-hash",
    lastLogin: daysAgo(1),
  },
  {
    id: "admin-2",
    name: "Mary Chileshe",
    email: "mary@coop.example",
    role: "ADMIN",
    passwordHash: "mock-hash",
    lastLogin: daysAgo(3),
  },
];

const produceListings: AnyObj[] = [
  {
    id: "l1",
    name: "Hass Avocado",
    description: "Premium grade Hass avocados, farm-fresh.",
    unitPrice: 45,
    quantityKg: 500,
    status: "ACTIVE",
    createdAt: daysAgo(60),
  },
  {
    id: "l2",
    name: "Fuerte Avocado",
    description: "Smooth-skinned Fuerte avocados.",
    unitPrice: 40,
    quantityKg: 300,
    status: "ACTIVE",
    createdAt: daysAgo(55),
  },
  {
    id: "l3",
    name: "Organic Bananas",
    description: "Organic dessert bananas, ripened naturally.",
    unitPrice: 20,
    quantityKg: 800,
    status: "ACTIVE",
    createdAt: daysAgo(30),
  },
];

const orders: AnyObj[] = [
  {
    id: "o1",
    reference: "COOP-1001",
    buyerName: "John Bwalya",
    buyerPhone: "+260966111001",
    buyerEmail: "john.bwalya@example.com",
    isBulk: false,
    totalAmount: 4500,
    status: "CONFIRMED",
    createdAt: daysAgo(20),
    items: [
      {
        id: "oi1",
        listingId: "l1",
        quantityKg: 100,
        unitPrice: 45,
        listing: produceListings[0],
      },
    ],
    payment: {
      id: "pay1",
      status: "SUCCESS",
      amount: 4500,
      provider: "MTN_MOMO",
      providerRef: "MOMO-REF-1001",
      loggedAt: daysAgo(20),
    },
  },
  {
    id: "o2",
    reference: "COOP-1002",
    buyerName: "Lusaka Wholesale Ltd",
    buyerPhone: "+260966111002",
    buyerEmail: "orders@lusakawholesale.example",
    isBulk: true,
    totalAmount: 12000,
    status: "PENDING",
    createdAt: daysAgo(12),
    items: [
      {
        id: "oi2",
        listingId: "l2",
        quantityKg: 300,
        unitPrice: 40,
        listing: produceListings[1],
      },
    ],
    payment: null,
  },
];

const payments: AnyObj[] = [
  {
    id: "pay1",
    orderId: "o1",
    provider: "MTN_MOMO",
    providerRef: "MOMO-REF-1001",
    amount: 4500,
    status: "SUCCESS",
    loggedAt: daysAgo(20),
    order: { reference: "COOP-1001", status: "CONFIRMED" },
  },
];

const contributions: AnyObj[] = [
  {
    id: "con1",
    memberId: "m1",
    amount: 1200,
    quantityKg: 30,
    produceListingId: "l1",
    deliveredAt: daysAgo(25),
  },
  {
    id: "con2",
    memberId: "m1",
    amount: 800,
    quantityKg: 20,
    produceListingId: "l2",
    deliveredAt: daysAgo(15),
  },
  {
    id: "con3",
    memberId: "m2",
    amount: 1500,
    quantityKg: 40,
    produceListingId: "l3",
    deliveredAt: daysAgo(10),
  },
];

const payouts: AnyObj[] = [
  {
    id: "po1",
    memberId: "m1",
    amount: 1800,
    status: "PAID",
    paidAt: daysAgo(8),
  },
  {
    id: "po2",
    memberId: "m2",
    amount: 1400,
    status: "PAID",
    paidAt: daysAgo(6),
  },
];

const contentPages: AnyObj[] = [
  {
    id: "cp1",
    slug: "home",
    title: "Welcome to Coop",
    content:
      "Coop is a farmers' cooperative connecting smallholder growers with fair markets for their produce.",
    published: true,
    updatedAt: daysAgo(5),
  },
  {
    id: "cp2",
    slug: "about",
    title: "About Coop",
    content:
      "We are a member-owned cooperative built to strengthen rural livelihoods through collective marketing, transparent payments, and shared growth.",
    published: true,
    updatedAt: daysAgo(5),
  },
  {
    id: "cp3",
    slug: "contact",
    title: "Contact Us",
    content:
      "Reach the Coop team by phone or email. We are happy to help members and buyers alike.",
    published: true,
    updatedAt: daysAgo(5),
  },
];

const shareCertificates: AnyObj[] = [
  {
    id: "sc1",
    memberId: "m1",
    certificateNo: "SH-0001",
    shares: 50,
    issuedAt: daysAgo(200),
  },
  {
    id: "sc2",
    memberId: "m2",
    certificateNo: "SH-0002",
    shares: 30,
    issuedAt: daysAgo(180),
  },
];

const memberPayments: AnyObj[] = [
  {
    id: "mp1",
    memberId: "m1",
    amount: 600,
    method: "MTN_MOMO",
    status: "SUCCESS",
    paidAt: daysAgo(7),
  },
  {
    id: "mp2",
    memberId: "m3",
    amount: 450,
    method: "CASH",
    status: "SUCCESS",
    paidAt: daysAgo(4),
  },
];

export const prisma: any = {
  member: makeModel(members),
  adminUser: makeModel(adminUsers),
  contribution: makeModel(contributions),
  payout: makeModel(payouts),
  produceListing: makeModel(produceListings),
  order: makeModel(orders),
  orderItem: makeModel(orders.flatMap((o) => o.items ?? [])),
  payment: makeModel(payments),
  contentPage: makeModel(contentPages),
  auditLog: makeModel([]),
  shareCertificate: makeModel(shareCertificates),
  memberPayment: makeModel(memberPayments),
};
