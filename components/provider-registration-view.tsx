"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {BriefcaseBusiness, CheckCircle2, FileUp, Lock, ShieldCheck, UserRound} from "lucide-react";
import {useTranslations} from "next-intl";
import {startTransition, useActionState, useEffect, useMemo, useRef, useState} from "react";
import {type FieldErrors, type UseFormRegisterReturn, useForm, useWatch} from "react-hook-form";
import {z} from "zod";

import {MotionSection} from "@/components/motion-section";
import {HeroBackgroundCarousel} from "@/components/hero-background-carousel";
import {container, pageY} from "@/components/premium-ui";
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

const draftStorageKey = "kaunbatayega-provider-registration-draft";

function readRegistrationDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const saved = window.localStorage.getItem(draftStorageKey);
    return saved ? JSON.parse(saved) as {values?: Partial<ProviderFormValues>; step?: number; completedSteps?: number[]} : null;
  } catch {
    window.localStorage.removeItem(draftStorageKey);
    return null;
  }
}

export default function ProviderRegisterPage({categories}: {categories: Category[]}) {
  const t = useTranslations("provider.register");
  const common = useTranslations("common.ui");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const draft = useMemo(() => readRegistrationDraft(), []);
  const [step, setStep] = useState(() => draft?.step && draft.step >= 1 && draft.step <= 6 ? draft.step : 1);
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => draft?.completedSteps ?? []);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, string>>({});
  const [documentErrors, setDocumentErrors] = useState<Record<string, string>>({});
  const [draftSaved, setDraftSaved] = useState(false);
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
    getValues,
    setFocus,
    setValue,
    reset,
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
  const draftValues = useWatch({control});
  const currentCategory = useMemo(() => categories.find((item) => item.value === category), [categories, category]);
  const services = currentCategory?.services ?? selectedCategory?.services ?? [];
  const specializations = currentCategory?.specializations ?? selectedCategory?.specializations ?? [];
  const progress = Math.round(((completedSteps.length + (step > completedSteps.length ? 0.5 : 0)) / steps.length) * 100);

  useEffect(() => {
    if (state.status === "success") {
      window.localStorage.removeItem(draftStorageKey);
      router.replace("/provider/verification");
    }
  }, [router, state.status]);

  useEffect(() => {
    if (draft?.values) {
      reset({...draft.values, declaration: Boolean(draft.values.declaration)});
    }
  }, [draft, reset]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(draftStorageKey, JSON.stringify({values: draftValues, step, completedSteps}));
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [completedSteps, draftValues, step]);

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

  function saveDraft() {
    window.localStorage.setItem(draftStorageKey, JSON.stringify({values: getValues(), step, completedSteps}));
    setDraftSaved(true);
    window.setTimeout(() => setDraftSaved(false), 1800);
  }

  return (
    <SiteShell visualStyle="indian-marketplace">
      <section className={`${container} pt-8 sm:pt-10 lg:pt-12`}>
        <HeroBackgroundCarousel align="left">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t("hero.eyebrow")}</p>
              <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold text-[var(--primary)] sm:text-5xl">{t("hero.title")}</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--secondary-text)]">{t("hero.copy")}</p>
            </div>
            <div className="rounded-[26px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-lift)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">{t("progress.step", {step, total: steps.length})}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-[var(--primary)]">{t("progress.complete", {progress})}</h2>
                </div>
                <ShieldCheck className="text-[var(--primary)]" size={34} aria-hidden />
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[var(--hover-bg)]">
                <div className="h-full rounded-full bg-[var(--primary)] transition-all duration-500" style={{width: `${progress}%`}} />
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-[var(--secondary-text)]">{t("progress.copy")}</p>
              <button type="button" onClick={saveDraft} className="mt-5 rounded-2xl border border-[var(--primary)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--primary)] transition hover:bg-[var(--hover-bg)]">{draftSaved ? t("progress.saved") : t("progress.saveDraft")}</button>
            </div>
          </div>
        </HeroBackgroundCarousel>
      </section>
      <MotionSection className={`${container} ${pageY}`}>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="hidden rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] lg:block">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{t("stepsLabel")}</p>
            <div className="mt-5 grid gap-3">
              {steps.map((title, index) => {
                const id = index + 1;
                const Icon = stepIcons[index] ?? Lock;
                const active = step === id;
                const done = completedSteps.includes(id);
                const locked = id > step && !completedSteps.includes(id - 1);

                return (
                  <button key={title} type="button" disabled={locked} onClick={() => !locked && setStep(id)} className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${active || done ? "border-[var(--primary)]/25 bg-[var(--hover-bg)] text-[var(--foreground)]" : "border-[var(--border)] bg-[var(--background)] text-[var(--secondary-text)]"}`}>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${active || done ? "bg-[var(--primary)] text-white" : "bg-white text-[var(--secondary-text)]"}`}>{done ? <CheckCircle2 size={19} aria-hidden /> : locked ? <Lock size={18} aria-hidden /> : <Icon size={19} aria-hidden />}</span>
                    <span><span className="block font-heading text-sm font-bold">{title}</span><span className="mt-1 block text-xs font-semibold">{active ? t("active") : done ? t("completed") : locked ? t("locked") : t("pending")}</span></span>
                  </button>
                );
              })}
            </div>
          </aside>
          <div className="min-h-[560px] rounded-[30px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-lift)] sm:p-6 lg:p-8">
            <form ref={formRef} encType="multipart/form-data">
              <input type="hidden" name="services" value={selectedServices.join(", ")} />
              <div className={step === 1 ? "block" : "hidden"}><FormPanel title={t("personal.title")} copy={t("personal.copy")}><Input registration={register("name")} label={t("personal.name")} error={errors.name?.message && t("errors.name")} required /><Input registration={register("mobile")} label={t("personal.mobile")} error={errors.mobile?.message && t("errors.mobile")} required /><Input registration={register("email")} label={t("personal.email")} error={errors.email?.message && t("errors.email")} required /><Input registration={register("fatherOrHusbandName")} label={t("personal.father")} /><Input registration={register("dateOfBirth")} type="date" label={t("personal.dob")} /><Select registration={register("gender")} label={t("personal.gender")} options={genderOptions} /><Select registration={register("profileType")} label={t("personal.profileType")} options={profileTypeOptions} error={errors.profileType?.message && t("errors.profileType")} required /><Actions backLabel={common("back")} nextLabel={common("continue")} next={() => validateStep(2)} /></FormPanel></div>
              <div className={step === 2 ? "block" : "hidden"}><FormPanel title={t("professional.title")} copy={t("professional.copy")}><Select registration={register("category", {onChange: () => setValue("services", [], {shouldValidate: true})})} label={t("professional.category")} options={categories} error={errors.category?.message && t("errors.category")} required /><Select registration={register("subCategory")} label={t("professional.subcategory")} options={specializations} /><Input registration={register("specialization")} label={t("professional.specialization")} /><Input registration={register("experienceYears")} type="number" label={t("professional.experience")} error={errors.experienceYears?.message && t("errors.experience")} required /><Input registration={register("highestQualification")} label={t("professional.highestQualification")} error={errors.highestQualification?.message && t("errors.highestQualification")} required /><Input registration={register("professionalQualification")} label={t("professional.professionalQualification")} error={errors.professionalQualification?.message && t("errors.professionalQualification")} required /><Input registration={register("languages")} label={t("professional.languages")} error={errors.languages?.message && t("errors.languages")} required /><Textarea registration={register("bio")} label={t("professional.bio")} error={errors.bio?.message && t("errors.bio")} required className="md:col-span-2" /><div className="md:col-span-2" data-error={Boolean(errors.services)}><p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--secondary-text)]">{t("professional.services")} <RequiredMark /></p><div className="grid gap-2 md:grid-cols-2">{services.map((service) => <label key={service.value} className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] ${selectedServices.includes(service.value) ? "border-[var(--primary)] bg-[var(--hover-bg)]" : errors.services ? "border-[var(--error)] bg-[var(--error)]/10" : "border-[var(--border)] bg-[var(--background)]"}`}><input type="checkbox" checked={selectedServices.includes(service.value)} onChange={(event) => toggleService(service.value, event.target.checked)} className="accent-[var(--primary)]" />{service.label}</label>)}</div>{errors.services && <ErrorText>{t("errors.services")}</ErrorText>}</div><Actions backLabel={common("back")} nextLabel={common("continue")} back={() => setStep(1)} next={() => validateStep(3)} /></FormPanel></div>
              <div className={step === 3 ? "block" : "hidden"}><FormPanel title={t("office.title")} copy={t("office.copy")}><Input registration={register("state")} label={t("office.state")} error={errors.state?.message && t("errors.state")} required /><Input registration={register("district")} label={t("office.district")} error={errors.district?.message && t("errors.district")} required /><Input registration={register("tehsil")} label={t("office.tehsil")} /><Input registration={register("city")} label={t("personal.city")} error={errors.city?.message && t("errors.city")} required /><Input registration={register("area")} label={t("office.area")} /><Input registration={register("pincode")} label={t("office.pincode")} error={errors.pincode?.message && t("errors.pincode")} required /><Input registration={register("officeName")} label={t("office.name")} error={errors.officeName?.message && t("errors.officeName")} required /><Input registration={register("officeTiming")} label={t("office.timing")} error={errors.officeTiming?.message && t("errors.officeTiming")} required /><Textarea registration={register("address")} label={t("personal.address")} error={errors.address?.message && t("errors.address")} required /><Textarea registration={register("officeAddress")} label={t("professional.office")} error={errors.officeAddress?.message && t("errors.officeAddress")} required /><Input registration={register("officeLandmark")} label={t("office.landmark")} /><Input registration={register("googleMapLocation")} label={t("office.map")} /><Actions backLabel={common("back")} nextLabel={common("continue")} back={() => setStep(2)} next={() => validateStep(4)} /></FormPanel></div>
              <div className={step === 4 ? "block" : "hidden"}><FormPanel title={t("working.title")} copy={t("working.copy")}><Input registration={register("availability")} label={t("working.availability")} error={errors.availability?.message && t("errors.availability")} required /><Input registration={register("workingDays")} label={t("working.days")} error={errors.workingDays?.message && t("errors.workingDays")} required /><Input registration={register("serviceAreas")} label={t("working.serviceAreas")} error={errors.serviceAreas?.message && t("errors.serviceAreas")} required /><Select registration={register("feeType")} label={t("working.feeType")} options={feeTypeOptions} error={errors.feeType?.message && t("errors.feeType")} required /><Input registration={register("minimumFee")} type="number" label={t("working.minimumFee")} /><Input registration={register("maximumFee")} type="number" label={t("working.maximumFee")} /><Input registration={register("registrationNumber")} label={t("working.registrationNumber")} /><Input registration={register("registrationAuthority")} label={t("working.registrationAuthority")} /><Input registration={register("registrationValidity")} label={t("working.registrationValidity")} /><Input registration={register("professionalMembership")} label={t("working.membership")} /><Input registration={register("industriesServed")} label={t("working.industries")} /><Input registration={register("awards")} label={t("working.awards")} /><Actions backLabel={common("back")} nextLabel={common("continue")} back={() => setStep(3)} next={() => validateStep(5)} /></FormPanel></div>
              <div className={step === 5 ? "block" : "hidden"}><FormPanel title={t("bank.title")} copy={t("bank.copy")}><Input registration={register("bankName")} label={t("bank.name")} /><Input registration={register("bankAccountNumber")} label={t("bank.account")} /><Input registration={register("bankIfsc")} label={t("bank.ifsc")} /><Input registration={register("upiId")} label={t("bank.upi")} /><Input registration={register("websiteUrl")} label={t("bank.website")} /><Input registration={register("googleBusinessUrl")} label={t("bank.google")} /><Input registration={register("facebookUrl")} label={t("bank.facebook")} /><Input registration={register("instagramUrl")} label={t("bank.instagram")} /><Input registration={register("linkedinUrl")} label={t("bank.linkedin")} /><Input registration={register("youtubeUrl")} label={t("bank.youtube")} /><Actions backLabel={common("back")} nextLabel={common("continue")} back={() => setStep(4)} next={() => validateStep(6)} /></FormPanel></div>
              <div className={step === 6 ? "block" : "hidden"}><PanelHeader eyebrow={t("documents.eyebrow")} title={t("documents.title")} copy={t("documents.copy")} /><div className="mt-8 grid gap-4 md:grid-cols-2">{requiredDocuments.map((document) => <label key={document.value} data-error={Boolean(documentErrors[document.value])} className={`group cursor-pointer rounded-[24px] border p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] ${documentErrors[document.value] ? "border-[var(--error)] bg-[var(--error)]/10" : "border-[var(--border)] bg-[var(--background)]"}`}><span className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--primary)]"><FileUp size={18} aria-hidden /></span><span className="min-w-0 flex-1"><span className="font-heading text-sm font-bold text-[var(--foreground)]">{document.label} {document.required && <RequiredMark />}</span>{documentErrors[document.value] && <ErrorText>{documentErrors[document.value]}</ErrorText>}<span className="mt-3 block max-w-full truncate rounded-full bg-white px-4 py-2 text-xs font-bold text-[var(--primary)]">{selectedFiles[document.value] ?? common("chooseFile")}</span></span></span><input name={`document:${document.value}`} type="file" accept=".pdf,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { setSelectedFiles((current) => ({...current, [document.value]: event.target.files?.[0]?.name ?? ""})); setDocumentErrors((current) => { const next = {...current}; delete next[document.value]; return next; }); }} /></label>)}</div><div className="mt-10"><PanelHeader eyebrow={t("declaration.eyebrow")} title={t("declaration.title")} copy={t("declaration.copy")} /></div><label data-error={Boolean(errors.declaration)} className={`mt-6 flex items-start gap-3 rounded-2xl border p-5 text-sm font-semibold leading-7 text-[var(--foreground)] ${errors.declaration ? "border-[var(--error)] bg-[var(--error)]/10" : "border-[var(--border)] bg-[var(--background)]"}`}><input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--primary)]" {...register("declaration")} />{t("declaration.checkbox")} <RequiredMark /></label>{errors.declaration && <ErrorText>{t("errors.declaration")}</ErrorText>}{state.messageKey && <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${state.status === "success" ? "border-[var(--success)]/20 bg-[var(--success)]/10 text-[var(--success)]" : "border-[var(--error)]/20 bg-[var(--error)]/10 text-[var(--error)]"}`}><p>{t(state.messageKey)}</p>{state.errors && state.errors.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5 font-normal">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul>}</div>}<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={() => setStep(5)} className="rounded-full border border-[var(--primary)] bg-white px-6 py-3 text-sm font-bold text-[var(--primary)] transition hover:bg-[var(--hover-bg)]">{common("back")}</button><button type="button" disabled={pending} onClick={() => { void handleSubmit(onSubmit, onInvalid)(); }} className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60">{pending ? t("submission.pending") : t("declaration.submit")}</button></div></div>
            </form>
          </div>
        </div>
      </MotionSection>
      <NextPathSection eyebrow={t("next.eyebrow")} title={t("next.title")} copy={t("next.copy")} estimateLabel={t("next.estimateLabel")} estimateValue={t("next.estimateValue")} estimateCopy={t("next.estimateCopy")} items={t.raw("next.items") as Array<{title: string; copy: string}>} />
    </SiteShell>
  );
}

