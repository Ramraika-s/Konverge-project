
"use client";

import { useState } from 'react';
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
  ChevronRight
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

// Mock Data
const MOCK_JOBS = [
  {
    id: '1',
    title: 'Frontend Engineering Intern',
    company: 'NexusTech',
    location: 'Remote',
    type: 'Internship',
    stipend: '$3,000/mo',
    postedAt: '2 days ago',
    description: 'Work with Next.js and Tailwind CSS on enterprise-grade applications.',
    tags: ['React', 'TypeScript', 'Tailwind']
  },
  {
    id: '2',
    title: 'Product Design Intern',
    company: 'CreativeFlow',
    location: 'San Francisco, CA',
    type: 'Internship',
    stipend: '$4,500/mo',
    postedAt: '5 hours ago',
    description: 'Help us craft the future of creative tools for professional artists.',
    tags: ['Figma', 'UI/UX', 'Prototyping']
  },
  {
    id: '3',
    title: 'Backend Developer (Summer)',
    company: 'FinGuard',
    location: 'New York, NY',
    type: 'Contract',
    stipend: '$5,000/mo',
    postedAt: '1 week ago',
    description: 'Build secure financial APIs using Node.js and PostgreSQL.',
    tags: ['Node.js', 'PostgreSQL', 'Security']
  },
  {
    id: '4',
    title: 'Data Science Assistant',
    company: 'Insights.ai',
    location: 'Austin, TX',
    type: 'Part-time',
    stipend: '$25/hr',
    postedAt: '3 days ago',
    description: 'Analyze large datasets to drive business decisions for global retailers.',
    tags: ['Python', 'SQL', 'Pandas']
  }
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-10">
        {/* Search Header */}
        <div className="max-w-4xl">
          <h1 className="text-4xl font-black mb-4">Find Your Next <span className="text-primary gold-glow">Career Move</span></h1>
          <p className="text-muted-foreground text-lg mb-8">Browse thousands of opportunities on Konnex from top companies looking for job seeker talent.</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search job titles, companies, or keywords..." 
                className="pl-10 h-12 bg-card border-white/5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[200px] h-12 bg-card border-white/5">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <Button size="lg" className="h-12 px-8 gold-border-glow">Search</Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside className="space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Role Category</label>
                  <div className="space-y-2">
                    {['Engineering', 'Design', 'Marketing', 'Business', 'Content'].map((cat) => (
                      <div key={cat} className="flex items-center gap-2">
                        <input type="checkbox" id={cat} className="w-4 h-4 rounded border-white/10 bg-card text-primary" />
                        <label htmlFor={cat} className="text-sm text-muted-foreground cursor-pointer">{cat}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Job Type</label>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Internship', 'Contract'].map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <input type="checkbox" id={type} className="w-4 h-4 rounded border-white/10 bg-card text-primary" />
                        <label htmlFor={type} className="text-sm text-muted-foreground cursor-pointer">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Salary Range</label>
                  <div className="space-y-2">
                    {['$0 - $2,000', '$2,000 - $5,000', '$5,000+'].map((sal) => (
                      <div key={sal} className="flex items-center gap-2">
                        <input type="radio" name="salary" id={sal} className="w-4 h-4 border-white/10 bg-card text-primary" />
                        <label htmlFor={sal} className="text-sm text-muted-foreground cursor-pointer">{sal}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Jobs List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Showing results for your search</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px] h-9 border-none bg-transparent">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                  <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {MOCK_JOBS.map((job) => (
                <Card key={job.id} className="glass-card hover:border-primary/40 transition-all duration-300 group">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center border border-white/5 overflow-hidden">
                        <Image 
                          src={`https://picsum.photos/seed/${job.company}/100/100`}
                          alt={job.company}
                          width={48}
                          height={48}
                          className="object-cover"
                          data-ai-hint="company logo"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-3">
                          <span className="font-semibold text-white/80">{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{job.type}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-white/5 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-bold text-primary"><DollarSign className="w-3 h-3" /> {job.stipend}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Posted {job.postedAt}</span>
                    </div>
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm" className="group/btn gap-1 text-xs font-bold">
                        View Details <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="pt-8 flex justify-center">
              <Button variant="outline" className="border-white/10 text-muted-foreground">Load More Opportunities</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
