"use client";

import Image from "next/image";
import React from "react";
import PaymentButton from "@/components/ui/PaymentButton";
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"




export default function Home() {

  const scrollToSection = (id: string): void => {
    const section = document.querySelector(id);
    if (section instanceof HTMLElement) {
        section.scrollIntoView({ behavior: "smooth" });
    }
};


  return (
    <main className="bg-black text-white"> 
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image src="/IBEXhead.png" alt="IBEX Head" width={32} height={32} />
          </div>
          <nav className="flex gap-4">
  
            <a href="#" className="hover:underline"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#product_details");
            }}>
              About
            </a>
            <a href="#research" className="hover:underline"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#research");
            }}>
              Research
            </a>
          </nav>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded hover:bg-gray-100" 
            onClick={() => scrollToSection("#cta-section")}>
            Order
          </button>
        </div>
      </header>

      <section className="flex items-center justify-center h-[700px] bg-fixed" style={{ backgroundImage: "url('/backgroundproduct.jpeg')", backgroundSize: '150%', backgroundPosition: 'center' }}>
        <div className="max-w-2xl text-center text-white mx-auto">
          <h1 className="mb-4 text-4xl font-bold">
            Experience the Power of OBEX Today
          </h1>
          <p className="mb-4">
          Your Natural Barrier Against Heartburn.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={() => scrollToSection("#cta-section")}>
              Order
            </button>
            <button className="px-6 py-2 border rounded hover:bg-gray-100"
            onClick={() => scrollToSection("#product_details")}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section id="hero" className="flex items-center justify-center h-[500px]">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="max-w-2xl text-left text-white">
            <h1 className="mb-4 text-4xl font-bold text-white">
              Experience the Power of OBEX Packets
            </h1>
            <p className="mb-4 text-white">
              OBEX packets are the perfect solution for busy individuals looking
              for a convenient and effective way to defend against reflux. With our
              specially formulated packets, you can easily avoid the discomfort on the go.
            </p>
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-semibold text-white">Conveniently Packed</h3>
                <p className="text-white">
                  Each OBEX packet contains a single 5mL dose of our proprietary blend.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Effective Results</h3>
                <p className="text-white">
                  Studies indicate sodium alginate is as effective as regular prescription strength medications (PPI) in preventing reflux.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <button className="px-6 py-2 border rounded hover:bg-gray-100 text-white"
              onClick={() => scrollToSection("#product_details")}>
                Learn More
              </button>
              <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
                onClick={() => scrollToSection("#cta-section")}>
                Order Now
              </button>
            </div>
          </div>
          <div className="w-1/2 h-[300px]">
            <Image src="/seaweedOBEX.png" alt="Seaweed" width={300} height={300} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

{/* customer reactions to product */}
<section id="customer_reactions" className="flex items-center justify-center h-[500px] text-white">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="w-1/2 bg-gray-300 h-[300px] flex justify-center items-center">
            <button className="bg-gray-400 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 3.75a3.75 3.75 0 00-3.75 3.75v9a3.75 3.75 0 003.75 3.75h15a3.75 3.75 0 003.75-3.75v-9a3.75 3.75 0 00-3.75-3.75h-15zm7.86 5.22a.75.75 0 01.14 1.06l-2.12 2.12 2.12 2.12a.75.75 0 01-1.06 1.06L8.43 12.94l-2.12 2.12a.75.75 0 11-1.06-1.06l2.12-2.12L7.37 9.97a.75.75 0 011.06-1.06l2.12 2.12 2.12-2.12a.75.75 0 011.06-.14zM9.97 6.75h6.28a1.5 1.5 0 100-3H9.97a1.5 1.5 0 100 3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="max-w-2xl text-left">
            <h1 className="mb-4 text-4xl font-bold">
              Proven Results That Customers Love
            </h1>
            <p className="mb-4">
              Our product has been shown to deliver outstanding results, leaving our
              customers satisfied and happy. Try it today and experience the difference
              for yourself.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-1/2">
                <h3 className="font-semibold">50% Off</h3>
                <p>
                  Limited time offer: Get 50% off your first purchase.
                </p>
              </div>
              <div className="w-1/2">
                <h3 className="font-semibold">50% More</h3>
                <p>
                  Get 50% more product for the same price.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <button className="px-6 py-2 border rounded hover:bg-gray-100">
                Learn More
              </button>
              <button className="px-6 py-2 border rounded hover:bg-gray-100">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>
      

