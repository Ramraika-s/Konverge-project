
"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Filter, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  Users,
  SearchCode,
  Globe,
  Navigation,
  Loader2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

// Expanded Professional Categories
const ROLE_CATEGORIES = [
  { id: 'eng', name: 'Engineering & Tech', subcategories: ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'Data Science', 'AI/ML', 'Cybersecurity'] },
  { id: 'fin', name: 'Finance & Accounting', subcategories: ['Investment Banking', 'Corporate Finance', 'Audit', 'Tax', 'Wealth Management', 'FinTech'] },
  { id: 'biz', name: 'Business & Operations', subcategories: ['Strategy', 'Project Management', 'Operations', 'Supply Chain', 'Logistics', 'Procurement'] },
  { id: 'mkt', name: 'Marketing & PR', subcategories: ['Brand Management', 'Digital Marketing', 'Content Strategy', 'SEO', 'Market Research', 'Public Relations'] },
  { id: 'des', name: 'Design & Creative', subcategories: ['UI/UX', 'Product Design', 'Graphic Design', 'Motion Graphics', 'User Research', 'Architecture'] },
  { id: 'hr', name: 'Human Resources', subcategories: ['Talent Acquisition', 'L&D', 'Compensation & Benefits', 'Employee Relations', 'HR Analytics'] },
  { id: 'leg', name: 'Legal & Compliance', subcategories: ['Corporate Law', 'Intellectual Property', 'Compliance', 'Risk Management', 'Public Policy'] },
  { id: 'sales', name: 'Sales & BD', subcategories: ['Account Management', 'Enterprise Sales', 'Inside Sales', 'Business Development'] }
];

