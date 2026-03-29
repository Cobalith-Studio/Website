import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Diamond } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/__generating__/img_06369e00f899.png"
          alt="Paysage de vignobles"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Diamond className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Cobalith Studio</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            L'art de la production,
            <br />
            <span className="text-primary">réinventé en jeu.</span>
          </h1>

          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-lg">
            Plongez dans un simulateur de gestion où vous produisez vins, bières et spiritueux. 
            Stratégie, oenologie et économie se mêlent dans une expérience unique.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://store.steampowered.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all hover:translate-y-px"
            >
              Ajouter à la Wishlist
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/le-jeu"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              Découvrir le jeu
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}