import "dotenv/config";

import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "@prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({adapter});

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const masterCategories = [
  ["Advocate", ["Civil", "Criminal", "Family", "Revenue", "Property", "Consumer", "Labour", "High Court", "Supreme Court", "Arbitration", "Documentation", "Legal Notice", "Agreement Drafting"]],
  ["Chartered Accountant", ["Audit", "Accounting", "Income Tax", "GST", "TDS", "ROC", "Project Finance"]],
  ["GST Consultant", ["GST Registration", "GST Return", "GST Notice", "GST Refund", "GST Audit"]],
  ["Income Tax Consultant", ["ITR", "Tax Planning", "Tax Notice", "PAN Services"]],
  ["Company Secretary", ["Company Registration", "ROC Compliance", "Annual Filing", "LLP", "Secretarial Compliance"]],
  ["Notary", ["Affidavit", "Notary", "Attestation", "Declaration"]],
  ["Deed Writer", ["Sale Deed", "Gift Deed", "Lease Deed", "Will", "Power of Attorney"]],
  ["Stamp Vendor", ["E-Stamp", "Stamp Paper", "Judicial", "Non-Judicial"]],
  ["Property & Revenue Consultant", ["Mutation", "Partition", "Khasra", "Khatauni", "Registry", "Revenue Appeal"]],
  ["Government Documentation Consultant", ["Birth Certificate", "Death Certificate", "Marriage Certificate", "Domicile", "Income", "Caste", "Character Certificate"]],
  ["RTO Consultant", ["Driving Licence", "RC", "Transfer", "NOC", "Fitness", "Permit", "Hypothecation"]],
  ["Passport & Visa Consultant", ["Passport", "Renewal", "Tatkal", "Visa Documentation"]],
  ["Insurance Advisor", ["Life", "Health", "Motor", "Claim Assistance"]],
  ["Loan Consultant", ["Home Loan", "Business Loan", "Personal Loan", "MSME Loan", "Documentation"]],
  ["Architect", ["Building Plan", "Map Approval", "3D Design"]],
  ["Valuer", ["Property Valuation", "Bank Valuation"]],
  ["Contractor", ["Civil Work", "Renovation", "Government Tender"]],
  ["Electrical Contractor", ["Industrial", "Commercial", "Residential", "Electrical Approval"]],
  ["Electrician", ["Installation", "Repair", "Maintenance"]],
  ["Plumber", ["Installation", "Repair", "Pipeline"]],
  ["Computer & Digital Service Provider", ["CSC", "Digital Signature", "Online Forms", "Scanning", "Printing", "Cyber Services"]],
  ["MSME Consultant", ["Udyam Registration", "Subsidy", "Government Schemes"]],
  ["Factory Licence Consultant", ["Factory Licence", "Renewal", "Compliance"]],
  ["Fire NOC Consultant", ["Fire NOC", "Fire Audit", "Fire Compliance"]],
  ["Pollution Consultant", ["CTE", "CTO", "Consent Renewal"]],
  ["FSSAI Consultant", ["New Licence", "Renewal", "Modification"]],
  ["Other", ["Custom Services"]]
];

async function main() {
  for (const [name, services] of masterCategories) {
    const category = await prisma.category.upsert({
      where: {slug: slugify(name)},
      update: {
        name,
        description: `${name} services for verified KaunBatayega providers.`
      },
      create: {
        name,
        slug: slugify(name),
        description: `${name} services for verified KaunBatayega providers.`
      }
    });

    for (const serviceName of services) {
      const subCategory = await prisma.subCategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: category.id,
            slug: slugify(serviceName)
          }
        },
        update: {name: serviceName},
        create: {
          name: serviceName,
          slug: slugify(serviceName),
          categoryId: category.id
        }
      });

      await prisma.service.upsert({
        where: {
          categoryId_slug: {
            categoryId: category.id,
            slug: slugify(serviceName)
          }
        },
        update: {
          name: serviceName,
          subCategoryId: subCategory.id
        },
        create: {
          name: serviceName,
          slug: slugify(serviceName),
          categoryId: category.id,
          subCategoryId: subCategory.id
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
