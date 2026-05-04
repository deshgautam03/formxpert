"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { ArrowLeft, Target, Activity, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { exerciseDetails, ExerciseDetail } from "@/lib/exerciseDetails";

// Animation Variants
const containerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch delay to show loading state if desired (or just instant resolution)
    const id = params.exerciseId as string;
    if (id && exerciseDetails[id.toLowerCase()]) {
      setExercise(exerciseDetails[id.toLowerCase()]);
    } else {
      // In a real app we might route to a 404 page if not found
      console.warn("Exercise not found for id:", id);
    }
    setLoading(false);
  }, [params.exerciseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-neon-green rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-4xl font-bold mb-4">Exercise Not Found</h1>
        <button
          onClick={() => router.push("/dashboard/workouts")}
          className="px-6 py-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
        >
          Back to Workouts
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon-green selection:text-black pb-24">
      
      {/* Back Navigation */}
      <div className="container mx-auto px-4 pt-8">
        <button
          onClick={() => router.push("/dashboard/workouts")}
          className="inline-flex items-center text-slate-400 hover:text-neon-green transition-colors mt-12 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Workouts
        </button>
      </div>

      <motion.div
        className="container mx-auto px-4"
        variants={containerVariant}
        initial="hidden"
        animate="visible"
      >
        {/* A. Hero Section */}
        <motion.div variants={itemVariant} className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            {exercise.name}
          </h1>
          <p className="text-xl md:text-2xl text-neon-green font-medium">
            {exercise.tagline}
          </p>
        </motion.div>

        {/* B. Key Info Cards */}
        <motion.div variants={itemVariant} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <InfoCard
            icon={<Target className="w-6 h-6 text-neon-blue" />}
            title="Primary Muscles"
            value={exercise.primaryMuscles.join(", ")}
          />
          <InfoCard
            icon={<Activity className="w-6 h-6 text-purple-500" />}
            title="Secondary Muscles"
            value={exercise.secondaryMuscles.join(", ")}
          />
          <InfoCard
            icon={<Zap className="w-6 h-6 text-yellow-500" />}
            title="Difficulty"
            value={exercise.difficulty}
          />
          <InfoCard
            icon={<CheckCircle className="w-6 h-6 text-neon-green" />}
            title="Equipment"
            value={exercise.equipment}
          />
        </motion.div>

        {/* NEW: Targeted Muscles Section */}
        {exercise.targetedMuscleImage && (
          <motion.section variants={itemVariant} className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Targeted Muscles</h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[500px]"
              >
                <img
                  src={`/images/targeted_muscles/${exercise.targetedMuscleImage}`}
                  alt={`${exercise.name} targeted muscle diagram`}
                  className="w-full h-auto rounded-xl border border-slate-700 object-contain shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                />
              </motion.div>
            </div>
          </motion.section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          
          <div className="lg:col-span-2 space-y-16">
            
            {/* C. "Why This Exercise?" Section */}
            <motion.section variants={itemVariant}>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-neon-green rounded-full"></span>
                Why This Exercise?
              </h2>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                <ul className="space-y-4">
                  {exercise.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-neon-green flex-shrink-0"></span>
                      <span className="text-slate-300 leading-relaxed text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* D. How to Perform - Step-by-Step Guide */}
            <motion.section variants={itemVariant}>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-neon-blue rounded-full"></span>
                How to Perform
              </h2>
              <div className="space-y-6">
                {exercise.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariant}
                    className="flex gap-6 items-start bg-slate-900/30 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 font-bold text-xl text-neon-blue">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-slate-400 text-lg leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

          </div>

          <div className="space-y-12">
            
            {/* E. Precautions & Common Mistakes */}
            <motion.section variants={itemVariant}>
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <AlertTriangle className="w-32 h-32 text-amber-500" />
                </div>
                
                <h2 className="text-2xl font-bold mb-6 text-amber-500 flex items-center gap-3 relative z-10">
                  <AlertTriangle className="w-6 h-6" />
                  Common Mistakes
                </h2>
                
                <ul className="space-y-4 relative z-10">
                  {exercise.precautions.map((precaution, index) => (
                    <li key={index} className="flex items-start gap-3 text-amber-200/80">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                      <span className="leading-relaxed">{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

          </div>
        </div>

        {/* F. Demo Video Section */}
        <motion.section variants={itemVariant} className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Form Demonstration</h2>
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
            <iframe
              width="100%"
              height="100%"
              src={exercise.demoVideoUrl}
              title={`${exercise.name} Demonstration Video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full object-cover"
            ></iframe>
          </div>
          <p className="text-center text-slate-500 mt-4 text-sm">{exercise.demoVideoCaption}</p>
        </motion.section>

      </motion.div>
    </div>
  );
}

function InfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col items-start hover:border-slate-700 transition-colors">
      <div className="mb-4 p-3 bg-slate-800/80 rounded-xl">{icon}</div>
      <h4 className="text-slate-400 text-sm font-medium mb-1">{title}</h4>
      <p className="text-white font-bold text-lg">{value}</p>
    </div>
  );
}
