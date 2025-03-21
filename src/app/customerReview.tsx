import React, { useState, useCallback, useMemo } from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface CustomerReviewProps {
  name: string;
  review: string;
}

const CustomerReview: React.FC<CustomerReviewProps> = ({ name, review }) => (
  <div className="testimonial-card flex flex-col bg-white/40 backdrop-blur-md p-8 rounded-2xl border border-white/50 shadow-[0px_10px_20px_rgba(0,0,0,0.08)] max-w-sm mx-auto h-[400px] transition-all duration-300 hover:translate-y-[-6px] hover:shadow-[0px_15px_30px_rgba(42,157,143,0.15)] overflow-hidden relative">
    <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-br from-white/30 via-transparent to-white/10 pointer-events-none"></div>
    <div className="absolute top-0 left-0 w-24 h-24 bg-[#2A9D8F]/10 rounded-br-[100px] -translate-x-6 -translate-y-6 blur-md"></div>
    <div className="flex justify-center mb-6 relative z-10">
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="text-[#E9C46A] fill-[#E9C46A] drop-shadow-sm" size={20} />
        ))}
      </div>
    </div>
    <div className="text-[#2A9D8F]/10 text-6xl font-serif absolute top-6 left-6">"</div>
    <div className="flex-grow flex items-center justify-center mb-6 relative z-10 px-4">
      <div className="overflow-y-auto max-h-[200px] custom-scrollbar">
        <p className="text-[#2A353E] text-center leading-relaxed font-medium">{review}</p>
      </div>
    </div>
    <div className="flex items-center justify-center mt-auto pt-5 border-t border-white/50 relative z-10">
      <div className="w-12 h-12 bg-[#2A9D8F] rounded-full mr-4 flex items-center justify-center flex-shrink-0 shadow-md transform hover:scale-105 transition-transform duration-200">
        <span className="text-white text-xl font-bold">
          {name.charAt(0)}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-[#2A9D8F] text-lg">{name}</h3>
        <span className="text-sm text-gray-600">Verified Customer</span>
      </div>
    </div>
  </div>
);

const CustomerReviews: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const allReviews = useMemo(() => [
    { name: "Sandy G.", review: "I have suffered from acid reflux for over 30 years and have never found a product that works so instantly to relieve my severe heartburn. This product works in an almost instant way. My choice forever." },
    { name: "Darcy M.", review: "Flavour was amazing and it gave me a more soothing and immediate relief vs tablet style heartburn medications." },
    { name: "Sarah R.", review: "I had some spicy burps after eating Thai food. I took a packet, and it worked! The burps got better right away and stopped after 15-20 minutes. Highly recommend!" },
    { name: "Nicole C.", review: "Amazing product providing 100% relief of my heartburn and indigestion even at 37 weeks pregnant after eating a spicy and acidic meal. Have tried other types of antacids throughout my pregnancy and this has been the most effective by far! The flavours are great and in very convenient packaging which makes it easy to take with me in my purse/hospital bags." },
    { name: "Wilma M.", review: "Very effective product in treating my reflux as I go through chemotherapy. This worked considerably better than Nexium for me and I was grateful for a safe alternative. The relief it provides during this challenging time is truly appreciated." },
    { name: "Dawn J.", review: "Before discovering Obex, I experienced a severe acid reflux episode that kept me awake until 4 AM in terrible pain. I'm incredibly thankful to have found this product - it works quickly and effectively to provide relief. The pleasant taste is an added bonus. I highly recommend giving Obex a try - you'll see the difference for yourself." },
    { name: "Carly M.", review: "My husband suffers with GERD and with a recent flare up he was finding minimal relief with over the counter medication. Through a co-worker we were introduced to Obex. As stated it creates a barrier to protect the esophagus. Accompanied by Nexum he was able to finally manage his symptoms. It has played a pivotal role and now has become a part of his regular nighttime routine to ensure protection throughout the night. The fact that this product is all natural and can be taken alone or alongside other medications with no interactions is truly remarkable. It is an added bonus that this product comes in a variety of carefully crafted flavours that don't taste medicinal and are true to the flavour description. Our household will never be without Obex." },
  ], []);

  const getRandomReviews = useCallback(() => {
    const shuffled = [...allReviews].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [allReviews]);

  const displayedReviews = showAll ? allReviews : getRandomReviews();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E9EDe9] to-[#DCE6E4] z-0"></div>
      <div className="absolute inset-0 opacity-20 z-0" style={{ 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%232A9D8F\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      }}></div>
      
      {/* Large decorative circle */}
      <div className="absolute top-1/4 -right-40 w-80 h-80 bg-[#2A9D8F]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-[#E9C46A]/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block px-4 py-1 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-full text-sm font-medium mb-4">Testimonials</span>
          <h2 className="text-5xl font-bold text-[#2A9D8F] mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">Real experiences from people who've found relief with our product</p>
        </div>
        
        {!showAll ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {displayedReviews.map((review, index) => (
              <div key={index} className="transform transition-all duration-500" style={{ 
                transitionDelay: `${index * 100}ms`,
                animation: `fadeIn 0.8s ease-out ${index * 150}ms both` 
              }}>
                <CustomerReview {...review} />
              </div>
            ))}
          </div>
        ) : (
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {displayedReviews.map((review, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <CustomerReview {...review} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/60 hover:bg-white text-[#2A9D8F] border border-white/80 shadow-md hover:scale-105 transition-all" />
            <CarouselNext className="bg-white/60 hover:bg-white text-[#2A9D8F] border border-white/80 shadow-md hover:scale-105 transition-all" />
          </Carousel>
        )}
        
        <div className="text-center mt-16">
          <Button
            onClick={() => setShowAll(!showAll)}
            className="bg-[#2A9D8F] text-white hover:bg-[#238276] shadow-md hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-full text-lg font-medium"
          >
            {showAll ? "Show Less" : "See All Testimonials"}
          </Button>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(42, 157, 143, 0.4) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(42, 157, 143, 0.4);
          border-radius: 10px;
        }
        .testimonial-card {
          backface-visibility: hidden;
          transform: translateZ(0);
          will-change: transform;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </section>
  );
}

export default CustomerReviews;