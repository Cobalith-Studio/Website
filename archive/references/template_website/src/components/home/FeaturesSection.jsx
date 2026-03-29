import React from 'react';
import { motion } from 'framer-motion';
import { Grape, TrendingUp, FlaskConical, Map } from 'lucide-react';

const features = [
  {
    icon: Grape,
    title: 'Production artisanale',
    description: 'Maîtrisez chaque étape de la production, du choix des cépages à la mise en bouteille. Des centaines de combinaisons possibles.',
  },
  {
    icon: TrendingUp,
    title: 'Gestion économique',
    description: 'Gérez vos finances, votre supply chain et affrontez la concurrence sur un marché dynamique et réaliste.',
  },
  {
    icon: FlaskConical,
    title: 'Laboratoire de recettes',
    description: 'Expérimentez et créez des boissons uniques. Chaque paramètre influe sur les arômes, la qualité et la rareté.',
  },
  {
    icon: Map,
    title: 'Monde ouvert',
    description: 'Explorez différentes régions viticoles, chacune avec son terroir, son climat et ses opportunités commerciales.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Mécaniques de jeu</span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mt-3">
            Une simulation riche et profonde
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Chaque décision compte. De la vigne au verre, maîtrisez un empire 
            de production d'alcools dans un monde vivant.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}