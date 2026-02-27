
"use client";

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ExternalLink, 
  Check, 
  X, 
  Search, 
  Filter, 
  GraduationCap, 
  Briefcase,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserMinus,
  Mail,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock Data for Applicants
const MOCK_APPLICANTS = [
  {
    id: 'a1',
    name: 'Sarah Chen',
    university: 'Stanford University',
    degree: 'B.S. Computer Science',
    year: 'Senior',
    skills: ['React', 'TypeScript', 'Node.js', 'Figma'],
    status: 'Applied',
    appliedDate: 'Oct 24, 2024',
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  },
  {
    id: 'a2',
    name: 'Marcus Rodriguez',
    university: 'MIT',
    degree: 'M.S. Software Engineering',
    year: 'Graduate',
    skills: ['Python', 'Kubernetes', 'Go', 'AWS'],
    status: 'Applied',
    appliedDate: 'Oct 23, 2024',
    avatar: 'https://picsum.photos/seed/marcus/100/100'
  },
  {
    id: 'a3',
    name: 'Aisha Gupta',
    university: 'IIT Delhi',
    degree: 'B.Tech Electrical Engineering',
    year: 'Junior',
    skills: ['React Native', 'Firebase', 'Java'],
    status: 'Applied',
    appliedDate: 'Oct 22, 2024',
    avatar: 'https://picsum.photos/seed/aisha/100/100'
  },
  {
    id: 'a4',
    name: 'James Wilson',
    university: 'UC Berkeley',
    degree: 'B.A. Cognitive Science',
    year: 'Senior',
    skills: ['UI/UX', 'Product Strategy', 'Research'],
    status: 'Applied',
    appliedDate: 'Oct 21, 2024',
    avatar: 'https://picsum.photos/seed/james/100/100'
  },
  {
    id: 'a5',
    name: 'Emily Zhang',
    university: 'University of Toronto',
    degree: 'B.Sc Statistics',
    year: 'Sophomore',
    skills: ['R', 'Python', 'Tableau', 'SQL'],
    status: 'Applied',
    appliedDate: 'Oct 20, 2024',
    avatar: 'https://picsum.photos/seed/emily/100/100'
  },
  {
    id: 'a6',
    name: 'Leo Nakamura',
    university: 'Tokyo Tech',
    degree: 'B.Eng Robotics',
    year: 'Senior',
    skills: ['C++', 'ROS', 'Embedded Systems'],
    status: 'Applied',
    appliedDate: 'Oct 19, 2024',
    avatar: 'https://picsum.photos/seed/leo/100/100'
  }
];

export default function ApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const jobId = params.id as string;
  // In a real app, you'd fetch the job details here
  const jobTitle = "Frontend Engineering Intern"; 

  const filteredApplicants = useMemo(() => {
    return MOCK_APPLICANTS.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const paginatedApplicants = filteredApplicants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = (applicantName: string, action: 'accept' | 'reject') => {
    toast({
      title: action === 'accept' ? 'Application Shortlisted' : 'Application Rejected',
      description: `${applicantName} has been ${action === 'accept' ? 'moved to the interview stage' : 'notified of the decision'}.`,
      variant: action === 'reject' ? 'destructive' : 'default',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8 gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Hub
        </Button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">Review <span className="text-primary gold-glow">Applicants</span></h1>
            <p className="text-muted-foreground flex items-center gap-2 font-medium">
              <Briefcase className="w-4 h-4" /> {jobTitle} • {filteredApplicants.length} Total Applicants
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search candidates..." 
                className="pl-10 h-11 bg-white/5 border-white/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-full sm:w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="all">All Candidates</SelectItem>
                <SelectItem value="applied">New Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 animate-in fade-in duration-700">
          {paginatedApplicants.length > 0 ? (
            paginatedApplicants.map((app) => (
              <Card key={app.id} className="glass-card border-white/5 hover:border-primary/30 transition-all duration-300 rounded-4xl overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Section: Profile Info */}
                    <div className="p-8 flex-1 flex flex-col md:flex-row gap-8">
                      <div className="w-20 h-20 rounded-3xl bg-secondary/50 border border-white/5 overflow-hidden shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={app.avatar} 
                          alt={app.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="space-y-4 flex-1">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-black tracking-tight">{app.name}</h3>
                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-primary/20 text-primary bg-primary/5">
                              {app.year}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground font-bold">
                            <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-primary" /> {app.university}</span>
                            <span className="text-white/60">•</span>
                            <span>{app.degree}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {app.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="bg-white/5 border-white/5 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-6 pt-2">
                           <Link 
                            href="#" 
                            className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:underline group/link"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Resume 
                            <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </Link>
                          <Link 
                            href={`mailto:${app.name.toLowerCase().replace(' ', '.')}@example.com`}
                            className="text-muted-foreground text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" /> Contact
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Actions */}
                    <div className="lg:w-72 bg-white/2 border-l border-white/5 p-8 flex flex-col justify-center gap-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block text-center lg:text-left">
                        Decision Matrix
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full h-12 gap-2 border-green-500/20 text-green-400 hover:bg-green-500/10 hover:border-green-500/40 font-black rounded-xl transition-all"
                        onClick={() => handleAction(app.name, 'accept')}
                      >
                        <UserCheck className="w-4 h-4" /> Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-12 gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 font-black rounded-xl transition-all"
                        onClick={() => handleAction(app.name, 'reject')}
                      >
                        <UserMinus className="w-4 h-4" /> Reject
                      </Button>
                      <p className="text-[10px] text-center text-muted-foreground mt-2 font-bold">
                        Applied on {app.appliedDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-24 text-center glass-card rounded-4xl border-dashed">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No matching candidates</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search keywords.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-xl border-white/10"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'default' : 'ghost'}
                  className={`w-10 h-10 rounded-xl font-black text-sm ${currentPage === i + 1 ? 'gold-border-glow' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-xl border-white/10"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