export default function JobsPage() {
  const db = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string[]>([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [salaryRange, setSalaryRange] = useState([0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  // Firestore Query
  const jobsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'jobListings'),
      where('status', '==', 'Active'),
      orderBy('postedAt', 'desc')
    );
  }, [db]);

  const { data: jobs, isLoading: isJobsLoading } = useCollection(jobsQuery);

  const filteredCategories = useMemo(() => {
    if (!categorySearch) return ROLE_CATEGORIES;
    const lowerSearch = categorySearch.toLowerCase();
    return ROLE_CATEGORIES.map(cat => {
      const isCategoryMatch = cat.name.toLowerCase().includes(lowerSearch);
      const matchedSubcategories = cat.subcategories.filter(sub => 
        sub.toLowerCase().includes(lowerSearch)
      );
      if (isCategoryMatch || matchedSubcategories.length > 0) {
        return {
          ...cat,
          subcategories: isCategoryMatch ? cat.subcategories : matchedSubcategories,
          isExplicitMatch: true
        };
      }
      return null;
    }).filter(Boolean) as any[];
  }, [categorySearch]);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter(job => {
      const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWorkMode = selectedWorkMode.length === 0 || selectedWorkMode.includes(job.jobType) || (selectedWorkMode.includes('Remote') && job.remoteOption);
      const matchesSalary = job.stipendMax >= salaryRange[0];
      const matchesLocation = !locationQuery || job.location?.toLowerCase().includes(locationQuery.toLowerCase());
      
      return matchesSearch && matchesWorkMode && matchesSalary && matchesLocation;
    });
  }, [jobs, searchQuery, selectedWorkMode, salaryRange, locationQuery]);

  const showLocationSearch = selectedWorkMode.includes('On-site') || selectedWorkMode.includes('Hybrid');

  const toggleWorkMode = (mode: string) => {
    setSelectedWorkMode(prev => 
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  const toggleCategory = (catName: string) => {
    setSelectedCategories(prev =>
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const toggleSubcategory = (subName: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subName) ? prev.filter(s => s !== subName) : [...prev, subName]
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-10">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight">
              Premium <span className="text-primary gold-glow">Career Streams</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Verified opportunities across the corporate landscape, from Tech and Finance to Legal and Strategy.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Role title, skills, or keywords..." 
                  className="pl-12 h-14 bg-card/50 border-white/5 rounded-2xl focus:ring-primary/50 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {showLocationSearch && (
                <div className="relative md:w-[250px] animate-in slide-in-from-left-2 duration-300">
                  <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input 
                    placeholder="City or Country..." 
                    className="pl-10 h-14 bg-card/50 border-white/5 rounded-2xl"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
              )}

              <Button size="lg" className="h-14 px-10 gold-border-glow rounded-2xl font-black text-lg">
                Search
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              {['Remote', 'On-site', 'Hybrid'].map(mode => (
                <Badge 
                  key={mode}
                  variant={selectedWorkMode.includes(mode) ? 'default' : 'outline'}
                  className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold transition-all border-white/10 ${
                    selectedWorkMode.includes(mode) ? 'bg-primary text-primary-foreground' : 'hover:bg-white/5'
                  }`}
                  onClick={() => toggleWorkMode(mode)}
                >
                  {mode === 'Remote' && <Globe className="w-3 h-3 mr-1.5" />}
                  {mode}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-10">
          <aside className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="glass-card rounded-3xl p-6 border-white/5 shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h3>
                <Button 
                  variant="ghost" size="sm" 
                  className="text-[10px] uppercase font-bold text-muted-foreground h-auto p-0 hover:bg-transparent" 
                  onClick={() => {
                    setSelectedWorkMode([]);
                    setSelectedCategories([]);
                    setSelectedSubcategories([]);
                    setSalaryRange([0]);
                    setCategorySearch('');
                    setOpenAccordions([]);
                  }}
                >
                  Reset
                </Button>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Specializations</Label>
                <div className="relative">
                  <SearchCode className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input 
                    placeholder="Search roles..." 
                    className="h-9 pl-9 text-xs bg-white/5 border-white/5 rounded-xl"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                </div>
                
                <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="w-full">
                  {filteredCategories.map((cat) => (
                    <AccordionItem key={cat.id} value={cat.id} className="border-white/5">
                      <div className="flex items-center gap-2 w-full pr-2">
                        <Checkbox 
                          id={`cat-${cat.id}`} 
                          checked={selectedCategories.includes(cat.name)}
                          onCheckedChange={() => toggleCategory(cat.name)}
                          className="z-10 translate-y-0.5"
                        />
                        <AccordionTrigger className="flex-1 hover:no-underline py-3">
                          <span className="text-sm font-bold text-left">{cat.name}</span>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent>
                        <div className="space-y-3 pl-6 pt-2 pb-2">
                          {cat.subcategories.map((sub: string) => (
                            <div key={sub} className="flex items-center gap-2">
                              <Checkbox 
                                id={`sub-${sub}`}
                                checked={selectedSubcategories.includes(sub)}
                                onCheckedChange={() => toggleSubcategory(sub)}
                              />
                              <Label htmlFor={`sub-${sub}`} className="text-xs text-muted-foreground cursor-pointer hover:text-white transition-colors">
                                {sub}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Min Stipend</Label>
                  <span className="text-xs font-black text-primary">${salaryRange[0].toLocaleString()}+</span>
                </div>
                <Slider 
                  max={10000} 
                  step={500}
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  className="py-4"
                />
              </div>
            </div>
          </aside>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {isJobsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                ) : (
                  <>Displaying <span className="text-white font-black">{filteredJobs.length}</span> curated opportunities</>
                )}
              </span>
            </div>

            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="glass-card hover:border-primary/40 transition-all duration-500 group relative overflow-hidden rounded-4xl">
                  <CardHeader className="flex flex-col md:flex-row items-start justify-between gap-4 p-8">
                    <div className="flex gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/80 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <Briefcase className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link href={`/jobs/${job.id}`}>
                            <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors cursor-pointer leading-tight">
                              {job.title}
                            </CardTitle>
                          </Link>
                          <Badge variant="outline" className="h-5 px-1.5 border-primary/20 text-primary bg-primary/5 text-[9px] font-black uppercase tracking-tighter">
                            {job.status}
                          </Badge>
                        </div>
                        <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1.5 text-xs"><MapPin className="w-3.5 h-3.5 text-primary" /> {job.location}</span>
                          <span className="flex items-center gap-1.5 text-xs"><Briefcase className="w-3.5 h-3.5 text-primary" /> {job.jobType}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-8 pb-4">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2 max-w-3xl">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-[10px] bg-white/5 border-white/5 uppercase font-black text-muted-foreground tracking-widest px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-white/5 px-8 py-5 flex items-center justify-between bg-white/2">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Est. Value</span>
                        <div className="flex items-center gap-1 font-black text-primary">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span className="text-lg">{job.stipendMin?.toLocaleString()} - {job.stipendMax?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-white/5 hidden sm:block" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Remote</span>
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Globe className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm">{job.remoteOption ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link href={`/jobs/${job.id}`}>
                      <Button size="lg" className="group/btn gap-2 font-black rounded-xl gold-border-glow h-12">
                        View Details <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
