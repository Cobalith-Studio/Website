import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Beaker } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 lg:p-12 rounded-2xl bg-primary text-primary-foreground overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="font-heading text-2xl lg:text-3xl font-bold mb-4">
                Ajoutez le jeu à votre Wishlist
              </h3>
              <p className="text-primary-foreground/70 mb-8 max-w-md">
                Soyez parmi les premiers à découvrir le jeu. Ajoutez-le à votre wishlist Steam 
                pour être notifié dès la sortie.
              </p>
              <a
                href="https://store.steampowered.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                Wishlist Steam <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative p-8 lg:p-12 rounded-2xl bg-card border border-border overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-6">
                <Beaker className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-2xl lg:text-3xl font-bold mb-4">
                Testez le simulateur
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                Explorez les mécaniques de vinification, brassage et distillation directement dans votre navigateur.
              </p>
              <Link
                to="/simulateur"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Lancer le simulateur <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}