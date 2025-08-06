'use client';

import { Card, CardBody, CardHeader, Button, Chip, Badge } from '@heroui/react';
import { CheckIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: {
    text: string;
    included: boolean;
  }[];
  popular?: boolean;
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with basic trading features',
    color: 'default',
    features: [
      { text: 'Basic strategy configuration', included: true },
      { text: 'Up to 3 active strategies', included: true },
      { text: 'Standard market data', included: true },
      { text: 'Community support', included: true },
      { text: 'Advanced analytics', included: false },
      { text: 'Priority execution', included: false },
      { text: 'Custom indicators', included: false },
      { text: 'API access', included: false },
      { text: 'Dedicated support', included: false },
      { text: 'White-label solution', included: false },
    ]
  },
  {
    name: 'Pro',
    price: '$99',
    period: 'month',
    description: 'Advanced features for serious traders',
    color: 'primary',
    popular: true,
    features: [
      { text: 'Advanced strategy configuration', included: true },
      { text: 'Up to 20 active strategies', included: true },
      { text: 'Real-time market data', included: true },
      { text: 'Priority support', included: true },
      { text: 'Advanced analytics & insights', included: true },
      { text: 'Priority execution', included: true },
      { text: 'Custom indicators', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated support', included: false },
      { text: 'White-label solution', included: false },
    ]
  },
  {
    name: 'Enterprise',
    price: '$299',
    period: 'month',
    description: 'Complete solution for professional trading firms',
    color: 'success',
    features: [
      { text: 'Unlimited strategy configuration', included: true },
      { text: 'Unlimited active strategies', included: true },
      { text: 'Premium market data feeds', included: true },
      { text: '24/7 dedicated support', included: true },
      { text: 'Advanced analytics & insights', included: true },
      { text: 'Ultra-fast execution', included: true },
      { text: 'Custom indicators & algorithms', included: true },
      { text: 'Full API access', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'White-label solution', included: true },
    ]
  }
];

export default function Pricing() {
  const handleSelectPlan = (tier: PricingTier) => {
    if (tier.name === 'Free') {
      // Handle free plan selection
      console.log('Selected Free plan');
    } else {
      // Handle paid plan selection
      console.log(`Selected ${tier.name} plan`);
      // Here you would typically redirect to payment or show payment modal
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          Choose Your Plan
        </h1>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
          Select the perfect plan for your trading needs. Start free and upgrade as you grow.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        {pricingTiers.map((tier) => (
          <Card 
            key={tier.name}
            className={`relative ${tier.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}
          >
            {tier.popular && (
              <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                <Badge 
                  color='primary' 
                  variant='solid'
                  className='px-4 py-1'
                >
                  <StarIcon className='w-4 h-4 mr-1' />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className='text-center pb-4'>
              <h3 className='text-2xl font-bold text-gray-900'>{tier.name}</h3>
              <div className='mt-4'>
                <span className='text-4xl font-bold text-gray-900'>{tier.price}</span>
                {tier.period !== 'forever' && (
                  <span className='text-gray-600 ml-1'>/{tier.period}</span>
                )}
                {tier.period === 'forever' && (
                  <span className='text-gray-600 ml-1'>/{tier.period}</span>
                )}
              </div>
              <p className='text-gray-600 mt-2'>{tier.description}</p>
            </CardHeader>

            <CardBody className='pt-0'>
              {/* Features List */}
              <div className='space-y-3 mb-8'>
                {tier.features.map((feature, index) => (
                  <div key={index} className='flex items-center'>
                    {feature.included ? (
                      <CheckIcon className='w-5 h-5 text-green-500 mr-3 flex-shrink-0' />
                    ) : (
                      <XMarkIcon className='w-5 h-5 text-gray-400 mr-3 flex-shrink-0' />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Button
                color={tier.color}
                variant={tier.popular ? 'solid' : 'bordered'}
                size='lg'
                className='w-full'
                onClick={() => handleSelectPlan(tier)}
              >
                {tier.name === 'Free' ? 'Get Started' : `Choose ${tier.name}`}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <div className='mt-16 text-center'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            All Plans Include
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CheckIcon className='w-6 h-6 text-blue-600' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Secure Trading</h3>
              <p className='text-gray-600 text-sm'>
                Bank-level security with multi-factor authentication and encrypted data
              </p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CheckIcon className='w-6 h-6 text-green-600' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>24/7 Monitoring</h3>
              <p className='text-gray-600 text-sm'>
                Round-the-clock strategy monitoring and automated execution
              </p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CheckIcon className='w-6 h-6 text-purple-600' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Risk Management</h3>
              <p className='text-gray-600 text-sm'>
                Advanced risk controls and position management tools
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className='mt-16 max-w-4xl mx-auto'>
        <h2 className='text-2xl font-bold text-gray-900 text-center mb-8'>
          Frequently Asked Questions
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h3 className='font-semibold text-gray-900 mb-2'>Can I change my plan later?</h3>
            <p className='text-gray-600 text-sm'>
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h3 className='font-semibold text-gray-900 mb-2'>Is there a setup fee?</h3>
            <p className='text-gray-600 text-sm'>
              No setup fees. You only pay the monthly subscription fee for the plan you choose.
            </p>
          </div>
          <div>
            <h3 className='font-semibold text-gray-900 mb-2'>What payment methods do you accept?</h3>
            <p className='text-gray-600 text-sm'>
              We accept all major credit cards, PayPal, and cryptocurrency payments.
            </p>
          </div>
          <div>
            <h3 className='font-semibold text-gray-900 mb-2'>Is there a free trial?</h3>
            <p className='text-gray-600 text-sm'>
              Yes, all paid plans come with a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
