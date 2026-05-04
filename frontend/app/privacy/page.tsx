import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8">
        <span className="mr-2">&larr;</span> Back to Home
      </Link>
      
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-8 text-slate-300 leading-relaxed">
        <section>
          <p className="text-sm text-slate-500 mb-4">Last Updated: May 2026</p>
          <p>
            Welcome to FormXpert. Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our web application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Data Collection</h2>
          <p className="mb-2">We collect the following types of information to provide and improve our services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> When you register, we collect your name, email address, and authentication credentials.</li>
            <li><strong>Workout Data:</strong> We track and record your workout history, exercise sets, repetitions, accuracy scores, and the duration of your sessions.</li>
            <li><strong>Camera & Biomechanics:</strong> During a workout, we process real-time video to analyze joint angles and movements. <em>Note: Video streams are processed entirely locally in your browser and are not recorded, stored, or sent to our servers.</em></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Usage of Data</h2>
          <p className="mb-2">Your information is used strictly for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide personalized performance analytics and track your consistency.</li>
            <li>To manage and secure your account.</li>
            <li>To improve our pose detection algorithms and overall user experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Data Storage and Security</h2>
          <p>
            We implement industry-standard security measures, including data encryption and secure token-based authentication (JWT), to protect your personal data. Workout metrics and account details are stored securely in our database. We do not sell, trade, or rent your personal identification information to others.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. User Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request the deletion of your account and associated workout history.</li>
            <li>Update or correct your personal information at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy, please contact us at support@formxpert.com.
          </p>
        </section>
      </div>
    </div>
  );
}
