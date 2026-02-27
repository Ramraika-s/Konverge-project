
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Share2, 
  Bookmark,
  CheckCircle2,
  Building2,
  Clock,
  ExternalLink,
  Users,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/firebase';

// Mock Data updated to match search page
const MOCK_JOBS = [
  {
    id: '1',
    title: 'Frontend Engineering Intern',
    company: 'NexusTech',
    location: 'Remote',
    workMode: 'Remote',
    type: 'Internship',
    duration: '6 Months',
    stipend: '3,000',
    currency: 'USD',
    postedAt: '2 days ago',
    deadline: 'Oct 30, 2024',
    isVerified: true,
    applicants: 48,
    description: 'Work with Next.js and Tailwind CSS on enterprise-grade applications. You will be responsible for building responsive UI components and integrating with backend APIs.',
    requirements: [
      'Proficiency in React and TypeScript',
      'Experience with Tailwind CSS',
      'Understanding of Next.js App Router',
      'Strong problem-solving skills',
      'Good communication and teamwork'
    ],
    benefits: [
      'Competitive stipend',
      'Mentorship from senior engineers',
      'Flexible working hours',
      'Potential for full-time role'
    ],
    tags: ['React', 'TypeScript', 'Tailwind']
  },
  {
    id: '2',
    title: 'Product Design Intern',
    company: 'CreativeFlow',
    location: 'San Francisco, CA',
    workMode: 'On-site',
    type: 'Internship',
    duration: '3 Months',
    stipend: '4,500',
    currency: 'USD',
    postedAt: '5 hours ago',
    deadline: 'Nov 15, 2024',
    isVerified: true,
    applicants: 12,
    description: 'Help us craft the future of creative tools for professional artists. You will work closely with product managers and engineers to design intuitive user experiences.',
    requirements: [
      'Strong portfolio showcasing UI/UX skills',
      'Proficiency in Figma',
      'Understanding of design systems',
      'Ability to iterate based on feedback'
    ],
    benefits: [
      'Relocation assistance',
      'High-end hardware provided',
      'Weekly team workshops'
    ],
    tags: ['Figma', 'UI/UX', 'Prototyping']
  }
];

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const job = MOCK_JOBS.find(j => j.id === params.id) || MOCK_JOBS[0];

  const handleApply = () => {
    if (!user) {
      router.push('/auth#signup');
    } else {
      router.push('/dashboard/job-seeker');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8 gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Search
        </Button>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          {/* Main Content */}
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-24 h-24 rounded-3xl bg-secondary/50 flex items-center justify-center border border-white/5 shrink-0 overflow-hidden shadow-2xl">
                <Image 
                  src={`https://picsum.photos/seed/${job.company}/200/200`}
                  alt={job.company}
                  width={96}
                  height={96}
                  className="object-cover"
                  data-ai-hint="company logo"
                />
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">{job.title}</h1>
                  {job.isVerified && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 font-black flex gap-1 items-center px-3 py-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-bold">
                  <Link href="#" className="text-primary hover:underline flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> {job.company}
                  </Link>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4" /> {job.workMode}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {job.postedAt}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 font-black uppercase text-[10px] tracking-widest">{job.type}</Badge>
                  <Badge variant="outline" className="border-white/10 px-4 py-1.5 flex gap-2 items-center font-black text-[10px] tracking-widest uppercase">
                    <DollarSign className="w-3 h-3" /> {job.stipend ? `${job.stipend} / month` : 'Competitive'}
                  </Badge>
                  <Badge variant="outline" className="border-white/10 px-4 py-1.5 flex gap-2 items-center font-black text-[10px] tracking-widest uppercase">
                    <Users className="w-3 h-3" /> {job.applicants} Applied
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-white/5" />

            {/* Description */}
            <section className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight">Role Overview</h3>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                {job.description}
              </p>
            </section>

            {/* Requirements */}
            <section className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight">Key Requirements</h3>
              <ul className="space-y-5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-4 text-muted-foreground text-lg font-medium">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section className="space-y-8">
              <h3 className="text-2xl font-black tracking-tight">Growth & Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {job.benefits.map((benefit, i) => (
                  <Card key={i} className="glass-card border-none bg-white/5 p-6 rounded-2xl">
                    <div className="font-black flex items-center gap-3 text-lg">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      {benefit}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Skills Tags */}
            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Tech Stack & Mastery</h3>
              <div className="flex flex-wrap gap-3">
                {job.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-secondary/80 text-foreground px-6 py-2 font-black uppercase text-[11px] tracking-widest border border-white/5">{tag}</Badge>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
            <Card className="glass-card border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <CardContent className="p-10 space-y-10">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Application Intelligence</h4>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-bold">Deadline</span>
                      </div>
                      <span className="text-sm font-black">{job.deadline}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-bold">Duration</span>
                      </div>
                      <span className="text-sm font-black">{job.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-bold">Active Applicants</span>
                      </div>
                      <span className="text-sm font-black">{job.applicants}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                  <Button variant="outline" className="w-full h-14 gap-3 font-black rounded-2xl border-white/10 hover:bg-white/5 text-lg">
                    <Bookmark className="w-5 h-5" /> Save Opportunity
                  </Button>
                  <Button variant="outline" className="w-full h-14 gap-3 font-black rounded-2xl border-white/10 hover:bg-white/5 text-lg">
                    <Share2 className="w-5 h-5" /> Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="p-10 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                    <Building2 className="w-6 h-6 text-primary" />
                 </div>
                 <h4 className="font-black text-xl">About {job.company}</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                At {job.company}, we're building the infrastructure for tomorrow's digital economy. Join a team of passionate innovators and make a real impact on global systems.
              </p>
              <Link href="#" className="inline-flex items-center gap-2 text-sm font-black text-primary hover:underline group">
                Visit Company Website <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-2xl border-t border-white/10 py-8 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between gap-10">
          <div className="hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{job.company}</p>
            <h4 className="text-2xl font-black tracking-tight">{job.title}</h4>
          </div>
          <div className="flex flex-1 md:flex-none items-center gap-4">
            <Button 
              size="lg" 
              className="flex-1 md:w-[400px] h-16 text-xl font-black gold-border-glow rounded-2xl shadow-2xl shadow-primary/20"
              onClick={handleApply}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
