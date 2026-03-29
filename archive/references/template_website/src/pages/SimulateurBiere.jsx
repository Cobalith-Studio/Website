import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Beer, Construction } from 'lucide-react';

export default function SimulateurBiere() {
  return (
    <div className="pt-20">
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/simulateur" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Retour aux simulateurs
            </Link>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Beer className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-2xl lg:text-3xl font-bold">Simulateur de Brassage</h1>
                <p className="text-sm text-muted-foreground">Simulation des étapes de brassage artisanal</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mb-6">
              <Construction className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold mb-3">En cours de développement</h2>
            <p className="text-muted-foreground max-w-md">
              Le simulateur de brassage est en cours de construction. 
              Il sera disponible prochainement avec les mêmes niveaux de détails que le simulateur de vinification.
            </p>
            <Link
              to="/simulateur/vin"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Essayer le simulateur de vin
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}