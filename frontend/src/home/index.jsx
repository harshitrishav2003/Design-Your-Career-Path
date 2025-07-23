import Footer from "@/components/custom/Footer";
import Header from "@/components/custom/Header";
// import { UserButton } from '@clerk/clerk-react'
import { Atom, Edit3, DownloadCloud, Sparkles } from "lucide-react";
// import React from 'react'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const isSignedIn = !!user; // fallback check
  let url = "";

  if (!isSignedIn) {
    url = "auth/sign-in";
  } else {
    url = "/dashboard";
  }

  return (
    <div>
      <Header />
      <div>
        <section className=" z-50">
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
            <a
              href="#"
              className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              role="alert"
            >
              <span className="text-xs bg-primary rounded-full text-white px-4 py-1.5 mr-3">
                New
              </span>{" "}
              <span className="text-sm font-medium">
                Launching: Design Your Career Path
              </span>
              <svg
                className="ml-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Build Your Resume <span className="text-primary">With AI</span>{" "}
            </h1>
            <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
              Effortlessly create multiple stunning resumes using ready-made
              templates and our AI-powered builder.
            </p>

            <div className="flex flex-col mb-8  space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <div className="">
                <a
                  href={url}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-white shadow hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Sparkles className="w-4 h-4" />
                  Start Building Your Resume
                </a>
              </div>
            </div>
           
          </div>
        </section>
        <section className="py-12 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="mx-auto max-w-screen-xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-2 text-md text-gray-600">
              Build a job-ready resume with AI in just 3 easy steps.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="group block rounded-l p-8 bg-white shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <Atom className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary">
                  Fill the Smart Form
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your details like job title, skills, and background —
                  our form collects everything needed for a perfect resume.
                </p>
              </div>

              {/* Step 2 */}
              <div className="group block rounded-l p-8 bg-white shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <Edit3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary">
                  Generate & Customize
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Let AI instantly create tailored summaries, experiences, and
                  sections — then tweak anything to match your goals.
                </p>
              </div>

              {/* Step 3 */}
              <div className="group block rounded-l p-8 bg-white shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <DownloadCloud className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary">
                  Download & Apply
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Download your polished AI-generated resume as a PDF — ready to
                  share and apply to jobs with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="py-16 px-4 mx-auto max-w-screen-xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 text-md mb-10">
            Real stories from people who landed interviews faster with our
            AI-powered resume builder.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Testimonial 1 */}
          <div className="rounded-l bg-white shadow-md p-8 hover:shadow-lg transition">
            <p className="text-gray-700 text-md leading-relaxed mb-4">
              &ldquo;I&apos;m absolutely amazed by how easy it was to build my
              resume with AI. The suggestions were spot on and saved me so much
              time.&rdquo;
            </p>
            <p className="font-semibold text-primary">— Josh Grazioso</p>
          </div>

          {/* Testimonial 2 */}
          <div className="rounded-l bg-white shadow-md p-8 hover:shadow-lg transition">
            <p className="text-gray-700 text-md leading-relaxed mb-4">
              &ldquo;Using this AI resume builder was a game changer — I finally
              feel confident sending out my applications. I got interview calls
              within a week!&rdquo;
            </p>
            <p className="font-semibold text-primary">— Nicole Grazioso</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
