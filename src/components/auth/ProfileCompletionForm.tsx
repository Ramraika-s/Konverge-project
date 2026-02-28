
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Loader2, 
  User, 
  Building2, 
  Phone, 
  Globe, 
  Sparkles, 
  FileText,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ProfileCompletionForm() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const seekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: seekerDoc } = useDoc(seekerRef);
  
  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerDoc } = useDoc(employerRef);

  const [step, setStep] = useState<'choice' | 'details'>('choice');
  const [isEmployer, setIsEmployer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [skills, setSkills] = useState('');
  const [educationSummary, setEducationSummary] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');

  useEffect(() => {
    if (seekerDoc) {
      setIsEmployer(false);
      setStep('details');
      setFirstName(seekerDoc.firstName || '');
      setLastName(seekerDoc.lastName || '');
    } else if (employerDoc) {
      setIsEmployer(true);
      setStep('details');
      setCompanyName(employerDoc.companyName || '');
      setContactPersonName(employerDoc.contactPersonName || '');
    } else if (user?.displayName) {
      const names = user.displayName.split(' ');
      setFirstName(names[0] || '');
      setLastName(names.slice(1).join(' ') || '');
      setContactPersonName(user.displayName);
    }
  }, [seekerDoc, employerDoc, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    setIsLoading(true);

    try {
      const targetCollection = isEmployer ? 'employerProfiles' : 'jobseekerProfile';
      const profileRef = doc(db, targetCollection, user.uid);
      
      const profileData = isEmployer ? {
        id: user.uid,
        companyName,
        companyWebsite,
        companyDescription: companyDescription || "Leading innovation in our industry.",
        contactPersonName,
        contactEmail: user.email,
        contactNumber: contactNumber || "Not specified",
        companyLocation,
        createdAt: employerDoc?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } : {
        id: user.uid,
        firstName,
        lastName,
        email: user.email,
        contactNumber,
        educationSummary,
        skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        resumeUrl: `https://example.com/resumes/${user.uid}`, // Dummy
        preferredRoles: [],
        preferredLocations: [],
        isRemotePreferred: true,
        createdAt: seekerDoc?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(profileRef, profileData, { merge: true });

      toast({
        title: "Profile Updated",
        description: `Welcome to Konnex.`,
      });

      // Redirect happens automatically due to page-level listeners on seekerDoc/employerDoc
      
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: err.message,
      });
      setIsLoading(false);
    }
  };

  if (step === 'choice' && !seekerDoc && !employerDoc) {
    return (
      <div className="max-w-3xl mx-auto text-center space-y-12 py-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-white">Join the <span className="text-primary gold-glow">Network</span></h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">Select your path. This choice will customize your Konnex experience.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className="glass-card hover:border-primary/50 transition-all cursor-pointer group p-6 border-2 relative overflow-hidden"
            onClick={() => { setIsEmployer(false); setStep('details'); }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 mx-auto group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <User className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Job Seeker</CardTitle>
              <CardDescription className="text-base text-muted-foreground">Apply for premium roles and track your career growth.</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="glass-card hover:border-primary/50 transition-all cursor-pointer group p-6 border-2 relative overflow-hidden"
            onClick={() => { setIsEmployer(true); setStep('details'); }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                <Building2 className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Employer</CardTitle>
              <CardDescription className="text-base text-muted-foreground">Find top talent and manage your hiring pipeline.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto glass-card border-white/5 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="text-center border-b border-white/5 bg-primary/5 p-8">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          {isEmployer ? <Building2 className="w-6 h-6 text-primary-foreground" /> : <User className="w-6 h-6 text-primary-foreground" />}
        </div>
        <CardTitle className="text-2xl font-black text-white">Finalize your {isEmployer ? 'Organization' : 'Identity'}</CardTitle>
        <CardDescription className="text-muted-foreground font-medium">Almost there. Fill in the details to enter your dashboard.</CardDescription>
      </CardHeader>

      <CardContent className="p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isEmployer ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                  <Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                  <Input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Phone className="w-3 h-3" /> Phone Number</Label>
                <Input required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><FileText className="w-3 h-3" /> Education/Bio</Label>
                <Textarea required placeholder="Tell us about your background..." value={educationSummary} onChange={(e) => setEducationSummary(e.target.value)} className="bg-white/5 border-white/10 min-h-[100px] rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Sparkles className="w-3 h-3" /> Skills (comma separated)</Label>
                <Input placeholder="React, Python, Sales..." value={skills} onChange={(e) => setSkills(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Building2 className="w-3 h-3" /> Company Name</Label>
                <Input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Globe className="w-3 h-3" /> Website</Label>
                <Input required placeholder="https://company.com" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Bio</Label>
                <Textarea placeholder="Tell us about your mission..." value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="bg-white/5 border-white/10 min-h-[100px] rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Person</Label>
                  <Input required value={contactPersonName} onChange={(e) => setContactPersonName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><MapPin className="w-3 h-3" /> HQ Location</Label>
                  <Input required placeholder="City, Country" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            {!seekerDoc && !employerDoc && (
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-14 font-bold rounded-xl border-white/10"
                onClick={() => setStep('choice')}
              >
                Back
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-[2] h-14 font-black text-lg gold-border-glow rounded-xl"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Dashboard'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
