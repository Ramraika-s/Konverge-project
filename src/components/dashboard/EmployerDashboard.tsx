
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FilePlus, 
  TrendingUp, 
  MoreVertical,
  Plus,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Building2,
  AlertCircle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { DataSeeder } from '@/components/admin/DataSeeder';

export function EmployerDashboard() {
  const { user, profile } = useUser();
  const db = useFirestore();

  const jobsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'jobListings'),
      where('employerId', '==', user.uid),
      orderBy('postedAt', 'desc')
    );
  }, [db, user]);

  const { data: postings, isLoading } = useCollection(jobsQuery);

  // Check if current user is admin
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isProfileComplete = !!profile?.companyWebsite && !!profile?.companyDescription;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-left duration-500">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">{profile?.companyName || 'Corporate Hub'}</h2>
            <p className="text-muted-foreground font-medium">Recruitment dashboard for {profile?.contactPersonName || 'Admin'}</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Link href="/employer/post-job">
            <Button className="gap-2 h-14 px-8 gold-border-glow font-black rounded-2xl w-full sm:w-auto shadow-2xl shadow-primary/20">
              <Plus className="w-5 h-5" /> Post New Vacancy
            </Button>
          </Link>
        </div>
      </div>

      {!isProfileComplete && (
        <Link href="/profile">
          <Card className="border-primary/30 bg-primary/5 rounded-[2rem] border-dashed hover:bg-primary/10 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-widest">Verify Your Organization</p>
                  <p className="text-xs text-muted-foreground font-medium">Complete your company profile to increase trust scores and attract high-tier talent.</p>
                </div>
              </div>
              <Button variant="outline" className="hidden sm:flex border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest rounded-xl group-hover:bg-primary group-hover:text-primary-foreground">
                Complete Setup
              </Button>
            </CardContent>
          </Card>
        </Link>
      )}

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        {[
          { label: 'Live Vacancies', value: postings?.length || 0, icon: FilePlus, change: 'Active', color: 'text-primary' },
          { label: 'Talent Pool', value: 'N/A', icon: Users, change: 'Tracking', color: 'text-blue-400' },
          { label: 'Engagements', value: 'N/A', icon: TrendingUp, change: 'Live', color: 'text-green-400' },
        ].map((stat) => (
          <Card key={stat.label} className="glass-card border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color} shadow-inner`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-white/10 bg-white/2 px-2 py-0.5">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
            </CardContent>
          </Card>
        ))}

        {isAdmin && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <DataSeeder />
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight">Active Recruitment Stream</h2>
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">Archive History</Button>
        </div>
        
        <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
          <div className="hidden md:grid grid-cols-[1fr_140px_140px_140px_80px] gap-4 p-8 border-b border-white/5 bg-white/2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <div>Vacancy Identity</div>
            <div className="text-center">Candidate Count</div>
            <div className="text-center">Operational Status</div>
            <div className="text-center">Location</div>
            <div></div>
          </div>
          
          <div className="divide-y divide-white/5">
            {postings?.map((post) => (
              <div key={post.id} className="grid grid-cols-1 md:grid-cols-[1fr_140px_140px_140px_80px] gap-4 p-8 items-center hover:bg-white/5 transition-all group">
                <div className="space-y-1">
                  <Link href={`/employer/job/${post.id}/applicants`} className="font-black text-xl group-hover:text-primary transition-colors block leading-tight">
                    {post.title}
                  </Link>
                  <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock className="w-3 h-3 text-primary" /> {post.jobType}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black px-4 py-1.5 text-[10px] tracking-widest">
                    REVIEW
                  </Badge>
                </div>
                <div className="flex items-center justify-center">
                  <Badge 
                    className={
                      post.status === 'Active' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20 font-black px-4 py-1.5 text-[10px] tracking-widest' 
                        : 'bg-muted/10 text-muted-foreground border-white/10 font-black px-4 py-1.5 text-[10px] tracking-widest'
                    }
                  >
                    {post.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-center flex flex-col items-center justify-center gap-1 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-1.5 text-white">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {post.location}
                  </div>
                </div>
                <div className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-white/10 min-w-[200px] p-2 rounded-2xl">
                      <DropdownMenuItem className="cursor-pointer font-bold rounded-xl py-3" asChild>
                        <Link href={`/employer/job/${post.id}/applicants`}>
                          <Users className="w-4 h-4 mr-3 text-primary" /> Review Applicants
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer font-bold rounded-xl py-3">
                        <ArrowUpRight className="w-4 h-4 mr-3 text-primary" /> Edit Parameters
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {!postings?.length && (
              <div className="py-24 text-center text-muted-foreground font-medium flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                  <FilePlus className="w-8 h-8 opacity-20" />
                </div>
                <p>No active recruitment pipelines found.</p>
                <Link href="/employer/post-job">
                  <Button variant="link" className="text-primary font-black uppercase text-xs">Publish your first role</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
