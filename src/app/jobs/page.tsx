
"use client";

import { useState, useMemo } from 'react';
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
  Navigation
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
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Data Structures
const ROLE_CATEGORIES = [
  {
    id: 'eng',
    name: 'Engineering',
    subcategories: ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'QA']
  },
  {
    id: 'des',
    name: 'Design',
    subcategories: ['UI/UX', 'Product Design', 'Graphic Design', 'Motion Design', 'User Research']
  },
  {
    id: 'mkt',
    name: 'Marketing',
    subcategories: ['Content', 'SEO', 'Performance', 'Social Media', 'Brand']
  },
  {
    id: 'biz',
    name: 'Business',
    subcategories: ['Sales', 'Operations', 'Strategy', 'Finance', 'HR']
  }
];

const MOCK_JOBS = [
  {
    id: '1',
    title: 'Frontend Engineering Intern',
    company: 'NexusTech',
    location: 'Remote',
    workMode: 'Remote',
    type: 'Internship',
    duration: '6 Months',
    stipend: '3000',
    currency: 'USD',
    postedAt: '2 days ago',
    description: 'Work with Next.js and Tailwind CSS on enterprise-grade applications.',
    tags: ['React', 'TypeScript', 'Tailwind'],
    isVerified: true,
    applicants: 48,
    category: 'Engineering',
    logoSeed: 'nexustech-logo'
  },
  {
    id: '2',
    title: 'Product Design Intern',
    company: 'CreativeFlow',
    location: 'San Francisco, CA',
    workMode: 'On-site',
    type: 'Internship',
    duration: '3 Months',
    stipend: '4500',
    currency: 'USD',
    postedAt: '5 hours ago',
    description: 'Help us craft the future of creative tools for professional artists.',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    isVerified: true,
    applicants: 12,
    category: 'Design',
    logoSeed: 'creativeflow-logo'
  },
  {
    id: '3',
    title: 'Backend Developer (Summer)',
    company: 'FinGuard',
    location: 'New York, NY',
    workMode: 'Hybrid',
    type: 'Contract',
    duration: '12 Weeks',
    stipend: '5000',
    currency: 'USD',
    postedAt: '1 week ago',
    description: 'Build secure financial APIs using Node.js and PostgreSQL.',
    tags: ['Node.js', 'PostgreSQL', 'Security'],
    isVerified: false,
    applicants: 156,
    category: 'Engineering',
    logoSeed: 'finguard-logo'
  },
  {
    id: '4',
    title: 'Data Science Assistant',
    company: 'Insights.ai',
    location: 'Austin, TX',
    workMode: 'On-site',
    type: 'Part-time',
    duration: 'Ongoing',
    stipend: '25',
    currency: 'USD',
    rateType: 'hr',
    postedAt: '3 days ago',
    description: 'Analyze large datasets to drive business decisions for global retailers.',
    tags: ['Python', 'SQL', 'Pandas'],
    isVerified: true,
    applicants: 8,
    category: 'Engineering',
    logoSeed: 'insightsai-logo'
  },
  {
    id: '5',
    title: 'Sales Operations Coordinator',
    company: 'ScaleUp',
    location: 'Remote',
    workMode: 'Remote',
    type: 'Full-time',
    duration: 'Full-time',
    stipend: '',
    currency: 'USD',
    postedAt: '1 day ago',
    description: 'Optimize our sales processes and support the global sales team.',
    tags: ['CRM', 'Analysis', 'Strategy'],
    isVerified: true,
    applicants: 24,
    category: 'Business',
    logoSeed: 'scaleup-logo'
  }
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string[]>([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [salaryRange, setSalaryRange] = useState([0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const filteredCategories = useMemo(() => {
    if (!categorySearch) return ROLE_CATEGORIES;
    const lowerSearch = categorySearch.toLowerCase();
    return ROLE_CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(lowerSearch) ||
      cat.subcategories.some(sub => sub.toLowerCase().includes(lowerSearch))
    );
  }, [categorySearch]);

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

  const getLogo = (seedId: string) => {
    return PlaceHolderImages.find(img => img.id === seedId)?.imageUrl || `https://picsum.photos/seed/${seedId}/100/100`;
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
              Verified opportunities from innovative companies, organized for clarity and results.
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
                <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-muted-foreground h-auto p-0 hover:bg-transparent" onClick={() => {
                  setSelectedWorkMode([]);
                  setSelectedCategories([]);
                  setSelectedSubcategories([]);
                  setSalaryRange([0]);
                  setCategorySearch('');
                }}>Reset</Button>
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
                
                <Accordion type="multiple" className="w-full">
                  {filteredCategories.map((cat) => (
                    <AccordionItem key={cat.id} value={cat.id} className="border-white/5">
                      <div className="flex items-center gap-2 w-full pr-2 group">
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
                          {cat.subcategories.map(sub => (
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
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Min Stipend/Salary</Label>
                  <span className="text-xs font-black text-primary">${salaryRange[0].toLocaleString()}+</span>
                </div>
                <Slider 
                  max={10000} 
                  step={500}
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  className="py-4"
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                  <span>$0</span>
                  <span>$10k+</span>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Commitment</Label>
                <div className="grid grid-cols-1 gap-3">
                  {['Full-time', 'Part-time', 'Internship', 'Contract'].map(type => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox id={`type-${type}`} className="border-white/20" />
                      <Label htmlFor={`type-${type}`} className="text-xs font-bold cursor-pointer">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Displaying <span className="text-white font-black">{MOCK_JOBS.length}</span> curated opportunities
              </span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[160px] h-9 border-white/5 bg-transparent rounded-xl text-xs font-bold">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="newest">Latest Posted</SelectItem>
                  <SelectItem value="salary-high">Highest Stipend</SelectItem>
                  <SelectItem value="applicants-low">Least Competitive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6">
              {MOCK_JOBS.map((job) => (
                <Card key={job.id} className="glass-card hover:border-primary/40 transition-all duration-500 group relative overflow-hidden rounded-4xl">
                  {job.isVerified && (
                    <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-primary/10 rotate-45 flex items-end justify-center pb-2 pointer-events-none">
                       <CheckCircle2 className="w-4 h-4 text-primary -rotate-45" />
                    </div>
                  )}

                  <CardHeader className="flex flex-col md:flex-row items-start justify-between gap-4 p-8">
                    <div className="flex gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/80 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <Image 
                          src={getLogo(job.logoSeed)}
                          alt={job.company}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link href={`/jobs/${job.id}`}>
                            <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors cursor-pointer leading-tight">
                              {job.title}
                            </CardTitle>
                          </Link>
                          {job.isVerified && (
                            <Badge variant="outline" className="h-5 px-1.5 border-primary/20 text-primary bg-primary/5 text-[9px] font-black uppercase tracking-tighter">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="font-bold text-white/90 text-sm">{job.company}</span>
                          <span className="flex items-center gap-1.5 text-xs"><MapPin className="w-3.5 h-3.5 text-primary" /> {job.location}</span>
                          <span className="flex items-center gap-1.5 text-xs"><Briefcase className="w-3.5 h-3.5 text-primary" /> {job.workMode}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] tracking-widest px-3 py-1">
                        {job.type}
                      </Badge>
                      <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {job.duration}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-8 pb-4">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2 max-w-3xl">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map(tag => (
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
                          {job.stipend ? (
                            <>
                              <DollarSign className="w-3.5 h-3.5" />
                              <span className="text-lg">{Number(job.stipend).toLocaleString()}</span>
                              {job.rateType && <span className="text-[10px] text-muted-foreground">/{job.rateType}</span>}
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Competitive</span>
                          )}
                        </div>
                      </div>
                      <div className="h-8 w-px bg-white/5 hidden sm:block" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Applicants</span>
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm">{job.applicants || 0}</span>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-white/5 hidden sm:block" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Posted</span>
                        <div className="flex items-center gap-1.5 font-bold text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-sm">{job.postedAt}</span>
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

            <div className="pt-12 flex justify-center">
              <Button variant="outline" className="border-white/10 text-muted-foreground font-bold hover:bg-white/5 px-12 h-12 rounded-2xl">
                Discover More Opportunities
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
