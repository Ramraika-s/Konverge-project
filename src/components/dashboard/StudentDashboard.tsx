
"use client";

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
  ExternalLink
} from 'lucide-react';

const APPLICATIONS = [
  { id: '1', title: 'UX Intern', company: 'DesignCo', status: 'Applied', date: 'Oct 24, 2023' },
  { id: '2', title: 'React Developer', company: 'TechNova', status: 'Interviewing', date: 'Oct 22, 2023' },
  { id: '3', title: 'QA Analyst', company: 'SwiftPay', status: 'Rejected', date: 'Oct 15, 2023' },
];

export function StudentDashboard() {
  return (
    <div className="space-y-10">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Total Applications', value: '12', icon: Briefcase, color: 'text-blue-400' },
          { label: 'Interviews Scheduled', value: '3', icon: Calendar, color: 'text-primary' },
          { label: 'Saved Jobs', value: '45', icon: Bookmark, color: 'text-green-400' },
        ].map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Applications</h2>
            <Button variant="link" className="text-primary font-bold">View All</Button>
          </div>

          <div className="space-y-4">
            {APPLICATIONS.map((app) => (
              <div key={app.id} className="glass-card p-5 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold group-hover:text-primary transition-colors">{app.title}</h4>
                    <p className="text-xs text-muted-foreground">{app.company} • Applied on {app.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Badge 
                    className={
                      app.status === 'Applied' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      app.status === 'Interviewing' ? 'bg-primary/10 text-primary border-primary/20' :
                      'bg-destructive/10 text-destructive border-destructive/20'
                    }
                  >
                    {app.status}
                  </Badge>
                  <Button size="icon" variant="ghost">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
            
            {APPLICATIONS.length === 0 && (
              <div className="py-20 text-center glass-card rounded-2xl border-dashed">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-1">No applications yet</h3>
                <p className="text-muted-foreground text-sm">Start your journey by applying to available jobs.</p>
                <Button className="mt-6" variant="secondary">Browse Jobs</Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recommended</h2>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="glass-card border-none bg-linear-to-br from-card to-secondary/50">
                <CardHeader className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-[10px] border-white/10">NEW</Badge>
                  </div>
                  <CardTitle className="text-lg">Growth Marketing Intern</CardTitle>
                  <CardDescription>ScaleUp Media • Remote</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <Button variant="secondary" className="w-full text-xs font-bold">Quick Apply</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
