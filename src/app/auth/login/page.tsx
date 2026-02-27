"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        
        <Card className="glass-card border-white/5 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-black">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access NexusHire.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="name@company.com" className="h-12 bg-white/5 border-white/10 focus:border-primary/50 transition-all" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" className="h-12 bg-white/5 border-white/10 focus:border-primary/50 transition-all" />
            </div>
            <Button className="w-full h-12 font-bold gold-border-glow">Log In</Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-white/5 pt-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-bold">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-11 border-white/10 rounded-xl font-bold flex gap-2 transition-all relative overflow-hidden gold-shine-hover no-grey-hover shadow-sm"
              >
                Google
              </Button>
              <Button variant="outline" className="h-11 border-white/10 hover:bg-white/5">LinkedIn</Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Don&apos;t have an account? <Link href="/auth#signup" className="text-primary font-bold hover:underline">Sign up for free</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}