import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';

export default function WineResultPanel({ result }) {
  if (!result) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-border text-center">
        <p className="text-muted-foreground">Configurez les paramètres pour voir le profil du vin.</p>
      </div>
    );
  }

  const radarData = [
    { axis: 'Sucre', value: Math.min(10, result.sucre / 5) },
    { axis: 'Acidité', value: result.acidite },
    { axis: 'Tanins', value: result.tanins },
    { axis: 'A. Primaires', value: result.aromes_primaires },
    { axis: 'A. Secondaires', value: result.aromes_secondaires },
    { axis: 'A. Tertiaires', value: result.aromes_tertiaires },
  ];

  const barData = [
    { name: 'Sucre', value: result.sucre, unit: 'g/L' },
    { name: 'Acidité', value: result.acidite, unit: 'g/L' },
    { name: 'Tanins', value: result.tanins, unit: 'IPT' },
    { name: 'Alcool', value: result.alcool, unit: '%' },
  ];

  const typeColor = result.type === 'Rouge' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800';

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-heading font-bold text-lg mb-4">Profil du vin</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Type</p>
            <Badge className={`mt-1 ${typeColor}`}>{result.type}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Style</p>
            <p className="font-semibold mt-1">{result.style}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Cépage</p>
            <p className="font-semibold mt-1">{result.cepage}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Alcool</p>
            <p className="font-semibold mt-1">{result.alcool}% vol</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-border">
          {barData.map((d) => (
            <div key={d.name} className="text-center">
              <p className="text-2xl font-bold text-primary">{d.value}</p>
              <p className="text-xs text-muted-foreground">{d.name} ({d.unit})</p>
            </div>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-heading font-bold text-lg mb-4">Profil aromatique</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
            <Radar
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-heading font-bold text-lg mb-4">Arômes</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[
            { name: 'Primaires', value: result.aromes_primaires },
            { name: 'Secondaires', value: result.aromes_secondaires },
            { name: 'Tertiaires', value: result.aromes_tertiaires },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}