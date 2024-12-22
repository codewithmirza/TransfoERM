'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Boxes,
  LineChart,
  Users2,
  Building2,
  Laptop,
  ArrowRight,
  Sparkles,
  Globe,
  Clock,
  Settings,
  Lock,
  CheckCircle,
  GitBranch,
  Bot,
  Shield,
  LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'
import { SignupForm } from '@/components/SignupForm'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const formRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading, signIn, signUp } = useAuth()
  const { toast } = useToast()

  const features: Feature[] = [
    {
      icon: Brain,
      title: 'AI-Powered Automation',
      description: 'Transform business processes with natural language commands and zero-code automation',
    },
    {
      icon: Sparkles,
      title: 'Intelligent Customization',
      description: 'Dynamic solutions that evolve with your business through AI-driven adaptations',
    },
    {
      icon: GitBranch,
      title: 'Smart Workflows',
      description: 'Self-healing workflows and AI-generated integrations for seamless operations',
    },
    {
      icon: Bot,
      title: 'NLP Command Center',
      description: 'Control your entire system through natural language - text or voice',
    },
    {
      icon: Boxes,
      title: 'Enterprise Integration',
      description: 'Seamlessly connect with existing systems through AI-generated integrations',
    },
    {
      icon: Shield,
      title: 'Intelligent Security',
      description: 'Self-monitoring and automated security compliance for enterprise data',
    },
  ]

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
    setShowForm(true)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    try {
      if (activeTab === 'login') {
        await signIn(email, password)
      } else {
        const name = formData.get('name') as string
        const company = formData.get('company') as string
        await signUp(email, password, { name, company })
      }
      router.push('/dashboard')
    } catch (error) {
      console.error('Authentication error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Authentication failed',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Show loading state in the return statement instead
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 text-gray-800">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-teal-800">TransfoERM</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="outline"
              className="bg-white/80 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition-all"
            >
              Contact Sales
            </Button>
          </motion.div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 bg-teal-100/50 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-5 w-5 text-teal-600" />
            <span className="text-teal-800 font-medium">Next-Gen Enterprise Platform</span>
            </div>
            <h2 className="text-6xl font-bold mb-6 text-teal-900 leading-tight">
              Transform Your Enterprise
              <br />
              With AI-Powered Automation
            </h2>
            <p className="text-xl mb-8 text-teal-700 max-w-3xl mx-auto">
              Revolutionize your business operations with zero-code automation and natural language controls. 
              Say goodbye to rigid ERPs and hello to dynamic, AI-driven solutions.
            </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-teal-600 text-white hover:bg-teal-700 px-8 py-6 text-lg flex items-center gap-2 group"
              onClick={scrollToForm}
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/80 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-8 py-6 text-lg transition-all"
            >
              Watch Demo
            </Button>
          </div>
        </motion.section>

        <section className="grid md:grid-cols-2 gap-16 items-center mb-16">
          <div className="animate-on-scroll">
          <h3 className="text-3xl font-bold mb-4 text-teal-800">
                Enterprise-Grade Power, Consumer-Grade Simplicity
              </h3>
              <p className="text-lg mb-6 text-teal-700">
                Experience the perfect balance of powerful features and intuitive design. 
                Our platform adapts to your business needs while remaining remarkably easy to use.
              </p>
            <ul className="space-y-2">
              {[
                'Automated workflow orchestration',
                  'Advanced security and compliance',
                  'Real-time analytics and reporting',
                  'Seamless third-party integrations',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center text-teal-700"
                >
                  <CheckCircle className="mr-2 h-5 w-5 text-teal-500" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg shadow-2xl overflow-hidden animate-on-scroll"
          >
            <Image
              src="/images/placeholder.png"
              alt="ERP Dashboard Preview"
              width={400}
              height={300}
              className="w-full h-auto"
              priority
            />
          </motion.div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-teal-800">
            Powerful Features for Modern Businesses
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white bg-opacity-50 rounded-lg p-6 backdrop-blur-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-on-scroll"
              >
                <feature.icon className="h-12 w-12 mb-4 text-teal-600" />
                <h4 className="text-xl font-semibold mb-2 text-teal-800">{feature.title}</h4>
                <p className="text-teal-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-16 animate-on-scroll"
        >
          <h3 className="text-3xl font-bold mb-4 text-teal-800">
            Ready to Transform Your Business?
          </h3>
          <p className="text-xl mb-8 text-teal-700">
            Join thousands of companies already using TransfoERM to drive growth and efficiency
          </p>
          <Button
            size="lg"
            className="bg-teal-600 text-white hover:bg-teal-700"
            onClick={scrollToForm}
          >
            Get Started Now
          </Button>
        </motion.section>

        <motion.section
          ref={formRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: showForm ? 'auto' : 0,
            opacity: showForm ? 1 : 0,
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="overflow-hidden"
        >
          <div className="max-w-5xl mx-auto px-4 py-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: showForm ? 1 : 0.8,
                opacity: showForm ? 1 : 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: showForm ? 0 : 20,
                      opacity: showForm ? 1 : 0,
                    }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="space-y-6"
                  >
                    <h3 className="text-4xl font-bold text-teal-800">
                      Start Your Digital
                      <br />
                      Transformation Today
                    </h3>
                    <p className="text-teal-600">
                      Join thousands of businesses already using TransfoERM to streamline their
                      operations
                    </p>
                    <div className="space-y-4">
                      {[
                        { icon: Globe, text: 'Access from anywhere, anytime' },
                        { icon: Clock, text: 'Set up in minutes, not months' },
                        { icon: Settings, text: 'No coding required' },
                        { icon: Lock, text: 'Enterprise-grade security' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="bg-teal-100/50 p-2 rounded-full">
                            <item.icon className="h-5 w-5 text-teal-600" />
                          </div>
                          <span className="text-teal-700">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: showForm ? 0 : 20,
                        opacity: showForm ? 1 : 0,
                      }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger
                          value="login"
                          className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                        >
                          Login
                        </TabsTrigger>
                        <TabsTrigger
                          value="signup"
                          className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                        >
                          Start Free Trial
                        </TabsTrigger>
                      </TabsList>
                    </motion.div>

                    <TabsContent value="login">
                      <motion.form
                        onSubmit={handleFormSubmit}
                        className="space-y-6"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-teal-700">
                            Work Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@company.com"
                            className="bg-white/50 border-white/20 backdrop-blur-sm focus:border-teal-500 focus:ring-teal-500 h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-teal-700">
                            Password
                          </Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            className="bg-white/50 border-white/20 backdrop-blur-sm focus:border-teal-500 focus:ring-teal-500 h-12"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium h-12 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                          disabled={loading}
                        >
                          {loading ? 'Loading...' : 'Log In to Dashboard'}
                        </Button>
                        <p className="text-sm text-center text-teal-600">
                          <a href="#" className="hover:underline">
                            Forgot password?
                          </a>
                        </p>
                      </motion.form>
                    </TabsContent>

                    <TabsContent value="signup">
                      <motion.form
                        onSubmit={handleFormSubmit}
                        className="space-y-6"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="signup-name" className="text-teal-700">
                            Full Name
                          </Label>
                          <Input
                            id="signup-name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            className="bg-white/50 border-white/20 backdrop-blur-sm focus:border-teal-500 focus:ring-teal-500 h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-teal-700">
                            Work Email
                          </Label>
                          <Input
                            id="signup-email"
                            name="email"
                            type="email"
                            placeholder="you@company.com"
                            className="bg-white/50 border-white/20 backdrop-blur-sm focus:border-teal-500 focus:ring-teal-500 h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-teal-700">
                            Password
                          </Label>
                          <Input
                            id="signup-password"
                            name="password"
                            type="password"
                            className="bg-white/50 border-white/20 backdrop-blur-sm focus:border-teal-500 focus:ring-teal-500 h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-company" className="text-teal-700">
                            Company Name
                          </Label>
                          <Input
                            id="signup-company"
                            name="company"
                            type="text"
                            placeholder="Your Company"
                            className="bg-white/50 border-white/20 backdrop-blur-sm focus:border-teal-500 focus:ring-teal-500 h-12"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium h-12 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                          disabled={loading}
                        >
                          {loading ? 'Creating Account...' : 'Create Free Account'}
                        </Button>
                        <p className="text-sm text-center text-teal-600">
                          By signing up, you agree to our{' '}
                          <a href="#" className="hover:underline">
                            Terms of Service
                          </a>
                        </p>
                      </motion.form>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="bg-teal-800 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">TransfoERM</h4>
              <p>Empowering businesses with intelligent solutions</p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Quick Links</h5>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Connect With Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-teal-300">
                  Facebook
                </a>
                <a href="#" className="hover:text-teal-300">
                  Twitter
                </a>
                <a href="#" className="hover:text-teal-300">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            &copy; 2024 TransfoERM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
