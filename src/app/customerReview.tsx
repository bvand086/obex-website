import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import BlurFade from '@/components/magicui/blur-fade';

interface CustomerReviewProps {
  name: string;
  review: string;
}

const CustomerReview: React.FC<CustomerReviewProps> = ({ name, review }) => (
  <BlurFade>
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="text-[#E9C46A] fill-[#E9C46A]" size={24} />
        ))}
      </div>
      <p className="text-[#264653] text-center mb-4">{review}</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-[#2A9D8F] rounded-full mr-4 flex items-center justify-center">
          <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-[#2A9D8F]">{name}</h3>
        </div>
      </div>
    </div>
  </BlurFade>
);

const CustomerReviews: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [displayedReviews, setDisplayedReviews] = useState<CustomerReviewProps[]>([]);

  const allReviews = [
    { name: "Sandy G.", review: "I have suffered from acid reflux for over 30 years and have never found a product that works so instantly to relieve my severe heartburn. This product works in an almost instant way. My choice forever." },
    { name: "Darcy M.", review: "Flavour was amazing and it gave me a more soothing and immediate relief vs tablet style heartburn medications." },
    { name: "Sarah R.", review: "I had some spicy burps after eating Thai food. I took a packet, and it worked! The burps got better right away and stopped after 15-20 minutes. Highly recommend!" },
    { name: "Nicole C.", review: "Amazing product providing 100% relief of my heartburn and indigestion even at 37 weeks pregnant after eating a spicy and acidic meal. Have tried other types of antacids throughout my pregnancy and this has been the most effective by far! The flavours are great and in very convenient packaging which makes it easy to take with me in my purse/hospital bags." },
    { name: "Wilma M.", review: "Very effective product in treating my reflux as I go through chemotherapy. This worked considerably better than Nexium for me and I was grateful for a safe alternative. The relief it provides during this challenging time is truly appreciated." },
  ];

  const getRandomReviews = (count: number) => {
    const shuffled = [...allReviews].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    setDisplayedReviews(getRandomReviews(3));
  }, []);

  return (
    <section className="bg-[#E9EDe9] py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#2A9D8F] mb-8">What Our Customers Say</h2>
        {!showAll && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {displayedReviews.map((review, index) => (
              <CustomerReview key={index} name={review.name} review={review.review} />
            ))}
          </div>
        )}
        {showAll && (
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {allReviews.map((review, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <CustomerReview name={review.name} review={review.review} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
        <div className="text-center mt-8">
          <Button
            onClick={() => setShowAll(!showAll)}
            className="bg-[#2A9D8F] text-white hover:bg-[#238276]"
          >
            {showAll ? "Show Less" : "See All Testimonials"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;