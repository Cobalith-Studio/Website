import React from 'react';
import { Link } from 'react-router-dom';
import { Diamond, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Diamond className="w-6 h-6 text-primary" />
              <span className="font-heading font-bold text-lg">Cobalith Studio</span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              Studio indépendant français dédié à la création de jeux vidéo originaux et immersifs.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 opacity-80">Navigation</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Accueil', path: '/' },
                { label: 'Le Jeu', path: '/le-jeu' },
                { label: 'Simulateur', path: '/simulateur' },
                { label: 'À propos', path: '/a-propos' },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="block text-sm opacity-60 hover:opacity-100 transition-opacity">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 opacity-80">Communauté</h4>
            <div className="space-y-2.5">
              <a href="https://discord.gg/yKXXXunr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity">
                Discord <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://instagram.com/cobalithstudio" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity">
                Instagram <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://www.linkedin.com/company/cobalith-studio" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity">
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 opacity-80">Contact</h4>
            <a href="mailto:contact@cobalithstudio.fr" className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity">
              <Mail className="w-4 h-4" />
              contact@cobalithstudio.fr
            </a>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-40">
            © {new Date().getFullYear()} Cobalith Studio — Association loi 1901 — SIRET 945 406 965 00018
          </p>
          <p className="text-xs opacity-40">
            91160 Longjumeau, France
          </p>
        </div>
      </div>
    </footer>
  );
}