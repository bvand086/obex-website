import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Parse request body
    const data = await request.json();
    const { rating, feedback, flavour, email, name } = data;

    // Validate required fields
    if (!rating || !flavour) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Store in Supabase
    const { error: supabaseError } = await supabase
      .from("product_reviews")
      .insert([
        {
          rating: parseInt(rating),
          feedback,
          flavour,
          email: email || null,
          name: name || null,
          created_at: new Date().toISOString(),
        },
      ]);

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      return NextResponse.json(
        { error: "Failed to store review in database" },
        { status: 500 }
      );
    }

    // Send email notification
    const emailContent = `
      New ØBEX Product Review:
      
      Rating: ${rating}/5
      Flavour: ${flavour}
      Feedback: ${feedback || "No feedback provided"}
      
      From: ${name || "Anonymous"} ${email ? `(${email})` : ""}
    `;

    const { error: emailError } = await resend.emails.send({
      from: "no-reply@obexcanada.com",
      to: "support@obexcanada.com",
      subject: "New ØBEX Product Review",
      text: emailContent,
    });

    if (emailError) {
      console.error("Email sending error:", emailError);
      // We don't want to fail the whole request if just the email fails
      // But we log it for debugging
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { error: "Failed to process review" },
      { status: 500 }
    );
  }
} 