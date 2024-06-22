import React from 'react';
import { Star } from 'lucide-react';

interface CustomerReviewProps {
  name: string;
  review: string;
  // followers: string;
}

const CustomerReview: React.FC<CustomerReviewProps> = ({ name, review }) => (
  <div className="flex flex-col items-center bg-[#E7A423] p-6 rounded-lg shadow-md max-w-sm mx-auto">
    <div className="flex mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="text-[#F0E68C] fill-[#F0E68C]" size={24} />
      ))}
    </div>
    <p className="text-[#364C43] text-center mb-4">{review}</p>
    <div className="flex items-center">
      <div className="w-12 h-12 bg-[#496748] rounded-full mr-4"></div>
      <div>
        <h3 className="font-bold text-[#364C43]">{name}</h3>
        {/* <p className="text-sm text-[#496748]">{followers} followers on X</p> */}
      </div>
    </div>
  </div>
);

const CustomerReviews: React.FC = () => {
  return (
    <section className="bg-[#E7A423] py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#364C43] mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CustomerReview 
            name="Sandy G."
            review="I have suffered from acid reflux, aka heartburn, for over 30 years and have never found a product that works so instantly to relieve my severe heartburn. I wake up throughout the night or can't even begin to sleep for hours sometimes because my chest is burning.

            Every product I've used has always worked in an almost gone way. This product works in an almost instant way. I say almost because, in truth, it takes just a second to move down the esophagus to do its 'amazing job.'
            
            I highly recommend this wonderful godsend to anyone who experiences any form of heartburn, whether it’s just beginning or severe. My choice forever."
          />
          {/* <CustomerReview 
            name="Jane Smith"
            review="I love how natural OBEX is. It's effective and doesn't have any side effects. Highly recommend!"
            // followers="5,678"
          /> */}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;