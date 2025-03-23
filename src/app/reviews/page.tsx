"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

// Form validation schema
const formSchema = z.object({
  rating: z.string().min(1, {
    message: "Please select a rating.",
  }),
  feedback: z.string().optional(),
  flavour: z.enum(["Lemon Meringue", "Soothing Mint", "Orange Cream"], {
    required_error: "Please select a flavour.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional(),
  name: z.string().optional(),
});

export default function ReviewPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: "",
      feedback: "",
      flavour: undefined,
      email: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Send the form data to our API endpoint
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review');
      }
      
      setIsSubmitted(true);
      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will use it to improve our products.",
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Something went wrong.",
        description: "Your feedback could not be submitted. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Navigation */}
      <header className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-teal-600">ØBEX</div>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-teal-600 transition-colors">
              Home
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-teal-600 transition-colors">
              Blog
            </Link>
            <Link href="/reviews" className="text-teal-600 font-medium">
              Reviews
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
                ØBEX Product Feedback
              </h1>
              <p className="text-gray-600 text-center mb-6">
                Help us improve our product!
              </p>
              <Separator className="mb-6" />

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">
                          How would you rate our product? <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="flex gap-4 pt-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div key={rating} className="flex-1">
                              <FormControl>
                                <div className="flex flex-col items-center">
                                  <Input
                                    type="radio"
                                    className="sr-only peer"
                                    id={`rating-${rating}`}
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                    checked={field.value === rating.toString()}
                                    value={rating.toString()}
                                  />
                                  <label
                                    htmlFor={`rating-${rating}`}
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold cursor-pointer 
                                    border-2 transition-all duration-200 
                                    peer-checked:bg-teal-600 peer-checked:text-white peer-checked:border-teal-600
                                    hover:border-teal-500 hover:bg-teal-50"
                                  >
                                    {rating}
                                  </label>
                                </div>
                              </FormControl>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">
                          Tell us more about your experience:
                        </FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            placeholder="What did you like or dislike? How could we improve?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="flavour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">
                          What's your favourite flavour? <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                          {["Lemon Meringue", "Soothing Mint", "Orange Cream"].map((flavour) => (
                            <div key={flavour}>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="radio"
                                    className="peer sr-only"
                                    id={`flavour-${flavour}`}
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                    checked={field.value === flavour}
                                    value={flavour}
                                  />
                                  <label
                                    htmlFor={`flavour-${flavour}`}
                                    className="flex flex-col items-center p-4 rounded-lg border-2 bg-white 
                                    cursor-pointer transition-all duration-200
                                    peer-checked:border-teal-600 peer-checked:bg-teal-50 
                                    hover:border-teal-300"
                                  >
                                    <div className={`w-16 h-16 mb-2 rounded-full flex items-center justify-center 
                                      ${flavour === "Lemon Meringue" ? "bg-yellow-100" : 
                                        flavour === "Soothing Mint" ? "bg-green-100" : "bg-orange-100"}`}
                                    >
                                      <div className={`text-2xl 
                                        ${flavour === "Lemon Meringue" ? "text-yellow-500" : 
                                          flavour === "Soothing Mint" ? "text-green-500" : "text-orange-500"}`}
                                      >
                                        {flavour === "Lemon Meringue" ? "🍋" : 
                                          flavour === "Soothing Mint" ? "🌿" : "🍊"}
                                      </div>
                                    </div>
                                    <span className="font-medium text-center">{flavour}</span>
                                  </label>
                                </div>
                              </FormControl>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your-email@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            We'll never share your email with anyone else.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button 
                      type="submit" 
                      className="w-full md:w-1/2 bg-teal-600 hover:bg-teal-700 text-white py-6 rounded-lg text-lg font-medium shadow-md transition-all duration-200 hover:shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Feedback"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-4">
              Thank You For Your Feedback!
            </h2>
            <p className="text-gray-600 mb-6">
              We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve our products.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)} 
              variant="outline"
              className="mx-auto"
            >
              Submit Another Response
            </Button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-teal-600">ØBEX</div>
              <p className="text-gray-600 mt-2">Premium Alginate Blend</p>
            </div>
            <div className="flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-teal-600 transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-teal-600 transition-colors">
                Blog
              </Link>
              <Link href="/reviews" className="text-teal-600 font-medium">
                Reviews
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} ØBEX Incorporated. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 