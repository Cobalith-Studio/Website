import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Grape } from 'lucide-react';
import ParamSelector from '../components/simulator/ParamSelector';
import WineResultPanel from '../components/simulator/WineResultPanel';
import {
  cepages, vendanges, sols, ensoleillements, precipitations,
  foulages, levures, macerations, fermentationTemps, fermentationDurees,
  malolactiques, elevageTypes, elevageDurees, elevageChauffes,
  simulateWine
} from '../lib/wineData';

const allCepages = [...cepages.blancs, ...cepages.rouges];

export default function SimulateurVin() {
  const [params, setParams] = useState({
    cepage: 'Chardonnay',
    vendange: 'Maturation',
    sol: 'Calcaire',
    ensoleillement: 'Modéré',
    precipitation: 'Moyennes',
    foulage: 'Complet',
    levure: 'Indigènes',
    maceration: 'Aucune',
    fermentationTemp: 'Basse',
    fermentationDuree: 'Longue',
    malolactique: 'Non',
    elevageType: 'Cuve inox',
    elevageDuree: 'Courte',
    elevageChauffe: 'Légère',
  });

  const set = (key) => (value) => setParams((p) => ({ ...p, [key]: value }));

  const result = useMemo(() => {
    const c = allCepages.find((x) => x.name === params.cepage);
    if (!c) return null;
    return simulateWine({
      cepage: c,
      vendange: vendanges.find((x) => x.name === params.vendange),
      sol: sols.find((x) => x.name === params.sol),
      ensoleillement: ensoleillements.find((x) => x.name === params.ensoleillement),
      precipitation: precipitations.find((x) => x.name === params.precipitation),
      foulage: foulages.find((x) => x.name === params.foulage),
      levure: levures.find((x) => x.name === params.levure),
      maceration: macerations.find((x) => x.name === params.maceration),
      fermentationTemp: fermentationTemps.find((x) => x.name === params.fermentationTemp),
      fermentationDuree: fermentationDurees.find((x) => x.name === params.fermentationDuree),
      malolactique: malolactiques.find((x) => x.name === params.malolactique),
      elevageType: elevageTypes.find((x) => x.name === params.elevageType),
      elevageDuree: elevageDurees.find((x) => x.name === params.elevageDuree),
      elevageChauffe: elevageChauffes.find((x) => x.name === params.elevageChauffe),
    });
  }, [params]);

  return (
    <div className="pt-20">
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <Link to="/simulateur" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Retour aux simulateurs
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <Grape className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-2xl lg:text-3xl font-bold">Simulateur de Vinification</h1>
                <p className="text-sm text-muted-foreground">Configurez chaque paramètre et visualisez le profil du vin résultant</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Parameters */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cépage & Vendange */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-heading font-semibold text-lg mb-4">Choix du cépage</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ParamSelector label="Cépage" options={allCepages} value={params.cepage} onChange={set('cepage')} />
                  <ParamSelector label="Moment de vendange" options={vendanges} value={params.vendange} onChange={set('vendange')} />
                </div>
              </div>

              {/* Terrain */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-heading font-semibold text-lg mb-4">Choix du terrain</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ParamSelector label="Type de sol" options={sols} value={params.sol} onChange={set('sol')} />
                  <ParamSelector label="Ensoleillement" options={ensoleillements} value={params.ensoleillement} onChange={set('ensoleillement')} />
                  <ParamSelector label="Précipitations" options={precipitations} value={params.precipitation} onChange={set('precipitation')} />
                </div>
              </div>

              {/* Vinification */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-heading font-semibold text-lg mb-4">Étapes de vinification</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ParamSelector label="Foulage" options={foulages} value={params.foulage} onChange={set('foulage')} />
                  <ParamSelector label="Levures" options={levures} value={params.levure} onChange={set('levure')} />
                  <ParamSelector label="Macération" options={macerations} value={params.maceration} onChange={set('maceration')} />
                  <ParamSelector label="Fermentation - Temp." options={fermentationTemps} value={params.fermentationTemp} onChange={set('fermentationTemp')} />
                  <ParamSelector label="Fermentation - Durée" options={fermentationDurees} value={params.fermentationDuree} onChange={set('fermentationDuree')} />
                  <ParamSelector label="Malo-lactique" options={malolactiques} value={params.malolactique} onChange={set('malolactique')} />
                </div>
              </div>

              {/* Élevage */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-heading font-semibold text-lg mb-4">Élevage</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ParamSelector label="Type d'élevage" options={elevageTypes} value={params.elevageType} onChange={set('elevageType')} />
                  <ParamSelector label="Durée d'élevage" options={elevageDurees} value={params.elevageDuree} onChange={set('elevageDuree')} />
                  <ParamSelector label="Chauffe" options={elevageChauffes} value={params.elevageChauffe} onChange={set('elevageChauffe')} />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <WineResultPanel result={result} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}