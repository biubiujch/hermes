'use client';

import { Button } from '@heroui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  BoltIcon, 
  ShieldCheckIcon, 
  CogIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const features = [
    {
      icon: ChartBarIcon,
      title: 'Smart Strategies',
      description: 'Advanced trading strategies for decentralized exchanges, automatically identifying market opportunities'
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      description: 'Millisecond-level trade execution to capture every market opportunity'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Multiple security mechanisms to protect your assets'
    },
    {
      icon: CogIcon,
      title: 'Flexible Configuration',
      description: 'Customizable trading parameters and risk management strategies'
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Hermora
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Personal Trading Bot for Decentralized Exchanges
              </p>
              <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                Leveraging advanced algorithms and machine learning technology to achieve intelligent, secure, and efficient cryptocurrency trading strategies on decentralized exchanges
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/dashboard">
                <Button 
                  size="lg"
                  color="primary" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg"
                >
                  Start Trading
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/strategy">
                <Button 
                  size="lg"
                  variant="bordered"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
                >
                  View Strategies
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Hermora?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the most advanced personal trading bot technology to give you an edge in the cryptocurrency market
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-6">
                  <feature.icon className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Trading Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join Hermora and experience the next-generation personal trading bot for decentralized exchanges
            </p>
            <Link href="/dashboard">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
              >
                Get Started Now
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
