import { notFound } from 'next/navigation';

import { BusinessTemplate } from '@/components/BusinessTemplate';
import { TemplateToolbar } from '@/components/TemplateToolbar';
import { brandTemplates, getBrandTemplate } from '@/data/brandTemplates';

export function generateStaticParams() {
  return brandTemplates.map(({ slug }) => ({ template: slug }));
}

export async function generateMetadata({ params }) {
  const { template: slug } = await params;
  const template = getBrandTemplate(slug);
  return template ? { title: `${template.title} | Hadassah Brand Kit` } : {};
}

export default async function TemplatePage({ params }) {
  const { template: slug } = await params;
  const template = getBrandTemplate(slug);
  if (!template) notFound();

  return (
    <main className="template-page">
      <TemplateToolbar title={template.title} />
      <BusinessTemplate slug={slug} />
    </main>
  );
}
