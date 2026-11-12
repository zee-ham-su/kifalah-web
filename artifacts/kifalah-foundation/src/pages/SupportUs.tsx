import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'wouter';
import { Landmark, Smartphone, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateDonationRecord, useListProgrammes } from '@workspace/api-client-react';
import { ConsentField } from '@/components/ConsentField';
import { siteConfig, hasBankDetails } from '@/config/site';

// Required wording (PRD section 5). Do not paraphrase.
export const NO_PAYMENT_NOTICE =
  'This form does not process payment. Please give only to the official accounts listed on this page.';

const pledgeSchema = z
  .object({
    donorName: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    currency: z.string().min(1),
    amount: z.string().optional(),
    inKindSupport: z.string().optional(),
    programme: z.string().optional(),
    message: z.string().optional(),
    consent: z.boolean().refine((v) => v, 'Please tick the box to continue'),
  })
  .superRefine((v, ctx) => {
    const amount = Number(v.amount);
    const hasAmount = v.amount?.trim() !== '' && v.amount !== undefined && Number.isFinite(amount) && amount > 0;
    const hasInKind = Boolean(v.inKindSupport?.trim());
    if (!hasAmount && !hasInKind) {
      ctx.addIssue({ code: 'custom', path: ['amount'], message: 'Enter an amount, or describe the support you would like to give' });
    }
  });

type PledgeForm = z.infer<typeof pledgeSchema>;

export function SupportUs() {
  const { toast } = useToast();
  const createPledge = useCreateDonationRecord();
  const { data: programmes } = useListProgrammes();
  const [done, setDone] = useState(false);

  const form = useForm<PledgeForm>({
    resolver: zodResolver(pledgeSchema),
    defaultValues: {
      donorName: '', email: '', phone: '', currency: 'GHS', amount: '', inKindSupport: '',
      programme: 'general', message: '', consent: false,
    },
  });

  const onSubmit = ({ consent: _consent, amount, ...rest }: PledgeForm) => {
    const n = Number(amount);
    createPledge.mutate(
      { data: { ...rest, amount: Number.isFinite(n) && n > 0 ? n : undefined } },
      {
        onSuccess: () => {
          setDone(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onError: () =>
          toast({
            title: 'Could not record your pledge',
            description: 'Please check your details and try again in a few minutes.',
            variant: 'destructive',
          }),
      },
    );
  };

  const { bank, mobileMoney } = siteConfig.giving;

  return (
    <div className="flex flex-col w-full bg-gray-50 pb-24">
      <section className="bg-emerald-950 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Support Our Work</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Your support helps us reach more communities across Ghana. Here is how to give, and how to let us know.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          {/* The required notice sits at the top, before any account details. */}
          <div role="note" className="flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
            <ShieldAlert className="h-6 w-6 shrink-0 mt-0.5" />
            <p className="font-semibold">{NO_PAYMENT_NOTICE}</p>
          </div>

          {/* Ways to give */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-emerald-950 mb-2">Ways to give</h2>
            <p className="text-gray-600 mb-6">
              Please confirm these details with the Foundation before making a large gift.
            </p>

            {hasBankDetails() || mobileMoney.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {hasBankDetails() && (
                  <div className="rounded-2xl border border-gray-200 p-5">
                    <div className="mb-3 flex items-center gap-2 font-bold text-emerald-900"><Landmark className="h-5 w-5" /> Bank transfer</div>
                    <dl className="space-y-1 text-sm text-gray-700">
                      <div><dt className="inline font-medium">Account name: </dt><dd className="inline">{bank.accountName}</dd></div>
                      <div><dt className="inline font-medium">Bank: </dt><dd className="inline">{bank.bankName}</dd></div>
                      <div><dt className="inline font-medium">Account number: </dt><dd className="inline">{bank.accountNumber}</dd></div>
                      {bank.branch && <div><dt className="inline font-medium">Branch: </dt><dd className="inline">{bank.branch}</dd></div>}
                    </dl>
                  </div>
                )}
                {mobileMoney.map((m) => (
                  <div key={`${m.network}-${m.number}`} className="rounded-2xl border border-gray-200 p-5">
                    <div className="mb-3 flex items-center gap-2 font-bold text-emerald-900"><Smartphone className="h-5 w-5" /> {m.network}</div>
                    <dl className="space-y-1 text-sm text-gray-700">
                      <div><dt className="inline font-medium">Number: </dt><dd className="inline">{m.number}</dd></div>
                      <div><dt className="inline font-medium">Account name: </dt><dd className="inline">{m.accountName}</dd></div>
                    </dl>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-gray-50 p-5 text-gray-700">
                Our official bank and Mobile Money details will be published here. Until then, please{' '}
                <Link href="/contact" className="font-medium text-emerald-700 underline">contact us</Link> to confirm how to give.
              </p>
            )}
          </div>

          {/* Pledge */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10 shadow-sm">
            {done ? (
              <div className="text-center py-6">
                <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-600" />
                <h2 className="text-2xl font-bold text-emerald-950 mb-3">Thank you</h2>
                <p className="text-gray-700 max-w-md mx-auto">
                  We have recorded your pledge. Our team will reach out to you, and we will share a receipt after your gift is received.
                </p>
                <p className="mt-4 text-sm text-gray-500">{NO_PAYMENT_NOTICE}</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-emerald-950 mb-2">Let us know you plan to give (optional)</h2>
                <p className="text-gray-600 mb-6">
                  This helps our team follow up and thank you. {NO_PAYMENT_NOTICE}
                </p>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="donorName" render={({ field }) => (
                        <FormItem><FormLabel>Full name</FormLabel><FormControl><Input autoComplete="name" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email address</FormLabel><FormControl><Input type="email" autoComplete="email" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone number (optional)</FormLabel><FormControl><Input type="tel" autoComplete="tel" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField control={form.control} name="currency" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              {['GHS', 'USD', 'GBP', 'EUR'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Amount you plan to give</FormLabel>
                          <FormControl><Input type="number" min="0" inputMode="decimal" placeholder="e.g. 200" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="inKindSupport" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Or the support you would like to offer (optional)</FormLabel>
                        <FormControl><Textarea rows={3} placeholder="For example: books, equipment, professional time, a venue..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="programme" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Programme of interest</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="general">Wherever the need is greatest</SelectItem>
                            {programmes?.map((p) => <SelectItem key={p.slug} value={p.slug}>{p.title}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (optional)</FormLabel>
                        <FormControl><Textarea rows={3} {...field} /></FormControl>
                      </FormItem>
                    )} />

                    <ConsentField control={form.control} />

                    <Button type="submit" className="w-full h-12 text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl" disabled={createPledge.isPending}>
                      {createPledge.isPending ? 'Sending...' : 'Record my pledge'}
                    </Button>
                    <p className="text-center text-sm text-gray-500">{NO_PAYMENT_NOTICE}</p>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
