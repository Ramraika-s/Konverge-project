
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Info,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const jobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  location: z.string().min(2, "Please specify a location"),
  jobType: z.enum(["Full-time", "Part-time", "Internship", "Contract"]),
  description: z.string().min(50, "Description should be detailed (at least 50 characters)"),
  stipendMin: z.string().optional(),
  stipendMax: z.string().optional(),
  applicationDeadline: z.string().min(1, "Please set a deadline"),
  remoteOption: z.boolean().default(false),
  skillsRequired: z.string().min(3, "Please list at least a few skills (e.g. React, UI Design)"),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function PostJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      location: "",
      jobType: "Full-time",
      description: "",
      stipendMin: "",
      stipendMax: "",
      applicationDeadline: "",
      remoteOption: false,
      skillsRequired: "",
    },
  });

  async function onSubmit(values: JobFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Form Submitted:", values);
    
    toast({
      title: "Job Published!",
      description: "Your listing is now live for all job seekers to see.",
    });
    
    setIsSubmitting(false);
    router.push('/dashboard/employer');
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8 gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Hub
        </Button>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">Post a New <span className="text-primary gold-glow">Vacancy</span></h1>
            <p className="text-muted-foreground">Reach out to top talent by providing clear and detailed information about the role.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <Card className="glass-card border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <CardHeader className="bg-primary/5 border-b border-white/5">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Briefcase className="w-5 h-5 text-primary" /> Role Identity
                  </CardTitle>
                  <CardDescription>Basic information that will appear in search results.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Senior Frontend Engineer" {...field} className="h-12 bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input placeholder="City, State" {...field} className="pl-10 h-12 bg-white/5 border-white/10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="jobType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Employment Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-white/5 border-white/10">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="glass-card">
                              <SelectItem value="Full-time">Full-time</SelectItem>
                              <SelectItem value="Part-time">Part-time</SelectItem>
                              <SelectItem value="Internship">Internship</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="remoteOption"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-white/5 p-4 bg-white/5">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-bold">Remote Opportunity</FormLabel>
                          <FormDescription className="text-xs">
                            Is this position open to remote workers?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="glass-card border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <CardHeader className="bg-primary/5 border-b border-white/5">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Info className="w-5 h-5 text-primary" /> Role Details
                  </CardTitle>
                  <CardDescription>Provide a comprehensive description of the role and requirements.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description & Responsibilities</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the role, day-to-day responsibilities, and team culture..." 
                            className="min-h-[200px] bg-white/5 border-white/10 leading-relaxed"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-[10px] text-muted-foreground flex gap-1 items-center">
                          <Sparkles className="w-3 h-3" /> Tip: Use bullet points for readability.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skillsRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Required Skills</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. React, Node.js, TypeScript, Figma" {...field} className="h-12 bg-white/5 border-white/10" />
                        </FormControl>
                        <FormDescription className="text-[10px]">Separate skills with commas.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Budget/Stipend Range (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                          <Input 
                            type="number" 
                            placeholder="Min" 
                            className="pl-8 h-10 bg-white/5 border-white/10"
                            {...form.register("stipendMin")}
                          />
                        </div>
                        <span className="text-muted-foreground">-</span>
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                          <Input 
                            type="number" 
                            placeholder="Max" 
                            className="pl-8 h-10 bg-white/5 border-white/10"
                            {...form.register("stipendMax")}
                          />
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="applicationDeadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Application Deadline</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input type="date" {...field} className="pl-10 h-12 bg-white/5 border-white/10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-8 z-50">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-14 flex-1 border-white/10 bg-background/80 backdrop-blur-md hover:bg-white/5 font-bold rounded-2xl"
                  onClick={() => {
                    toast({
                      title: "Preview Generated",
                      description: "Scroll up to review your listing before publishing.",
                    });
                  }}
                >
                  Preview Listing
                </Button>
                <Button 
                  type="submit" 
                  className="h-14 flex-1 font-black text-lg gold-border-glow rounded-2xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Publish Job
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="currentColor" />
  </svg>
);
