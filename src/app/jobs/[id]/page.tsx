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
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Mock Data for demonstration
const MOCK_JOBS = [
  {
    id: '1',
    title: 'Frontend Engineering Intern',
    company: 'NexusTech',
    location: 'Remote',
    type: 'Internship',
    stipend: '$3,000/mo',
    postedAt: '2 days ago',
    deadline: 'Oct 30, 2024',
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
    type: 'Internship',
    stipend: '$4,500/mo',
    postedAt: '5 hours ago',
    deadline: 'Nov 15, 2024',
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
  const job = MOCK_JOBS.find(j => j.id === params.id) || MOCK_JOBS[0];

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8 gap-2 text-muted-foreground hover:text-primary transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Button>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          {/* Main Content */}
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center border border-white/5 shrink-0 overflow-hidden">
                <Image 
                  src={`https://picsum.photos/seed/${job.company}/200/200`}
                  alt={job.company}
                  width={80}
                  height={80}
                  className="object-cover"
                  data-ai-hint="company logo"
                />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium">
                  <Link href="#" className="text-primary hover:underline flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> {job.company}
                  </Link>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {job.postedAt}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-bold">{job.type}</Badge>
                  <Badge variant="outline" className="border-white/10 px-3 py-1 flex gap-1 items-center font-bold">
                    <DollarSign className="w-3 h-3" /> {job.stipend}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-white/5" />

            {/* Description */}
            <section className="space-y-6">
              <h3 className="text-2xl font-bold">Role Overview</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {job.description}
              </p>
            </section>

            {/* Requirements */}
            <section className="space-y-6">
              <h3 className="text-2xl font-bold">Key Requirements</h3>
              <ul className="space-y-4">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground text-lg">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section className="space-y-6">
              <h3 className="text-2xl font-bold">Why Join Us?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {job.benefits.map((benefit, i) => (
                  <Card key={i} className="glass-card border-none bg-white/5 p-4 rounded-xl">
                    <div className="font-bold flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {benefit}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Skills Tags */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tech Stack & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-secondary/80 text-foreground px-4 py-1.5 font-bold uppercase text-[10px] tracking-widest">{tag}</Badge>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 animate-in fade-in slide-in-from-right duration-500 delay-200">
            <Card className="glass-card border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Application Details</h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Deadline</span>
                      </div>
                      <span className="text-sm font-bold">{job.deadline}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Employment</span>
                      </div>
                      <span className="text-sm font-bold">{job.type}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                  <Button variant="outline" className="w-full h-12 gap-2 font-bold border-white/10 hover:bg-white/5">
                    <Bookmark className="w-4 h-4" /> Save this Job
                  </Button>
                  <Button variant="outline" className="w-full h-12 gap-2 font-bold border-white/10 hover:bg-white/5">
                    <Share2 className="w-4 h-4" /> Share Role
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
              <h4 className="font-bold">About {job.company}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                At {job.company}, we're building the infrastructure for tomorrow's digital economy. Join a team of passionate innovators and make a real impact.
              </p>
              <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
                Visit Website <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-white/10 py-6 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between gap-6">
          <div className="hidden md:block">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{job.company}</p>
            <h4 className="text-lg font-black">{job.title}</h4>
          </div>
          <div className="flex flex-1 md:flex-none items-center gap-4">
            <Button size="lg" className="flex-1 md:w-[300px] h-14 text-lg font-black gold-border-glow rounded-2xl">
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
