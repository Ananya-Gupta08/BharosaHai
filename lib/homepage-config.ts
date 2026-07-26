import {
  BadgeCheck,
  BookOpenText,
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
  MapPin,
  ReceiptText,
  SearchCheck,
  ShieldCheck,
  Siren,
  Star,
  Users
} from "lucide-react";

export const homepagePopularServices = [
  {key: "legal", icon: Gavel},
  {key: "gst", icon: ClipboardCheck},
  {key: "business", icon: BriefcaseBusiness},
  {key: "property", icon: HomeIcon},
  {key: "electricity", icon: Lightbulb},
  {key: "insurance", icon: ShieldCheck},
  {key: "police", icon: Siren},
  {key: "municipal", icon: Building2},
  {key: "schemes", icon: Landmark},
  {key: "documentation", icon: FileText},
  {key: "licenses", icon: FileCheck2},
  {key: "labour", icon: HardHat}
] as const;

export const homepageCategoryGroups = [
  {key: "business", icon: BriefcaseBusiness},
  {key: "government", icon: Landmark},
  {key: "property", icon: HomeIcon},
  {key: "personal", icon: FileText},
  {key: "compliance", icon: ReceiptText},
  {key: "local", icon: MapPin}
] as const;

export const homepageCities = [
  {key: "mathura"},
  {key: "vrindavan"},
  {key: "agra"},
  {key: "delhi"},
  {key: "noida"},
  {key: "gurugram"},
  {key: "faridabad"},
  {key: "sonipat"},
  {key: "comingSoon"}
] as const;

export const homepageProviders = [
  {key: "advocate", icon: BadgeCheck, photo: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&w=600&q=80"},
  {key: "accountant", icon: ShieldCheck, photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"},
  {key: "documentation", icon: FileText, photo: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80"},
  {key: "property", icon: HomeIcon, photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"},
  {key: "insurance", icon: ShieldCheck, photo: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80"},
  {key: "electricity", icon: Lightbulb, photo: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=600&q=80"}
] as const;

export const homepageTestimonials = [
  {key: "customerOne", icon: Star},
  {key: "customerTwo", icon: Star},
  {key: "provider", icon: Users}
] as const;

export const homepageFaqs = [
  {key: "providerVerification"},
  {key: "free"},
  {key: "compare"},
  {key: "becomeProvider"},
  {key: "cities"}
] as const;

export const homepageKnowledgeArticles = [
  {key: "gstConsultant", icon: BookOpenText},
  {key: "propertyRegistration", icon: HomeIcon},
  {key: "businessRegistration", icon: BriefcaseBusiness},
  {key: "legalMistakes", icon: Gavel}
] as const;

export const homepageHowSteps = [
  {key: "choose", icon: SearchCheck},
  {key: "city", icon: MapPin},
  {key: "connect", icon: Users},
  {key: "compare", icon: Star},
  {key: "done", icon: ShieldCheck}
] as const;

export const homepageWhyCards = [
  {key: "verification"},
  {key: "process"},
  {key: "platform"},
  {key: "speed"}
] as const;

export const homepageImages = {
  hero: {
    src: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1400&q=80",
    altKey: "hero.imageAlt"
  }
} as const;

export const homepageStats = ["providers", "categories", "cities", "verification"] as const;
