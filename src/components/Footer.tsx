"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#264653] text-white py-8">
      <div className="max-w-2xl mx-auto text-center">
        <p className="mb-2">© 2025 OBEX Corporation. All rights reserved.</p>
        <p className="text-sm text-green-300">
          Contact us: <a href="mailto:support@obexcanada.com" className="hover:text-green-100 transition-colors">support@obexcanada.com</a>
        </p>
        <p className="text-xs text-gray-400 max-w-xl mx-auto mt-4">
          These statements have not been evaluated by Health Canada. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare practitioner prior to use if you have a medical condition or are taking medications.
        </p>
      </div>
    </footer>
  );
};

export default Footer;