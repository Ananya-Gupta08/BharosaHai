import {
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Gavel,
  HardHat,
  HomeIcon,
  Landmark,
  Lightbulb,
  ShieldCheck,
  Siren
} from "lucide-react";

export const serviceCategories = [
  {id: "legal-services", label: "Legal Services", icon: Gavel, providerAudience: "Lawyers"},
  {id: "gst-taxation", label: "GST & Taxation", icon: ClipboardCheck, providerAudience: "Chartered Accountants"},
  {id: "business-registration", label: "Business Registration", icon: BriefcaseBusiness, providerAudience: "Business Consultants"},
  {id: "property-documentation", label: "Property Documentation", icon: HomeIcon, providerAudience: "Property Consultants"},
  {id: "police-verification", label: "Police Verification", icon: Siren, providerAudience: "Verification Consultants"},
  {id: "electricity", label: "Electricity", icon: Lightbulb, providerAudience: "Electricians"},
  {id: "insurance", label: "Insurance", icon: ShieldCheck, providerAudience: "Insurance Advisors"},
  {id: "municipal-services", label: "Municipal Services", icon: Building2, providerAudience: "Municipal Consultants"},
  {id: "government-schemes", label: "Government Schemes", icon: Landmark, providerAudience: "Government Consultants"},
  {id: "licenses-permits", label: "Licenses & Permits", icon: FileCheck2, providerAudience: "License Consultants"},
  {id: "documentation", label: "Documentation", icon: FileText, providerAudience: "Documentation Experts"},
  {id: "labour-compliance", label: "Labour Compliance", icon: HardHat, providerAudience: "Contractors"}
] as const;

export type ServiceCategoryId = (typeof serviceCategories)[number]["id"];
