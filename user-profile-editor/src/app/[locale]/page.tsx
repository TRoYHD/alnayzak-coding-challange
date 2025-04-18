import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProfileForm } from "../components/profile-form";
import { ProfileFormSkeleton } from "../components/ui/skeleton";
import { Locale, locales } from "../i18n/config";
import { getDictionary } from "../i18n/utils";
import LanguageSwitcher from "../components/language-switcher";
import { mockUser,getLocalizedBio } from "../lib/mock-data";
import { RTLProvider } from "../context/rtl-context";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LocalePage(props: PageProps) {
  const params = await props.params;
  
  const locale = params.locale;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  
  const dictionary = getDictionary(locale as Locale);
  const isRTL = locale === 'ar';
  
  return (
    <main className="min-h-screen bg-gray-50 py-8" key={locale}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex justify-end">
            <LanguageSwitcher />
          </div>
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {dictionary.page.title}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {dictionary.page.subtitle}
            </p>
          </div>
          
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <Suspense fallback={<ProfileFormSkeleton />}>
              <RTLProvider locale={locale as Locale}>
                <ProfileFormContent locale={locale as Locale} />
              </RTLProvider>
            </Suspense>
          </div>
        </div>
      </div>
    </main>

  );
}

function ProfileFormContent({ locale }: { locale: Locale }) {
  const user = {
    ...mockUser,
    bio: getLocalizedBio(locale)
  };
  
  return (
    <div className="p-6">
      <ProfileForm initialData={user} locale={locale} />
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}