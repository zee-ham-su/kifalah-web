import { usePageMeta } from '@/lib/usePageMeta';
import { Link } from 'wouter';

export function Privacy() {
  usePageMeta("Privacy Notice", "How Kifalah Foundation Ghana collects and uses your information.");
  return (
    <div className="flex flex-col w-full bg-white pb-24">
      <section className="bg-emerald-950 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white">Privacy Notice</h1>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-6 text-gray-700 leading-relaxed">
          <p>
            Kifalah Foundation Ghana ("the Foundation") respects your privacy. This notice explains what we collect through this
            website, why, and the choices you have. It is written with Ghana's Data Protection Act, 2012 (Act 843) in mind.
          </p>
          <h2 className="text-xl font-bold text-emerald-950">What we collect</h2>
          <p>
            Only what you type into our forms: your name, email address, phone number (where asked), your message, and, depending on the
            form, details such as your skills and availability (volunteers), your organisation (partners), or the support you would like to
            offer (pledges). We keep the pages of this site light and do not ask for more than we need.
          </p>
          <h2 className="text-xl font-bold text-emerald-950">Why we collect it</h2>
          <p>
            To reply to you, to follow up on your volunteer, partnership or pledge enquiry, and, if you subscribe, to send you updates about
            our work. We do not sell your details.
          </p>
          <h2 className="text-xl font-bold text-emerald-950">No payments on this website</h2>
          <p>
            This website does not process payments and never asks for card or Mobile Money PINs. The pledge form only records your
            intention to give. Please give only to the official accounts listed on the <Link href="/support-us" className="text-emerald-700 underline">Support Us</Link> page.
          </p>
          <h2 className="text-xl font-bold text-emerald-950">Who can see it</h2>
          <p>
            Authorised Foundation staff. We use trusted service providers to host the website and send email, who may process your details
            on our behalf.
          </p>
          <h2 className="text-xl font-bold text-emerald-950">How long we keep it</h2>
          <p>Only for as long as needed for the purposes above and for the Foundation's record-keeping.</p>
          <h2 className="text-xl font-bold text-emerald-950">Your rights</h2>
          <p>
            You may ask to see, correct or delete the information we hold about you, or to stop receiving our updates, at any time. Use the
            details on our <Link href="/contact" className="text-emerald-700 underline">Contact</Link> page.
          </p>
        </div>
      </section>
    </div>
  );
}
