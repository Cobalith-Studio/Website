import React from 'react';
import { motion } from 'framer-motion';
import { Grape, Beer, Wine, TrendingUp, Users, Globe, ArrowRight, Cog, Leaf, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const mechanics = [
  {
    icon: Grape,
    title: 'Viticulture',
    description: 'Choisissez vos cépages, gérez votre terroir, contrôlez chaque étape de la vendange à la mise en bouteille.',
  },
  {
    icon: Beer,
    title: 'Brasserie',
    description: 'Maîtrisez le brassage artisanal. Sélectionnez malts et houblons pour créer des bières distinctives.',
  },
  {
    icon: Wine,
    title: 'Distillerie',
    description: 'Distillez eaux-de-vie, whisky et autres spiritueux. Contrôlez températures et temps de vieillissement.',
  },
  {
    icon: TrendingUp,
    title: 'Économie dynamique',
    description: 'Un marché vivant qui réagit à l\'offre et la demande. Exportez, négociez et développez votre réseau.',
  },
  {
    icon: Users,
    title: 'Personnel & compétences',
    description: 'Recrutez, formez et gérez vos employés. Chaque spécialiste apporte des bonus uniques à votre production.',
  },
  {
    icon: Globe,
    title: 'Terroirs & régions',
    description: 'Explorez différentes régions avec des climats, sols et traditions qui influencent directement vos produits.',
  },
];

const pillars = [
  { icon: Cog, label: 'Gestion', desc: 'Pilotez votre entreprise au quotidien' },
  { icon: Leaf, label: 'Simulation', desc: 'Des mécaniques réalistes et profondes' },
  { icon: BarChart3, label: 'Stratégie', desc: 'Planifiez et optimisez sur le long terme' },
];

export default function LeJeu() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Le Jeu</span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold mt-3 mb-6">
              Simulateur de production d'alcools
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Un jeu de stratégie et gestion dans lequel vous bâtissez un empire de production 
              de vins, bières et spiritueux. Disponible prochainement sur Steam.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {pillars.map((p) => (
                <div key={p.label} className="flex items-center gap-3 px-5 py-3 bg-card rounded-xl border border-border">
                  <p.icon className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img src="/__generating__/img_12c48183b1e9.png" alt="Domaine viticole" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img src="/__generating__/img_d74032dc379b.png" alt="Carte du monde" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mechanics */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Mécaniques</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mt-3">Tout pour bâtir votre empire</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mechanics.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-background border border-border hover:border-primary/20 transition-all"
              >
                <m.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Prêt à devenir maître de chai ?</h2>
          <p className="text-muted-foreground mb-8">
            Ajoutez le jeu à votre wishlist Steam ou testez le simulateur dès maintenant.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://store.steampowered.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Wishlist Steam <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/simulateur"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-secondary text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
            >
              Simulateur
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}