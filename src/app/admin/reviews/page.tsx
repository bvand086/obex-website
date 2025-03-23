"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// Define the review type
type Review = {
  id: string;
  rating: number;
  feedback: string | null;
  flavour: string;
  email: string | null;
  name: string | null;
  created_at: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Create Supabase client with public key (RLS policies will handle access control)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get the session (this will only work if the user is authenticated)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError("You must be logged in to view this page");
          setLoading(false);
          return;
        }

        // Fetch reviews
        const { data, error } = await supabase
          .from("product_reviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setReviews(data as Review[]);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? "text-yellow-500" : "text-gray-300"}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-teal-600">ØBEX</div>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/admin" className="text-gray-600 hover:text-teal-600 transition-colors">
                Admin Home
              </Link>
              <Link href="/admin/reviews" className="text-teal-600 font-medium">
                Reviews
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Reviews</h1>
        <Separator className="mb-8" />

        {loading ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 border-t-4 border-teal-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            <p>{error}</p>
            {error === "You must be logged in to view this page" && (
              <Link href="/login" className="text-red-600 underline mt-2 inline-block">
                Go to login
              </Link>
            )}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">No reviews submitted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {renderRating(review.rating)}
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                        {review.flavour}
                      </span>
                    </div>
                    
                    {review.feedback && (
                      <div className="mt-3 text-gray-700">
                        "{review.feedback}"
                      </div>
                    )}
                    
                    <div className="mt-4 text-sm text-gray-500">
                      {review.name ? (
                        <span className="font-medium text-gray-700">{review.name}</span>
                      ) : (
                        <span className="italic">Anonymous</span>
                      )}
                      {review.email && <span> ({review.email})</span>}
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    {formatDate(review.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 