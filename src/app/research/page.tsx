import React from 'react';
import type { Metadata } from "next";
import ResearchContent from '@/components/ResearchContent';

export const metadata: Metadata = {
  title: "Research - Medical Evidence",
  description: "Discover the scientific evidence supporting OBEX's effectiveness in managing reflux symptoms. Review peer-reviewed studies on sodium alginate therapy and its clinical applications.",
  keywords: ["sodium alginate research", "GERD studies", "reflux research", "alginate therapy evidence", "medical studies", "PubMed research"],
  openGraph: {
    title: "Research - Medical Evidence | ØBEX",
    description: "Scientific evidence behind OBEX's effectiveness in managing reflux symptoms through peer-reviewed research studies.",
    url: "https://OBEXCanada.com/research",
  },
  alternates: {
    canonical: "https://OBEXCanada.com/research"
  }
};

const Research: React.FC = () => {
  return <ResearchContent />;
};

export default Research; 