"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function AuthPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGoogleAuth = async () => {
    // 1. Strict early return if already loading or missing auth
    if (!auth || isLoading) return; 
    
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      // 2. Force the provider to select an account to prevent silent failures
      provider.setCustomParameters({
        prompt: 'select_account' 
      });

      const result = await signInWithPopup(auth, provider);
      
      // 3. Ensure we actually got a user back before celebrating
      if (result.user) {
        toast({
          title: "Signed in with Google",
          description: "Successfully authenticated.",
        });
        router.push('/dashboard');
      }
    } catch (err: any) {
      // 4. Safely handle the specific "closed by user" error to avoid ugly UI
      if (err.code === 'auth/popup-closed-by-user') {
         setIsLoading(false); // Just reset state, don't show a massive error
         return; 
      }

      toast({
        variant: "destructive",
        title: "Google Auth Failed",
        description: err.message || 'An error occurred during Google authentication.',
      });
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
    <div className="min-h-[calc(100vh-64px)] grid place-items-center px-4 py-12 relative bg-background overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://picsum.photos/seed/tech/1920/1080"
          alt="Technical background"
          fill
          className="object-cover opacity-20"
          priority
          data-ai-hint="tech background"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="w-full max-w-lg relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group font-bold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to home
        </Link>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger value="login" className="font-bold rounded-lg data-[state=active]:bg-background transition-all">Log In</TabsTrigger>
            <TabsTrigger value="signup" className="font-bold rounded-lg data-[state=active]:bg-background transition-all">Sign Up</TabsTrigger>
          </TabsList>

          <Card className="glass-card border-white/5 shadow-2xl rounded-3xl border">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tight">Konnex</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">Connecting ambition with innovation.</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 px-8">
              <TabsContent value="login" className="mt-0 outline-hidden">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup" className="mt-0 outline-hidden">
                <SignUpForm />
              </TabsContent>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-4 px-8 pb-8 border-t border-white/5">
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
                  variant="ghost" 
                  className="h-11 border-white/10 rounded-xl font-bold flex gap-2 transition-all relative overflow-hidden gold-shine-hover no-grey-hover shadow-sm border bg-transparent hover:bg-transparent"
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