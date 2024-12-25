"use client";

import CustomerReviews from '@/app/customerReview';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from 'next/link'; 
import { Instagram } from 'lucide-react';

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToSection = (id: string): void => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Section with ID ${id} not found.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been successfully subscribed to our product updates.",
        })
        setEmail("");
      } else {
        throw new Error(data.error || 'Subscription failed');
      } 
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isMounted) {
    return null;
  }

  return (
    <main className="bg-[#FAFAF9] text-[#264653]">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gradient-to-r from-[#e6dd58] via-[#dda742] to-[#57a779] max-w-full mx-auto">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-black">
            <Image src="/white_transparent_OSlashLogo.png" alt="OBEX Logo" width={28} height={28} className="object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white">OBEX</h1>
        </div>
        <nav className="flex gap-4 items-center">
          <a href="#" className="px-4 py-2 text-white hover:text-[#e6dd58] hover:bg-black/10 rounded transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection("product_details"); }}>
            About
          </a>
          <a href="#research" className="px-4 py-2 text-white hover:text-[#e6dd58] hover:bg-black/10 rounded transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection("research"); }}>
            Research
          </a>
          <Link href="/blog" className="px-4 py-2 text-white hover:text-[#e6dd58] hover:bg-black/10 rounded transition-colors">
            Blog
          </Link>
          <a 
            href="https://www.instagram.com/obexcanada/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-[#e6dd58] transition-colors"
            aria-label="Follow us on Instagram"
          >
            <Instagram size={24} />
          </a>
          <button className="px-4 py-2 bg-[#57a779] text-white rounded hover:bg-[#4a8f68] transition-colors" onClick={() => scrollToSection("cta-section")}>
            Order
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen py-16 px-4 bg-gradient-to-b from-[#F4A261] to-[#E9C46A] text-white">
        <div className="max-w-xs sm:max-w-2xl text-center mx-auto">
          <h2 className="mb-4 text-4xl sm:text-5xl font-bold text-green-800">Experience the Power of</h2>
          <h1 className="mb-4 text-6xl sm:text-[10rem] font-extrabold text-green-800 tracking-widest">ØBEX</h1>
          <p className="mb-8 text-lg sm:text-xl text-green-600">Your Natural Barrier Against Heartburn</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={() => scrollToSection('cta-section')}>
              Order
            </Button>
            <button className="w-full sm:w-auto px-6 py-2 border border-green-600 text-green-600 rounded hover:bg-green-100" onClick={() => scrollToSection('product_details')}>
              Learn More
            </button>
          </div>
          <div className="mt-8 w-full max-w-xs sm:max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-auto text-green-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-green-700 text-white w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Sign up for product updates"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Product Details */}
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

      {/* Research Section */}
      <section id="research" className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#2A9D8F] mb-4">Medical Research Support</h2>
          
          <Card className="mb-8 border-yellow-300">
            <CardHeader className="bg-yellow-100">
              <HoverCard>
                <HoverCardTrigger>
                  <CardTitle className="mb-4 text-yellow-800">Comparative Study of Alginate and Omeprazole in Symptomatic Treatment of Non-erosive Gastroesophageal Reflux Disease</CardTitle>
                </HoverCardTrigger>
                <HoverCardContent className="bg-white text-black">
                  <a href="https://pubmed.ncbi.nlm.nih.gov/30487493/" target="_blank" className="text-left underline hover:text-blue-600">
                    Saifullah, A. M., Ahmed, F., Shil, B. C., Banik, R. K., Saha, S. K., Chowdhury, M., ... & Akhter, A. (2018). Comparative Study of Alginate and Omeprazole in Symptomatic Treatment of Non-erosive Gastroesophageal Reflux Disease. Mymensingh medical journal: MMJ, 27(4), 771-775.
                  </a>
                </HoverCardContent>
              </HoverCard>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">This study compared the effectiveness of sodium alginate and omeprazole in treating heartburn. The results showed that sodium alginate works just as well as omeprazole for treating heartburn, providing a new option for people who might want an alternative to traditional heartburn medications.</p>
              <p className="text-yellow-700"><strong>Bottom Line:</strong> If you suffer from heartburn, sodium alginate could be a great alternative to consider, especially if you're interested in a natural remedy.</p>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-300">
            <CardHeader className="bg-yellow-100">
              <HoverCard>
                <HoverCardTrigger>
                  <CardTitle className="mb-4 text-yellow-800">Alginate on demand as add-on for patients with gastro-oesophageal reflux disease and insufficient PPI effect</CardTitle>
                </HoverCardTrigger>
                <HoverCardContent className="bg-white text-black">
                  <a href="https://pubmed.ncbi.nlm.nih.gov/30466131/" target="_blank" className="text-left underline hover:text-blue-600">
                    Müller, M., Labenz, G., Borkenstein, D. P., & Labenz, J. (2018). Alginate on demand as add-on for patients with gastro-oesophageal reflux disease and insufficient PPI effect. Deutsche Medizinische Wochenschrift (1946), 144(4), e30-e35.
                  </a>
                </HoverCardContent>
              </HoverCard>
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
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
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

      {/* Flavour Options Section */}
      <section className="bg-[#E9EDe9] py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#2A9D8F] mb-4">Chef Developed Flavours</h2>
          <p className="mb-8 text-left text-gray-700">Discover the delicious side of relief with OBEX, now available in three chef-inspired flavours.</p>
          
          <div className="mb-8 p-4 bg-green-100 rounded-lg">
            <h3 className="text-2xl font-bold mb-2 text-green-700">Refreshing Mint</h3>
            <p className="text-gray-700">Experience the crisp and invigorating taste of refreshing mint. This classic flavour not only soothes your senses but also provides a cooling comforting sensation.</p>
          </div>
          
          <div className="mb-8 p-4 bg-yellow-100 rounded-lg">
            <h3 className="text-2xl font-bold mb-2 text-yellow-700">Lemon Meringue</h3>
            <p className="text-gray-700">Indulge in the delightful tang of lemon meringue, reminiscent of a classic dessert. The perfect balance of zesty lemon and sweet meringue creates a delectable treat that will brighten your day while keeping you comfortable.</p>
          </div>
          
          <div className="mb-8 p-4 bg-orange-100 rounded-lg">
            <h3 className="text-2xl font-bold mb-2 text-orange-700">Orange Cream</h3>
            <p className="text-gray-700">Savour the nostalgic blend of creamy vanilla and bright orange with our orange creamsicle flavour. This comforting and luscious option takes you back to childhood summers, offering a soothing and enjoyable way to manage reflux.</p>
          </div>
          
          <p className="text-left text-gray-700">Each flavour is crafted with care to provide an enjoyable taste experience. Say goodbye to the bland and medicinal, and hello to the delicious and natural with OBEX.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="bg-[#2A9D8F] text-white py-16">
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Experience natural relief from reflux with OBEX</h2>
          <p className="mb-8">Choose the perfect OBEX package for you — our Large pack contains 24 packets with 3 delightful flavours. Order now for natural relief!</p>
          
          <Card className="mb-8 bg-white text-gray-900">
            <CardHeader className="bg-green-100">
              <CardTitle className="text-green-800">Large Pack</CardTitle>
              <CardDescription className="text-green-600">Perfect for regular use</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Image src="/productimage.png" alt="Product image" width={200} height={200} className="mx-auto mb-4" />
              <p className="mb-4 text-gray-700">Each large package contains 24 packets, each with a 5mL dose, featuring 3 delightful flavour varieties.</p>
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
          <p className="mb-2">© 2024 OBEX Corporation. All rights reserved.</p>
          <p className="text-sm text-green-300">
            Contact us: <a href="mailto:support@obexcanada.com" className="hover:text-green-100 transition-colors">support@obexcanada.com</a>
          </p>
        </div>
      </footer>
    </main>
  );
}