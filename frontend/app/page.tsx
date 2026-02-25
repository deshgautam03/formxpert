"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Zap, CheckCircle, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-neon-green selection:text-black">

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* Background Watermark/Parallax */}
        <div className="absolute inset-0 z-0 opacity-50 pointer-events-none flex items-center justify-center overflow-hidden">
          <h1 className="text-[20vw] font-black text-slate-600 whitespace-nowrap select-none animate-pulse">
            GYM AI
          </h1>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-black to-black z-0" />

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green text-sm font-semibold tracking-wide uppercase">
              AI-Powered Personal Training
            </div>
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
              Perfect Form. <br />
              <span className="text-neon-green">Maximum Gains.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              The only AI trainer that corrects your posture in real-time.
              Prevent injuries and optimize every rep with computer vision.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {user ? (
                <Link href="/dashboard" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-neon-green rounded-full hover:bg-[#b3ff00] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(163,255,0,0.3)]">
                  Go to Dashboard <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              ) : (
                <>
                  <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-neon-green rounded-full hover:bg-[#b3ff00] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(163,255,0,0.3)]">
                    Start Your Journey <ArrowRight className="ml-2 w-6 h-6" />
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white border border-slate-700 rounded-full hover:bg-slate-800 transition-all">
                    Log In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Three simple steps to perfect your form and master your workouts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard number="01" title="Setup Camera" description="Place your device so your full body is visible in the frame." />
            <StepCard number="02" title="Start Workout" description="Choose your exercise and let our AI track your movements." />
            <StepCard number="03" title="Get Feedback" description="Receive real-time audio and visual corrections as you train." />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why FormXpert?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Activity className="w-10 h-10 text-neon-blue" />}
              title="Real-time Analysis"
              description="Get instant feedback on your form as you exercise using your camera."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10 text-neon-green" />}
              title="Injury Prevention"
              description="Detect dangerous posture deviations before they cause harm."
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10 text-purple-500" />}
              title="Progress Tracking"
              description="Visualize your improvements with detailed analytics and charts."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">What Athletes Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Aditya Maurya"
              role="CrossFit Athlete"
              quote="FormXpert helped me fix my squat depth. The real-time feedback is a game changer."
            />
            <TestimonialCard
              name="Akhilesh Sahu"
              role="Yoga Instructor"
              quote="I recommend this to all my students. It's like having a personal trainer 24/7."
            />
            <TestimonialCard
              name="Ansh Kirola"
              role="Powerlifter"
              quote="The analytics helped me track my progress and break my plateaus safely."
            />
          </div>
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-neon-green/50 transition-all duration-300"
    >
      <div className="mb-6 p-4 bg-slate-800/50 rounded-xl inline-block">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-6xl font-black text-slate-800 mb-4">{number}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}

function TestimonialCard({ name, role, quote }: { name: string, role: string, quote: string }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />)}
      </div>
      <p className="text-lg text-slate-300 mb-6">"{quote}"</p>
      <div>
        <div className="font-bold text-white">{name}</div>
        <div className="text-sm text-slate-500">{role}</div>
      </div>
    </div>
  )
}
