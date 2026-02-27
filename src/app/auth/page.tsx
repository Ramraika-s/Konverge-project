
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, ArrowLeft, Loader2, AlertCircle, User, Building2, Phone, MapPin, Globe, Sparkles, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

export default function AuthPage() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('login');
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
  const [resumeUrl, setResumeUrl] = useState('');

  // Employer Fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#signup') setActiveTab('signup');
      if (hash === '#login') setActiveTab('login');
    }
  }, []);

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleEmailAuth = async (type: 'login' | 'signup') => {
    if (!auth || !db) return;
    if (!email || !password) {
      setError('Please fill in your credentials.');
      return;
    }
    
    setError(null);
    setIsLoading(true);

    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
      } else {
        // Basic validation for required fields
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
          resumeUrl: resumeUrl || `https://example.com/resumes/${result.user.uid}`,
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
      }
      router.push('/dashboard');
    } catch (err: any) {
      let message = err.message || 'An error occurred during authentication.';
      if (err.code === 'auth/user-not-found') message = 'No account found with this email.';
      if (err.code === 'auth/wrong-password') message = 'Incorrect password.';
      if (err.code === 'auth/email-already-in-use') message = 'This email is already registered.';
      if (err.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      
      setError(message);
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!auth) return;
    setError(null);
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Signed in with Google",
        description: "Successfully authenticated.",
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google authentication.');
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-lg relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group font-bold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to home
        </Link>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger value="login" className="font-bold rounded-lg data-[state=active]:bg-background transition-all">Log In</TabsTrigger>
            <TabsTrigger value="signup" className="font-bold rounded-lg data-[state=active]:bg-background transition-all">Sign Up</TabsTrigger>
          </TabsList>

          <Card className="glass-card border-white/5 shadow-2xl rounded-3xl overflow-hidden border">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tight">Konnex</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">Connecting ambition with innovation.</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive animate-in shake-1">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs font-bold">{error}</AlertDescription>
                </Alert>
              )}

              <ScrollArea className={activeTab === 'signup' ? "max-h-[500px] pr-4" : ""}>
                <div className="space-y-6">
                  {activeTab === 'signup' && (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
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
                  )}

                  <div className="space-y-4">
                    <div className="flex flex-col gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 bg-white/5 border-white/10 rounded-xl" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 bg-white/5 border-white/10 rounded-xl" 
                        />
                      </div>
                    </div>

                    {activeTab === 'signup' && !isEmployer && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                              <Input placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                              <Input placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-white/5 border-white/10" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                              <Phone className="w-3 h-3" /> Contact Number
                            </Label>
                            <Input placeholder="+1 234 567 890" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="bg-white/5 border-white/10" />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                              <FileText className="w-3 h-3" /> Education Summary
                            </Label>
                            <Textarea placeholder="E.g. Computer Science Senior at University of Technology" value={educationSummary} onChange={(e) => setEducationSummary(e.target.value)} className="bg-white/5 border-white/10 min-h-[80px]" />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                              <Sparkles className="w-3 h-3" /> Skills (comma separated)
                            </Label>
                            <Input placeholder="React, TypeScript, UI Design" value={skills} onChange={(e) => setSkills(e.target.value)} className="bg-white/5 border-white/10" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preferred Roles</Label>
                              <Input placeholder="Frontend, Backend" value={preferredRoles} onChange={(e) => setPreferredRoles(e.target.value)} className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preferred Locations</Label>
                              <Input placeholder="New York, London" value={preferredLocations} onChange={(e) => setPreferredLocations(e.target.value)} className="bg-white/5 border-white/10" />
                            </div>
                         </div>
                         <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                            <Label className="text-sm font-bold">Remote Preferred</Label>
                            <Switch checked={isRemotePreferred} onCheckedChange={setIsRemotePreferred} />
                         </div>
                      </div>
                    )}

                    {activeTab === 'signup' && isEmployer && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-4">
                         <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                              <Building2 className="w-3 h-3" /> Company Name
                            </Label>
                            <Input placeholder="Acme Inc." value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-white/5 border-white/10" />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                              <Globe className="w-3 h-3" /> Company Website
                            </Label>
                            <Input placeholder="https://acme.com" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="bg-white/5 border-white/10" />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Short Description</Label>
                            <Textarea placeholder="Tell us about your company..." value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="bg-white/5 border-white/10 min-h-[80px]" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Person</Label>
                              <Input placeholder="Jane Smith" value={contactPersonName} onChange={(e) => setContactPersonName(e.target.value)} className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</Label>
                              <Input placeholder="HR Manager" className="bg-white/5 border-white/10" />
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Phone className="w-3 h-3" /> Contact No
                              </Label>
                              <Input placeholder="+1 234 567 890" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> Location
                              </Label>
                              <Input placeholder="Silicon Valley, CA" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} className="bg-white/5 border-white/10" />
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-4 border-t border-white/5">
              <TabsContent value="login" className="w-full mt-0">
                <Button 
                  onClick={() => handleEmailAuth('login')} 
                  disabled={isLoading}
                  className="w-full h-12 font-bold gold-border-glow rounded-xl bg-primary text-primary-foreground"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="w-full mt-0">
                <Button 
                  onClick={() => handleEmailAuth('signup')} 
                  disabled={isLoading}
                  className="w-full h-12 font-bold gold-border-glow rounded-xl bg-primary text-primary-foreground"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Complete ${isEmployer ? 'Employer' : 'Seeker'} Setup`}
                </Button>
              </TabsContent>

              <div className="relative w-full py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 w-full">
                <Button 
                  variant="outline" 
                  className="h-11 border-white/10 hover:bg-white/5 rounded-xl font-bold flex gap-2 transition-all"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
