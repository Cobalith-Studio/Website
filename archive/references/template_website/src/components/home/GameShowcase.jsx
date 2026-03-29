import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const screenshots = [
  {
    id: 1,
    src: '/__generating__/img_1cc8ddd71ad0.png',
    alt: 'Interface de gestion',
    label: 'Gestion & Stratégie',
  },
  {
    id: 2,
    src: '/__generating__/img_12c48183b1e9.png',
    alt: 'Domaine viticole',
    label: 'Votre domaine',
  },
  {
    id: 3,
    src: '/__generating__/img_f8163a34a449.png',
    alt: 'Économie et marchés',
    label: 'Marchés & Économie',
  },
];

export default function GameShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Aperçu</span>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mt-3">Découvrez l'univers</h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-primary/10"
            >
              <img
                src={screenshots[active].src}
                alt={screenshots[active].alt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-8">
            {screenshots.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active === i
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}