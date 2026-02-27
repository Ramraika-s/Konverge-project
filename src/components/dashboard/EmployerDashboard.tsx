
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
  Loader2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

export function EmployerDashboard() {
  const { user } = useUser();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Recruitment Overview</h2>
          <p className="text-muted-foreground text-sm font-medium">Tracking your organization's talent pipeline.</p>
        </div>
        <Link href="/employer/post-job">
          <Button className="gap-2 h-12 px-6 gold-border-glow font-bold rounded-xl w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Post a Vacancy
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Active Postings', value: postings?.length || 0, icon: FilePlus, change: 'Updated', color: 'text-primary' },
          { label: 'Total Applicants', value: 'N/A', icon: Users, change: 'Tracking enabled', color: 'text-blue-400' },
          { label: 'Conversion Rate', value: 'N/A', icon: TrendingUp, change: 'Analyzing', color: 'text-green-400' },
        ].map((stat) => (
          <Card key={stat.label} className="glass-card border-white/5 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-white/10 bg-white/2">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight">Live Listings</h2>
          <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5">View History</Button>
        </div>
        
        <div className="glass-card rounded-4xl overflow-hidden border border-white/5 shadow-2xl">
          <div className="hidden md:grid grid-cols-[1fr_140px_140px_140px_80px] gap-4 p-6 border-b border-white/5 bg-white/2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <div>Position Details</div>
            <div className="text-center">Applicant Count</div>
            <div className="text-center">Status</div>
            <div className="text-center">Location</div>
            <div></div>
          </div>
          
          <div className="divide-y divide-white/5">
            {postings?.map((post) => (
              <div key={post.id} className="grid grid-cols-1 md:grid-cols-[1fr_140px_140px_140px_80px] gap-4 p-6 items-center hover:bg-white/5 transition-all group">
                <div className="space-y-1">
                  <Link href={`/employer/job/${post.id}/applicants`} className="font-black text-lg group-hover:text-primary transition-colors block">
                    {post.title}
                  </Link>
                  <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock className="w-3 h-3" /> {post.jobType}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black px-4 py-1">
                    Check
                  </Badge>
                </div>
                <div className="flex items-center justify-center">
                  <Badge 
                    className={
                      post.status === 'Active' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20 font-black px-4 py-1' 
                        : 'bg-muted/10 text-muted-foreground border-white/10 font-black px-4 py-1'
                    }
                  >
                    {post.status}
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
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-white/10 min-w-[180px] p-2">
                      <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-3" asChild>
                        <Link href={`/employer/job/${post.id}/applicants`}>
                          <Users className="w-4 h-4 mr-3 text-primary" /> Review Applicants
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-3">
                        <ArrowUpRight className="w-4 h-4 mr-3 text-primary" /> Edit Posting
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {!postings?.length && (
              <div className="p-10 text-center text-muted-foreground font-medium">
                No active postings found. Start by creating your first job listing.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
