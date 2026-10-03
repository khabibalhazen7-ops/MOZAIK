import React, { useEffect, useState } from 'react';
import { generateSitemapXml } from '../services/sitemap';

export const SitemapXmlView: React.FC = () => {
  const [xml, setXml] = useState<string>('Loading dynamic sitemap XML...');

  useEffect(() => {
    generateSitemapXml(window.location.origin).then((content) => {
      setXml(content);
    });
  }, []);

  return (
    <div className="bg-[#1C1A18] text-[#D4CCB8] min-h-screen p-6 font-mono text-xs overflow-x-auto">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#4A4036]">
          <span className="text-white font-bold tracking-wider">MOZAIK XML SITEMAP (/sitemap.xml)</span>
          <span className="text-[10px] text-[#A89F8D]">Generated dynamically for search engine bots</span>
        </div>
        <pre className="whitespace-pre-wrap leading-relaxed bg-[#121110] p-6 border border-[#2C2926] text-emerald-400">
          {xml}
        </pre>
      </div>
    </div>
  );
};
