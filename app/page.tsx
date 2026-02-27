"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Zap,
  BarChart3,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useSession } from "next-auth/react";

// Marketing Header Component
function MarketingHeader() {
  const { data: session } = useSession();
  const userType = session?.user?.userType as string;
  const logoHref = userType ? `/${userType}` : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/60 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href={logoHref} className="flex items-center gap-2 cursor-pointer">
            <Image 
              src="/logos/telemoz.png" 
              alt="Telemoz" 
              width={120}
              height={40}
              priority
              quality={100}
              className="h-10 w-auto object-contain"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-[#0a9396] transition-colors font-medium cursor-pointer">
              Home
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-[#0a9396] transition-colors font-medium cursor-pointer">
              How it Works
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#0a9396] transition-colors font-medium cursor-pointer">
              About
            </Link>
            <Link href="/marketplace" className="text-gray-700 hover:text-[#0a9396] transition-colors font-medium cursor-pointer">
              Marketplace
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <Link className="cursor-pointer" href={logoHref}>
                <Button size="sm" className="bg-[#0a9396] hover:bg-[#087579] text-white shadow-lg shadow-[#0a9396]/20 hover:shadow-[#0a9396]/40 hover:-translate-y-0.5 transition-all rounded-full px-6 cursor-pointer">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link className="cursor-pointer" href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#0a9396] hover:bg-[#0a9396]/5 transition-all rounded-full px-4 cursor-pointer">Log in</Button>
                </Link>
                <Link className="cursor-pointer" href="/register">
                  <Button size="sm" className="bg-[#0a9396] hover:bg-[#087579] text-white shadow-lg shadow-[#0a9396]/20 hover:shadow-[#0a9396]/40 hover:-translate-y-0.5 transition-all rounded-full px-6 cursor-pointer">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Marketing Footer Component
function MarketingFooter() {
  return (
    <footer className="border-t border-white/20 bg-white/40 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0a9396]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto max-w-7xl px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/logos/telemoz.png" 
                alt="Telemoz" 
                width={120}
                height={40}
                quality={100}
                className="h-10 w-auto object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
            <p className="text-gray-700 text-sm">
              The All-in-One Professional Hub for Digital Marketing Success
            </p>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-bold mb-6 tracking-tight">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/how-it-works" className="text-gray-600 hover:text-[#0a9396] hover:translate-x-1 transition-all inline-block cursor-pointer">How it Works</Link></li>
              <li><Link href="/marketplace" className="text-gray-600 hover:text-[#0a9396] hover:translate-x-1 transition-all inline-block cursor-pointer">Marketplace</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-[#0a9396] hover:translate-x-1 transition-all inline-block cursor-pointer">About</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold mb-6 tracking-tight">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/documentation" className="text-gray-600 hover:text-[#0a9396] hover:translate-x-1 transition-all inline-block cursor-pointer">Documentation</Link></li>
              <li><Link href="/support" className="text-gray-600 hover:text-[#0a9396] hover:translate-x-1 transition-all inline-block cursor-pointer">Support</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-[#0a9396] hover:translate-x-1 transition-all inline-block cursor-pointer">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold mb-6 tracking-tight">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="text-gray-600 hover:text-[#0a9396] hover:translate-x-1 transition-all inline-block cursor-pointer">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-[#0a9396] hover:translate-x-1 transition-all inline-block cursor-pointer">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[#a8a9ad]/20 text-center text-sm text-gray-700">
          <p>&copy; 2025 Telemoz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const features = [
  {
    icon: Zap,
    title: "AI-Powered Tools",
    description: "Leverage cutting-edge AI for SEO analysis, ad copy generation, and content optimization.",
  },
  {
    icon: BarChart3,
    title: "White-Label Reporting",
    description: "Automated, branded reports that showcase your value with aggregated analytics from all channels.",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Complete CRM, invoicing, and project management tools built specifically for digital marketers.",
  },
  {
    icon: Shield,
    title: "Trusted Marketplace",
    description: "Connect with verified professionals and clients in a secure, transparent environment.",
  },
];


export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  // Scroll tracking for Marketplace section
  const marketplaceRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: marketplaceRef,
    offset: ["start center", "end center"]
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#a8a9ad]/5 to-[#e0e1dd]">
      <MarketingHeader />
      
      <main className="flex-1">
      {/* Hero Section V2 (Split Layout with Image) */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 lg:pt-32 lg:pb-32 flex items-center min-h-[90vh]">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0a9396]/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#94d2bd]/20 blur-[120px]" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content (Text & CTAs) */}
            <motion.div 
              className="text-left"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-[#0a9396]/30 bg-[#0a9396]/10 px-4 py-2 mb-8 shadow-sm">
                <Sparkles className="h-4 w-4 text-[#0a9396] cursor-pointer" />
                <span className="text-sm text-[#0a9396] font-medium">Enterprise-Grade Digital Marketing Platform</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
                Your Digital <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a9396] to-[#005f73]">Marketing Hub</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-10 leading-relaxed font-light max-w-xl">
                The All-in-One Professional Hub for Digital Marketing Success and Seamless Client-Agency Collaboration.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link className="cursor-pointer" href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-[#0a9396] hover:bg-[#087579] text-white shadow-xl shadow-[#0a9396]/20 hover:shadow-[#0a9396]/40 hover:-translate-y-1 transition-all rounded-full px-8 h-14 text-base font-semibold cursor-pointer">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 cursor-pointer" />
                  </Button>
                </Link>
                <Link className="cursor-pointer" href="/marketplace">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 hover:border-[#0a9396] hover:text-[#0a9396] hover:bg-transparent shadow-sm hover:shadow-md hover:-translate-y-1 transition-all rounded-full px-8 h-14 text-base font-semibold cursor-pointer">
                    Browse Marketplace
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content (Floating Mockup) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
                className="relative z-10 w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 bg-white/50 backdrop-blur-sm p-2"
              >
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden">
                   <Image 
                     src="/images/mockups/dashboard.png" 
                     alt="Telemoz Dashboard Mockup" 
                     fill 
                     className="object-cover" 
                     priority
                   />
                   {/* Gradient overlay for blending */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 mix-blend-overlay" />
                </div>
              </motion.div>
              
              {/* Decorative background elements behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#0a9396]/10 to-transparent rounded-full blur-3xl -z-10" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 text-lg">
              Powerful tools and features designed for modern digital marketing professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[minmax(300px,auto)]">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isLarge = i === 0 || i === 3;
              
              return (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
                  className={`${isLarge ? 'md:col-span-2' : 'md:col-span-1'} group perspective-1000 h-full`}
                >
                  <Card className="h-full w-full flex flex-col justify-end p-8 border border-white/40 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(10,147,150,0.15)] transition-all duration-500 overflow-hidden relative group-hover:bg-white/80">
                    
                    {/* Background Asset for Large Cards */}
                    {isLarge && (
                      <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 mix-blend-multiply">
                        <Image 
                          src="/images/mockups/collaboration.png" 
                          alt="Collaboration Abstract" 
                          fill 
                          className="object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                      </div>
                    )}

                    {/* Default Top-Right Gradient Accent */}
                    {!isLarge && (
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#0a9396]/10 to-transparent rounded-bl-[100px] -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />
                    )}

                    <div className="relative z-10 w-full h-full flex flex-col justify-end">
                      
                      {/* Interactive Reveal Area (Slides up) */}
                      <div className="transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:translate-y-12 group-hover:translate-y-0">
                        <div className="rounded-2xl bg-white/80 shadow-sm backdrop-blur-md p-4 w-fit mb-6 ring-1 ring-[#0a9396]/20 group-hover:bg-[#0a9396]/10 group-hover:ring-[#0a9396]/40 transition-all">
                          <Icon className={`h-8 w-8 transition-colors duration-300 ${isLarge ? 'text-[#0a9396]' : 'text-gray-700 group-hover:text-[#0a9396]'} cursor-pointer`} />
                        </div>
                        
                        <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight drop-shadow-sm">{feature.title}</h3>
                        
                        {/* Hidden Description that fades and slides up */}
                        <div className="overflow-hidden md:h-0 md:opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 md:mt-0 group-hover:mt-4">
                          <p className="text-gray-600 leading-relaxed text-lg bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/60">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="px-6 py-20 bg-white/50">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="text-center mb-8">
                <Badge variant="success" size="lg" className="bg-[#0a9396] text-white mb-4">
                  FREE TO USE
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Digital Marketplace - Completely Free
                </h2>
                <p className="text-gray-700 text-lg mb-6">
                  The digital marketplace is completely free to use for digital marketing professionals 
                  and clients/businesses looking for digital marketing services.
                </p>
                <p className="text-gray-700 font-semibold">
                  No sign-up fees, no hidden costs. Telemoz charges a <span className="text-[#0a9396]">10% commission</span> only 
                  from the payment the digital marketing professional receives upon job completion.
                </p>
              </div>

              <div className="border-t border-white/20 pt-16 mt-8" ref={marketplaceRef}>
                <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center tracking-tight">How It Works</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  
                  {/* Left Side: Scrolling Steps */}
                  <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-1 before:bg-gray-100 before:rounded-full pt-4 pb-32">
                    
                    {/* Animated Progress Line */}
                    <motion.div 
                      className="absolute top-4 bottom-32 left-6 w-1 bg-gradient-to-b from-[#0a9396] to-[#94d2bd] rounded-full -translate-x-px origin-top"
                      style={{ scaleY: scrollYProgress }}
                    />

                    {[
                      {
                        icon: <span className="font-bold text-xl">1</span>,
                        title: "Agree on Terms",
                        desc: "Client and digital marketing professional agree on contract terms, scope of work, and pricing."
                      },
                      {
                        icon: <Clock className="h-6 w-6 cursor-pointer" />,
                        title: "Set Project Timeline",
                        desc: "The digital marketing professional uses the timeline/project feature bar to set the duration: one-off task, continuous task, or for a set date period."
                      },
                      {
                        icon: <Shield className="h-6 w-6 cursor-pointer" />,
                        title: "Secure Payment",
                        desc: "All payments are held securely by Telemoz to protect both parties. Your funds are safe until the work is completed to your satisfaction."
                      },
                      {
                        icon: <CheckCircle2 className="h-6 w-6 cursor-pointer" />,
                        title: "Job Completion & Payment",
                        desc: "Once the task/job is completed and approved, Telemoz releases payment to the digital marketing professional. Telemoz charges a 10% commission from the professional's payment."
                      }
                    ].map((step) => (
                      <motion.div 
                        key={step.title}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="relative flex items-start gap-6 group"
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-gray-200 text-gray-400 group-hover:border-[#0a9396]/50 group-hover:text-[#0a9396] group-hover:shadow-[0_0_20px_rgba(10,147,150,0.3)] transition-all shrink-0 z-10 relative mt-1">
                          {/* Active state indicator dot inside icon wrapper */}
                          <div className="absolute inset-0 bg-[#0a9396] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 opacity-10" />
                          <span className="relative z-10">{step.icon}</span>
                        </div>

                        <div className="flex-1 p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 group-hover:shadow-lg group-hover:border-[#0a9396]/20 group-hover:-translate-y-1 group-hover:bg-white transition-all duration-300">
                          <h4 className="text-xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-[#0a9396] transition-colors">{step.title}</h4>
                          <p className="text-gray-600 leading-relaxed text-base">{step.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Right Side: Sticky Interactive Image container */}
                  <div className="hidden lg:block sticky top-32 h-[500px] w-full mt-4">
                    <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 bg-white/40 backdrop-blur-xl group flex items-center justify-center">
                       {/* Abstract placeholder that reacts to scroll */}
                       <div className="absolute inset-0 bg-gradient-to-br from-[#0a9396]/5 to-[#94d2bd]/20" />
                       
                       <motion.div 
                         style={{ 
                            rotate: useTransform(scrollYProgress, [0, 1], [0, 10]),
                            scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9])
                         }}
                         className="relative w-[80%] h-[80%] rounded-2xl overflow-hidden shadow-2xl border border-white/50"
                       >
                         <Image 
                           src="/images/mockups/collaboration.png" 
                           alt="Marketplace Process" 
                           fill 
                           className="object-cover" 
                         />
                       </motion.div>

                       <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                    </div>
                  </div>

                </div>

                <div className="mt-8 p-4 bg-[#0a9396]/5 rounded-lg border border-[#0a9396]/20">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-[#0a9396] flex-shrink-0 mt-0.5 cursor-pointer" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Commission Structure</h4>
                      <p className="text-sm text-gray-700">
                        The marketplace is <strong>completely free</strong> for clients. Telemoz charges a 
                        <strong className="text-[#0a9396]"> 10% commission</strong> only from the payment 
                        the digital marketing professional receives upon successful job completion.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Link className="cursor-pointer" href="/marketplace">
                    <Button size="lg" className="bg-[#0a9396] hover:bg-[#087579] text-white cursor-pointer">
                      Browse Marketplace
                      <ArrowRight className="ml-2 h-5 w-5 cursor-pointer" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a9396] to-[#005f73]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#94d2bd]/20 rounded-full blur-[100px]" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center p-12 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Digital Marketing?
            </h2>
            <p className="text-white/80 text-xl md:text-2xl mb-10 font-light">
              Join thousands of professionals already using Telemoz to grow their business
            </p>
            <Link className="cursor-pointer" href="/register">
              <Button size="lg" className="bg-white text-[#005f73] hover:bg-gray-50 shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-1 transition-all rounded-full px-10 h-14 text-lg font-bold cursor-pointer">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-6 w-6 cursor-pointer" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      </main>
      
      <MarketingFooter />
    </div>
  );
}
