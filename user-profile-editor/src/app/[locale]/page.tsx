import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProfileForm } from "../components/profile-form";
import { ProfileFormSkeleton } from "../components/ui/skeleton";
import { Locale, locales } from "../i18n/config";
import { getDictionary } from "../i18n/utils";
import LanguageSwitcher from "../components/language-switcher";

import { mockUser } from "../lib/mock-data";

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
  
  return (
    <main className="min-h-screen bg-gray-50 py-8">
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
              <ProfileFormContent locale={locale as Locale} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileFormContent({ locale }: { locale: Locale }) {
  const user = mockUser;
  
  return (
    <div className="p-6">
      <ProfileForm initialData={user} locale={locale} />
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}