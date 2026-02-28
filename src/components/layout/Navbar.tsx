
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, Search, User, LogOut, Menu, Loader2, UserCircle, Building2, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();

  const seekerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'jobseekerProfile', user.uid), [db, user]);
  const { data: seekerProfile, isLoading: isSeekerLoading } = useDoc(seekerRef);
  
  const employerRef = useMemoFirebase(() => (!db || !user) ? null : doc(db, 'employerProfiles', user.uid), [db, user]);
  const { data: employerProfile, isLoading: isEmployerLoading } = useDoc(employerRef);
  
  const isProfileLoading = isSeekerLoading || isEmployerLoading;
  const isLoading = isUserLoading || (!!user && isProfileLoading);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tighter gold-glow">
              Konnex
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/jobs"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/jobs' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Find Jobs
            </Link>
            
            {!isLoading && user && (
              <div className="flex items-center gap-4 border-l border-white/10 pl-4 animate-in fade-in duration-300">
                {seekerProfile ? (
                  <Link
                    href="/dashboard/job-seeker"
                    className={`text-[10px] font-black uppercase tracking-widest transition-colors hover:text-primary ${
                      pathname === '/dashboard/job-seeker' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Seeker Hub
                  </Link>
                ) : employerProfile ? (
                  <Link
                    href="/dashboard/employer"
                    className={`text-[10px] font-black uppercase tracking-widest transition-colors hover:text-primary ${
                      pathname === '/dashboard/employer' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Employer Hub
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/job-seeker"
                    className={`text-[10px] font-black uppercase tracking-widest transition-colors hover:text-primary ${
                      pathname.includes('/dashboard') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Setup Dashboard
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : !user ? (
              <>
                <Link href="/auth#login">
                  <Button variant="ghost" className="text-sm font-medium">Log In</Button>
                </Link>
                <Link href="/auth#signup">
                  <Button className="text-sm font-bold gold-border-glow">Sign Up</Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-secondary/50 border border-white/5 p-0 overflow-hidden ring-offset-background transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 glass-card border-white/10 p-2">
                  <div className="px-2 py-3">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Authenticated as</p>
                    <p className="text-sm font-medium truncate text-white">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  {seekerProfile ? (
                    <DropdownMenuItem className="cursor-pointer rounded-lg py-3" onClick={() => router.push('/dashboard/job-seeker')}>
                      <LayoutDashboard className="mr-3 h-5 w-5 text-primary" /> 
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">Seeker Dashboard</span>
                        <span className="text-[10px] text-muted-foreground">Manage applications</span>
                      </div>
                    </DropdownMenuItem>
                  ) : employerProfile ? (
                    <DropdownMenuItem className="cursor-pointer rounded-lg py-3" onClick={() => router.push('/dashboard/employer')}>
                      <LayoutDashboard className="mr-3 h-5 w-5 text-primary" /> 
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">Employer Dashboard</span>
                        <span className="text-[10px] text-muted-foreground">Manage listings</span>
                      </div>
                    </DropdownMenuItem>
                  ) : null}

                  <DropdownMenuItem className="cursor-pointer rounded-lg py-3" onClick={() => router.push('/profile')}>
                    <Settings className="mr-3 h-5 w-5 text-primary" /> 
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">Manage Profile</span>
                      <span className="text-[10px] text-muted-foreground">Identity & Security</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-destructive cursor-pointer rounded-lg py-3" onClick={handleLogout}>
                    <LogOut className="mr-3 h-5 w-5" /> 
                    <span className="font-bold text-sm">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-l-white/5 p-8">
                <div className="flex flex-col gap-8 mt-12">
                  <Link href="/jobs" className="text-xl font-bold flex items-center gap-4 group">
                    <Search className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    Find Jobs
                  </Link>
                  {!isLoading && user && (
                    <>
                      {seekerProfile ? (
                        <Link href="/dashboard/job-seeker" className="text-xl font-bold flex items-center gap-4 group">
                          <LayoutDashboard className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                          Dashboard
                        </Link>
                      ) : employerProfile ? (
                        <Link href="/dashboard/employer" className="text-xl font-bold flex items-center gap-4 group">
                          <LayoutDashboard className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                          Dashboard
                        </Link>
                      ) : null}
                      <Link href="/profile" className="text-xl font-bold flex items-center gap-4 group">
                        <Settings className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                        Profile
                      </Link>
                    </>
                  )}
                  <hr className="border-white/5" />
                  {!user && !isLoading ? (
                    <Link href="/auth#signup">
                      <Button className="w-full h-14 font-black gold-border-glow text-lg">Get Started</Button>
                    </Link>
                  ) : user ? (
                    <Button variant="destructive" className="w-full h-14 font-black text-lg" onClick={handleLogout}>Log Out</Button>
                  ) : null}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
