import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function ParamSelector({ label, options, value, onChange, nameKey = 'name' }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder={`Choisir ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt[nameKey]} value={opt[nameKey]}>
              {opt[nameKey]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}