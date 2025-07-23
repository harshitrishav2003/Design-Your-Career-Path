"use client";

import { BadgeCheck, Target, Users, ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/auth/sign-in");
  };
  return (
    <main className="flex flex-col items-center justify-center">
      {/* Hero */}
      <section className="w-full bg-gradient-to-r from-primary to-indigo-600 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About Us</h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/90">
          Build a resume that opens doors. Smart, simple, and designed for your
          future.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl px-6 md:px-10 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Why Choose Us?</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          We blend stunning design, seamless tools, and future-ready tech to
          help you craft a resume that truly shines.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: BadgeCheck,
              title: "Professional Quality",
              description:
                "Clean, polished layouts that instantly impress recruiters and hiring managers.",
            },
            {
              icon: Users,
              title: "Tailored for You",
              description:
                "Pick modern templates, personalize them with ease — make your resume truly yours.",
            },
            {
              icon: Target,
              title: "Future-Proof",
              description:
                "Smart features, live updates, and AI-driven tools to keep you ahead of the curve.",
            },
          ].map(({ icon: Icon, title, description }, i) => (
            <Card
              key={i}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="flex flex-col items-center gap-2">
                <Icon className="h-10 w-10 text-primary" />
                <CardTitle className="text-center">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      {/* Mission */}
      <section className="w-full bg-gray-50 py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Rocket className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our mission is clear — to empower professionals at every stage of
            their journey with tools that make resume building simple, modern,
            and powerful. We help you share your story with confidence, clarity,
            and style.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="w-full py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Target className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We envision a world where every job seeker can create a stand-out
            resume in minutes — powered by smart suggestions, beautiful
            templates, and real-time tools. Your next big opportunity should
            never be out of reach.
          </p>
        </div>
      </section>

      {/* Unique Modern CTA */}
      <section className="relative w-full bg-gradient-to-r from-indigo-600 to-primary py-20 px-6 text-center text-white overflow-hidden">
  {/* Pattern */}
  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

  <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow">
    Ready to Build Yours?
  </h2>
  <p className="max-w-xl mx-auto text-lg md:text-xl mb-8 text-white/90">
    Thousands trust us to create resumes that get results. You can too.
    Start free today — no sign-up hassle.
  </p>

  {/*  Wrap with flex justify-center to center */}
  <div className="flex justify-center">
  <Button
      size="lg"
      onClick={handleRedirect}
      className="group bg-white text-primary px-8 py-6 text-lg font-semibold flex items-center gap-3 shadow-md hover:bg-white transition-none"
    >
      <span>Start Your Resume</span>
      <ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
    </Button>
  </div>

  <p className="mt-6 text-white/70 text-sm">
    ✅ Trusted by over 5,000 professionals worldwide.
  </p>
</section>

    </main>
  );
}
