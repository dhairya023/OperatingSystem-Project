
'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

type ShareDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  shareUrl: string;
  title: string;
  description: string;
};

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

const MessageSquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);


export function ShareDialog({ isOpen, onOpenChange, shareUrl, title, description }: ShareDialogProps) {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const shareData = {
    title: 'Grad Timetable',
    text: 'Check out my timetable on Grad!',
    url: shareUrl,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: 'Copied!', description: 'Link copied to clipboard.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to copy', description: 'Could not copy link to clipboard.' });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // This error can happen if the user cancels the share sheet.
        // We can safely ignore it.
        console.log('Share cancelled or failed:', error);
      }
    } else {
        toast({ variant: 'destructive', title: 'Not Supported', description: 'Web Share API is not supported in your browser.' });
    }
  };
  
  const encodedShareText = encodeURIComponent(`${shareData.text} ${shareData.url}`);

  const canShare = isClient && !!navigator.share;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="share-link">Share Link</Label>
                <div className="flex gap-2">
                    <Input id="share-link" value={shareUrl} readOnly />
                    <Button variant="outline" size="icon" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {canShare ? (
                 <Button className="w-full" onClick={handleNativeShare}>
                    <Share2 className="mr-2" /> Share via...
                </Button>
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" asChild>
                        <a href={`https://wa.me/?text=${encodedShareText}`} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon /> WhatsApp
                        </a>
                    </Button>
                     <Button variant="outline" asChild>
                        <a href={`sms:?body=${encodedShareText}`}>
                           <MessageSquareIcon /> SMS
                        </a>
                    </Button>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
