"use client";

import React from "react";

const ProductInformation: React.FC = () => {
  return (
    <div className="relative mb-16 z-30">
      <div className="absolute inset-0 bg-gradient-to-br from-[#E9C46A]/5 to-[#2A9D8F]/5 rounded-2xl transform transition-transform duration-500"></div>
      <div className="relative bg-white/95 backdrop-blur-md p-12 rounded-2xl shadow-xl border border-[#E9C46A]/10">
        <h2 className="text-3xl font-bold text-[#264653] mb-6">About OBEX</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-[#2A9D8F] mb-4">Natural Relief</h3>
            <p className="text-gray-600 mb-6">
              OBEX uses sodium alginate, a natural substance derived from seaweed, to create a protective barrier 
              that prevents acid reflux. This natural approach provides effective relief without harsh chemicals.
            </p>
            
            <h3 className="text-xl font-semibold text-[#2A9D8F] mb-4">Chef-Crafted Flavours</h3>
            <p className="text-gray-600">
              Our flavours are developed by professional chefs to ensure an enjoyable taste experience. 
              Say goodbye to chalky, medicinal-tasting antacids and hello to delicious relief.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-[#2A9D8F] mb-4">Made in Canada</h3>
            <p className="text-gray-600 mb-6">
              Proudly developed and manufactured in Hamilton, Ontario, OBEX represents Canadian innovation 
              in natural health products, backed by scientific research and culinary expertise.
            </p>
            
            <h3 className="text-xl font-semibold text-[#2A9D8F] mb-4">Fast-Acting</h3>
            <p className="text-gray-600">
              OBEX works quickly to form a protective gel raft on top of stomach contents, 
              providing rapid relief from heartburn and acid reflux symptoms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;