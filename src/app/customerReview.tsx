import React from 'react';
import { Star } from 'lucide-react';

interface CustomerReviewProps {
  name: string;
  review: string;
}

const CustomerReview: React.FC<CustomerReviewProps> = ({ name, review }) => (
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
);

const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      name: "Sandy G.",
      review: "I have suffered from acid reflux for over 30 years and have never found a product that works so instantly to relieve my severe heartburn. This product works in an almost instant way. My choice forever."
    },
    {
      name: "Darcy M.",
      review: "Flavour was amazing and it gave me a more soothing and immediate relief vs tablet style heartburn medications."
    },
    {
      name: "Sarah R.",
      review: "I had some spicy burps after eating Thai food. I took a packet, and it worked! The burps got better right away and stopped after 15-20 minutes. Highly recommend!"
    }
  ];

  return (
    <section className="bg-[#E9EDe9] py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#2A9D8F] mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <CustomerReview key={index} name={review.name} review={review.review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;