{/* features list */}
      <section id="product_details" className="w-full max-w-5xl p-4 mx-auto">
        <div className="flex flex-col items-center text-center">
          <TooltipProvider>
            <Tooltip>
          <TooltipTrigger><h2 className="text-3xl font-bold" style={{ color: "#839897" }}>About Sodium Alginate</h2></TooltipTrigger>
          <TooltipContent>
            <p>Click on these frequently asked questions to learn more about sodium alginate</p>
          </TooltipContent>
          </Tooltip>
          </TooltipProvider>
          <p className="text-left text-[#839897]">Sodium alginate, a natural substance derived from seaweed, has become an increasingly popular ingredient in products aimed at managing gastroesophageal reflux disease (GERD) and heartburn. The unique properties of sodium alginate make it especially effective for relieving these common digestive issues.</p>
          <Collapsible>
            <CollapsibleTrigger>
            <h2 className="font-bold text-[#839897]">How Sodium Alginate Works</h2></CollapsibleTrigger>
            <CollapsibleContent>
            <p className="text-left text-[#839897]">When ingested, sodium alginate reacts with stomach acid to form a gel-like raft that floats on top of the stomach contents. This raft acts as a barrier, preventing acid from rising back up into the esophagus, which is the cause of heartburn and other reflux-related discomfort. This protective mechanism makes sodium alginate particularly useful for addressing the symptoms of GERD, especially post-meal acid reflux episodes.</p>
            </CollapsibleContent>
            </Collapsible>
            <Collapsible>
            <CollapsibleTrigger>
            <h2 className="font-bold text-[#839897]">Why Sodium Alginate is Beneficial</h2>
              </CollapsibleTrigger>
              <CollapsibleContent>
              <ul>
                <li className="text-left text-[#839897]"><strong>Rapid Relief:</strong> Sodium alginate works quickly to form a protective barrier, often providing immediate relief from heartburn. This rapid action is beneficial for individuals who experience sudden or severe reflux symptoms.</li>
                <li className="text-left text-[#839897]"><strong>Natural and Safe:</strong> As a natural extract from seaweed, sodium alginate is generally well-tolerated and considered safe for most people, including pregnant women. It&apos;s natural origin also appeals to those who prefer alternative or plant-based remedies.</li>
                <li className="text-left text-[#839897]"><strong>Non-Systemic Action:</strong> Unlike proton pump inhibitors or other acid-suppressing medications, sodium alginate does not affect the overall acidity of the stomach. This makes it suitable for intermittent use and helps maintain normal digestive function.</li>
                <li className="text-left text-[#839897]"><strong>Complementary to Other Treatments:</strong> Sodium alginate can be used alongside other treatments for GERD or heartburn, enhancing their effectiveness or providing additional relief during particularly troublesome episodes.</li>
                <li className="text-left text-[#839897]"><strong>Versatility:</strong> Sodium alginate is available in various formulations, including liquid suspensions, chewable tablets, and granules, offering convenient options for different preferences and needs.</li>
              </ul>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
            <CollapsibleTrigger>
              <h2 className="font-bold text-[#839897]">Applications of Sodium Alginate</h2>
              </CollapsibleTrigger>
              <CollapsibleContent>
              <ul>
                <li className="text-left text-[#839897]"><strong>Mild to Moderate GERD:</strong> For individuals with occasional reflux or mild GERD, sodium alginate provides effective, on-the-spot relief.</li>
                <li className="text-left text-[#839897]"><strong>Postprandial Heartburn:</strong> Those who experience reflux after meals benefit from sodium alginate, which prevents acid from rising during digestion.</li>
                <li className="text-left text-[#839897]"><strong>Pregnancy-Related Heartburn:</strong> Pregnant women, who often experience heartburn, find sodium alginate useful due to its safety profile.</li>
                <li className="text-left text-[#839897]"><strong>Nighttime Reflux:</strong> Sodium alginate forms a lasting barrier, making it effective for preventing nighttime reflux when lying down.</li>
              </ul>
            </CollapsibleContent>
            </Collapsible>
              <h2 className="font-bold text-[#839897]">Conclusion</h2>

              <p className="text-left text-[#839897] text-left">Sodium alginate offers a natural, effective solution for managing heartburn and reflux. It&apos;s unique gel-forming properties, rapid action, and safety make it a valuable tool for individuals seeking relief from digestive discomfort. Whether used alone or in combination with other treatments, sodium alginate provides a soothing solution for a common and often bothersome problem.</p>


        </div>
        <Separator className="my-4" style={{ backgroundColor: '#B79941' }} />
      </section>

