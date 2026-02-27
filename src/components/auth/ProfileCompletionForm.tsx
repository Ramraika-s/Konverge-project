
"use client";

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Loader2, 
  User, 
  Building2, 
  Phone, 
  MapPin, 
  Globe, 
  Sparkles, 
  FileText,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ProfileCompletionForm() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [step, setStep] = useState<'choice' | 'details'>('choice');
  const [isEmployer, setIsEmployer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Job Seeker Fields
  const [firstName, setFirstName] = useState(user?.displayName?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.displayName?.split(' ').slice(1).join(' ') || '');
  const [contactNumber, setContactNumber] = useState('');
  const [skills, setSkills] = useState('');
  const [educationSummary, setEducationSummary] = useState('');
  const [preferredRoles, setPreferredRoles] = useState('');
  const [preferredLocations, setPreferredLocations] = useState('');
  const [isRemotePreferred, setIsRemotePreferred] = useState(true);

  // Employer Fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [contactPersonName, setContactPersonName] = useState(user?.displayName || '');
  const [companyLocation, setCompanyLocation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    setIsLoading(true);

    try {
      if (isEmployer) {
        if (!companyName || !companyWebsite || !contactPersonName || !companyLocation) {
          throw new Error("Please fill in all required company fields.");
        }
      } else {
        if (!firstName || !lastName || !contactNumber || !educationSummary) {
          throw new Error("Please fill in all required personal fields.");
        }
      }

      const profileRef = doc(db, isEmployer ? 'employerProfiles' : 'jobseekerProfile', user.uid);
      
      const profileData = isEmployer ? {
        id: user.uid,
        companyName,
        companyWebsite,
        companyDescription: companyDescription || "Leading innovation in the industry.",
        contactPersonName,
        contactEmail: user.email,
        contactNumber: contactNumber || "000-000-0000",
        companyLocation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } : {
        id: user.uid,
        firstName,
        lastName,
        email: user.email,
        contactNumber,
        educationSummary,
        skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        resumeUrl: `https://example.com/resumes/${user.uid}`,
        preferredRoles: preferredRoles.split(',').map(s => s.trim()).filter(s => s !== ''),
        preferredLocations: preferredLocations.split(',').map(s => s.trim()).filter(s => s !== ''),
        isRemotePreferred,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(profileRef, profileData, { merge: true });

      toast({
        title: "Profile Complete!",
        description: `Welcome to Konnex. Your ${isEmployer ? 'Employer' : 'Job-Seeker'} profile is ready.`,
      });
      
      // The dashboard page will automatically redirect once Firestore state updates
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: err.message,
      });
      setIsLoading(false);
    }
  };

  if (step === 'choice') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-white">One last <span className="text-primary gold-glow">step</span></h1>
          <p className="text-xl text-muted-foreground">To provide the best experience, we need to know your professional role.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className="glass-card hover:border-primary/50 transition-all cursor-pointer group p-4 border-2"
            onClick={() => { setIsEmployer(false); setStep('details'); }}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 mx-auto group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <User className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Job Seeker</CardTitle>
              <CardDescription className="text-base text-muted-foreground">Find opportunities, track applications, and grow your career.</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="glass-card hover:border-primary/50 transition-all cursor-pointer group p-4 border-2"
            onClick={() => { setIsEmployer(true); setStep('details'); }}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                <Building2 className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Employer</CardTitle>
              <CardDescription className="text-base text-muted-foreground">Post vacancies, manage talent, and build your team.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto glass-card border-white/5 shadow-2xl rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="text-center border-b border-white/5 bg-primary/5 rounded-t-3xl">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          {isEmployer ? <Building2 className="w-6 h-6 text-primary-foreground" /> : <User className="w-6 h-6 text-primary-foreground" />}
        </div>
        <CardTitle className="text-2xl font-black text-white">Complete your {isEmployer ? 'Employer' : 'Seeker'} Profile</CardTitle>
        <CardDescription className="text-muted-foreground font-medium">This information is required to access your dashboard.</CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isEmployer ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name <span className="text-destructive">*</span></Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name <span className="text-destructive">*</span></Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Phone className="w-3 h-3" /> Contact Number <span className="text-destructive">*</span></Label>
                <Input placeholder="+1 234 567 890" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><FileText className="w-3 h-3" /> Education Summary <span className="text-destructive">*</span></Label>
                <Textarea placeholder="E.g. Computer Science Senior" value={educationSummary} onChange={(e) => setEducationSummary(e.target.value)} className="bg-white/5 border-white/10 min-h-[100px] rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Sparkles className="w-3 h-3" /> Skills (comma separated)</Label>
                <Input placeholder="React, TypeScript, UI Design" value={skills} onChange={(e) => setSkills(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Building2 className="w-3 h-3" /> Company Name <span className="text-destructive">*</span></Label>
                <Input placeholder="Acme Inc." value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Globe className="w-3 h-3" /> Company Website <span className="text-destructive">*</span></Label>
                <Input placeholder="https://acme.com" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Short Description</Label>
                <Textarea placeholder="Tell us about your company..." value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="bg-white/5 border-white/10 min-h-[100px] rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Person <span className="text-destructive">*</span></Label>
                  <Input value={contactPersonName} onChange={(e) => setContactPersonName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><MapPin className="w-3 h-3" /> Location <span className="text-destructive">*</span></Label>
                  <Input placeholder="Silicon Valley, CA" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-12 font-bold rounded-xl border-white/10"
              onClick={() => setStep('choice')}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-[2] h-12 font-black text-lg gold-border-glow rounded-xl"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalize Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
