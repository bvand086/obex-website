"use client";

import React from "react";

const ProductDetailsSection: React.FC = () => {
  return (
    <section id="product_details" className="bg-[#E9EDe9] py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#2A9D8F] mb-4">About Sodium Alginate</h2>
        <p className="mb-8 text-gray-700">Sodium alginate, a natural substance derived from seaweed, has become an increasingly popular ingredient in products aimed at managing gastroesophageal reflux disease (GERD) and heartburn. The unique properties of sodium alginate make it especially effective for relieving these common digestive issues.</p>
        
        <h3 className="text-2xl font-bold mb-4 text-green-600">How Sodium Alginate Works</h3>
        <p className="mb-8 text-gray-700">When ingested, sodium alginate reacts with stomach acid to form a gel-like raft that floats on top of the stomach contents. This raft acts as a barrier, preventing acid from rising back up into the esophagus, which is the cause of heartburn and other reflux-related discomfort.</p>
        
        <h3 className="text-2xl font-bold mb-4 text-green-600">Why Sodium Alginate is Beneficial</h3>
        <ul className="list-disc pl-5 mb-8 text-gray-700">
          <li className="mb-2"><strong className="text-green-700">Rapid Relief:</strong> Sodium alginate works quickly to form a protective barrier, often providing immediate relief from heartburn.</li>
          <li className="mb-2"><strong className="text-green-700">Natural and Safe:</strong> As a natural extract from seaweed, sodium alginate is generally well-tolerated and considered safe for most people, including pregnant women.</li>
          <li className="mb-2"><strong className="text-green-700">Non-Systemic Action:</strong> Unlike proton pump inhibitors or other acid-suppressing medications, sodium alginate does not affect the overall acidity of the stomach.</li>
          <li className="mb-2"><strong className="text-green-700">Complementary to Other Treatments:</strong> Sodium alginate can be used alongside other treatments for GERD or heartburn.</li>
        </ul>
      </div>
    </section>
  );
};

export default ProductDetailsSection;