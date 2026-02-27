
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
  Eye
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const POSTINGS = [
  { id: '1', title: 'Software Engineer Intern', applicants: 48, status: 'Active', clicks: 1204 },
  { id: '2', title: 'Content Writer', applicants: 12, status: 'Active', clicks: 450 },
  { id: '3', title: 'Graphic Designer', applicants: 0, status: 'Draft', clicks: 0 },
];

export function EmployerDashboard() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overview</h2>
        <Link href="/employer/post-job">
          <Button className="gap-2 gold-border-glow">
            <Plus className="w-4 h-4" /> Post a Job
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Active Postings', value: '5', icon: FilePlus, change: '+2 this month' },
          { label: 'Total Applicants', value: '142', icon: Users, change: '+18% vs last month' },
          { label: 'Average CTR', value: '4.2%', icon: TrendingUp, change: '+0.5% growth' },
        ].map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/5 text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-black">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Active Job Listings</h2>
        <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_120px_60px] gap-4 p-4 border-b border-white/5 bg-secondary/50 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <div>Job Title</div>
            <div className="text-center">Applicants</div>
            <div className="text-center">Status</div>
            <div className="text-center">Visibility</div>
            <div></div>
          </div>
          
          <div className="divide-y divide-white/5">
            {POSTINGS.map((post) => (
              <div key={post.id} className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_120px_60px] gap-4 p-4 items-center hover:bg-white/5 transition-colors group">
                <div>
                  <h4 className="font-bold group-hover:text-primary transition-colors">{post.title}</h4>
                  <p className="text-xs text-muted-foreground">Posted on Oct 20, 2023</p>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="bg-white/10">{post.applicants} Students</Badge>
                </div>
                <div className="text-center">
                  <Badge 
                    className={
                      post.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-muted/10 text-muted-foreground border-white/10'
                    }
                  >
                    {post.status}
                  </Badge>
                </div>
                <div className="text-center flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
                  <Eye className="w-3 h-3" /> {post.clicks.toLocaleString()}
                </div>
                <div className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Listing</DropdownMenuItem>
                      <DropdownMenuItem>View Applicants</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
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
