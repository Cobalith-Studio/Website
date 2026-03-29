import React from 'react';
import { motion } from 'framer-motion';
import { Diamond, Target, Heart, Lightbulb, Users } from 'lucide-react';

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Nous explorons des mécaniques de jeu inédites et des approches narratives originales.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Chaque membre partage une passion profonde pour la création de jeux vidéo.',
  },
  {
    icon: Target,
    title: 'Qualité',
    description: 'Nous visons l\'excellence dans chaque aspect de nos productions, du gameplay au design.',
  },
  {
    icon: Users,
    title: 'Communauté',
    description: 'Notre communauté est au cœur de notre processus de développement.',
  },
];

export default function APropos() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Diamond className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-widest">À propos</span>
            </div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-6">
              Un studio indépendant français
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Cobalith Studio est une association loi 1901 fondée en 2025, dédiée à la création 
              de jeux vidéo originaux et immersifs. Basée à Longjumeau, en région parisienne, 
              notre équipe regroupe des développeurs, artistes, scénaristes et compositeurs 
              partageant une vision commune.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-primary uppercase tracking-widest">Notre mission</span>
              <h2 className="font-heading text-3xl font-bold mt-3 mb-6">
                Repousser les limites de l'indé
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous croyons que les jeux vidéo indépendants peuvent offrir des expériences 
                aussi riches et profondes que les productions AAA, avec une liberté créative 
                incomparable.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Notre premier projet est un simulateur de production d'alcools ambitieux, 
                mêlant stratégie, gestion et simulation avec une profondeur de gameplay 
                rarement vue dans le genre.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src="/__generating__/img_b32c74d5c2d6.png"
                alt="Crystal Cobalith"
                className="w-full aspect-square object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Nos valeurs</span>
            <h2 className="font-heading text-3xl font-bold mt-3">Ce qui nous anime</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}