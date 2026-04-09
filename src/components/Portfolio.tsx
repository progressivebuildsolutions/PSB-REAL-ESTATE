import { motion } from 'motion/react';
import { Badge } from './ui/badge';

const projects = [
  {
    title: 'Prime Residential Plot',
    category: 'Plot',
    location: 'Sector 82, Mohali',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Luxury 4BHK Villa',
    category: 'Residential',
    location: 'Sector 8, Chandigarh',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Kothi Remodeling',
    category: 'Renovation',
    location: 'Sector 35, Chandigarh',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Commercial Showroom',
    category: 'Commercial',
    location: 'Madhya Marg, Chandigarh',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Office Renovation',
    category: 'Remodeling',
    location: 'IT Park, Mohali',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Agricultural Farm Land',
    category: 'Agricultural',
    location: 'Near Banur, Punjab',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col items-end justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Featured Projects</h2>
            <p className="mt-4 text-lg text-stone-600">A showcase of our commitment to excellence and innovation.</p>
          </div>
          <Badge variant="outline" className="rounded-full border-stone-300 px-4 py-1 text-stone-600">
            View All Projects
          </Badge>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-stone-100"
            >
              <img 
                src={project.image} 
                alt={project.title}
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent p-8 flex flex-col justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Badge className="mb-2 w-fit bg-white/20 backdrop-blur-md">{project.category}</Badge>
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                <p className="text-stone-300">{project.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
