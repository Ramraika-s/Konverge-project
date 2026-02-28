"use client";

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface JobApplyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
}

export function JobApplyDialog({ isOpen, onOpenChange, jobId, jobTitle }: JobApplyDialogProps) {
  const { user, profile } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = async () => {
    if (!user || !db) return;

    setIsSubmitting(true);
    try {
      const applicationsRef = collection(db, 'applications');
      
      const applicationData = {
        studentId: user.uid,
        jobListingId: jobId,
        applicationDate: new Date().toISOString(),
        status: 'Applied',
        coverLetterText: coverLetter,
        attachedResumeUrl: profile?.resumeUrl || '',
        updatedAt: new Date().toISOString(),
      };

      await addDocumentNonBlocking(applicationsRef, applicationData);

      toast({
        title: "Application Sent!",
        description: `Your profile has been submitted for the ${jobTitle} position.`,
      });
      
      onOpenChange(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 rounded-3xl sm:max-w-2xl overflow-hidden p-0">
        <DialogHeader className="p-8 bg-primary/5 border-b border-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black">Apply for Mission</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                {jobTitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
              <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
              <span className={coverLetter.length > 500 ? 'text-primary' : ''}>{coverLetter.length}/1000</span>
            </div>
            <Textarea
              id="cover-letter"
              placeholder="Why are you the right fit for this role? Highlight your impact..."
              className="min-h-[200px] bg-white/5 border-white/10 rounded-2xl p-4 leading-relaxed focus:ring-primary/50"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value.slice(0, 1000))}
            />
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold">Identity Sync</p>
              <p className="text-xs text-muted-foreground font-medium">
                Your verified profile, resume, and skills will be automatically attached to this application.
              </p>
            </div>
          </div>

          {(!profile?.resumeUrl || !profile?.educationSummary) && (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex gap-4 animate-pulse">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-destructive">Profile Incomplete</p>
                <p className="text-xs text-destructive/80 font-medium">
                  We highly recommend completing your profile before applying to increase your selection chances.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-4">
          <Button 
            variant="ghost" 
            className="flex-1 h-14 font-bold border-white/5 hover:bg-white/5 rounded-2xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 h-14 font-black text-lg gold-border-glow rounded-2xl gap-2"
            onClick={handleApply}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            Confirm Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
