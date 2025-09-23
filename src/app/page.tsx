import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { Documents } from '@/components/landing/Document';
import { Support } from '@/components/landing/Support'
import { Testimonials } from '@/components/landing/Testimonials';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Documents/>
      <Support/>
      <Testimonials />
      <Footer />
    </div>
  );
}
