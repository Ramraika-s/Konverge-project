
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, getDocs, doc, where } from 'firebase/firestore';
import { 
  ArrowLeft, 
  Bookmark, 
  Briefcase, 
  MapPin, 
  ChevronRight, 
  Loader2, 
  Search,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BookmarksPage() {
  const { user, isUserLoading, role } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && (!user || role !== 'job-seeker')) {
      router.replace('/auth');
    }
  }, [user, isUserLoading, role, router]);

  // Fetch saved job IDs
  const savedJobsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'jobseekerProfile', user.uid, 'savedJobs'),
      orderBy('savedAt', 'desc')
    );
  }, [db, user]);

  const { data: savedJobsMeta, isLoading: isSavedLoading } = useCollection(savedJobsQuery);

  // Note: For a real app, you might want to join these with jobListings data.
  // Here we use another listener for simplicity or a fetch.
  // For the MVP, we'll listen to all jobs and filter locally or show placeholders.
  const allJobsQuery = useMemoFirebase(() => (!db ? null : query(collection(db, 'jobListings'))), [db]);
  const { data: allJobs } = useCollection(allJobsQuery);

  const bookmarkedJobs = (savedJobsMeta && allJobs) 
    ? allJobs.filter(job => savedJobsMeta.some(s => s.jobId === job.id))
    : [];

  if (isUserLoading || isSavedLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Accessing Bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </Button>
        <div className="text-right">
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 justify-end">
            Saved <span className="text-primary gold-glow">Opportunities</span>
            <Bookmark className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-muted-foreground font-medium">Opportunities you've handpicked for your future.</p>
        </div>
      </div>

      <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {bookmarkedJobs.length > 0 ? (
          bookmarkedJobs.map((job) => (
            <Card key={job.id} className="glass-card hover:border-primary/40 transition-all duration-500 group relative overflow-hidden rounded-4xl">
              <CardHeader className="flex flex-col md:flex-row items-start justify-between gap-4 p-8">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/80 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <Briefcase className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/jobs/${job.id}`}>
                        <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors cursor-pointer leading-tight">
                          {job.title}
                        </CardTitle>
                      </Link>
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1.5 text-xs"><MapPin className="w-3.5 h-3.5 text-primary" /> {job.location}</span>
                      <span className="flex items-center gap-1.5 text-xs"><Briefcase className="w-3.5 h-3.5 text-primary" /> {job.jobType}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Link href={`/jobs/${job.id}`}>
                    <Button size="sm" className="font-bold rounded-xl gold-border-glow">
                      Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                  {job.description}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-24 text-center glass-card rounded-[3rem] border-dashed border-white/10 flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">No Saved Missions</h3>
              <p className="text-muted-foreground text-sm font-medium max-w-xs mx-auto">
                Bookmark interesting roles while you browse to keep track of your top choices.
              </p>
            </div>
            <Link href="/jobs">
              <Button className="h-12 px-10 font-black gold-border-glow rounded-xl">
                Start Exploring <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
