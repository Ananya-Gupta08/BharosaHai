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
  {id: "legal-services", label: "Legal Services", icon: Gavel},
  {id: "gst-taxation", label: "GST & Taxation", icon: ClipboardCheck},
  {id: "business-registration", label: "Business Registration", icon: BriefcaseBusiness},
  {id: "property-documentation", label: "Property Documentation", icon: HomeIcon},
  {id: "police-verification", label: "Police Verification", icon: Siren},
  {id: "electricity", label: "Electricity", icon: Lightbulb},
  {id: "insurance", label: "Insurance", icon: ShieldCheck},
  {id: "municipal-services", label: "Municipal Services", icon: Building2},
  {id: "government-schemes", label: "Government Schemes", icon: Landmark},
  {id: "licenses-permits", label: "Licenses & Permits", icon: FileCheck2},
  {id: "documentation", label: "Documentation", icon: FileText},
  {id: "labour-compliance", label: "Labour Compliance", icon: HardHat}
] as const;

export type ServiceCategoryId = (typeof serviceCategories)[number]["id"];
