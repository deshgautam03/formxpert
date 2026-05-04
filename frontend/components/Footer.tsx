import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full border-t border-slate-800 bg-black py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-slate-400 text-sm">
                    © {new Date().getFullYear()} FormXpert. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy</Link>
                    <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms</Link>
                    <Link href="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">Contact</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
