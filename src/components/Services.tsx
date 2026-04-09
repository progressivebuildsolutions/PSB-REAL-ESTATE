import { motion } from 'motion/react';
import { Home, Paintbrush, Ruler, ShieldCheck, HardHat, Building2, LandPlot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const services = [
  {
    title: 'Rent & Lease',
    description: 'Specialized rental and leasing services for residential apartments, kothis, and commercial showrooms.',
    icon: Building2,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Remodeling & Renovation',
    description: 'Complete transformation of your old kothis and commercial spaces with modern architectural designs.',
    icon: Paintbrush,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'Plot Sales & Purchase',
    description: 'Expert guidance for buying and selling residential and commercial plots in prime locations.',
    icon: LandPlot,
    color: 'bg-stone-50 text-stone-600',
  },
  {
    title: 'Residential Properties',
    description: 'Find your dream home, apartment, or villa with our extensive verified listings.',
    icon: Home,
    color: 'bg-green-50 text-green-600',
  },
  {
    title: 'Commercial Real Estate',
    description: 'Strategic office spaces, shops, and industrial land for your business growth.',
    icon: Building2,
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    title: 'Legal & Documentation',
    description: 'Hassle-free legal support for property registration, titles, and transfers.',
    icon: ShieldCheck,
    color: 'bg-purple-50 text-purple-600',
  },
];

export function Services() {
  return (
    <section id="services" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Real Estate Services</h2>
          <p className="mt-4 text-lg text-stone-600">Comprehensive property solutions tailored to your investment goals.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-stone-100 transition-all hover:border-stone-200 hover:shadow-lg">
                <CardHeader>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${service.color}`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
