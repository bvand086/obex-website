"use client";

import React from "react";

const SuccessBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#2A9D8F]/5 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#E9C46A]/5 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/4"></div>
    </div>
  );
};

export default SuccessBackground;