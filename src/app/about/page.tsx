import React from 'react';
import type { Metadata } from "next";
import AboutContent from '@/components/AboutContent';

export const metadata: Metadata = {
  title: "About Us - Our Story",
  description: "Learn about OBEX's founding story and the team behind Canada's most enjoyable sodium alginate blend. Discover how our collaboration of medical experts, chefs, and food scientists created an innovative solution for reflux management.",
  keywords: ["OBEX story", "sodium alginate development", "Canadian medical innovation", "reflux solution team", "Hamilton Ontario", "alginate therapy"],
  openGraph: {
    title: "About ØBEX - Our Story",
    description: "The journey behind creating Canada's most enjoyable sodium alginate blend by a team of medical experts and culinary professionals.",
    url: "https://OBEXCanada.com/about",
  },
  alternates: {
    canonical: "https://OBEXCanada.com/about"
  }
};

const About: React.FC = () => {
  return <AboutContent />;
};

export default About; 