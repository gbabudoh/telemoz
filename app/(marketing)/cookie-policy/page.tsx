import { Cookie, ArrowLeft, Mail, LifeBuoy } from "lucide-react";
import Link from "next/link";

type SectionContent = {
  subtitle?: string;
  text: string;
};

type Section = {
  id: string;
  title: string;
  content: SectionContent[];
};

const sections: Section[] = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies",
    content: [
      {
        text: "Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.",
      },
    ],
  },
  {
    id: "how-we-use-cookies",
    title: "2. How We Use Cookies",
    content: [
      {
        subtitle: "2.1 Essential Cookies",
        text: "These cookies are necessary for the platform to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.",
      },
      {
        subtitle: "2.2 Analytics Cookies",
        text: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.",
      },
      {
        subtitle: "2.3 Functional Cookies",
        text: "These cookies enable the platform to provide enhanced functionality and personalisation. They may be set by us or by third party providers whose services we have added to our pages.",
      },
      {
        subtitle: "2.4 Targeting Cookies",
        text: "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.",
      },
    ],
  },
  {
    id: "third-party-cookies",
    title: "3. Third-Party Cookies",
    content: [
      {
        text: "In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.",
      },
      {
        subtitle: "3.1 Google Analytics",
        text: "This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience.",
      },
      {
        subtitle: "3.2 Payment Processors",
        text: "We use Stripe for payment processing. Stripe may use cookies to help us process payments and prevent fraud.",
      },
    ],
  },
  {
    id: "managing-cookies",
    title: "4. Managing Cookies",
    content: [
      {
        text: "Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org or www.allaboutcookies.org.",
      },
      {
        text: "Please note that if you choose to block or delete cookies, you may not be able to access some of the services or features on the Telemoz platform.",
      },
    ],
  },
  {
    id: "changes-to-policy",
    title: "5. Changes to This Cookie Policy",
    content: [
      {
        text: "We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons.",
      },
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-6xl px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md hover:bg-white/80 transition-all group text-sm font-medium text-gray-700 mb-10"
        >
          <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-[#0a9396] group-hover:-translate-x-0.5 transition-all" />
          Back to Home
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <aside className="hidden lg:block w-64 shrink-0 sticky top-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contents</p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-gray-500 hover:text-[#0a9396] hover:translate-x-0.5 transition-all py-1 leading-snug"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm p-8 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-linear-to-br from-[#0a9396] to-[#6ece39] flex items-center justify-center shrink-0">
                  <Cookie className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Last updated: January 2025</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                This Cookie Policy explains how Telemoz uses cookies and similar technologies to recognise you when you visit our platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm divide-y divide-gray-100">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="p-8 scroll-mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">{section.title}</h2>
                  <div className="space-y-5">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        {item.subtitle && (
                          <h3 className="text-base font-semibold text-gray-800 mb-2">{item.subtitle}</h3>
                        )}
                        <p className="text-gray-600 leading-relaxed text-sm">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-linear-to-br from-[#0a9396]/8 to-[#6ece39]/8 border border-[#0a9396]/20 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need more information?</h3>
              <p className="text-gray-600 text-sm mb-5">
                If you have any questions about our use of cookies or other technologies, please email us.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:privacy@telemoz.com"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#0a9396] hover:text-[#0a9396] transition-all"
                >
                  <Mail className="h-4 w-4 text-[#0a9396]" />
                  privacy@telemoz.com
                </a>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#0a9396] hover:text-[#0a9396] transition-all"
                >
                  <LifeBuoy className="h-4 w-4 text-[#0a9396]" />
                  Visit Support Centre
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
