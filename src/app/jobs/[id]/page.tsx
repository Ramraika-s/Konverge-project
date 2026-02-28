
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Globe,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { JobShareDialog } from '@/components/jobs/JobShareDialog';
import { useToast } from '@/hooks/use-toast';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, role } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const jobId = params.id as string;
  const jobRef = useMemoFirebase(() => {
    if (!db || !jobId) return null;
    return doc(db, 'jobListings', jobId);
  }, [db, jobId]);

  const { data: job, isLoading } = useDoc(jobRef);

  // Check if job is saved
  const savedJobRef = useMemoFirebase(() => {
    if (!db || !user || !jobId) return null;
    return doc(db, 'jobseekerProfile', user.uid, 'savedJobs', jobId);
  }, [db, user, jobId]);

  const { data: savedJobData } = useDoc(savedJobRef);
  const isBookmarked = !!savedJobData;

  const handleApply = () => {
    if (!user) {
      router.push('/auth#signup');
    } else {
      router.push('/dashboard/job-seeker');
    }
  };

  const handleBookmark = async () => {
    if (!user || !db || role !== 'job-seeker') {
      toast({
        title: "Access Restricted",
        description: "Only Job Seekers can bookmark opportunities.",
        variant: "destructive"
      });
      return;
    }

    if (!savedJobRef) return;

    setIsSaving(true);
    try {
      if (isBookmarked) {
        await deleteDoc(savedJobRef);
        toast({ title: "Removed", description: "Opportunity removed from your bookmarks." });
      } else {
        await setDoc(savedJobRef, {
          id: jobId,
          jobId: jobId,
          savedAt: new Date().toISOString()
        });
        toast({ title: "Saved!", description: "Opportunity bookmarked successfully." });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Job Not Found</h1>
        <Button onClick={() => router.push('/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8 gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Search
        </Button>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-24 h-24 rounded-3xl bg-secondary/50 flex items-center justify-center border border-white/5 shrink-0 overflow-hidden shadow-2xl">
                <Briefcase className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">{job.title}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-bold">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4" /> {job.remoteOption ? "Remote Available" : "On-site"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 font-black uppercase text-[10px] tracking-widest">{job.jobType}</Badge>
                  <Badge variant="outline" className="border-white/10 px-4 py-1.5 flex gap-2 items-center font-black text-[10px] tracking-widest uppercase">
                    <DollarSign className="w-3 h-3" /> {job.stipendMin} - {job.stipendMax} / {job.stipendCurrency}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <section className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight">Role Overview</h3>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                {job.description}
              </p>
            </section>

            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Tech Stack & Mastery</h3>
              <div className="flex flex-wrap gap-3">
                {job.skillsRequired?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-secondary/80 text-foreground px-6 py-2 font-black uppercase text-[11px] tracking-widest border border-white/5">{tag}</Badge>
                ))}
              </div>
            </section>
          </div>

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
                      <span className="text-sm font-black">{job.applicationDeadline}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                  <Button 
                    variant={isBookmarked ? "default" : "outline"}
                    className={`w-full h-14 gap-3 font-black rounded-2xl border-white/10 text-lg transition-all ${isBookmarked ? 'bg-primary text-primary-foreground' : 'hover:bg-white/5'}`}
                    onClick={handleBookmark}
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />}
                    {isBookmarked ? "Saved Opportunity" : "Save Opportunity"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-14 gap-3 font-black rounded-2xl border-white/10 hover:bg-white/5 text-lg"
                    onClick={() => setIsShareOpen(true)}
                  >
                    <Share2 className="w-5 h-5" /> Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-2xl border-t border-white/10 py-8 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between gap-10">
          <div className="hidden md:block">
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

      <JobShareDialog 
        isOpen={isShareOpen} 
        onOpenChange={setIsShareOpen} 
        jobTitle={job.title} 
        jobUrl={shareUrl} 
      />
    </div>
  );
}
