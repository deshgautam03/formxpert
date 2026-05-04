import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8">
        <span className="mr-2">&larr;</span> Back to Home
      </Link>
      
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-8 text-slate-300 leading-relaxed">
        <section>
          <p className="text-sm text-slate-500 mb-4">Last Updated: May 2026</p>
          <p>
            Welcome to FormXpert. By accessing or using our application, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptable Use</h2>
          <p className="mb-2">By using FormXpert, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and complete information when creating an account.</li>
            <li>Use the service only for lawful purposes and in accordance with these Terms.</li>
            <li>Not interfere with or disrupt the security, integrity, or performance of the application.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Disclaimers</h2>
          <p className="mb-4">
            <strong>Not Medical Advice:</strong> FormXpert provides AI-assisted tracking and feedback for educational and fitness tracking purposes only. We are not a licensed medical care provider. The app should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider before starting any new exercise program.
          </p>
          <p>
            <strong>Accuracy:</strong> While we strive for high precision, computer vision technology and pose detection may not be 100% accurate. Users should exercise caution and listen to their bodies to prevent injury.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Intellectual Property</h2>
          <p>
            The FormXpert application, including its original content, features, algorithms, and functionality, are owned by FormXpert and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
          <p>
            In no event shall FormXpert, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, personal injury, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; and (iii) unauthorized access, use or alteration of your transmissions or content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@formxpert.com.
          </p>
        </section>
      </div>
    </div>
  );
}