function NextPathSection({eyebrow, title, copy, estimateLabel, estimateValue, estimateCopy, items}: {eyebrow: string; title: string; copy: string; estimateLabel: string; estimateValue: string; estimateCopy: string; items: Array<{title: string; copy: string}>}) {
  return (
    <MotionSection className={`${container} pb-16 sm:pb-20 lg:pb-24`}>
      <div className="rounded-[32px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-lift)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <PanelHeader eyebrow={eyebrow} title={title} copy={copy} />
            <div className="mt-6 rounded-[24px] bg-[var(--background)] p-5">
              <p className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{estimateLabel}</p>
              <p className="mt-2 font-heading text-3xl font-bold text-[var(--primary)]">{estimateValue}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{estimateCopy}</p>
            </div>
          </div>
          <div className="grid gap-4">
            {items.map((item, index) => (
              <div key={item.title} className="relative rounded-[24px] border border-[var(--border)] bg-[var(--background)] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] font-heading text-sm font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[var(--primary)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--secondary-text)]">{item.copy}</p>
                  </div>
                </div>
                {index < items.length - 1 && <span className="absolute left-10 top-[68px] hidden h-6 w-px bg-[var(--border)] sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}

function FormPanel({title, copy, children}: {title: string; copy: string; children: React.ReactNode}) {
  return <div><PanelHeader title={title} copy={copy} /><div className="mt-8 grid gap-4 md:grid-cols-2">{children}</div></div>;
}

function PanelHeader({eyebrow, title, copy}: {eyebrow?: string; title: string; copy?: string}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{eyebrow}</p>}
      <h2 className="mt-2 font-heading text-3xl font-bold leading-tight text-[var(--primary)]">{title}</h2>
      {copy && <p className="mt-3 text-base leading-7 text-[var(--secondary-text)]">{copy}</p>}
    </div>
  );
}

function RequiredMark() {
  return <span className="text-[var(--error)]">*</span>;
}

function ErrorText({children}: {children: React.ReactNode}) {
  return <p className="mt-2 text-xs font-bold text-[var(--error)]">{children}</p>;
}

function FieldShell({label, required, error, children, className = ""}: {label: string; required?: boolean; error?: string | false; children: React.ReactNode; className?: string}) {
  return (
    <label data-error={Boolean(error)} className={`grid gap-2 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--secondary-text)]">{label} {required && <RequiredMark />}</span>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </label>
  );
}

function Input({registration, label, type = "text", error, required}: {registration: UseFormRegisterReturn; label: string; type?: string; error?: string | false; required?: boolean}) {
  return <FieldShell label={label} required={required} error={error}><input {...registration} type={type} className={`rounded-2xl border bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 ${error ? "border-[var(--error)]" : "border-[var(--border)]"}`} placeholder={label} /></FieldShell>;
}

function Textarea({registration, label, error, required, className = ""}: {registration: UseFormRegisterReturn; label: string; error?: string | false; required?: boolean; className?: string}) {
  return <FieldShell label={label} required={required} error={error} className={className}><textarea {...registration} className={`min-h-28 rounded-2xl border bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 ${error ? "border-[var(--error)]" : "border-[var(--border)]"}`} placeholder={label} /></FieldShell>;
}

function Select({registration, label, options, error, required}: {registration: UseFormRegisterReturn; label: string; options: SelectOption[]; error?: string | false; required?: boolean}) {
  return <FieldShell label={label} required={required} error={error}><select {...registration} aria-label={label} className={`rounded-2xl border bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 ${error ? "border-[var(--error)]" : "border-[var(--border)]"}`}><option value="">{label}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></FieldShell>;
}

function Actions({back, next, backLabel, nextLabel}: {back?: () => void; next?: () => void; backLabel: string; nextLabel: string}) {
  return <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between md:col-span-2"><button type="button" disabled={!back} onClick={back} className="rounded-full border border-[var(--primary)] bg-white px-6 py-3 text-sm font-bold text-[var(--primary)] transition hover:bg-[var(--hover-bg)] disabled:opacity-0">{backLabel}</button><button type="button" onClick={next} className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]">{nextLabel}</button></div>;
}
