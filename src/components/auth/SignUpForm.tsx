
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  AlertCircle, 
  User, 
  Building2, 
  Phone, 
  MapPin, 
  Globe, 
  Sparkles, 
  FileText 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export function SignUpForm() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmployer, setIsEmployer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Student Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
  const [contactPersonName, setContactPersonName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    if (!email || !password) {
      setError('Please fill in your credentials.');
      return;
    }

    setError(null);
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

      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      const profileRef = doc(db, isEmployer ? 'employerProfiles' : 'studentProfiles', result.user.uid);
      
      const profileData = isEmployer ? {
        id: result.user.uid,
        companyName,
        companyWebsite,
        companyDescription: companyDescription || "Leading innovation in the industry.",
        contactPersonName,
        contactEmail: result.user.email,
        contactNumber: contactNumber || "000-000-0000",
        companyLocation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } : {
        id: result.user.uid,
        firstName,
        lastName,
        email: result.user.email,
        contactNumber,
        educationSummary,
        skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        resumeUrl: `https://example.com/resumes/${result.user.uid}`,
        preferredRoles: preferredRoles.split(',').map(s => s.trim()).filter(s => s !== ''),
        preferredLocations: preferredLocations.split(',').map(s => s.trim()).filter(s => s !== ''),
        isRemotePreferred,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(profileRef, profileData, { merge: true });

      toast({
        title: "Account created!",
        description: `Welcome to Konnex as an ${isEmployer ? 'Employer' : 'Job-Seeker'}.`,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col h-full">
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-bold">{error}</AlertDescription>
        </Alert>
      )}

      <ScrollArea className="flex-grow max-h-[480px] w-full rounded-md pr-4">
        <div className="space-y-8 pb-10 px-1">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-primary/20 shadow-sm transition-all mx-1">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold flex items-center gap-2">
                {isEmployer ? <Building2 className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-primary" />}
                Register as {isEmployer ? 'Employer' : 'Job-Seeker'}
              </Label>
              <p className="text-[10px] text-muted-foreground">{isEmployer ? 'Hire top talent' : 'Find your next career move'}</p>
            </div>
            <Switch 
              checked={isEmployer} 
              onCheckedChange={setIsEmployer}
            />
          </div>

          <div className="space-y-6 px-1">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <Input 
                id="signup-email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
              <Input 
                id="signup-password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-colors" 
              />
            </div>

            {!isEmployer ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                    <Input placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                    <Input placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Contact Number
                  </Label>
                  <Input placeholder="+1 234 567 890" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Education Summary
                  </Label>
                  <Textarea placeholder="E.g. Computer Science Senior" value={educationSummary} onChange={(e) => setEducationSummary(e.target.value)} className="bg-white/5 border-white/10 min-h-[100px] rounded-xl focus:border-primary/50 leading-relaxed" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Skills (comma separated)
                  </Label>
                  <Input placeholder="React, TypeScript, UI Design" value={skills} onChange={(e) => setSkills(e.target.value)} className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preferred Roles</Label>
                    <Input placeholder="Frontend, Backend" value={preferredRoles} onChange={(e) => setPreferredRoles(e.target.value)} className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preferred Locations</Label>
                    <Input placeholder="New York, London" value={preferredLocations} onChange={(e) => setPreferredLocations(e.target.value)} className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 mx-1">
                  <Label className="text-sm font-bold">Remote Preferred</Label>
                  <Switch checked={isRemotePreferred} onCheckedChange={setIsRemotePreferred} />
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Building2 className="w-3 h-3" /> Company Name
                  </Label>
                  <Input placeholder="Acme Inc." value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Company Website
                  </Label>
                  <Input placeholder="https://acme.com" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Short Description</Label>
                  <Textarea placeholder="Tell us about your company..." value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="bg-white/5 border-white/10 min-h-[100px] rounded-xl focus:border-primary/50 leading-relaxed" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Person</Label>
                    <Input placeholder="Jane Smith" value={contactPersonName} onChange={(e) => setContactPersonName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Location
                    </Label>
                    <Input placeholder="Silicon Valley, CA" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="pt-8 pb-4 border-t border-white/5 bg-card/50 backdrop-blur-sm -mx-8 px-8 mt-4 rounded-b-3xl">
        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full h-14 font-black text-lg gold-border-glow rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            `Complete ${isEmployer ? 'Employer' : 'Seeker'} Setup`
          )}
        </Button>
      </div>
    </form>
  );
}

