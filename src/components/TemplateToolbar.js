'use client';

import { ArrowLeft, Download, Printer } from 'lucide-react';
import { useEffect } from 'react';

export function TemplateToolbar({ title }) {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('download') === '1') {
      window.setTimeout(() => window.print(), 350);
    }
  }, []);

  return (
    <div className="template-toolbar">
      <a href="/brand-kit">
        <ArrowLeft size={16} /> Brand kit
      </a>
      <strong>{title}</strong>
      <button type="button" onClick={() => window.print()}>
        <Printer size={16} /> Print / save PDF <Download size={14} />
      </button>
    </div>
  );
}
