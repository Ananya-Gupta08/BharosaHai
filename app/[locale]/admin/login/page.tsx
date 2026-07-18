import {getTranslations} from "next-intl/server";

import {AdminLoginForm} from "@/components/admin-login-form";
import {MotionSection} from "@/components/motion-section";
import {Card, PageHero, container, pageY} from "@/components/premium-ui";
import {SiteShell} from "@/components/site-shell";

type Props = {
  params: Promise<{locale: string}>;
};

export default async function AdminLoginPage({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "admin.login"});

  return (
    <SiteShell>
      <section className="bg-[#f8fafc]">
        <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} copy={t("hero.copy")} image={{src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80", alt: t("hero.imageAlt")}} />
        <MotionSection className={`${container} ${pageY}`}>
          <div className="mx-auto max-w-xl">
            <Card>
              <AdminLoginForm />
            </Card>
          </div>
        </MotionSection>
      </section>
    </SiteShell>
  );
}
