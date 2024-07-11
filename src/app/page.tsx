"use client";

import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import CustomerReviews from '@/app/customerReview';

export default function Home() {
  const scrollToSection = (id: string): void => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Section with ID ${id} not found.`);
    }
  };
  
  return (
    <main className="bg-[#FAFAF9] text-[#264653]">
      {/* Header */}
      <header className="flex flex-col items-center justify-between p-4 border-b border-green-200 max-w-4xl mx-auto ">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image src="/IBEXhead.png" alt="OBEX Head" width={32} height={32} />
          </div>
          <h1 className="text-2xl font-bold text-green-800">OBEX</h1>
        </div>
        <nav className="flex gap-4 items-center">
          <a href="#" className="px-4 py-2 text-green-700 hover:text-green-900 hover:bg-green-100 rounded transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection("product_details"); }}>
            About
          </a>
          <a href="#research" className="px-4 py-2 text-green-700 hover:text-green-900 hover:bg-green-100 rounded transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection("research"); }}>
            Research
          </a>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors" onClick={() => scrollToSection("cta-section")}>
            Order
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen py-16 px-4 bg-gradient-to-b from-[#F4A261] to-[#E9C46A] text-white py-16">
        <div className="max-w-2xl text-center mx-auto">
          <h1 className="mb-4 text-4xl sm:text-5xl font-bold text-green-800">Experience the Power of</h1>
          <h1 className="mb-4 text-7xl sm:text-[10rem] font-bold text-green-700 tracking-widest">OBEX</h1>
          <p className="mb-8 text-lg sm:text-xl text-green-600">Your Natural Barrier Against Heartburn</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={() => scrollToSection('cta-section')}>
              Order
            </button>
            <button className="w-full sm:w-auto px-6 py-2 border border-green-600 text-green-600 rounded hover:bg-green-100" onClick={() => scrollToSection('product_details')}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Product Details */}
      <section id="product_details" className="bg-[#E9EDe9] py-16">
        <div className="max-w-2xl mx-auto">
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
            <li><strong className="text-green-700">Versatility:</strong> Sodium alginate is available in various formulations, including liquid suspensions, chewable tablets, and granules.</li>
          </ul>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="bg-white py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#2A9D8F] mb-4">Medical Research Support</h2>
          
          <Card className="mb-8 border-yellow-300">
            <CardHeader className="bg-yellow-100">
              <CardTitle className="text-yellow-800">Comparative Study of Alginate and Omeprazole in Symptomatic Treatment of Non-erosive Gastroesophageal Reflux Disease</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">This study compared the effectiveness of sodium alginate and omeprazole in treating heartburn. The results showed that sodium alginate works just as well as omeprazole for treating heartburn, providing a new option for people who might want an alternative to traditional heartburn medications.</p>
              <p className="text-yellow-700"><strong>Bottom Line:</strong> If you suffer from heartburn, sodium alginate could be a great alternative to consider, especially if you're interested in a natural remedy.</p>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-300">
            <CardHeader className="bg-yellow-100">
              <CardTitle className="text-yellow-800">Alginate on demand as add-on for patients with gastro-oesophageal reflux disease and insufficient PPI effect</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">This study looked at adding alginate to the treatment plan of GERD patients who were already on PPIs but still had symptoms. After adding alginate, 72% of the patients felt better about their treatment, with many showing significant improvement.</p>
              <p className="text-yellow-700"><strong>What This Means:</strong> For people with chronic acid reflux who aren't satisfied with their current treatment, adding alginate can be an effective and safe way to manage symptoms.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Made in Canada Section */}
      <section className="bg-[#F4A261] text-white py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Image src="/canada_white_lines.png" alt="Canada" width={300} height={300} className="mx-auto mb-8" />
          <h2 className="text-4xl font-bold mb-4 text-white">
            <span className="text-red-500">Developed</span> Right Here in <span className="text-red-500">Canada 🇨🇦</span>
          </h2>
          <p className="mb-8 text-gray-700">
            Crafted in Hamilton, Ontario, OBEX is the result of a groundbreaking collaboration among an ENT Surgeon, a Speech-Language Pathologist, a Chef, and a Food Scientist. Born from the desire to offer a palatable, natural alternative to traditional reflux remedies, OBEX combines a rich legacy of scientific knowledge with culinary innovation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => scrollToSection("product_details")}>
              Learn More
            </button>
            <button className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={() => scrollToSection("cta-section")}>
              Order Now
            </button>
          </div>
        </div>
      </section>

      {/* Flavor Options Section */}
      <section className="bg-[#E9EDe9] py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#2A9D8F] mb-4">Chef Developed Flavours</h2>
          <p className="mb-8 text-center text-gray-700">Discover the delicious side of relief with OBEX, now available in three chef-inspired flavours.</p>
          
          <div className="mb-8 p-4 bg-green-100 rounded-lg">
            <h3 className="text-2xl font-bold mb-2 text-green-700">Refreshing Mint</h3>
            <p className="text-gray-700">Experience the crisp and invigorating taste of refreshing mint. This classic flavour not only soothes your senses but also provides a cooling comforting sensation.</p>
          </div>
          
          <div className="mb-8 p-4 bg-yellow-100 rounded-lg">
            <h3 className="text-2xl font-bold mb-2 text-yellow-700">Lemon Meringue</h3>
            <p className="text-gray-700">Indulge in the delightful tang of lemon meringue, reminiscent of a classic dessert. The perfect balance of zesty lemon and sweet meringue creates a delectable treat that will brighten your day while keeping you comfortable.</p>
          </div>
          
          <div className="mb-8 p-4 bg-orange-100 rounded-lg">
            <h3 className="text-2xl font-bold mb-2 text-orange-700">Orange Creamsicle</h3>
            <p className="text-gray-700">Savour the nostalgic blend of creamy vanilla and bright orange with our orange creamsicle flavour. This comforting and luscious option takes you back to childhood summers, offering a soothing and enjoyable way to manage reflux.</p>
          </div>
          
          <p className="text-center text-gray-700">Each flavour is crafted with care to provide an enjoyable taste experience. Say goodbye to the bland and medicinal, and hello to the delicious and natural with OBEX.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="bg-[#2A9D8F] text-white py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Experience natural relief from reflux with OBEX</h2>
          <p className="mb-8">Choose the perfect OBEX package for you — our Large pack contains 24 packets with 3 delightful flavours. Order now for natural relief!</p>
          
          <Card className="mb-8 bg-white text-gray-900">
            <CardHeader className="bg-green-100">
              <CardTitle className="text-green-800">Large Pack</CardTitle>
              <CardDescription className="text-green-600">Perfect for regular use</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Image src="/productimage.png" alt="Product image" width={200} height={200} className="mx-auto mb-4" />
              <p className="mb-4 text-gray-700">Each large package contains 24 packets, each with a 5mL dose, featuring 3 delightful flavor varieties.</p>
              <p className="text-xl font-semibold text-green-700">$34.99+tax</p>
            </CardContent>
            <CardFooter className="bg-green-100">
              <a href="https://buy.stripe.com/9AQdUjcDrdiT9os7st" className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-center">
                Buy Now
              </a>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#264653] text-white py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p>© 2024 OBEX Corporation. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}