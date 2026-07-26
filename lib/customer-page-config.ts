import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  Gavel,
  HardHat,
  Heart,
  History,
  HomeIcon,
  Landmark,
  Lightbulb,
  MapPin,
  Scale,
  ShieldCheck,
  Siren,
  Star,
  Users
} from "lucide-react";

export const customerFeatures = [
  {key: "find", icon: ShieldCheck},
  {key: "compare", icon: Scale},
  {key: "track", icon: ClipboardCheck},
  {key: "save", icon: Heart},
  {key: "updates", icon: Bell},
  {key: "history", icon: History}
] as const;

export const customerServiceCategories = [
  {key: "legal", icon: Gavel},
  {key: "gst", icon: ClipboardCheck},
  {key: "business", icon: BriefcaseBusiness},
  {key: "property", icon: HomeIcon},
  {key: "police", icon: Siren},
  {key: "electricity", icon: Lightbulb},
  {key: "insurance", icon: ShieldCheck},
  {key: "municipal", icon: Building2},
  {key: "schemes", icon: Landmark},
  {key: "licenses", icon: FileCheck2},
  {key: "documentation", icon: FileText},
  {key: "labour", icon: HardHat}
] as const;

export const customerLaunchCities = [
  {key: "mathura"},
  {key: "vrindavan"},
  {key: "agra"},
  {key: "delhi"},
  {key: "noida"},
  {key: "gurugram"},
  {key: "faridabad"},
  {key: "sonipat"}
] as const;

export const customerWhyCards = [
  {key: "verified", icon: ShieldCheck},
  {key: "transparent", icon: ClipboardCheck},
  {key: "network", icon: Users},
  {key: "simple", icon: Star}
] as const;

export const customerFaqs = [
  {key: "launch"},
  {key: "free"},
  {key: "verified"},
  {key: "cities"},
  {key: "provider"}
] as const;

export const customerHeroMetrics = [
  {key: "verified", icon: ShieldCheck},
  {key: "cities", icon: MapPin},
  {key: "updates", icon: Clock3}
] as const;
