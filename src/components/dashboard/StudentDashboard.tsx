
"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Bookmark,
  ExternalLink,
  Loader2,
  ArrowRight,
  TrendingUp,
  Search,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';

export function StudentDashboard() {
  const { user, profile } = useUser();
  const db = useFirestore();

  // 1. Fetch User Applications
  const appsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'applications'),
      where('studentId', '==', user.uid),
      orderBy('applicationDate', 'desc')
    );
  }, [db, user]);

  const { data: applications, isLoading: isAppsLoading } = useCollection(appsQuery);

  // 2. Fetch Recommended Jobs (Active listings)
  const recsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'jobListings'),
      where('status', '==', 'Active'),
      limit(3)
    );
  }, [db]);

  const { data: recommendations, isLoading: isRecsLoading } = useCollection(recsQuery);

  // 3. Fetch Saved Jobs count
  const savedJobsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'jobseekerProfile', user.uid, 'savedJobs');
  }, [db, user]);
  const { data: savedJobs } = useCollection(savedJobsQuery);

  // 4. Calculate Stats
  const stats = useMemo(() => {
    if (!applications) return { total: 0, interviewing: 0, rejected: 0 };
    return {
      total: applications.length,
      interviewing: applications.filter(a => a.status === 'Interview Scheduled' || a.status === 'Under Review').length,
      rejected: applications.filter(a => a.status === 'Rejected').length,
    };
  }, [applications]);

  const isProfileStrong = !!profile?.resumeUrl && !!profile?.educationSummary;

  if (isAppsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Syncing career stream...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-500">
        <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center border border-white/5 shadow-2xl overflow-hidden">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={profile?.firstName} className="w-full h-full object-cover" />
          ) : (
            <UserCheck className="w-8 h-8 text-primary" />
          )}
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight">Welcome back, <span className="text-primary">{profile?.firstName || 'Innovator'}</span>.</h2>
          <p className="text-muted-foreground font-medium">You have {stats.interviewing} active leads this week.</p>
        </div>
      </div>

      {!isProfileStrong && (
        <Link href="/profile">
          <Card className="border-primary/30 bg-primary/5 rounded-[2rem] border-dashed hover:bg-primary/10 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-widest">Boost Your Discoverability</p>
                  <p className="text-xs text-muted-foreground font-medium">You haven't added a Resume Link yet. Employers cannot verify your credentials without it.</p>
                </div>
              </div>
              <Button variant="outline" className="hidden sm:flex border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest rounded-xl group-hover:bg-primary group-hover:text-primary-foreground">
                Fix Profile
              </Button>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {[
          { label: 'Total Missions', value: stats.total, icon: Briefcase, color: 'text-blue-400', sub: 'Applications launched' },
          { label: 'Active Leads', value: stats.interviewing, icon: Calendar, color: 'text-primary', sub: 'Interviewing or Review' },
          { 
            label: 'Saved Stream', 
            value: savedJobs?.length || 0, 
            icon: Bookmark, 
            color: 'text-green-400', 
            sub: 'Future opportunities',
            href: '/dashboard/job-seeker/bookmarks'
          },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href || '#'}>
            <Card className="glass-card border-white/5 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-300 h-full group">
              <CardContent className="p-8 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                  <p className="text-5xl font-black tracking-tighter group-hover:text-primary transition-colors">{stat.value}</p>
                  <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">{stat.sub}</p>
                </div>
                <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        {/* Applications List */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              Application <span className="text-primary gold-glow">Tracker</span>
              {applications && applications.length > 0 && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black">
                  {applications.length}
                </Badge>
              )}
            </h2>
            <Link href="/jobs">
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">
                Explore More
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {applications && applications.map((app) => (
              <div key={app.id} className="glass-card p-6 rounded-[2rem] border-white/5 flex flex-col sm:flex-row items-center justify-between group hover:border-primary/20 transition-all duration-500 gap-6">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/50 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <Briefcase className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h4 className="font-black text-lg group-hover:text-primary transition-colors truncate">
                      Job ID: {app.jobListingId.substring(0, 8)}...
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(app.applicationDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Real-time status</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <Badge 
                    className={`px-4 py-1.5 font-black uppercase tracking-widest text-[10px] rounded-full border-2 ${
                      app.status === 'Applied' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      app.status === 'Interview Scheduled' || app.status === 'Under Review' ? 'bg-primary/10 text-primary border-primary/20' :
                      app.status === 'Rejected' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}
                  >
                    {app.status}
                  </Badge>
                  <Link href={`/jobs/${app.jobListingId}`}>
                    <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/10 transition-colors">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            
            {(!applications || applications.length === 0) && (
              <div className="py-24 text-center glass-card rounded-[3rem] border-dashed border-white/10 flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto shadow-2xl opacity-50">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="space-y-2 px-6">
                  <h3 className="text-2xl font-black">Zero Missions Launched</h3>
                  <p className="text-muted-foreground text-sm font-medium max-w-xs mx-auto">Your next career leap is waiting in the stream. Start applying to verified opportunities.</p>
                </div>
                <Link href="/jobs">
                  <Button className="h-12 px-10 font-black gold-border-glow rounded-xl">
                    Discover Roles <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Sidebar */}
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight">Curated Feed</h2>
            <Link href="/jobs">
              <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-primary">All Roles</Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {isRecsLoading ? (
               <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-40 rounded-3xl bg-white/5 animate-pulse" />)}
               </div>
            ) : recommendations?.map((job) => (
              <Card key={job.id} className="glass-card border-none bg-linear-to-br from-card to-secondary/30 rounded-3xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 group/rec">
                <CardHeader className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner group-hover/rec:bg-primary/20 transition-colors">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-white/10 bg-white/2">
                      {job.jobType}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-black leading-tight truncate group-hover/rec:text-primary transition-colors">{job.title}</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{job.location} • {job.remoteOption ? 'Remote' : 'On-site'}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="secondary" className="w-full h-11 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                      Examine Role
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
