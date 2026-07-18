"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {BriefcaseBusiness, CheckCircle2, FileUp, Lock, ShieldCheck, UserRound} from "lucide-react";
import {useTranslations} from "next-intl";
import {startTransition, useActionState, useEffect, useMemo, useRef, useState} from "react";
import {type FieldErrors, type UseFormRegisterReturn, useForm, useWatch} from "react-hook-form";
import {z} from "zod";

import {MotionSection} from "@/components/motion-section";
import {Card, PageHero, SectionHeader, Timeline, container, pageY} from "@/components/premium-ui";
import {SiteShell} from "@/components/site-shell";
import {useRouter} from "@/i18n/navigation";
import {submitProviderApplication} from "@/lib/actions/provider-actions";

type Category = {
  value: string;
  label: string;
  specializations: Array<{value: string; label: string}>;
  services: Array<{value: string; label: string}>;
};

type SelectOption = {value: string; label: string};
type DocumentOption = SelectOption & {required?: boolean};

const stepIcons = [UserRound, BriefcaseBusiness, BriefcaseBusiness, BriefcaseBusiness, FileUp, ShieldCheck];
const initialState = {status: "idle" as const};

const requiredText = z.string().trim().min(1);
const formSchema = z.object({
  name: requiredText.min(2),
  mobile: requiredText.regex(/^[+\d][\d\s-]{9,19}$/),
  email: requiredText.email(),
  fatherOrHusbandName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  profileType: requiredText,
  category: requiredText,
  subCategory: z.string().optional(),
  services: z.array(z.string()).min(1),
  specialization: z.string().optional(),
  experienceYears: requiredText.refine((value) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= 60;
  }),
  highestQualification: requiredText.min(2),
  professionalQualification: requiredText.min(2),
  bio: requiredText.min(20),
  state: requiredText.min(2),
  district: requiredText.min(2),
  tehsil: z.string().optional(),
  city: requiredText.min(2),
  area: z.string().optional(),
  pincode: requiredText.min(4),
  officeName: requiredText.min(2),
  officeTiming: requiredText.min(2),
  address: requiredText.min(5),
  officeAddress: requiredText.min(5),
  officeLandmark: z.string().optional(),
  googleMapLocation: z.string().optional(),
  languages: requiredText.min(2),
  availability: requiredText.min(2),
  workingDays: requiredText.min(2),
  serviceAreas: requiredText.min(2),
  feeType: requiredText,
  minimumFee: z.string().optional(),
  maximumFee: z.string().optional(),
  registrationNumber: z.string().optional(),
  registrationAuthority: z.string().optional(),
  registrationValidity: z.string().optional(),
  professionalMembership: z.string().optional(),
  industriesServed: z.string().optional(),
  awards: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIfsc: z.string().optional(),
  upiId: z.string().optional(),
  websiteUrl: z.string().optional(),
  googleBusinessUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  declaration: z.boolean().refine(Boolean)
});

type ProviderFormValues = z.infer<typeof formSchema>;
type FieldName = keyof ProviderFormValues;

const stepFields: Record<number, FieldName[]> = {
  1: ["name", "mobile", "email", "profileType"],
  2: ["category", "services", "experienceYears", "highestQualification", "professionalQualification", "languages", "bio"],
  3: ["state", "district", "city", "pincode", "officeName", "officeTiming", "address", "officeAddress"],
  4: ["availability", "workingDays", "serviceAreas", "feeType"],
  5: [],
  6: ["declaration"]
};

