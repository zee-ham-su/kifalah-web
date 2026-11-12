import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ConsentField } from '@/components/ConsentField';
import { useSubmitVolunteerApplication, useSubmitPartnershipEnquiry } from '@workspace/api-client-react';

const volunteerSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(5, 'Phone is required'),
  location: z.string().min(2, 'Location is required'),
  skills: z.string().min(2, 'Skills required'),
  areaOfInterest: z.string().min(2, 'Area of interest required'),
  availability: z.string().min(2, 'Availability required'),
  motivation: z.string().min(10, 'Motivation required'),
  consent: z.boolean().refine((v) => v, 'Please tick the box to continue'),
});

const partnershipSchema = z.object({
  organisationName: z.string().min(2, 'Organisation name required'),
  contactName: z.string().min(2, 'Contact name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  organisationType: z.string().min(2, 'Type required'),
  website: z.string().optional(),
  message: z.string().min(10, 'Message required'),
  consent: z.boolean().refine((v) => v, 'Please tick the box to continue'),
});

export function GetInvolved() {
  const { toast } = useToast();
  const submitVolunteer = useSubmitVolunteerApplication();
  const submitPartner = useSubmitPartnershipEnquiry();

  const volForm = useForm<z.infer<typeof volunteerSchema>>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      fullName: '', email: '', phone: '', location: '', skills: '', areaOfInterest: '', availability: '', motivation: '', consent: false
    }
  });

  const partForm = useForm<z.infer<typeof partnershipSchema>>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: {
      organisationName: '', contactName: '', email: '', phone: '', organisationType: '', website: '', message: '', consent: false
    }
  });

  const onVolSubmit = (values: z.infer<typeof volunteerSchema>) => {
    const { consent: _c, ...data } = values;
    submitVolunteer.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Application Submitted", description: "Thank you for volunteering! We will contact you soon." });
        volForm.reset();
      },
      onError: () => toast({ title: "Could not submit", description: "Please check your details and try again in a few minutes.", variant: "destructive" }),
    });
  };

  const onPartSubmit = (values: z.infer<typeof partnershipSchema>) => {
    const { consent: _c, ...data } = values;
    submitPartner.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Enquiry Submitted", description: "Thank you for your interest in partnering with us." });
        partForm.reset();
      },
      onError: () => toast({ title: "Could not submit", description: "Please check your details and try again in a few minutes.", variant: "destructive" }),
    });
  };

  return (
    <div className="flex flex-col w-full bg-white pb-24">
      <section className="bg-emerald-950 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Get Involved</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Join our mission to empower communities and transform lives in Ghana.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Tabs defaultValue="volunteer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100 rounded-xl mb-8 p-1">
              <TabsTrigger value="volunteer" className="rounded-lg text-lg data-[state=active]:bg-white data-[state=active]:text-emerald-800">Volunteer</TabsTrigger>
              <TabsTrigger value="partner" className="rounded-lg text-lg data-[state=active]:bg-white data-[state=active]:text-emerald-800">Partner With Us</TabsTrigger>
            </TabsList>

            <TabsContent value="volunteer" className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-emerald-950 mb-2">Volunteer Application</h2>
                <p className="text-gray-600 mb-8">Share your time and skills to make a direct impact.</p>
              </div>
              
              <Form {...volForm}>
                <form onSubmit={volForm.handleSubmit(onVolSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={volForm.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={volForm.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={volForm.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={volForm.control} name="location" render={({ field }) => (
                      <FormItem><FormLabel>Location / City</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={volForm.control} name="skills" render={({ field }) => (
                      <FormItem><FormLabel>Key Skills</FormLabel><FormControl><Input className="bg-white" placeholder="e.g. Teaching, Coding, Medical" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={volForm.control} name="areaOfInterest" render={({ field }) => (
                      <FormItem><FormLabel>Area of Interest</FormLabel><FormControl><Input className="bg-white" placeholder="Which programme?" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={volForm.control} name="availability" render={({ field }) => (
                    <FormItem><FormLabel>Availability</FormLabel><FormControl><Input className="bg-white" placeholder="e.g. Weekends, Full-time" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={volForm.control} name="motivation" render={({ field }) => (
                    <FormItem><FormLabel>Why do you want to volunteer with us?</FormLabel><FormControl><Textarea className="bg-white min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <ConsentField control={volForm.control} />
                  <Button type="submit" className="w-full h-12 text-lg bg-emerald-700 hover:bg-emerald-800 text-white" disabled={submitVolunteer.isPending}>
                    {submitVolunteer.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="partner" className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-emerald-950 mb-2">Partnership Enquiry</h2>
                <p className="text-gray-600 mb-8">Corporate, NGO, or institutional partnerships.</p>
              </div>
              <Form {...partForm}>
                <form onSubmit={partForm.handleSubmit(onPartSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={partForm.control} name="organisationName" render={({ field }) => (
                      <FormItem><FormLabel>Organisation Name</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={partForm.control} name="contactName" render={({ field }) => (
                      <FormItem><FormLabel>Contact Person</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={partForm.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={partForm.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={partForm.control} name="organisationType" render={({ field }) => (
                      <FormItem><FormLabel>Organisation Type</FormLabel><FormControl><Input className="bg-white" placeholder="e.g. Corporate, NGO" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={partForm.control} name="website" render={({ field }) => (
                      <FormItem><FormLabel>Website URL</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={partForm.control} name="message" render={({ field }) => (
                    <FormItem><FormLabel>How would you like to partner?</FormLabel><FormControl><Textarea className="bg-white min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <ConsentField control={partForm.control} />
                  <Button type="submit" className="w-full h-12 text-lg bg-emerald-700 hover:bg-emerald-800 text-white" disabled={submitPartner.isPending}>
                    {submitPartner.isPending ? "Submitting..." : "Submit Enquiry"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}