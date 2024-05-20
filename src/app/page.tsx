"use client";

import Image from "next/image";
import React from "react";
import PaymentButton from "@/components/ui/PaymentButton";
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
    } else {
      console.error(`Section with ID ${id} not found.`);
    }
  };
  
  return (
    <main className="bg-black text-white p-4 sm:p-0"> 
      <header className="flex flex-col sm:flex-row items-center justify-between p-4 border-b">
        <div className="flex flex-col sm:flex-row items-center gap-4">
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

      <section className="flex flex-col sm:flex-row items-center justify-center h-[700px] bg-black" 
           style={{ backgroundImage: "url('/backgroundproduct.jpeg')", backgroundSize: '150%', backgroundPosition: 'center' }}>
        <div className="max-w-2xl text-center text-white mx-auto shadow-lg p-6 bg-black bg-opacity-30 rounded-lg"
             style={{ paddingLeft: '16px', paddingRight: '16px' }}>
          <h1 className="mb-4 text-5xl font-bold text-[#F0E68C]">Experience the Power of OBEX Today</h1>
          <p className="mb-4 text-xl text-[#F0E68C]">Your Natural Barrier Against Heartburn.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-6 py-2 bg-[#688B63] text-white rounded hover:bg-[#496748]"
                    onClick={() => scrollToSection('#cta-section')}>
              Order
            </button>
            <button className="px-6 py-2 border border-white text-white rounded hover:bg-[#688B63] hover:text-white"
                    onClick={() => scrollToSection('#product_details')}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section id="hero" className="flex flex-col sm:flex-row items-center justify-center h-[500px] pb-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="max-w-2xl text-left text-[#E0DED4]">
            <h1 className="mb-4 text-4xl font-bold text-[#E0DED4]">Experience the Power of OBEX Packets</h1>
            <p className="mb-4 text-[#A8B18C]">
              OBEX packets are the perfect solution for busy individuals looking
              for a convenient and effective way to defend against reflux. With our
              specially formulated packets, you can easily avoid the discomfort on the go.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div>
                <h3 className="font-semibold text-[#E0DED4]">Conveniently Packed</h3>
                <p className="text-[#A8B18C]">
                  Each OBEX packet contains a single 5mL dose of our proprietary blend.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#E0DED4]">Effective Results</h3>
                <p className="text-[#A8B18C]">
                  Studies indicate sodium alginate is as effective as the gold standard prescription strength medications (Proton Pump Inhibitors (PPI)) in preventing reflux.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <button className="px-6 py-2 border rounded text-[#E0DED4] border-[#E0DED4] hover:bg-[#496748]" onClick={() => scrollToSection("#product_details")}>
                Learn More
              </button>
              <button className="px-6 py-2 bg-[#688B63] text-white rounded hover:bg-[#496748]" onClick={() => scrollToSection("#cta-section")}>
                Order Now
              </button>
            </div>
          </div>
          <div className="w-full sm:w-1/2 h-[300px] pb-4 md:pb-0">
            <Image src="/seaweedOBEX.jpeg" alt="Seaweed" width={300} height={300} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

{/* customer reactions to product */}
<section id="madeincanada" className="flex flex-col sm:flex-row items-center justify-center min-h-[500px] pt-8 text-white">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/canada_white_lines.png" alt="Canada" width={300} height={500} className="w-full sm:w-1/2 bg-black object-cover" />
          <div className="max-w-2xl text-left h-full flex flex-col justify-between">
            <div>
              <h1 className="mb-4 text-4xl font-bold text-[#E0DED4]">
                <span className="text-red-600">Developed</span> Right Here in <span className="text-red-600">Canada 🇨🇦</span>
              </h1>
              <p className="mb-4 text-[#A8B18C]">
              Crafted in Hamilton, Ontario, OBEX is the result of a groundbreaking collaboration among an ENT Surgeon, a Speech-Language Pathologist, a Chef, and a Food Scientist. Born from the desire to offer a palatable, natural alternative to traditional reflux remedies, OBEX combines a rich legacy of scientific knowledge with culinary innovation. Utilizing Sodium Alginate, a time-tested ingredient known since the 1880s for its efficacy but poor taste, our team has revolutionized its use. With OBEX, developed right here in Canada, you no longer have to compromise taste for effective reflux and regurgitation relief.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <button className="px-6 py-2 border rounded hover:bg-[#496748]"
              onClick={() => scrollToSection("#product_details")}>
                Learn More
              </button>
              <button className="px-6 py-2 bg-[#688B63] text-white rounded hover:bg-[#496748]" onClick={() => scrollToSection("#cta-section")}>
          Order Now
        </button>
            </div>
          </div>
        </div>
      </section>
      
{/* customer reactions to product */}
<section id="flavour_options" className="flex flex-col sm:flex-row items-center justify-center min-h-[500px] pt-8 text-white">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="max-w-2xl text-left h-full flex flex-col justify-between">
            <div>
              <h1 className="mb-4 text-4xl font-bold text-white">
                <span className="text-white">Local Chef-Inspired Flavors</span>
              </h1>
              <p className="mb-4 text-white">
              <h2>Discover the delicious side of relief with OBEX, now available in three chef-inspired flavours that transform your daily anti-reflux routine into a gourmet experience.</h2>
              <br />
              <h2 style={{ color: '#98FB98' }}>Refreshing Mint:</h2>
              <p style={{ color: '#98FB98' }}>Experience the crisp and invigorating taste of refreshing mint. This classic flavour not only soothes your senses but also provides a cooling sensation, making it perfect for a revitalizing start to your day.</p>
              <br />
              <h2 style={{ color: '#FFD700' }}>Lemon Meringue:</h2>
              <p style={{ color: '#FFEA00' }}>Indulge in the delightful tang of lemon meringue, reminiscent of your favourite dessert. The perfect balance of zesty lemon and sweet meringue creates a delectable treat that will brighten your day while keeping reflux at bay.</p>
              <br />
              <h2 style={{ color: '#FFA500' }}>Orange Creamsicle:</h2>
              <p style={{ color: '#FFA500' }}>Savour the nostalgic blend of creamy vanilla and bright orange with our orange creamsicle flavour. This comforting and luscious option takes you back to childhood summers, offering a soothing and enjoyable way to manage reflux.</p>
              <br />
              Each flavour is crafted with care to provide not only effective relief but also an enjoyable taste experience. Say goodbye to the bland and medicinal, and hello to the delicious and natural with OBEX.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            </div>
          </div>
          <Image src="/flavourphoto.jpeg" alt="flavours stylised" width={300} height={500} className="w-full sm:w-1/2 bg-black object-cover" />
        </div>
      </section>      

{/* features list */}
      <section id="product_details" className="w-full max-w-5xl p-4 mx-auto">
        <div className="flex flex-col items-center text-center">
          <TooltipProvider>
            <Tooltip>
          <TooltipTrigger><h2 className="text-3xl font-bold text-[#E0DED4]">About Sodium Alginate</h2></TooltipTrigger>
          <TooltipContent>
            <p>Click on these frequently asked questions to learn more about sodium alginate</p>
          </TooltipContent>
          </Tooltip>
          </TooltipProvider>
          <p className="text-left text-[#688B63]">Sodium alginate, a natural substance derived from seaweed, has become an increasingly popular ingredient in products aimed at managing gastroesophageal reflux disease (GERD) and heartburn. The unique properties of sodium alginate make it especially effective for relieving these common digestive issues.</p>
          <Collapsible>
            <CollapsibleTrigger>
              <h2 className="font-bold text-[#688B63] hover:text-[#E0DED4] cursor-pointer transition-colors duration-100">How Sodium Alginate Works</h2>
            </CollapsibleTrigger>
            <CollapsibleContent>
            <p className="text-left text-[#688B63]">When ingested, sodium alginate reacts with stomach acid to form a gel-like raft that floats on top of the stomach contents. This raft acts as a barrier, preventing acid from rising back up into the esophagus, which is the cause of heartburn and other reflux-related discomfort. This protective mechanism makes sodium alginate particularly useful for addressing the symptoms of GERD, especially post-meal acid reflux episodes.</p>
            </CollapsibleContent>
            </Collapsible>
            <Collapsible>
            <CollapsibleTrigger>
            <h2 className="font-bold text-[#688B63] hover:text-[#E0DED4] cursor-pointer transition-colors duration-100">Why Sodium Alginate is Beneficial</h2>
              </CollapsibleTrigger>
              <CollapsibleContent>
              <ul>
                <li className="text-left text-[#688B63]"><strong>Rapid Relief:</strong> Sodium alginate works quickly to form a protective barrier, often providing immediate relief from heartburn. This rapid action is beneficial for individuals who experience sudden or severe reflux symptoms.</li>
                <li className="text-left text-[#688B63]"><strong>Natural and Safe:</strong> As a natural extract from seaweed, sodium alginate is generally well-tolerated and considered safe for most people, including pregnant women. The natural origin of Sodium Alginate also appeals to those who prefer alternative or plant-based remedies.</li>
                <li className="text-left text-[#688B63]"><strong>Non-Systemic Action:</strong> Unlike proton pump inhibitors or other acid-suppressing medications, sodium alginate does not affect the overall acidity of the stomach. This makes it suitable for intermittent use and helps maintain normal digestive function.</li>
                <li className="text-left text-[#688B63]"><strong>Complementary to Other Treatments:</strong> Sodium alginate can be used alongside other treatments for GERD or heartburn, enhancing their effectiveness or providing additional relief during particularly troublesome episodes.</li>
                <li className="text-left text-[#688B63]"><strong>Versatility:</strong> Sodium alginate is available in various formulations, including liquid suspensions, chewable tablets, and granules, offering convenient options for different preferences and needs.</li>
              </ul>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
            <CollapsibleTrigger>
              <h2 className="font-bold text-[#688B63] hover:text-[#E0DED4] cursor-pointer transition-colors duration-100">Applications of Sodium Alginate</h2>
              </CollapsibleTrigger>
              <CollapsibleContent>
              <ul>
                <li className="text-left text-[#688B63]"><strong>Mild to Moderate GERD:</strong> For individuals with occasional reflux or mild GERD, sodium alginate provides effective, on-the-spot relief.</li>
                <li className="text-left text-[#688B63]"><strong>Postprandial Heartburn:</strong> Those who experience reflux after meals benefit from sodium alginate, which prevents acid from rising during digestion.</li>
                <li className="text-left text-[#688B63]"><strong>Pregnancy-Related Heartburn:</strong> Pregnant women, who often experience heartburn, find sodium alginate useful due to its safety profile.</li>
                <li className="text-left text-[#688B63]"><strong>Nighttime Reflux:</strong> Sodium alginate forms a lasting barrier, making it effective for preventing nighttime reflux when lying down.</li>
              </ul>
            </CollapsibleContent>
            </Collapsible>
              <h2 className="font-bold text-[#688B63]">Conclusion</h2>

              <p className="text-left text-[#688B63] text-left">Sodium alginate offers a natural, effective solution for managing heartburn and reflux. It&apos;s unique gel-forming properties, rapid action, and safety make it a valuable tool for individuals seeking relief from digestive discomfort. Whether used alone or in combination with other treatments, sodium alginate provides a soothing solution for a common and often bothersome problem.</p>


        </div>
        <Separator className="my-4" style={{ backgroundColor: '#E0DED4' }} />
      </section>

{/* About the product */}
<section id="research" className="w-full max-w-5xl p-4 mx-auto bg-transparent">
  <h2 className="text-3xl font-bold pb-4 text-[#E0DED4] text-center" >Medical Research Support of Alginates</h2>
  <div className="flex flex-col sm:flex-row items-center text-center">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Card style={{ borderColor: '#A8B18C' }}>
              <CardHeader>
                <HoverCard>
                  <HoverCardTrigger>
                    <CardTitle style={{ color: "#A8B18C" }}>Comparative Study of Alginate and Omeprazole in Symptomatic Treatment of Non-erosive Gastroesophageal Reflux Disease</CardTitle>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-white text-black">
                    <a href="https://pubmed.ncbi.nlm.nih.gov/30487493/" target="_blank" className="text-left underline hover:text-blue-600">
                      Saifullah, A. M., Ahmed, F., Shil, B. C., Banik, R. K., Saha, S. K., Chowdhury, M., ... & Akhter, A. (2018). Comparative Study of Alginate and Omeprazole in Symptomatic Treatment of Non-erosive Gastroesophageal Reflux Disease. Mymensingh medical journal: MMJ, 27(4), 771-775.
                    </a>
                  </HoverCardContent>
                </HoverCard>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-[#A8B18C]">A New Way to Treat Heartburn: Alginates Work as Well as Omeprazole</p>
                <p className="text-left text-[#A8B18C]">Many people experience heartburn or acid reflux, which can be uncomfortable and bothersome. This condition, known as non-erosive gastroesophageal reflux disease (NERD), is often treated with medications like omeprazole. However, a new study suggests that sodium alginate, a natural substance found in seaweed, might be just as effective.</p>
                <p className="font-bold text-[#A8B18C]">What Was the Study About?</p>
                <p className="text-left text-[#A8B18C]">Researchers in Taiwan wanted to compare the effectiveness of two treatments for heartburn: sodium alginate and omeprazole. They recruited 195 adults with NERD and divided them into two groups. One group took sodium alginate, while the other group took omeprazole for four weeks.</p>
                <p className="font-bold text-[#A8B18C]">What Did the Study Find?</p>
                <p className="text-left text-[#A8B18C]">At the end of the study, over half of the participants in both groups reported relief from heartburn symptoms. Both treatments were safe and well-tolerated, with few side effects.</p>
                <p className="font-bold text-[#A8B18C]">What Does This Mean for People with Heartburn?</p>
                <p className="text-left text-[#A8B18C]">The results show that sodium alginate works just as well as omeprazole for treating heartburn. This provides a new option for people who might want an alternative to traditional heartburn medications. Sodium alginate is a natural product and might appeal to those looking for more natural treatment options.</p>
                <p className="font-bold text-[#A8B18C]">Bottom Line</p>
                <p className="text-left text-[#A8B18C]">If you suffer from heartburn, sodium alginate could be a great alternative to consider, especially if you're interested in a natural remedy. Always talk to your doctor to figure out the best treatment for you.</p>
              </CardContent>
            </Card>
            <Card style={{ borderColor: '#A8B18C' }}>
              <CardHeader>
              <HoverCard>
                  <HoverCardTrigger>
                <CardTitle style={{ color: "#A8B18C" }}>Alginate on demand as add-on for patients with gastro-oesophageal reflux disease and insufficient PPI effect</CardTitle>
              </HoverCardTrigger>
              <HoverCardContent className="bg-white text-black">
              <a href="https://pubmed.ncbi.nlm.nih.gov/30466131/" target="_blank" className="text-left underline hover:text-blue-600">
              Müller, M., Labenz, G., Borkenstein, D. P., & Labenz, J. (2018). Alginate on demand as add-on for patients with gastro-oesophageal reflux disease and insufficient PPI effect. Deutsche Medizinische Wochenschrift (1946), 144(4), e30-e35.
                    </a>
              </HoverCardContent>
              </HoverCard>
              </CardHeader>
              <CardContent>
                 <p className="font-bold text-[#A8B18C]"><strong>Helping Heartburn: Alginate and PPI Therapy</strong></p>

                  <p className="text-left text-[#A8B18C]">Many people who suffer from chronic acid reflux, also known as GERD, take proton pump inhibitors (PPIs) for relief. However, even with these medications, some patients continue to have symptoms. This could be due to something called the "acid pocket," which is an area of acid in the stomach that can cause discomfort. Luckily, a natural remedy called alginate can help.</p>

                  <h2 className="font-bold text-[#A8B18C]">Study Details</h2>

                  <p className="text-left text-[#A8B18C]">Researchers wanted to see if adding alginate to the treatment plan of GERD patients who were already on PPIs but still had symptoms would help. The study involved patients who had been on PPIs for at least a year and were unhappy with their treatment. These patients used alginate for 14 days, taking it up to four times a day when needed.</p>

                  <h3 className="font-bold text-[#A8B18C]">What the Researchers Did</h3>

                  <ul>
                    <li className="text-left text-[#A8B18C]"><strong>Participants:</strong> 155 patients participated, with 54% being women and an average age of 57 years.</li>
                    <li className="text-left text-[#A8B18C]"><strong>Treatment:</strong> Patients took alginate in addition to their usual PPIs.</li>
                    <li className="text-left text-[#A8B18C]"><strong>Assessment:</strong> The patients filled out a survey about their symptoms before and after the treatment. The main goal was to see if their satisfaction with the therapy improved.</li>
                  </ul>

                  <h3 className="font-bold text-[#A8B18C]">What They Found</h3>

                  <ul>
                    <li className="text-left text-[#A8B18C]"><strong>Improved Satisfaction:</strong> After adding alginate, 72% of the patients felt better about their treatment, with many showing significant improvement.</li>
                    <li className="text-left text-[#A8B18C]"><strong>Symptom Relief:</strong> The patients experienced relief from typical reflux symptoms and sleep disturbances.</li>
                    <li className="text-left text-[#A8B18C]"><strong>Safe to Use:</strong> The treatment was generally well-tolerated.</li>
                  </ul>

                  <h2 className="font-bold text-[#A8B18C]">What This Means</h2>

                  <p className="text-left text-[#A8B18C]">For people with chronic acid reflux who aren't satisfied with their current treatment, adding alginate can be an effective and safe way to manage symptoms. It's a natural remedy that acts as a barrier, blocking reflux and providing relief.</p>

              </CardContent>
            </Card>
          </div>
        </div>
      </section>

{/* CTA Section */}
<section id="cta-section" className="w-full max-w-5xl p-4 mx-auto h-auto min-h-screen text-center">
  <h2 className="text-3xl font-bold pb-4 text-[#E0DED4]">Experience natural relief from reflux with OBEX—try it now for safe, immediate relief!</h2>
    <p className="text-[#E0DED4]">Choose the perfect OBEX package for you — try our Small (10 packets), Large (25 packets), or opt for our convenient 6 or 12-month subscriptions. Order now for natural relief!</p>
      <div className="flex flex-col sm:flex-row items-center"> 
          <Carousel className="w-11/12 h-auto max-h-[80vh] mx-auto pt-4 pb-8"
              opts={{
                align: "start",
                loop: true,
              }}
          >
            <CarouselContent className="-ml-1">
              {[
                { title: "Small Pack", description: "Ideal for occasional use", content: "Each small package contains 10 packets, each with a 5mL dose of a single, delightful flavor.", footer: "$16.99+tax", link: "https://buy.stripe.com/cN2bMb46VcePfMQ8ww" },
                { title: "Large Pack", description: "Perfect for regular use", content: "Each large package contains 25 packets, each with a 5mL dose, featuring 3 delightful flavor varieties.", footer: "$34.99+tax", link: "https://buy.stripe.com/9AQdUjcDrdiT9os7st" },
                { title: "6 Mo Subscription", description: "Half-year supply", content: "With our 6-month subscription, you'll receive a large variety pack of 3 different flavors every 30 days, each pack containing 25 convenient packets.", footer: "Save 10%", footer2: "$178.50+tax", link: "https://buy.stripe.com/3cs4jJfPD5Qr8ko3ce" },
                { title: "12 Mo Subscription", description: "Full-year supply", content: "With our 12-month subscription, you'll receive a large variety pack of 3 different flavors every 30 days, each pack containing 25 convenient packets.", footer: "Save 15%", footer2: "$336.00+tax", link: "https://buy.stripe.com/6oEg2rfPD0w7fMQfZ1" }
              ].map((card, index) => (
                <CarouselItem key={index} className="pl-1 mx-2 basis-full sm:basis-1/2">
                  <div className="p-1 h-[65vh] flex flex-col justify-between border border-gray-700 rounded-lg bg-[#364C43]">
                    <div>
                      <CardHeader className="text-left flex items-center px-5 py-4 bg-[#496748]">
                        <CardTitle className="text-lg font-semibold text-[#E0DED4]">{card.title}</CardTitle>
                        <CardDescription className="text-sm text-[#A8B18C] ml-4">{card.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="px-5 py-4">
                      <div className="flex justify-center my-4">
                          <img src="/productimage.png" alt="Product image" className="w-1/2 max-w-lg" />
                        </div>
                        <p className="text-left text-sm text-[#A8B18C]">{card.content}</p>
                        
                      </CardContent>
                    </div>
                    <CardFooter className="mt-auto flex justify-between items-center px-5 py-4 bg-[#496748] text-lg font-bold">
                      <div className="flex justify-center items-center h-full">
                        <Image src="/IBEXhead.png" alt="Product Image" width={75} height={75} className="object-cover object-center rounded-full" />
                      </div>
                      <p className="text-xl font-semibold text-[#E0DED4]">{card.footer}</p>
                      <p className="text-sm font-semibold text-[#E0DED4]">{card.footer2}</p>
                      <div className="w-full sm:w-auto border border-transparent rounded-lg bg-[#688B63] text-white p-4 hover:bg-[#496748] text-center">
                        <a href={card.link} className="flex items-center justify-center h-full w-full">
                          Buy Now
                        </a>
                      </div>
                    </CardFooter>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext />
            <CarouselPrevious />
          </Carousel>
        </div>
        
      </section>




      <footer className="w-full p-4 border-t border-[#A8B18C] bg-[#E0DED4] text-[#364C43]">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">© 2024 OBEX Corporation. All rights reserved.</p>
          {/* <div className="flex items-center gap-4">
            <a href="#" className="text-sm hover:underline">Privacy Policy</a>
            <a href="#" className="text-sm hover:underline">Terms of Use</a>
          </div> */}
        </div>
      </footer>
    </main>
  );
}