export default function ProviderRegisterPage({categories}: {categories: Category[]}) {
  const t = useTranslations("provider.register");
  const common = useTranslations("common.ui");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, string>>({});
  const [documentErrors, setDocumentErrors] = useState<Record<string, string>>({});
  const [state, formAction, pending] = useActionState(submitProviderApplication, initialState);
  const genderOptions = t.raw("personal.genderOptions") as SelectOption[];
  const profileTypeOptions = t.raw("personal.profileTypeOptions") as SelectOption[];
  const feeTypeOptions = t.raw("working.feeTypeOptions") as SelectOption[];
  const requiredDocuments = t.raw("documents.required") as DocumentOption[];
  const defaultCategory = categories[0]?.value ?? "";
  const selectedCategory = useMemo(() => categories.find((item) => item.value === defaultCategory) ?? categories[0], [categories, defaultCategory]);
  const steps = t.raw("steps") as string[];
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    trigger,
    control,
    formState: {errors}
  } = useForm<ProviderFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      category: defaultCategory,
      services: [],
      profileType: "",
      feeType: "",
      declaration: false
    }
  });
  const category = useWatch({control, name: "category"}) || defaultCategory;
  const selectedServices = useWatch({control, name: "services"}) ?? [];
  const currentCategory = useMemo(() => categories.find((item) => item.value === category), [categories, category]);
  const services = currentCategory?.services ?? selectedCategory?.services ?? [];
  const specializations = currentCategory?.specializations ?? selectedCategory?.specializations ?? [];

  useEffect(() => {
    if (state.status === "success") {
      router.replace("/provider/dashboard");
    }
  }, [router, state.status]);

  async function validateStep(nextStep: number) {
    const fields = stepFields[step];
    const valid = fields.length === 0 ? true : await trigger(fields);
    const documentsValid = step === 6 ? validateDocuments() : true;

    if (!valid || !documentsValid) {
      focusFirstError();
      return;
    }

    setCompletedSteps((current) => Array.from(new Set([...current, step])));
    setStep(nextStep);
  }

  function validateDocuments() {
    let valid = true;
    const nextErrors: Record<string, string> = {};
    for (const document of requiredDocuments.filter((item) => item.required)) {
      if (!selectedFiles[document.value]) {
        nextErrors[document.value] = t("documents.uploadRequired", {document: document.label});
        valid = false;
      }
    }
    setDocumentErrors(nextErrors);
    return valid;
  }

  function focusFirstError() {
    requestAnimationFrame(() => {
      const first = formRef.current?.querySelector<HTMLElement>("[data-error='true']");
      first?.scrollIntoView({behavior: "smooth", block: "center"});
      const input = first?.querySelector<HTMLElement>("input, textarea, select, button");
      input?.focus();
    });
  }

  function onInvalid(formErrors: FieldErrors<ProviderFormValues>) {
    const first = Object.keys(formErrors)[0] as FieldName | undefined;
    if (first) {
      setFocus(first);
    }
    focusFirstError();
  }

  function onSubmit() {
    if (!validateDocuments()) {
      focusFirstError();
      return;
    }
    setCompletedSteps([1, 2, 3, 4, 5, 6]);
    if (!formRef.current) {
      return;
    }
    const formData = new FormData(formRef.current);
    startTransition(() => {
      formAction(formData);
    });
  }

  function toggleService(service: string, checked: boolean) {
    const next = checked ? Array.from(new Set([...selectedServices, service])) : selectedServices.filter((item) => item !== service);
    setValue("services", next, {shouldDirty: true, shouldValidate: true});
  }

  return (
    <SiteShell>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}} />
      <MotionSection className={`${container} ${pageY}`}>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[28px] border border-[#eae4da] bg-[#f7f4ee] p-5">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-[#2f5d50]">{t("stepsLabel")}</p>
            <div className="mt-5 grid gap-3">
              {steps.map((title, index) => {
                const id = index + 1;
                const Icon = stepIcons[index] ?? Lock;
                const active = step === id;
                const done = completedSteps.includes(id);
                const locked = id > step && !completedSteps.includes(id - 1);

                return (
                  <button key={title} type="button" disabled={locked} onClick={() => !locked && setStep(id)} className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition duration-300 disabled:cursor-not-allowed ${active || done ? "border-[#2f5d50]/25 bg-white text-[#1f2937]" : "border-[#eae4da] bg-[#fffdf8] text-[#6b7280]"}`}>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${active || done ? "bg-[#2f5d50] text-white" : "bg-white text-[#6b7280]"}`}>{done ? <CheckCircle2 size={19} aria-hidden /> : locked ? <Lock size={18} aria-hidden /> : <Icon size={19} aria-hidden />}</span>
                    <span><span className="block font-heading text-sm font-bold">{title}</span><span className="mt-1 block text-xs font-semibold">{active ? t("active") : done ? t("completed") : locked ? t("locked") : t("pending")}</span></span>
                  </button>
                );
              })}
            </div>
          </aside>
          <Card className="min-h-[560px]">
            <form ref={formRef} encType="multipart/form-data">
              <input type="hidden" name="services" value={selectedServices.join(", ")} />
              <div className={step === 1 ? "block" : "hidden"}><FormPanel title={t("personal.title")} copy={t("personal.copy")}><Input registration={register("name")} label={t("personal.name")} error={errors.name?.message && t("errors.name")} required /><Input registration={register("mobile")} label={t("personal.mobile")} error={errors.mobile?.message && t("errors.mobile")} required /><Input registration={register("email")} label={t("personal.email")} error={errors.email?.message && t("errors.email")} required /><Input registration={register("fatherOrHusbandName")} label={t("personal.father")} /><Input registration={register("dateOfBirth")} type="date" label={t("personal.dob")} /><Select registration={register("gender")} label={t("personal.gender")} options={genderOptions} /><Select registration={register("profileType")} label={t("personal.profileType")} options={profileTypeOptions} error={errors.profileType?.message && t("errors.profileType")} required /><Actions backLabel={common("back")} nextLabel={common("continue")} next={() => validateStep(2)} /></FormPanel></div>
              <div className={step === 2 ? "block" : "hidden"}><FormPanel title={t("professional.title")} copy={t("professional.copy")}><Select registration={register("category", {onChange: () => setValue("services", [], {shouldValidate: true})})} label={t("professional.category")} options={categories} error={errors.category?.message && t("errors.category")} required /><Select registration={register("subCategory")} label={t("professional.subcategory")} options={specializations} /><Input registration={register("specialization")} label={t("professional.specialization")} /><Input registration={register("experienceYears")} type="number" label={t("professional.experience")} error={errors.experienceYears?.message && t("errors.experience")} required /><Input registration={register("highestQualification")} label={t("professional.highestQualification")} error={errors.highestQualification?.message && t("errors.highestQualification")} required /><Input registration={register("professionalQualification")} label={t("professional.professionalQualification")} error={errors.professionalQualification?.message && t("errors.professionalQualification")} required /><Input registration={register("languages")} label={t("professional.languages")} error={errors.languages?.message && t("errors.languages")} required /><Textarea registration={register("bio")} label={t("professional.bio")} error={errors.bio?.message && t("errors.bio")} required className="md:col-span-2" /><div className="md:col-span-2" data-error={Boolean(errors.services)}><p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{t("professional.services")} <RequiredMark /></p><div className="grid gap-2 md:grid-cols-2">{services.map((service) => <label key={service.value} className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold text-[#374151] ${errors.services ? "border-[#991b1b] bg-[#fff1f2]" : "border-[#eae4da] bg-[#f7f4ee]"}`}><input type="checkbox" checked={selectedServices.includes(service.value)} onChange={(event) => toggleService(service.value, event.target.checked)} className="accent-[#2f5d50]" />{service.label}</label>)}</div>{errors.services && <ErrorText>{t("errors.services")}</ErrorText>}</div><Actions backLabel={common("back")} nextLabel={common("continue")} back={() => setStep(1)} next={() => validateStep(3)} /></FormPanel></div>
              <div className={step === 3 ? "block" : "hidden"}><FormPanel title={t("office.title")} copy={t("office.copy")}><Input registration={register("state")} label={t("office.state")} error={errors.state?.message && t("errors.state")} required /><Input registration={register("district")} label={t("office.district")} error={errors.district?.message && t("errors.district")} required /><Input registration={register("tehsil")} label={t("office.tehsil")} /><Input registration={register("city")} label={t("personal.city")} error={errors.city?.message && t("errors.city")} required /><Input registration={register("area")} label={t("office.area")} /><Input registration={register("pincode")} label={t("office.pincode")} error={errors.pincode?.message && t("errors.pincode")} required /><Input registration={register("officeName")} label={t("office.name")} error={errors.officeName?.message && t("errors.officeName")} required /><Input registration={register("officeTiming")} label={t("office.timing")} error={errors.officeTiming?.message && t("errors.officeTiming")} required /><Textarea registration={register("address")} label={t("personal.address")} error={errors.address?.message && t("errors.address")} required /><Textarea registration={register("officeAddress")} label={t("professional.office")} error={errors.officeAddress?.message && t("errors.officeAddress")} required /><Input registration={register("officeLandmark")} label={t("office.landmark")} /><Input registration={register("googleMapLocation")} label={t("office.map")} /><Actions backLabel={common("back")} nextLabel={common("continue")} back={() => setStep(2)} next={() => validateStep(4)} /></FormPanel></div>
              <div className={step === 4 ? "block" : "hidden"}><FormPanel title={t("working.title")} copy={t("working.copy")}><Input registration={register("availability")} label={t("working.availability")} error={errors.availability?.message && t("errors.availability")} required /><Input registration={register("workingDays")} label={t("working.days")} error={errors.workingDays?.message && t("errors.workingDays")} required /><Input registration={register("serviceAreas")} label={t("working.serviceAreas")} error={errors.serviceAreas?.message && t("errors.serviceAreas")} required /><Select registration={register("feeType")} label={t("working.feeType")} options={feeTypeOptions} error={errors.feeType?.message && t("errors.feeType")} required /><Input registration={register("minimumFee")} type="number" label={t("working.minimumFee")} /><Input registration={register("maximumFee")} type="number" label={t("working.maximumFee")} /><Input registration={register("registrationNumber")} label={t("working.registrationNumber")} /><Input registration={register("registrationAuthority")} label={t("working.registrationAuthority")} /><Input registration={register("registrationValidity")} label={t("working.registrationValidity")} /><Input registration={register("professionalMembership")} label={t("working.membership")} /><Input registration={register("industriesServed")} label={t("working.industries")} /><Input registration={register("awards")} label={t("working.awards")} /><Actions backLabel={common("back")} nextLabel={common("continue")} back={() => setStep(3)} next={() => validateStep(5)} /></FormPanel></div>
              <div className={step === 5 ? "block" : "hidden"}><FormPanel title={t("bank.title")} copy={t("bank.copy")}><Input registration={register("bankName")} label={t("bank.name")} /><Input registration={register("bankAccountNumber")} label={t("bank.account")} /><Input registration={register("bankIfsc")} label={t("bank.ifsc")} /><Input registration={register("upiId")} label={t("bank.upi")} /><Input registration={register("websiteUrl")} label={t("bank.website")} /><Input registration={register("googleBusinessUrl")} label={t("bank.google")} /><Input registration={register("facebookUrl")} label={t("bank.facebook")} /><Input registration={register("instagramUrl")} label={t("bank.instagram")} /><Input registration={register("linkedinUrl")} label={t("bank.linkedin")} /><Input registration={register("youtubeUrl")} label={t("bank.youtube")} /><Actions backLabel={common("back")} nextLabel={common("continue")} back={() => setStep(4)} next={() => validateStep(6)} /></FormPanel></div>
              <div className={step === 6 ? "block" : "hidden"}><SectionHeader eyebrow={t("documents.eyebrow")} title={t("documents.title")} copy={t("documents.copy")} /><div className="mt-8 grid gap-4">{requiredDocuments.map((document) => <label key={document.value} data-error={Boolean(documentErrors[document.value])} className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-4 ${documentErrors[document.value] ? "border-[#991b1b] bg-[#fff1f2]" : "border-[#eae4da] bg-[#f7f4ee]"}`}><span><span className="font-heading text-sm font-bold text-[#1f2937]">{document.label} {document.required && <RequiredMark />}</span>{documentErrors[document.value] && <ErrorText>{documentErrors[document.value]}</ErrorText>}</span><span className="max-w-[52%] truncate rounded-full bg-white px-4 py-2 text-xs font-bold text-[#2f5d50]">{selectedFiles[document.value] ?? common("chooseFile")}</span><input name={`document:${document.value}`} type="file" accept=".pdf,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { setSelectedFiles((current) => ({...current, [document.value]: event.target.files?.[0]?.name ?? ""})); setDocumentErrors((current) => { const next = {...current}; delete next[document.value]; return next; }); }} /></label>)}</div><SectionHeader eyebrow={t("declaration.eyebrow")} title={t("declaration.title")} copy={t("declaration.copy")} /><label data-error={Boolean(errors.declaration)} className={`mt-8 flex items-start gap-3 rounded-2xl border p-5 text-sm leading-7 text-[#374151] ${errors.declaration ? "border-[#991b1b] bg-[#fff1f2]" : "border-[#eae4da] bg-[#f7f4ee]"}`}><input type="checkbox" className="mt-1 h-4 w-4 accent-[#2f5d50]" {...register("declaration")} />{t("declaration.checkbox")} <RequiredMark /></label>{errors.declaration && <ErrorText>{t("errors.declaration")}</ErrorText>}{state.messageKey && <div className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${state.status === "success" ? "bg-[#e8f3ee] text-[#2f5d50]" : "bg-[#fff1f2] text-[#991b1b]"}`}><p>{t(state.messageKey)}</p>{state.errors && state.errors.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5 font-normal">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul>}</div>}<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={() => setStep(5)} className="rounded-full border border-[#eae4da] bg-white px-6 py-3 text-sm font-bold text-[#374151] transition hover:border-[#2f5d50] hover:text-[#2f5d50]">{common("back")}</button><button type="button" disabled={pending} onClick={() => { void handleSubmit(onSubmit, onInvalid)(); }} className="rounded-full bg-[#2f5d50] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#264c42] disabled:cursor-not-allowed disabled:opacity-60">{pending ? t("submission.pending") : t("declaration.submit")}</button></div></div>
            </form>
          </Card>
        </div>
      </MotionSection>
      <MotionSection className={`${container} ${pageY}`}><SectionHeader eyebrow={t("next.eyebrow")} title={t("next.title")} /><div className="mt-10"><Timeline items={t.raw("next.items") as Array<{title: string; copy: string}>} /></div></MotionSection>
    </SiteShell>
  );
}

function FormPanel({title, copy, children}: {title: string; copy: string; children: React.ReactNode}) {
  return <div><SectionHeader eyebrow="" title={title} copy={copy} /><div className="mt-8 grid gap-4 md:grid-cols-2">{children}</div></div>;
}

function RequiredMark() {
  return <span className="text-[#991b1b]">*</span>;
}

function ErrorText({children}: {children: React.ReactNode}) {
  return <p className="mt-2 text-xs font-bold text-[#991b1b]">{children}</p>;
}

function FieldShell({label, required, error, children, className = ""}: {label: string; required?: boolean; error?: string | false; children: React.ReactNode; className?: string}) {
  return (
    <label data-error={Boolean(error)} className={`grid gap-2 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7280]">{label} {required && <RequiredMark />}</span>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </label>
  );
}

function Input({registration, label, type = "text", error, required}: {registration: UseFormRegisterReturn; label: string; type?: string; error?: string | false; required?: boolean}) {
  return <FieldShell label={label} required={required} error={error}><input {...registration} type={type} className={`rounded-2xl border bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#2f5d50] ${error ? "border-[#991b1b]" : "border-[#eae4da]"}`} placeholder={label} /></FieldShell>;
}

function Textarea({registration, label, error, required, className = ""}: {registration: UseFormRegisterReturn; label: string; error?: string | false; required?: boolean; className?: string}) {
  return <FieldShell label={label} required={required} error={error} className={className}><textarea {...registration} className={`min-h-28 rounded-2xl border bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#2f5d50] ${error ? "border-[#991b1b]" : "border-[#eae4da]"}`} placeholder={label} /></FieldShell>;
}

function Select({registration, label, options, error, required}: {registration: UseFormRegisterReturn; label: string; options: SelectOption[]; error?: string | false; required?: boolean}) {
  return <FieldShell label={label} required={required} error={error}><select {...registration} aria-label={label} className={`rounded-2xl border bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#2f5d50] ${error ? "border-[#991b1b]" : "border-[#eae4da]"}`}><option value="">{label}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></FieldShell>;
}

function Actions({back, next, backLabel, nextLabel}: {back?: () => void; next?: () => void; backLabel: string; nextLabel: string}) {
  return <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between md:col-span-2"><button type="button" disabled={!back} onClick={back} className="rounded-full border border-[#eae4da] bg-white px-6 py-3 text-sm font-bold text-[#374151] transition hover:border-[#2f5d50] hover:text-[#2f5d50] disabled:opacity-0">{backLabel}</button><button type="button" onClick={next} className="rounded-full bg-[#2f5d50] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#264c42]">{nextLabel}</button></div>;
}
