import { useState } from 'react';
import { Link } from 'wouter';
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useSubscribeNewsletter } from '@workspace/api-client-react';
import { siteConfig } from '@/config/site';

export function Footer() {
  const { toast } = useToast();
  const subscribe = useSubscribeNewsletter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    subscribe.mutate({ data: { fullName: fullName.trim(), email: email.trim() } }, {
      onSuccess: () => {
        toast({ title: 'Subscribed', description: 'Thank you. You will hear from us soon.' });
        setFullName(''); setEmail(''); setAgreed(false);
      },
      onError: (err) => {
        const already = (err as { status?: number })?.status === 409;
        toast({
          title: already ? 'Already subscribed' : 'Could not subscribe',
          description: already ? 'That email is already on our list.' : 'Please check your details and try again.',
          variant: already ? 'default' : 'destructive',
        });
      },
    });
  };

  return (
    <footer className="bg-emerald-950 text-emerald-50 pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <img src="/logo.svg" alt="Kifalah Foundation Logo" className="h-8 w-8" />
              </div>
              <span className="font-bold text-xl text-white">Kifalah Foundation</span>
            </Link>
            <p className="text-emerald-100/80 text-sm leading-relaxed mt-4">
              Dedicated to improving lives through education, economic empowerment, social welfare, humanitarian assistance, and sustainable livelihood programmes in Ghana.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="h-10 w-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-emerald-100/80 hover:text-amber-400 transition-colors">About Us</Link></li>
              <li><Link href="/programmes" className="text-emerald-100/80 hover:text-amber-400 transition-colors">Our Programmes</Link></li>
              <li><Link href="/impact" className="text-emerald-100/80 hover:text-amber-400 transition-colors">Our Impact</Link></li>
              <li><Link href="/news" className="text-emerald-100/80 hover:text-amber-400 transition-colors">News & Stories</Link></li>
              <li><Link href="/transparency" className="text-emerald-100/80 hover:text-amber-400 transition-colors">Transparency & Reports</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              {siteConfig.contact.address.length > 0 && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-emerald-100/80 text-sm">
                    {siteConfig.contact.address.map((line, i) => (<span key={i}>{line}<br /></span>))}
                  </span>
                </li>
              )}
              {siteConfig.contact.phones.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-amber-500 shrink-0" />
                  <span className="text-emerald-100/80 text-sm">{p}</span>
                </li>
              ))}
              {siteConfig.contact.emails.map((m) => (
                <li key={m} className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-amber-500 shrink-0" />
                  <span className="text-emerald-100/80 text-sm">{m}</span>
                </li>
              ))}
              {!siteConfig.contact.address.length && !siteConfig.contact.phones.length && !siteConfig.contact.emails.length && (
                <li className="text-emerald-100/80 text-sm">
                  Reach us through the <Link href="/contact" className="underline">contact form</Link>.
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Newsletter</h3>
            <p className="text-emerald-100/80 text-sm mb-4">
              Subscribe to get the latest updates on our programmes and impact.
            </p>
            <form className="flex flex-col gap-3" onSubmit={onSubscribe}>
              <Input
                aria-label="Your name"
                required
                minLength={2}
                autoComplete="name"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-emerald-900 border-emerald-800 text-white placeholder:text-emerald-100/50 focus-visible:ring-amber-500"
              />
              <Input
                aria-label="Email address"
                type="email"
                required
                autoComplete="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-emerald-900 border-emerald-800 text-white placeholder:text-emerald-100/50 focus-visible:ring-amber-500"
              />
              <label className="flex items-start gap-2 text-xs text-emerald-100/70">
                <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5 border-emerald-100/60" />
                <span>
                  I agree to receive updates and to the <Link href="/privacy" className="underline">Privacy Notice</Link>.
                </span>
              </label>
              <Button disabled={!agreed || subscribe.isPending} className="w-full bg-amber-500 hover:bg-amber-600 text-white border-0 disabled:opacity-60">
                {subscribe.isPending ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-emerald-900 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-emerald-100/60 text-sm">
            © {new Date().getFullYear()} Kifalah Foundation Ghana. All rights reserved.{' '}
            <Link href="/privacy" className="underline">Privacy Notice</Link>
          </p>
          <div className="flex items-center gap-1 text-emerald-100/60 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-amber-500" />
            <span>for Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}