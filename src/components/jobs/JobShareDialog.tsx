
"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Facebook, Linkedin, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  jobUrl: string;
}

export function JobShareDialog({ isOpen, onOpenChange, jobTitle, jobUrl }: JobShareDialogProps) {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(jobUrl);
    toast({
      title: "Link Copied",
      description: "Opportunity URL copied to clipboard.",
    });
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      href: `https://wa.me/?text=${encodeURIComponent(`Check out this job: ${jobTitle} at ${jobUrl}`)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-600",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-500",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`,
    },
    {
      name: "Twitter",
      icon: Send,
      color: "bg-sky-400",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this job: ${jobTitle}`)}&url=${encodeURIComponent(jobUrl)}`,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Share Opportunity</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Spread the word about this opening at Konnex.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 py-6">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${link.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <link.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors">
                {link.name}
              </span>
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-2 pt-4 border-t border-white/5">
          <div className="grid flex-1 gap-2">
            <Input
              readOnly
              value={jobUrl}
              className="bg-white/5 border-white/10 h-11 text-xs"
            />
          </div>
          <Button onClick={handleCopyLink} size="icon" className="h-11 w-11 rounded-xl gold-border-glow">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