{/* About the product */}
      <section id="research" className="w-full max-w-5xl p-4 mx-auto bg-transparent">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold pb-4" style={{ color: "#F8E1A9" }}>Medical Research Support of Alginates</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card style={{ borderColor: '#F8E1A9' }}>
              <CardHeader>
                <HoverCard>
                  <HoverCardTrigger>
                    <CardTitle style={{ color: "#F8E1A9" }}>Comparative Study of Alginate and Omeprazole in Symptomatic Treatment of Non-erosive Gastroesophageal Reflux Disease</CardTitle>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-white text-black">
                    <a href="https://pubmed.ncbi.nlm.nih.gov/30487493/" target="_blank" className="text-left underline hover:text-blue-600">
                      Saifullah, A. M., Ahmed, F., Shil, B. C., Banik, R. K., Saha, S. K., Chowdhury, M., ... & Akhter, A. (2018). Comparative Study of Alginate and Omeprazole in Symptomatic Treatment of Non-erosive Gastroesophageal Reflux Disease. Mymensingh medical journal: MMJ, 27(4), 771-775.
                    </a>
                  </HoverCardContent>
                </HoverCard>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-[#F8E1A9]">A New Way to Treat Heartburn: Alginates Work as Well as Omeprazole</p>
                <p className="text-left text-[#F8E1A9]">Many people experience heartburn or acid reflux, which can be uncomfortable and bothersome. This condition, known as non-erosive gastroesophageal reflux disease (NERD), is often treated with medications like omeprazole. However, a new study suggests that sodium alginate, a natural substance found in seaweed, might be just as effective.</p>
                <p className="font-bold text-[#F8E1A9]">What Was the Study About?</p>
                <p className="text-left text-[#F8E1A9]">Researchers in Taiwan wanted to compare the effectiveness of two treatments for heartburn: sodium alginate and omeprazole. They recruited 195 adults with NERD and divided them into two groups. One group took sodium alginate, while the other group took omeprazole for four weeks.</p>
                <p className="font-bold text-[#F8E1A9]">What Did the Study Find?</p>
                <p className="text-left text-[#F8E1A9]">At the end of the study, over half of the participants in both groups reported relief from heartburn symptoms. Both treatments were safe and well-tolerated, with few side effects.</p>
                <p className="font-bold text-[#F8E1A9]">What Does This Mean for People with Heartburn?</p>
                <p className="text-left text-[#F8E1A9]">The results show that sodium alginate works just as well as omeprazole for treating heartburn. This provides a new option for people who might want an alternative to traditional heartburn medications. Sodium alginate is a natural product and might appeal to those looking for more natural treatment options.</p>
                <p className="font-bold text-[#F8E1A9]">Bottom Line</p>
                <p className="text-left text-[#F8E1A9]">If you suffer from heartburn, sodium alginate could be a great alternative to consider, especially if you're interested in a natural remedy. Always talk to your doctor to figure out the best treatment for you.</p>
              </CardContent>
            </Card>
            <Card style={{ borderColor: '#F8E1A9' }}>
              <CardHeader>
              <HoverCard>
                  <HoverCardTrigger>
                <CardTitle style={{ color: "#F8E1A9" }}>Alginate on demand as add-on for patients with gastro-oesophageal reflux disease and insufficient PPI effect</CardTitle>
              </HoverCardTrigger>
              <HoverCardContent className="bg-white text-black">
              <a href="https://pubmed.ncbi.nlm.nih.gov/30466131/" target="_blank" className="text-left underline hover:text-blue-600">
              Müller, M., Labenz, G., Borkenstein, D. P., & Labenz, J. (2018). Alginate on demand as add-on for patients with gastro-oesophageal reflux disease and insufficient PPI effect. Deutsche Medizinische Wochenschrift (1946), 144(4), e30-e35.
                    </a>
              </HoverCardContent>
              </HoverCard>
              </CardHeader>
              <CardContent>
                 <p className="font-bold text-[#F8E1A9]"><strong>Helping Heartburn: Alginate and PPI Therapy</strong></p>

                  <p className="text-left text-[#F8E1A9]">Many people who suffer from chronic acid reflux, also known as GERD, take proton pump inhibitors (PPIs) for relief. However, even with these medications, some patients continue to have symptoms. This could be due to something called the "acid pocket," which is an area of acid in the stomach that can cause discomfort. Luckily, a natural remedy called alginate can help.</p>

                  <h2 className="font-bold text-[#F8E1A9]">Study Details</h2>

                  <p className="text-left text-[#F8E1A9]">Researchers wanted to see if adding alginate to the treatment plan of GERD patients who were already on PPIs but still had symptoms would help. The study involved patients who had been on PPIs for at least a year and were unhappy with their treatment. These patients used alginate for 14 days, taking it up to four times a day when needed.</p>

                  <h3 className="font-bold text-[#F8E1A9]">What the Researchers Did</h3>

                  <ul>
                    <li className="text-left text-[#F8E1A9]"><strong>Participants:</strong> 155 patients participated, with 54% being women and an average age of 57 years.</li>
                    <li className="text-left text-[#F8E1A9]"><strong>Treatment:</strong> Patients took alginate in addition to their usual PPIs.</li>
                    <li className="text-left text-[#F8E1A9]"><strong>Assessment:</strong> The patients filled out a survey about their symptoms before and after the treatment. The main goal was to see if their satisfaction with the therapy improved.</li>
                  </ul>

                  <h3 className="font-bold text-[#F8E1A9]">What They Found</h3>

                  <ul>
                    <li className="text-left text-[#F8E1A9]"><strong>Improved Satisfaction:</strong> After adding alginate, 72% of the patients felt better about their treatment, with many showing significant improvement.</li>
                    <li className="text-left text-[#F8E1A9]"><strong>Symptom Relief:</strong> The patients experienced relief from typical reflux symptoms and sleep disturbances.</li>
                    <li className="text-left text-[#F8E1A9]"><strong>Safe to Use:</strong> The treatment was generally well-tolerated.</li>
                  </ul>

                  <h2 className="font-bold text-[#F8E1A9]">What This Means</h2>

                  <p className="text-left text-[#F8E1A9]">For people with chronic acid reflux who aren't satisfied with their current treatment, adding alginate can be an effective and safe way to manage symptoms. It's a natural remedy that acts as a barrier, blocking reflux and providing relief.</p>

              </CardContent>
            </Card>
          </div>
        </div>
      </section>

{/* CTA Section */}
      <section id="cta-section" className="w-full max-w-5xl p-4 mx-auto h-screen">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold pb-4">Experience natural relief from reflux with OBEX—try it now for safe, immediate relief!</h2>
          <p>Choose the perfect OBEX package for you — try our Small (10 packets), Large (25 packets), or opt for our convenient 6 or 12-month subscriptions. Order now for natural relief!</p>
        
          <Carousel className="w-11/12 h-auto max-h-[80vh] mx-auto pt-4"
              opts={{
                align: "start",
                loop: true,
              }}
          >
            <CarouselContent className="-ml-1">
              {[
                { title: "Small Pack", description: "Ideal for occasional use", content: "Each small package contains 10 packets, each with a 5mL dose of a single, delightful flavor.", footer: "Starting at $16.99", link: "https://buy.stripe.com/cN2bMb46VcePfMQ8ww" },
                { title: "Large Pack", description: "Perfect for regular use", content: "Each large package contains 25 packets, each with a 5mL dose, featuring 3 delightful flavor varieties.", footer: "Starting at $34.99", link: "https://buy.stripe.com/9AQdUjcDrdiT9os7st" },
                { title: "6 Month Subscription", description: "Half-year supply", content: "With our 6-month subscription, you'll receive a large variety pack of 3 different flavors every 30 days, each pack containing 25 convenient packets.", footer: "Save 10%", link: "https://buy.stripe.com/3cs4jJfPD5Qr8ko3ce" },
                { title: "12 Month Subscription", description: "Full-year supply", content: "With our 12-month subscription, you'll receive a large variety pack of 3 different flavors every 30 days, each pack containing 25 convenient packets.", footer: "Save 15%", link: "https://buy.stripe.com/6oEg2rfPD0w7fMQfZ1" }
              ].map((card, index) => (
                <CarouselItem key={index} className="pl-1 md:basis-3/5 lg:basis-5/12 mx-2">
                  <div className="p-1 h-auto max-h-[65vh] flex flex-col justify-between border border-white rounded-lg">
                    <div>
                      <CardHeader className="text-left">
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-left">
                        <Image src="/IBEXhead.png" alt="Product Image" width={250} height={250} />
                        <p>{card.content}</p>
                      </CardContent>
                    </div>
                    <CardFooter className="mt-auto flex justify-between items-center text-lg font-bold">
                      <p>{card.footer}</p>
                      <div className="border border-white rounded-lg p-4 hover:bg-white hover:text-black">
                        <a href={card.link} className="button">
                          Buy Now
                        </a>
                      </div>
                    </CardFooter>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        
      </section>




      <footer className="w-full p-4 border-t border-gray-300 bg-gray-100">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-600">
            © 2024 OBEX Corporation. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm hover:underline">Privacy Policy</a>
            <a href="#" className="text-sm hover:underline">Terms of Use</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

