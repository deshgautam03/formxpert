"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Linkedin, Send, Loader2, CheckCircle, XCircle } from "lucide-react";
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast(null);

    try {
      await emailjs.send(
        "service_s8da2fo",
        "template_0xnqj3y",
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        { publicKey: "y6EMWwLqOqD12BIbs" }
      );
      
      setToast({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setToast({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg border backdrop-blur-md transition-all ${
          toast.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <XCircle className="w-5 h-5 mr-3" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="w-full max-w-3xl mb-8 flex items-center">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
          <span className="mr-2">&larr;</span> Back to Home
        </Link>
      </div>
      
      <div className="w-full max-w-3xl space-y-2 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter text-white">
          Contact Us
        </h1>
        <p className="text-slate-400">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <a 
          href="mailto:support@formxpert.com"
          className="flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-colors group"
        >
          <Mail className="w-8 h-8 text-neon-green mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-white">Email</span>
          <span className="text-xs text-slate-400 mt-1">support@formxpert.com</span>
        </a>

        <a 
          href="tel:+919027680644"
          className="flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-colors group"
        >
          <Phone className="w-8 h-8 text-neon-green mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-white">Phone</span>
          <span className="text-xs text-slate-400 mt-1">+91 90276 80644</span>
        </a>

        <a 
          href="https://www.linkedin.com/in/desh-deepak-gautam-a68a6a235"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-colors group text-center"
        >
          <Linkedin className="w-8 h-8 text-neon-green mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-white">LinkedIn</span>
          <span className="text-xs text-slate-400 mt-1">Desh Deepak Gautam</span>
        </a>
      </div>

      <div className="w-full max-w-3xl p-8 space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Send a Message</h2>
          <p className="text-slate-400 text-sm">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Name</label>
              <input
                suppressHydrationWarning
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black border border-slate-800 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-transparent outline-none text-white transition-all"
                placeholder="Your Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input
                suppressHydrationWarning
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black border border-slate-800 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-transparent outline-none text-white transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Message</label>
            <textarea
              suppressHydrationWarning
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 bg-black border border-slate-800 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-transparent outline-none text-white transition-all resize-none"
              placeholder="How can we help you?"
            ></textarea>
          </div>

          <button
            suppressHydrationWarning
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 font-bold text-black bg-neon-green rounded-lg hover:bg-[#b3ff00] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
