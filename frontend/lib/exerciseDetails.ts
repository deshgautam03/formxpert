export interface ExerciseDetail {
  id: string;
  name: string;
  tagline: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  benefits: string[];
  steps: { title: string; description: string }[];
  precautions: string[];
  demoVideoUrl: string;
  demoVideoCaption: string;
  targetedMuscleImage?: string;
}

export const exerciseDetails: Record<string, ExerciseDetail> = {
  "squat": {
    id: "squat",
    name: "Squat",
    tagline: "The king of lower body movements",
    primaryMuscles: ["Quadriceps", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core", "Lower Back"],
    difficulty: "Beginner",
    equipment: "Bodyweight (or Barbell/Dumbbells)",
    benefits: [
      "Builds foundational lower body strength and muscle mass.",
      "Improves core stability and overall athletic performance.",
      "Burns a significant number of calories due to large muscle group engagement.",
      "Enhances mobility and flexibility in the hips and ankles."
    ],
    steps: [
      { title: "Setup", description: "Stand with feet shoulder-width apart, toes pointing slightly outward." },
      { title: "Brace", description: "Engage your core and keep your chest up and back straight." },
      { title: "Descend", description: "Push your hips back and bend your knees to lower your body, as if sitting in a chair." },
      { title: "Depth", description: "Lower yourself until your thighs are at least parallel to the floor." },
      { title: "Ascend", description: "Push through your heels to return to the starting position." }
    ],
    precautions: [
      "Do not let your knees cave inward (valgus collapse).",
      "Avoid rounding your lower back; keep it neutral.",
      "Ensure your heels stay flat on the ground throughout the movement."
    ],
    demoVideoUrl: "https://www.youtube.com/embed/aclHkVaku9U",
    demoVideoCaption: "Proper bodyweight squat form demonstration.",
    targetedMuscleImage: "squat_skeleton.jpg"
  },
  "pushup": {
    id: "pushup",
    name: "Push-Up",
    tagline: "The ultimate upper body bodyweight builder",
    primaryMuscles: ["Chest (Pectorals)", "Triceps", "Shoulders (Deltoids)"],
    secondaryMuscles: ["Core", "Serratus Anterior"],
    difficulty: "Beginner",
    equipment: "Bodyweight",
    benefits: [
      "Develops upper body pushing strength effectively.",
      "Engages the core heavily for stability.",
      "Requires no equipment and can be done anywhere.",
      "Highly scalable for all fitness levels (e.g., knee push-ups, incline push-ups)."
    ],
    steps: [
      { title: "Setup", description: "Start in a high plank position with hands slightly wider than shoulder-width apart." },
      { title: "Alignment", description: "Maintain a straight line from your head to your heels. Engage your core and glutes." },
      { title: "Descend", description: "Lower your body by bending your elbows, keeping them at a roughly 45-degree angle to your body." },
      { title: "Depth", description: "Continue lowering until your chest nearly touches the floor." },
      { title: "Ascend", description: "Push firmly through your hands to return to the starting high plank position." }
    ],
    precautions: [
      "Do not let your hips sag towards the floor.",
      "Avoid flaring your elbows straight out to the sides (keep them tucked to 45 degrees).",
      "Don't crane your neck forward; keep your gaze slightly ahead of your hands."
    ],
    demoVideoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
    demoVideoCaption: "Step-by-step perfect push-up tutorial.",
    targetedMuscleImage: "pushup_skeleton.webp"
  },
  "plank": {
    id: "plank",
    name: "Plank",
    tagline: "The foundation of core stability",
    primaryMuscles: ["Core (Rectus Abdominis, Transverse Abdominis)"],
    secondaryMuscles: ["Shoulders", "Glutes", "Lower Back"],
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    benefits: [
      "Improves overall core strength and stability.",
      "Enhances posture and helps prevent lower back pain.",
      "Builds endurance in both standard and stabilizing muscles.",
      "A safe isometric exercise requiring no movement."
    ],
    steps: [
      { title: "Setup", description: "Start on the floor resting on your forearms and toes." },
      { title: "Position Arms", description: "Keep your elbows directly beneath your shoulders." },
      { title: "Alignment", description: "Maintain a straight, rigid line from your head to your heels." },
      { title: "Hold", description: "Engage your core, squeeze your glutes, and hold the position without dipping." }
    ],
    precautions: [
      "Do not let your hips drop toward the floor.",
      "Avoid raising your hips too high into a V-shape.",
      "Keep your neck neutral; don't look up or drop your head."
    ],
    demoVideoUrl: "https://www.youtube.com/embed/pSHjTRCQxIw",
    demoVideoCaption: "Proper plank form and common mistakes to avoid.",
    targetedMuscleImage: "Plank_skeleton.webp"
  },
  "lunge": {
    id: "lunge",
    name: "Lunge",
    tagline: "Build single-leg strength and balance",
    primaryMuscles: ["Quadriceps", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Calves", "Core"],
    difficulty: "Beginner",
    equipment: "Bodyweight (or Dumbbells)",
    benefits: [
      "Develops unilateral (single-leg) strength, reducing muscle imbalances.",
      "Improves balance, coordination, and athletic performance.",
      "Great for mobility and flexibility of the hip flexors."
    ],
    steps: [
      { title: "Setup", description: "Stand tall with your feet hip-width apart and hands on your hips or by your side." },
      { title: "Step Forward", description: "Take a large step forward with your right leg." },
      { title: "Descend", description: "Lower your hips until both your front and back knees form a 90-degree angle." },
      { title: "Alignment", description: "Keep your front knee directly above your front ankle and do not let it extend past your toes." },
      { title: "Ascend", description: "Push off your front foot to return to the starting position." }
    ],
    precautions: [
      "Avoid letting your front knee collapse inward.",
      "Do not let your back knee slam into the ground.",
      "Keep your chest up and torso upright throughout the movement."
    ],
    demoVideoUrl: "https://www.youtube.com/embed/QOVaHwm-Q6U",
    demoVideoCaption: "How to perform the perfect lunge.",
    targetedMuscleImage: "Lunges_skeleton.webp"
  },
  "bicepcurl": {
    id: "bicepcurl",
    name: "Bicep Curl",
    tagline: "Isolate and build serious arm strength",
    primaryMuscles: ["Biceps Brachii"],
    secondaryMuscles: ["Brachialis", "Forearms"],
    difficulty: "Beginner",
    equipment: "Dumbbells",
    benefits: [
      "Directly isolates the biceps for targeted muscle growth.",
      "Improves grip strength and forearm stability.",
      "Aesthetically enhances the arms and aids in pulling movements."
    ],
    steps: [
      { title: "Setup", description: "Stand with a dumbbell in each hand, arms fully extended facing forward." },
      { title: "Anchor", description: "Keep your elbows tucked closely to your sides and do not let them move." },
      { title: "Curl", description: "Exhale and curl the weights up toward your shoulders by contracting your biceps." },
      { title: "Squeeze", description: "Pause for a moment at the top of the movement and squeeze the muscle." },
      { title: "Lower", description: "Slowly lower the weights back to the starting position." }
    ],
    precautions: [
      "Do not swing your body or use momentum to lift the weights.",
      "Keep your wrists neutral; do not curl them inward intensely.",
      "Ensure full extension at the bottom for an optimal range of motion."
    ],
    demoVideoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
    demoVideoCaption: "Dumbbell bicep curl demonstration.",
    targetedMuscleImage: "bicep_curl_skeleton.webp"
  },
  "shoulderpress": {
    id: "shoulderpress",
    name: "Shoulder Press",
    tagline: "The premier vertical pushing movement",
    primaryMuscles: ["Shoulders (Deltoids)"],
    secondaryMuscles: ["Triceps", "Upper Chest", "Core"],
    difficulty: "Intermediate",
    equipment: "Dumbbells",
    benefits: [
      "Builds significant upper body strength and shoulder hypertrophy.",
      "Improves core stability when performed standing.",
      "Enhances lockout strength for various athletic movements."
    ],
    steps: [
      { title: "Setup", description: "Stand tall or sit holding dumbbells at shoulder height with palms facing forward." },
      { title: "Brace", description: "Engage your core and ensure your back is straight, avoiding excessive arching." },
      { title: "Press", description: "Push the dumbbells straight up above your head until your arms are fully extended." },
      { title: "Control", description: "Slowly lower the weights back down to shoulder height." }
    ],
    precautions: [
      "Do not arch your lower back excessively to help push the weight.",
      "Avoid locking out your elbows violently at the top of the movement.",
      "Keep the weights moving in a controlled path; do not let them drift backward."
    ],
    demoVideoUrl: "https://www.youtube.com/embed/qEwKCR5JCog",
    demoVideoCaption: "Proper dumbbell shoulder press technique.",
    targetedMuscleImage: "shoulder_press_skeleton.jpg"
  },
  "sittingposture": {
    id: "sittingposture",
    name: "Sitting Posture",
    tagline: "Correct your desk habits",
    primaryMuscles: ["Erector Spinae", "Core"],
    secondaryMuscles: ["Neck Flexors", "Rhomboids"],
    difficulty: "Beginner",
    equipment: "Chair",
    benefits: [
      "Reduces chronic back and neck pain caused by prolonged sitting.",
      "Improves breathing efficiency by opening up the chest cavity.",
      "Helps maintain spinal health and prevents muscular imbalances."
    ],
    steps: [
      { title: "Setup", description: "Sit toward the back of your chair so your lower back is supported." },
      { title: "Feet Flat", description: "Keep both feet flat on the floor or on a footrest." },
      { title: "Alignment", description: "Align your ears horizontally with your shoulders, and keep your chin parallel to the floor." },
      { title: "Shoulders", description: "Relax your shoulders, keeping them pulled slightly back and down." }
    ],
    precautions: [
      "Avoid slouching forward or rounding your upper back (kyphosis).",
      "Do not let your head jut forward toward the screen (forward head posture).",
      "Take frequent breaks to stand up and stretch."
    ],
    demoVideoUrl: "https://www.youtube.com/embed/Ozz-hN2uF3w",
    demoVideoCaption: "How to maintain proper sitting posture at a desk."
  }
};
