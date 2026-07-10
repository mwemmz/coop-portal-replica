import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin users
  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@coop.example" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@coop.example",
      passwordHash: adminHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("  ✓ Admin user created (admin@coop.example / admin123)");

  // Members
  const memberHash = await bcrypt.hash("member123", 12);
  const members = await Promise.all([
    prisma.member.upsert({
      where: { phone: "+260970000001" },
      update: {},
      create: {
        membershipNo: "COOP-001",
        name: "John Mulenga",
        phone: "+260970000001",
        email: "john@example.com",
        passwordHash: memberHash,
        farmLocation: "Chongwe District",
        status: "ACTIVE",
      },
    }),
    prisma.member.upsert({
      where: { phone: "+260970000002" },
      update: {},
      create: {
        membershipNo: "COOP-002",
        name: "Mary Banda",
        phone: "+260970000002",
        email: "mary@example.com",
        passwordHash: memberHash,
        farmLocation: "Kafue District",
        status: "ACTIVE",
      },
    }),
    prisma.member.upsert({
      where: { phone: "+260970000003" },
      update: {},
      create: {
        membershipNo: "COOP-003",
        name: "Peter Zulu",
        phone: "+260970000003",
        passwordHash: memberHash,
        farmLocation: "Lusaka",
        status: "INACTIVE",
      },
    }),
  ]);
  console.log("  ✓ 3 members created (use any phone + password: member123)");

  // Produce listings
  const listings = await Promise.all([
    prisma.produceListing.upsert({
      where: { id: "seed-grade-a" },
      update: {},
      create: {
        id: "seed-grade-a",
        name: "Grade A Avocados",
        category: "fresh",
        grade: "A",
        price: 45.0,
        quantityKg: 2000,
        images: "[]",
        status: "ACTIVE",
      },
    }),
    prisma.produceListing.upsert({
      where: { id: "seed-grade-b" },
      update: {},
      create: {
        id: "seed-grade-b",
        name: "Grade B Avocados",
        category: "fresh",
        grade: "B",
        price: 30.0,
        quantityKg: 1500,
        images: "[]",
        status: "ACTIVE",
      },
    }),
    prisma.produceListing.upsert({
      where: { id: "seed-avocado-oil" },
      update: {},
      create: {
        id: "seed-avocado-oil",
        name: "Avocado Oil",
        category: "processed",
        grade: "A",
        price: 120.0,
        quantityKg: 0,
        images: "[]",
        status: "OUT_OF_STOCK",
      },
    }),
  ]);
  console.log("  ✓ 3 produce listings created");

  // Content pages
  await Promise.all([
    prisma.contentPage.upsert({
      where: { slug: "about" },
      update: {},
      create: {
        slug: "about",
        title: "About Coop",
        body: "Cooperative Society Limited (Coop) is a farmer-owned cooperative based in Lusaka Province, Zambia.",
        published: true,
      },
    }),
    prisma.contentPage.upsert({
      where: { slug: "home" },
      update: {},
      create: {
        slug: "home",
        title: "Home Page",
        body: "Welcome to Coop — Growing Zambia's Finest Avocados, Together.",
        published: true,
      },
    }),
  ]);
  console.log("  ✓ Content pages created");

  // Sample order
  const order = await prisma.order.upsert({
    where: { reference: "DEMO-001" },
    update: {},
    create: {
      reference: "DEMO-001",
      buyerName: "Demo Buyer",
      buyerPhone: "+260970000000",
      totalAmount: 225.0,
      status: "PENDING",
      items: {
        create: [
          { listingId: "seed-grade-a", quantityKg: 5, unitPrice: 45.0 },
        ],
      },
    },
  });
  console.log("  ✓ Demo order created");

  // Sample contribution records
  const members_db = await prisma.member.findMany({ take: 2 });
  if (members_db[0]) {
    await prisma.contribution.createMany({
      data: [
        { memberId: members_db[0].id, produceType: "Avocados", grade: "A", quantityKg: 500, deliveredAt: new Date("2026-06-15"), recordedBy: "seed" },
        { memberId: members_db[0].id, produceType: "Avocados", grade: "B", quantityKg: 350, deliveredAt: new Date("2026-06-01"), recordedBy: "seed" },
      ],
    });
  }
  if (members_db[1]) {
    await prisma.contribution.createMany({
      data: [
        { memberId: members_db[1].id, produceType: "Avocados", grade: "A", quantityKg: 400, deliveredAt: new Date("2026-06-10"), recordedBy: "seed" },
      ],
    });
  }
  console.log("  ✓ Sample contributions created");

  // Sample payouts
  if (members_db[0]) {
    await prisma.payout.createMany({
      data: [
        { memberId: members_db[0].id, amount: 2250, status: "PAID", paidAt: new Date("2026-06-30") },
        { memberId: members_db[0].id, amount: 1200, status: "PAID", paidAt: new Date("2026-06-15") },
        { memberId: members_db[0].id, amount: 1800, status: "PENDING" },
      ],
    });
  }
  console.log("  ✓ Sample payouts created");

  // Share certificates
  const shareData: { memberName: string; issueDate: string; shareValue: number; numberOfShares: number }[] = [
    { memberName: "Sarah Ngoma", issueDate: "2025-01-10", shareValue: 10000, numberOfShares: 10 },
    { memberName: "Sarah Ngoma", issueDate: "2025-01-10", shareValue: 4000, numberOfShares: 4 },
    { memberName: "Abedanigo K Banda", issueDate: "2025-01-10", shareValue: 3000, numberOfShares: 3 },
    { memberName: "Mkandawire Fwayawo", issueDate: "2025-01-15", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Kebby Lyanapu", issueDate: "2025-01-15", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Fraser Associates", issueDate: "2025-01-15", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Naomi Lungu", issueDate: "2025-01-22", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Peter Kangamba", issueDate: "2025-01-23", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Maurice chibu", issueDate: "2025-01-24", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Edith Nambeye", issueDate: "2025-01-24", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Peter Mwape Chilambwe", issueDate: "2025-01-27", shareValue: 10000, numberOfShares: 10 },
    { memberName: "Elsie Simpam", issueDate: "2025-01-27", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Morgan Malama", issueDate: "2025-01-28", shareValue: 7000, numberOfShares: 7 },
    { memberName: "Khunga Majumo", issueDate: "2025-02-03", shareValue: 500, numberOfShares: 0.5 },
    { memberName: "Ann Mwewa Chansa", issueDate: "2025-02-03", shareValue: 500, numberOfShares: 0.5 },
    { memberName: "Tillage Village", issueDate: "2025-02-04", shareValue: 35000, numberOfShares: 35 },
    { memberName: "Edith Nambeye Musongole", issueDate: "2025-02-09", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Mwandu Chiteba", issueDate: "2025-02-10", shareValue: 10000, numberOfShares: 10 },
    { memberName: "Dr Bwalya E Chiteba", issueDate: "2025-02-10", shareValue: 10000, numberOfShares: 10 },
    { memberName: "Captain Alexander Mukuka", issueDate: "2025-02-10", shareValue: 7000, numberOfShares: 7 },
    { memberName: "Thomas Zulu", issueDate: "2025-02-17", shareValue: 12000, numberOfShares: 12 },
    { memberName: "Thomas Zulu", issueDate: "2025-02-17", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Abraham Nyirongo", issueDate: "2025-02-24", shareValue: 11000, numberOfShares: 11 },
    { memberName: "Makungu Mulando", issueDate: "2025-02-27", shareValue: 2500, numberOfShares: 2.5 },
    { memberName: "Elsie Simpasa", issueDate: "2025-03-03", shareValue: 2000, numberOfShares: 2 },
    { memberName: "David Lukamba", issueDate: "2025-03-04", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Maurice Chibu", issueDate: "2025-03-05", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Edith Nambeye Musongole", issueDate: "2025-03-07", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Musonda Chiluba", issueDate: "2025-03-13", shareValue: 4000, numberOfShares: 4 },
    { memberName: "Kenneth Chense", issueDate: "2025-03-25", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Lesley Jumbe", issueDate: "2025-03-27", shareValue: 500, numberOfShares: 0.5 },
    { memberName: "Anthony Lungu Chilanga", issueDate: "2025-03-28", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Bertha Muchengwa", issueDate: "2025-03-30", shareValue: 11000, numberOfShares: 11 },
    { memberName: "Chama Makungu", issueDate: "2025-04-01", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Benjamin Kilalo", issueDate: "2025-04-02", shareValue: 15000, numberOfShares: 15 },
    { memberName: "Lesley Jumbe", issueDate: "2025-04-03", shareValue: 500, numberOfShares: 0.5 },
    { memberName: "Joel Mwelwa Chungu", issueDate: "2025-04-08", shareValue: 5000, numberOfShares: 5 },
    { memberName: "Mutenga Mbewa", issueDate: "2025-04-10", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Agness Nachizonde", issueDate: "2025-04-10", shareValue: 500, numberOfShares: 0.5 },
    { memberName: "John Mulenga", issueDate: "2025-04-14", shareValue: 7000, numberOfShares: 7 },
    { memberName: "Mwandu Chiteba", issueDate: "2025-04-15", shareValue: 2500, numberOfShares: 2.5 },
    { memberName: "Dr Bwalya E Chiteba", issueDate: "2025-04-15", shareValue: 2500, numberOfShares: 2.5 },
    { memberName: "Zaliwe Ethel Chabala", issueDate: "2025-04-16", shareValue: 6000, numberOfShares: 6 },
    { memberName: "Lillian Nkwashi", issueDate: "2025-04-21", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Elsie Simpasa", issueDate: "2025-04-26", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Santander Farms", issueDate: "2025-05-01", shareValue: 3000, numberOfShares: 3 },
    { memberName: "Dr. Ignace Gasho", issueDate: "2025-05-01", shareValue: 20000, numberOfShares: 20 },
    { memberName: "Masasa Mudzi", issueDate: "2025-05-05", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Edith Musongole", issueDate: "2025-05-05", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Mwandu Chiteba", issueDate: "2025-05-07", shareValue: 30000, numberOfShares: 30 },
    { memberName: "Dr Bwalya E Chiteba", issueDate: "2025-05-07", shareValue: 30000, numberOfShares: 30 },
    { memberName: "John Mulenga", issueDate: "2025-05-08", shareValue: 12000, numberOfShares: 12 },
    { memberName: "Chama Makungu", issueDate: "2025-05-08", shareValue: 500, numberOfShares: 0.5 },
    { memberName: "Peter Nsulu", issueDate: "2025-05-10", shareValue: 6000, numberOfShares: 6 },
    { memberName: "Lesley Jumbe", issueDate: "2025-05-15", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Mwandu Chiteba", issueDate: "2025-05-19", shareValue: 30000, numberOfShares: 30 },
    { memberName: "Dr Bwalya E Chiteba", issueDate: "2025-05-19", shareValue: 30000, numberOfShares: 30 },
    { memberName: "Deborah Mwila/Mwinda", issueDate: "2025-05-26", shareValue: 3000, numberOfShares: 3 },
    { memberName: "Bryson Mumba", issueDate: "2025-05-27", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Deborah Mwila/Mwinda", issueDate: "2025-05-28", shareValue: 4000, numberOfShares: 4 },
    { memberName: "Anthony Lungu", issueDate: "2025-05-30", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Lesley Jumbe", issueDate: "2025-06-01", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Sidney Kawimbe", issueDate: "2025-06-29", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Mohamed Ahmad", issueDate: "2025-07-01", shareValue: 23000, numberOfShares: 23 },
    { memberName: "Mahmoud Ahmad", issueDate: "2025-07-01", shareValue: 23000, numberOfShares: 23 },
    { memberName: "Mildred Mpongwe", issueDate: "2025-07-13", shareValue: 5000, numberOfShares: 5 },
    { memberName: "Cindy Kanyenda", issueDate: "2025-07-15", shareValue: 4000, numberOfShares: 4 },
    { memberName: "John Mulenga", issueDate: "2025-07-28", shareValue: 30000, numberOfShares: 30 },
    { memberName: "Naomi Lungu Saili", issueDate: "2025-07-31", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Cindy Kanyenda", issueDate: "2025-08-02", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Maurice Chibu", issueDate: "2025-08-09", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Rosario Muzeta Muzondiwa", issueDate: "2025-08-14", shareValue: 20000, numberOfShares: 20 },
    { memberName: "Gertrude Banda", issueDate: "2025-08-14", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Mutinta Nalubamba", issueDate: "2025-08-18", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Auxilia Ponga", issueDate: "2025-08-19", shareValue: 20000, numberOfShares: 20 },
    { memberName: "Chama Makungu", issueDate: "2025-08-23", shareValue: 3000, numberOfShares: 3 },
    { memberName: "Edith N. Musongole", issueDate: "2025-10-07", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Lesley Jumbe", issueDate: "2025-10-08", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Henry Nyundu", issueDate: "2025-10-09", shareValue: 8000, numberOfShares: 8 },
    { memberName: "Catherine Mukutuma", issueDate: "2025-10-16", shareValue: 4000, numberOfShares: 4 },
    { memberName: "Maurice Chibu", issueDate: "2025-10-27", shareValue: 3000, numberOfShares: 3 },
    { memberName: "Lesley Jumbe", issueDate: "2025-12-04", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Edith Musongole", issueDate: "2025-12-06", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Susan Munathali", issueDate: "2025-12-14", shareValue: 11000, numberOfShares: 11 },
    { memberName: "Selestine Haangwaze Nzala", issueDate: "2025-12-14", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Mary N Yoyo", issueDate: "2025-12-29", shareValue: 5000, numberOfShares: 5 },
    { memberName: "Brian Chirwa", issueDate: "2025-12-30", shareValue: 10000, numberOfShares: 10 },
    { memberName: "Martha Mulenga", issueDate: "2026-01-08", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Ansberto A.N. Banda", issueDate: "2026-01-09", shareValue: 15000, numberOfShares: 15 },
    { memberName: "MALALA MAPANI", issueDate: "2026-01-27", shareValue: 13000, numberOfShares: 13 },
    { memberName: "Kenneth Chola", issueDate: "2026-01-27", shareValue: 5000, numberOfShares: 5 },
    { memberName: "Catherine Mukutuma", issueDate: "2026-01-27", shareValue: 16000, numberOfShares: 16 },
    { memberName: "Selestine H Nzala", issueDate: "2026-02-11", shareValue: 4000, numberOfShares: 4 },
    { memberName: "Lillian Nkwashi", issueDate: "2026-02-17", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Simoonga Charles M", issueDate: "2026-02-24", shareValue: 4150, numberOfShares: 4.15 },
    { memberName: "James Chisha", issueDate: "2026-02-25", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Chama Makungu", issueDate: "2026-02-26", shareValue: 5000, numberOfShares: 5 },
    { memberName: "Eunice Chibuye Mwelwa", issueDate: "2026-03-01", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Joseph Manase Mwanza", issueDate: "2026-03-24", shareValue: 3000, numberOfShares: 3 },
    { memberName: "SANTANDER FARMS", issueDate: "2026-03-27", shareValue: 2000, numberOfShares: 2 },
    { memberName: "MANYEPA JOSPHAT", issueDate: "2026-03-27", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Lovemore Milambo Shankoti", issueDate: "2026-03-28", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Richard Chakaba", issueDate: "2026-04-17", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Lillian Nkwashi", issueDate: "2026-04-22", shareValue: 1000, numberOfShares: 1 },
    { memberName: "Mutinta Nalubamba", issueDate: "2026-04-30", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Lawrence Musonda", issueDate: "2026-05-05", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Jane Mwinanyambe", issueDate: "2026-05-13", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Joseph Ngulube", issueDate: "2026-05-15", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Suzyo Ngandu", issueDate: "2026-05-31", shareValue: 100, numberOfShares: 0.1 },
    { memberName: "Arnott Simon CHILWESA", issueDate: "2026-06-09", shareValue: 10000, numberOfShares: 10 },
    { memberName: "Tehillah L Mugara", issueDate: "2026-06-17", shareValue: 2000, numberOfShares: 2 },
    { memberName: "Jennipher Sakala", issueDate: "2026-06-26", shareValue: 30000, numberOfShares: 30 },
  ];
  let shareCount = 0;
  for (const s of shareData) {
    const id = `share-${s.memberName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)}-${s.issueDate}-${s.shareValue}`;
    await prisma.shareCertificate.upsert({
      where: { id },
      update: {},
      create: {
        id,
        memberName: s.memberName,
        issueDate: new Date(s.issueDate),
        shareValue: s.shareValue,
        numberOfShares: s.numberOfShares,
      },
    });
    shareCount++;
  }
  console.log(`  ✓ ${shareCount} share certificates created`);

  // Member payments
  const paymentData: {
    memberName: string;
    paymentDate: string;
    shareValue: number;
    registrationFee: number;
    subscriptionFee: number;
    totalPayment: number;
    shareNumber: number;
  }[] = [
    { memberName: "Chama Makungu", paymentDate: "2026-01-01", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Arnott Simon CHILWESA", paymentDate: "2026-01-06", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Lovemore Milambo Shankoti", paymentDate: "2026-01-06", shareValue: 0, registrationFee: 0, subscriptionFee: 150, totalPayment: 150, shareNumber: 0 },
    { memberName: "izukanji Sikazwe", paymentDate: "2026-01-07", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Martha Mulenga", paymentDate: "2026-01-08", shareValue: 2000, registrationFee: 150, subscriptionFee: 250, totalPayment: 2400, shareNumber: 2 },
    { memberName: "Ansberto A.N. Banda", paymentDate: "2026-01-09", shareValue: 15000, registrationFee: 150, subscriptionFee: 250, totalPayment: 15400, shareNumber: 15 },
    { memberName: "Suzyo Ngandu", paymentDate: "2026-01-10", shareValue: 0, registrationFee: 0, subscriptionFee: 500, totalPayment: 500, shareNumber: 0 },
    { memberName: "Lyanapu Kebby", paymentDate: "2026-01-10", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Maurice Chibu", paymentDate: "2026-01-13", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Denny Musonda Sichula", paymentDate: "2026-01-16", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Stevens Luka Kawama", paymentDate: "2026-01-19", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Daniel CW Nkhuwa", paymentDate: "2026-01-23", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Holland C Mulenga (BITRUST REAL ESTATE LTD)", paymentDate: "2026-01-23", shareValue: 0, registrationFee: 0, subscriptionFee: 500, totalPayment: 500, shareNumber: 0 },
    { memberName: "Patrick Mpulubusi", paymentDate: "2026-01-23", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Mbulo Seke", paymentDate: "2026-01-26", shareValue: 0, registrationFee: 0, subscriptionFee: 500, totalPayment: 500, shareNumber: 0 },
    { memberName: "Cindy Nkhoma", paymentDate: "2026-01-26", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Peter Kavuma", paymentDate: "2026-01-26", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Suzanna Mwanza", paymentDate: "2026-01-26", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Bertha Muchengwa", paymentDate: "2026-01-26", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Catherine Mukutuma", paymentDate: "2026-01-27", shareValue: 16000, registrationFee: 0, subscriptionFee: 250, totalPayment: 16250, shareNumber: 16 },
    { memberName: "MALALA MAPANI", paymentDate: "2026-01-27", shareValue: 13000, registrationFee: 0, subscriptionFee: 250, totalPayment: 13250, shareNumber: 13 },
    { memberName: "Emelia Sharon Lungu Bwalya", paymentDate: "2026-01-27", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Kenneth Chola", paymentDate: "2026-01-27", shareValue: 5000, registrationFee: 0, subscriptionFee: 0, totalPayment: 5000, shareNumber: 5 },
    { memberName: "Morgan Musonda", paymentDate: "2026-01-27", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Sisters women association", paymentDate: "2026-01-27", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Bornwell M Chibesa", paymentDate: "2026-01-28", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Credy M Chongo", paymentDate: "2026-01-28", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Chris C Kampamba", paymentDate: "2026-01-31", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Doria Daka", paymentDate: "2026-01-31", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Alifasi Daka", paymentDate: "2026-01-31", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Esther Hara - Zulu", paymentDate: "2026-02-03", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Ireen Mpulubusi", paymentDate: "2026-02-06", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Alexander Mukuka", paymentDate: "2026-02-08", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Selestine H Nzala", paymentDate: "2026-02-11", shareValue: 4000, registrationFee: 0, subscriptionFee: 250, totalPayment: 4250, shareNumber: 4 },
    { memberName: "Dr Dorothy Kasonde", paymentDate: "2026-02-12", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "EDITH MUSONGOLE", paymentDate: "2026-02-15", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Lillian Nkwashi", paymentDate: "2026-02-17", shareValue: 1000, registrationFee: 0, subscriptionFee: 250, totalPayment: 1250, shareNumber: 1 },
    { memberName: "Boniface Chiluba Musonda", paymentDate: "2026-02-19", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Theresa Mukabe", paymentDate: "2026-02-20", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "GETRUDE MUSONDA MULENGA", paymentDate: "2026-02-22", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Bernard Chiwala", paymentDate: "2026-02-23", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Simoonga Charles M", paymentDate: "2026-02-24", shareValue: 4150, registrationFee: 150, subscriptionFee: 250, totalPayment: 4550, shareNumber: 4.15 },
    { memberName: "James Chisha", paymentDate: "2026-02-25", shareValue: 2000, registrationFee: 150, subscriptionFee: 250, totalPayment: 2400, shareNumber: 2 },
    { memberName: "Thokozani Kamanga", paymentDate: "2026-02-25", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Chama Makungu", paymentDate: "2026-02-26", shareValue: 5000, registrationFee: 0, subscriptionFee: 0, totalPayment: 5000, shareNumber: 5 },
    { memberName: "Eunice Chibuye Mwelwa", paymentDate: "2026-03-01", shareValue: 2000, registrationFee: 150, subscriptionFee: 250, totalPayment: 2400, shareNumber: 2 },
    { memberName: "MULEYA MWILA (DR)", paymentDate: "2026-03-04", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Makungu Mulando", paymentDate: "2026-03-16", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Hendrina Chalwe Doroba", paymentDate: "2026-03-17", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Chigomezyo Ngwira", paymentDate: "2026-03-19", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Chomba Mwiko", paymentDate: "2026-03-19", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Webster Miyanda", paymentDate: "2026-03-19", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "ALEC MULONGA", paymentDate: "2026-03-23", shareValue: 0, registrationFee: 0, subscriptionFee: 500, totalPayment: 500, shareNumber: 0 },
    { memberName: "Yonah Banda", paymentDate: "2026-03-24", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Joseph Manase Mwanza", paymentDate: "2026-03-24", shareValue: 3000, registrationFee: 0, subscriptionFee: 250, totalPayment: 3250, shareNumber: 3 },
    { memberName: "SANTANDER FARMS", paymentDate: "2026-03-27", shareValue: 2000, registrationFee: 0, subscriptionFee: 250, totalPayment: 2250, shareNumber: 2 },
    { memberName: "MANYEPA JOSPHAT", paymentDate: "2026-03-27", shareValue: 2000, registrationFee: 0, subscriptionFee: 250, totalPayment: 2250, shareNumber: 2 },
    { memberName: "VICTOR CHIKAFYA", paymentDate: "2026-03-27", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "EDWARD BWALYA", paymentDate: "2026-03-27", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Lovemore Milambo Shankoti", paymentDate: "2026-03-28", shareValue: 2000, registrationFee: 0, subscriptionFee: 250, totalPayment: 2250, shareNumber: 2 },
    { memberName: "Mwansa Ketty Lubeya", paymentDate: "2026-03-29", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Monica Mwiche Musonda", paymentDate: "2026-04-01", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Thulasoni Kaira", paymentDate: "2026-04-02", shareValue: 0, registrationFee: 0, subscriptionFee: 500, totalPayment: 500, shareNumber: 0 },
    { memberName: "Marjorie Sakala", paymentDate: "2026-04-16", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
    { memberName: "Richard Chakaba", paymentDate: "2026-04-17", shareValue: 2000, registrationFee: 150, subscriptionFee: 250, totalPayment: 2400, shareNumber: 0 },
    { memberName: "Lillian Nkwashi", paymentDate: "2026-04-22", shareValue: 1000, registrationFee: 0, subscriptionFee: 0, totalPayment: 1000, shareNumber: 0 },
    { memberName: "Mutinta Nalubamba", paymentDate: "2026-04-30", shareValue: 3000, registrationFee: 0, subscriptionFee: 250, totalPayment: 3250, shareNumber: 0 },
    { memberName: "Peter Sichula Nsululu", paymentDate: "2026-05-01", shareValue: 0, registrationFee: 0, subscriptionFee: 250, totalPayment: 250, shareNumber: 0 },
  ];
  let payCount = 0;
  for (const p of paymentData) {
    const id = `pay-${p.memberName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)}-${p.paymentDate}-${p.totalPayment}`;
    await prisma.memberPayment.upsert({
      where: { id },
      update: {},
      create: {
        id,
        memberName: p.memberName,
        paymentDate: new Date(p.paymentDate),
        shareValue: p.shareValue,
        registrationFee: p.registrationFee,
        subscriptionFee: p.subscriptionFee,
        totalPayment: p.totalPayment,
        shareNumber: p.shareNumber,
      },
    });
    payCount++;
  }
  console.log(`  ✓ ${payCount} member payments created`);

  console.log("\nSeed complete!");
  console.log("  Admin:  admin@coop.example / admin123");
  console.log("  Member: +260970000001 / member123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
