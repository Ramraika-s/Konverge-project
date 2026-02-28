
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jobsData from '@/data/jobs.json';

/**
 * @fileOverview Administrative tool to seed Firestore with jobs from jobs.json.
 * Only visible to the user defined in NEXT_PUBLIC_ADMIN_EMAIL.
 * Enhanced to handle null values from external streams.
 */
export function DataSeeder() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSeedData = async () => {
    if (!db || isSeeding) return;

    setIsSeeding(true);
    setProgress(0);
    const total = jobsData.jobs.length;

    try {
      for (let i = 0; i < total; i++) {
        const job = jobsData.jobs[i];
        const jobRef = doc(db, 'jobListings', job.id);

        // Sanitize data: provide defaults for null/missing fields to maintain schema integrity
        const sanitizedJob = {
          ...job,
          description: job.description || "Professional opportunity details coming soon. Please refer to the application link for more information.",
          stipendMin: job.stipendMin || 0,
          stipendMax: job.stipendMax || 0,
          stipendCurrency: job.stipendCurrency || "USD",
          applicationDeadline: job.applicationDeadline || "Open until filled",
          postedAt: job.postedAt || new Date().toISOString(),
          updatedAt: serverTimestamp(),
          status: job.status || "Active",
          skillsRequired: job.skillsRequired || [],
        };

        await setDoc(jobRef, sanitizedJob, { merge: true });
        setProgress(Math.round(((i + 1) / total) * 100));
      }

      toast({
        title: "Stream Synced",
        description: `Successfully processed ${total} items from the global stream.`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: err.message,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5 rounded-3xl overflow-hidden shadow-xl border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" /> Admin Stream Ingest
        </CardTitle>
        <CardDescription className="text-xs font-medium">
          Source: <span className="font-bold text-foreground">src/data/jobs.json</span> ({jobsData.jobs.length} items)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleSeedData} 
            disabled={isSeeding}
            className="w-full h-11 font-black gold-border-glow rounded-xl gap-2"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing {progress}%
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Sync Global Stream
              </>
            )}
          </Button>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
            <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
              Handles null values and ensures data consistency.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
