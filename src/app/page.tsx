
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, Building2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    const firstText = "We gather fragmented listings from multiple sources, normalize the data, and deliver a single reliable opportunity stream built for job seekers.";
    const secondText = "Never Miss an Opportunity Again.";
    
    let i = 0;
    let phase = 1; // 1: typing 1st, 2: deleting, 3: typing 2nd

    const typingInterval = setInterval(() => {
      if (phase === 1) {
        setDisplayText(firstText.slice(0, i));
        i++;
        if (i > firstText.length) {
          clearInterval(typingInterval);
          setTimeout(() => {
            phase = 2;
            startNextPhase();
          }, 2000);
        }
      }
    }, 45);

    const startNextPhase = () => {
      const nextInterval = setInterval(() => {
        if (phase === 2) {
          setDisplayText(firstText.slice(0, i));
          i--;
          if (i < 0) {
            clearInterval(nextInterval);
            setTimeout(() => {
              phase = 3;
              i = 0;
              startNextPhase();
            }, 800);
          }
        } else if (phase === 3) {
          setDisplayText(secondText.slice(0, i));
          i++;
          if (i > secondText.length) {
            clearInterval(nextInterval);
            setShowCursor(false);
          }
        }
      }, phase === 2 ? 25 : 60);
    };

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/nexus-hero/1920/1080"
            alt="Premium workspace"
            fill
            className="object-cover opacity-20"
            priority
            data-ai-hint="modern office"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
        
        <div className="container relative z-10 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-3 h-3" />
            The Future of Talent Acquisition
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight max-w-4xl mx-auto font-headline flex flex-col gap-2">
            <span>Stop Hunting Opportunities.</span>
            <span className="italic text-primary">Start Discovering Them.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed min-h-[3.5em]">
            {displayText}
            {showCursor && <span className="animate-pulse border-r-2 border-primary ml-1"></span>}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/jobs">
              <Button size="lg" className="h-14 px-8 text-base font-bold gap-2 gold-border-glow">
                Explore Jobs <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth#signup">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold border-white/10 hover:bg-white/5">
                Join as Employer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grids */}
      <section className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-3xl flex flex-col gap-6 group hover:border-primary/50 transition-all duration-500">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">For Job Seekers</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Build your professional identity, showcase your skills, and get discovered by companies that value potential and innovation.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <ShieldCheck className="w-4 h-4 text-primary" /> 
                  Opportunities gathered beyond traditional job boards
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <ShieldCheck className="w-4 h-4 text-primary" /> 
                  Clean, structured listings with verified sources
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <ShieldCheck className="w-4 h-4 text-primary" /> 
                  Personalized discovery with deadline & stipend insights
                </li>
              </ul>
              <Link href="/auth#signup">
                <Button variant="secondary" className="w-full sm:w-auto">Start Your Career</Button>
              </Link>
            </div>
          </div>

          <div className="glass-card p-10 rounded-3xl flex flex-col gap-6 group hover:border-primary/50 transition-all duration-500">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">For Employers</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Streamline your hiring process with advanced management tools and reach a curated pool of talented job seekers ready to make an impact.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm"><ShieldCheck className="w-4 h-4 text-primary" /> Seamless job posting</li>
                <li className="flex items-center gap-3 text-sm"><ShieldCheck className="w-4 h-4 text-primary" /> Applicant management system</li>
                <li className="flex items-center gap-3 text-sm"><ShieldCheck className="w-4 h-4 text-primary" /> Collaborative hiring tools</li>
              </ul>
              <Link href="/auth#signup">
                <Button variant="secondary" className="w-full sm:w-auto">Post a Vacancy</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary/50 py-20">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Jobs', value: '2,500+' },
              { label: 'Talented Seekers', value: '50k+' },
              { label: 'Hiring Partners', value: '450+' },
              { label: 'Success Rate', value: '94%' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
