"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PlaySquareIcon, Library, FileText, Brain, PlaySquare, Check, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const features = [
  {
    icon: <Library className="w-6 h-6" />,
    title: "Custom Library",
    description: "Organize your videos in a personalized library for easy access and management."
  },
  {
    icon: <PlaySquare className="w-6 h-6" />,
    title: "Custom Playlists",
    description: "Create playlists to organize your favorite videos based on your interests."
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Rich Text Notes",
    description: "Take timestamped notes with formatting options, including bold, italics, and code blocks."
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI Summaries",
    description: "Get instant AI-generated summaries of any video in your library."
  }
];

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    features: [
      "Basic video library",
      "5 playlists",
      "Simple notes",
      "3 AI summaries/month"
    ]
  },
  {
    name: "Pro",
    price: "12",
    popular: true,
    features: [
      "Unlimited video library",
      "Unlimited playlists",
      "Rich text notes",
      "50 AI summaries/month",
      "Priority support"
    ]
  },
  {
    name: "Enterprise",
    price: "49",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom integrations",
      "Unlimited AI summaries",
      "24/7 support",
      "API access"
    ]
  }
];

export default function Home() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [pricingRef, pricingInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [demoRef, demoInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { user, loading } = useAuth();
  return (
    <div className="min-h-screen bg-[#050A30]">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-28"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-500/10 text-blue-400 rounded-full">
                ✨ Revolutionizing Video Learning
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 p-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              NoteFlix - YouTube Videos + Notes = binge-worthy knowledge.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-blue-200/80 mb-12"
            >
              Organize, annotate, and learn from your favorite YouTube videos with powerful AI assistance.
              Take smarter notes, get instant summaries, and master content faster than ever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
             {loading ? (
               <Button
               size="lg"
               className="bg-blue-600 hover:bg-blue-700 text-white min-w-52 px-8"
             >
                <Loader2 className="animate-spin w-6 h-6" />
             </Button>):
             <Link href={`${user?'/dashboard':'/login'}`}>
              <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-52 w-full px-8"
              >
              {user ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
              </Link>
             }
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-blue-400  text-blue-400 hover:bg-blue-400/10"
              >
                Watch Demo
                <PlaySquareIcon className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Stats Section */}
          {/* <motion.div
            ref={statsRef}
            variants={staggerContainer}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-24 text-center"
          >
            {[
              { number: "10K+", label: "Active Users" },
              { number: "1M+", label: "Videos Analyzed" },
              { number: "500K", label: "AI Summaries" },
              { number: "4.9/5", label: "User Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-blue-600/10 rounded-xl p-6"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-blue-200/80 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div> */}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-32 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300">
              Everything You Need to Master Video Content
            </h2>
            <p className="text-lg text-blue-200/80">
              Powerful features designed to transform how you learn from YouTube videos.
              From organization to AI-powered insights, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.2 }
                  }
                }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
                <Card className="relative bg-[#060B36]/90 border-blue-500/20 p-6 hover:border-blue-500/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-blue-300">{feature.title}</h3>
                      <p className="text-blue-200/80">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      {/* <motion.section
        ref={pricingRef}
        initial="hidden"
        animate={pricingInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-32 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-blue-200/80">
              Choose the plan that best fits your needs. All plans include core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.2 }
                  }
                }}
                className="relative group"
              >
                <div className={`absolute inset-0 ${plan.popular ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30' : 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20'} rounded-2xl transform group-hover:scale-105 transition-transform duration-300`} />
                <Card className={`relative bg-[#060B36]/90 border-blue-500/20 p-8 ${plan.popular ? 'border-blue-500/40' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2 text-blue-300">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-blue-400">${plan.price}</span>
                      <span className="text-blue-200/80">/month</span>
                    </div>
                    <ul className="space-y-4 mb-8 text-left">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-blue-200/80">
                          <Check className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      size="lg"
                      className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400'}`}
                    >
                      Get Started
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section> */}
      {/*Demo Section*/}
      <motion.section
        ref={demoRef}
        initial="hidden"
        animate={demoInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="py-32 relative"
        id="demo"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300">
              Watch the Demo
            </h2>
            <p className="text-lg text-blue-200/80">
            Watch NoteFlix in action as it effortlessly summarizes a 28-minute video in just one minute.
            </p>
          </div>
          <div className="relative w-full  bg-blue-600/10 rounded-2xl overflow-hidden">
            <video
              src="https://res.cloudinary.com/dxygc9jz4/video/upload/f_auto:video,q_auto/qh4bg6rwghmre9ut1tlh"
              className="w-full h-full object-fit"
              autoPlay={true}
              muted
              loop
            />
            
          </div>
        </div>
      </motion.section>
    
      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-lg text-blue-200/80 mb-8">
              Join many users who are already learning smarter with NoteFlix.
            </p>
            {loading ? (
               <Button
               size="lg"
               className="bg-blue-600 hover:bg-blue-700 text-white min-w-52 px-8"
             >
               <Loader2 className="animate-spin w-6 h-6" />
             </Button>):
             <Link href={`${user?'/dashboard':'/login'}`}>
              <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-32 px-8"
              >
              {user ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
              </Link>
             }
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#030720] py-8 px-6">
      <div className="container mx-auto text-center">
        <p className="text-blue-300">&copy; 2025 NoteFlix. All rights reserved.</p>
        <p className="text-blue-300">Built with ❤️ by <Link className="underline" href={'https://www.linkedin.com/in/vignesh-d-mys'} target="_blank">Vignesh</Link> </p>
      </div>
    </footer>
  )
}
