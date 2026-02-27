
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
  Clock
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const POSTINGS = [
  { id: '1', title: 'Software Engineer Intern', applicants: 48, status: 'Active', clicks: 1204, postedOn: 'Oct 20, 2024' },
  { id: '2', title: 'Content Writer', applicants: 12, status: 'Active', clicks: 450, postedOn: 'Oct 15, 2024' },
  { id: '3', title: 'Graphic Designer', applicants: 0, status: 'Draft', clicks: 0, postedOn: 'Oct 10, 2024' },
];

export function EmployerDashboard() {
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
          { label: 'Active Postings', value: '5', icon: FilePlus, change: '+2 new', color: 'text-primary' },
          { label: 'Total Applicants', value: '142', icon: Users, change: '+18% growth', color: 'text-blue-400' },
          { label: 'Conversion Rate', value: '4.2%', icon: TrendingUp, change: '+0.5% up', color: 'text-green-400' },
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
            <div className="text-center">Insights</div>
            <div></div>
          </div>
          
          <div className="divide-y divide-white/5">
            {POSTINGS.map((post) => (
              <div key={post.id} className="grid grid-cols-1 md:grid-cols-[1fr_140px_140px_140px_80px] gap-4 p-6 items-center hover:bg-white/5 transition-all group">
                <div className="space-y-1">
                  <Link href={`/employer/job/${post.id}/applicants`} className="font-black text-lg group-hover:text-primary transition-colors block">
                    {post.title}
                  </Link>
                  <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock className="w-3 h-3" /> Posted on {post.postedOn}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black px-4 py-1">
                    {post.applicants} Students
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
                    <Eye className="w-3.5 h-3.5 text-primary" /> {post.clicks.toLocaleString()}
                  </div>
                  Total Views
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
                      <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-3">
                        <CheckCircle2 className="w-4 h-4 mr-3 text-primary" /> Close Listing
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive cursor-pointer font-bold rounded-lg py-3 hover:bg-destructive/10">
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
