
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { EmployerDashboard } from '@/components/dashboard/EmployerDashboard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function DashboardPage() {
  const [role, setRole] = useState<'student' | 'employer'>('student');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2">My <span className="text-primary gold-glow">Nexus</span></h1>
          <p className="text-muted-foreground">Manage your applications, listings, and profile details.</p>
        </div>
        
        {/* Mock Role Switcher for Demo */}
        <div className="flex items-center space-x-2 bg-card p-3 rounded-2xl border border-white/5">
          <Label htmlFor="role-mode" className={`text-xs font-bold uppercase tracking-widest ${role === 'student' ? 'text-primary' : 'text-muted-foreground'}`}>Student</Label>
          <Switch 
            id="role-mode" 
            checked={role === 'employer'}
            onCheckedChange={(checked) => setRole(checked ? 'employer' : 'student')}
          />
          <Label htmlFor="role-mode" className={`text-xs font-bold uppercase tracking-widest ${role === 'employer' ? 'text-primary' : 'text-muted-foreground'}`}>Employer</Label>
        </div>
      </div>

      <div className="animate-in fade-in duration-500">
        {role === 'student' ? <StudentDashboard /> : <EmployerDashboard />}
      </div>
    </div>
  );
}
