import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grape, Beer, Wine, ArrowRight } from 'lucide-react';

const simulators = [
  {
    icon: Grape,
    title: 'Simulateur de Vinification',
    description: 'Explorez les étapes de la vinification : choix du cépage, terroir, fermentation, élevage. Visualisez les profils oenologiques résultants.',
    path: '/simulateur/vin',
    color: 'from-purple-500/10 to-red-500/10',
  },
  {
    icon: Beer,
    title: 'Simulateur de Brassage',
    description: 'Maîtrisez le brassage artisanal. Sélectionnez vos ingrédients et méthodes pour créer des profils de bières uniques.',
    path: '/simulateur/biere',
    color: 'from-amber-500/10 to-orange-500/10',
  },
  {
    icon: Wine,
    title: 'Simulateur de Distillation',
    description: 'Découvrez les secrets de la distillation. Contrôlez chaque paramètre pour produire des spiritueux d\'exception.',
    path: '/simulateur/spiritueux',
    color: 'from-amber-700/10 to-yellow-500/10',
  },
];

export default function SimulateurHub() {
  return (
    <div className="pt-20">
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Outils interactifs</span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold mt-3 mb-6">
              Simulateurs
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorez les mécaniques de production du jeu. Ces simulateurs reproduisent fidèlement 
              les systèmes de production et vous permettent de visualiser les résultats.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {simulators.map((sim, i) => (
              <motion.div
                key={sim.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={sim.path}
                  className="group block h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sim.color} flex items-center justify-center mb-6`}>
                    <sim.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-heading text-xl font-bold mb-3">{sim.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {sim.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    Lancer <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}