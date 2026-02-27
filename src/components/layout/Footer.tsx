
"use client";

import Link from 'next/link';
import { Briefcase, Twitter, Linkedin, Github, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/30 border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tighter gold-glow">
                Konnex
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The premium bridge between ambitious job seeker talent and innovative global companies. Elevating the future of work through data-driven matching.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white/10 transition-all">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white/10 transition-all">
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-white/10 transition-all">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">For Job Seekers</h4>
            <ul className="space-y-4">
              <li><Link href="/jobs" className="text-sm text-muted-foreground hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-white transition-colors">Job Seeker Dashboard</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">Career Resources</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">Resume Builder</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6">For Employers</h4>
            <ul className="space-y-4">
              <li><Link href="/auth" className="text-sm text-muted-foreground hover:text-white transition-colors">Post a Vacancy</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-white transition-colors">Employer Hub</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">Talent Solutions</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">Pricing Plans</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Bhubaneshwar, India</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>1800-DUMMYNUMBER</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>helpdesk@thenullpointers.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-medium">
            © {currentYear} Konnex. All rights reserved. Built for the next generation.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
