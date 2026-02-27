
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { EmployerDashboard } from '@/components/dashboard/EmployerDashboard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [role, setRole] = useState<'student' | 'employer'>('student');

  // Protected Route Check
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-4xl font-black mb-2 tracking-tight">My <span className="text-primary gold-glow">Nexus</span></h1>
          <p className="text-muted-foreground font-medium">Manage your professional journey and connections.</p>
        </div>
        
        {/* Role Switcher - In a real app this would be fixed based on user profile */}
        <div className="flex items-center space-x-3 bg-card/50 p-2 rounded-2xl border border-white/5 backdrop-blur-sm animate-in fade-in slide-in-from-right duration-500">
          <Label htmlFor="role-mode" className={`text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors ${role === 'student' ? 'text-primary' : 'text-muted-foreground'}`}>Student</Label>
          <Switch 
            id="role-mode" 
            checked={role === 'employer'}
            onCheckedChange={(checked) => setRole(checked ? 'employer' : 'student')}
          />
          <Label htmlFor="role-mode" className={`text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors ${role === 'employer' ? 'text-primary' : 'text-muted-foreground'}`}>Employer</Label>
        </div>
      </div>

      <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
        {role === 'student' ? <StudentDashboard /> : <EmployerDashboard />}
      </div>
    </div>
  );
}
