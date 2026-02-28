"use client";

import { useState, useEffect } from 'react';
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
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview Profile Details Completion Form.
 * This form is shown on the specialized dashboards when the profile 
 * is missing its "professional markers" (like education or website).
 */
export function ProfileCompletionForm() {
  const { user, role } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const seekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: seekerDoc } = useDoc(seekerRef);
  
  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerDoc } = useDoc(employerRef);

  const isEmployer = role === 'employer';
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
      setFirstName(seekerDoc.firstName || '');
      setLastName(seekerDoc.lastName || '');
      setContactNumber(seekerDoc.contactNumber || '');
      setEducationSummary(seekerDoc.educationSummary || '');
      setSkills(seekerDoc.skills?.join(', ') || '');
    } else if (employerDoc) {
      setCompanyName(employerDoc.companyName || '');
      setContactPersonName(employerDoc.contactPersonName || '');
      setCompanyWebsite(employerDoc.companyWebsite || '');
      setCompanyDescription(employerDoc.companyDescription || '');
      setCompanyLocation(employerDoc.companyLocation || '');
      setContactNumber(employerDoc.contactNumber || '');
    }
  }, [seekerDoc, employerDoc]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    setIsLoading(true);

    try {
      const targetCollection = isEmployer ? 'employerProfiles' : 'jobseekerProfile';
      const profileRef = doc(db, targetCollection, user.uid);
      
      const profileData = isEmployer ? {
        companyName,
        companyWebsite,
        companyDescription: companyDescription || "Leading innovation in our industry.",
        contactPersonName,
        contactEmail: user.email,
        contactNumber,
        companyLocation,
        updatedAt: new Date().toISOString(),
      } : {
        firstName,
        lastName,
        contactNumber,
        educationSummary,
        skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        updatedAt: new Date().toISOString(),
      };

      setDocumentNonBlocking(profileRef, profileData, { merge: true });

      toast({
        title: "Profile Finalized",
        description: `Welcome to your hub.`,
      });
      
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto glass-card border-white/5 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="text-center border-b border-white/5 bg-primary/5 p-8">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          {isEmployer ? <Building2 className="w-6 h-6 text-primary-foreground" /> : <User className="w-6 h-6 text-primary-foreground" />}
        </div>
        <CardTitle className="text-2xl font-black text-white">Complete your professional profile</CardTitle>
        <CardDescription className="text-muted-foreground font-medium">Add a few more details to unlock your full dashboard.</CardDescription>
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
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><FileText className="w-3 h-3" /> Education/Professional Bio</Label>
                <Textarea required placeholder="Tell us about your background..." value={educationSummary} onChange={(e) => setEducationSummary(e.target.value)} className="bg-white/5 border-white/10 min-h-[120px] rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Sparkles className="w-3 h-3" /> Key Skills (comma separated)</Label>
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
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Globe className="w-3 h-3" /> Official Website</Label>
                <Input required placeholder="https://company.com" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Mission</Label>
                <Textarea placeholder="Tell us about what you do..." value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="bg-white/5 border-white/10 min-h-[120px] rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Person</Label>
                  <Input required value={contactPersonName} onChange={(e) => setContactPersonName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><MapPin className="w-3 h-3" /> Primary Location</Label>
                  <Input required placeholder="City, Country" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Phone className="w-3 h-3" /> Contact Phone</Label>
                <Input required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 font-black text-lg gold-border-glow rounded-xl mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finish Setup'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
