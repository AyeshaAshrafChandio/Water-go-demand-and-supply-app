import React from 'react';
import { useApp } from '../../../context/AppContext';
import { WaterType } from '../../../types';
import { getTranslation } from '../../../locales/translations';
import { 
  Droplet, 
  Truck, 
  Container, 
  Boxes, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';

interface WaterSelectorProps {
  selectedTypeId: string;
  onSelect: (wt: WaterType) => void;
}

export const WaterSelector: React.FC<WaterSelectorProps> = ({ selectedTypeId, onSelect }) => {
  const { waterTypes, language } = useApp();

  const getWaterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-6 h-6 text-cyan-400" />;
      case 'Container':
        return <Container className="w-6 h-6 text-blue-400" />;
      case 'Boxes':
        return <Boxes className="w-6 h-6 text-indigo-400" />;
      default:
        return <Droplet className="w-6 h-6 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>{getTranslation(language, 'chooseWaterType')}</span>
        </h3>
        <span className="text-[11px] text-cyan-400 font-medium">
          {waterTypes.length} Types Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {waterTypes.map((wt) => {
          const isSelected = wt.id === selectedTypeId;

          return (
            <div
              key={wt.id}
              onClick={() => onSelect(wt)}
              className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-900/30 ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              {wt.popular && (
                <span className="absolute -top-2 right-3 bg-cyan-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Popular</span>
                </span>
              )}

              <div className="flex items-start space-x-3">
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-cyan-950/80 border border-cyan-800' : 'bg-slate-800'}`}>
                  {getWaterIcon(wt.iconName)}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-100 truncate">
                    {language === 'ur' ? wt.nameUr : wt.nameEn}
                  </h4>
                  <p className="text-xs text-cyan-400 font-medium mt-0.5">
                    {language === 'ur' ? wt.capacityTextUr : wt.capacityTextEn}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {language === 'ur' ? wt.descriptionUr : wt.descriptionEn}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Base Price:</span>
                  <span className="text-sm font-extrabold text-emerald-400">
                    Rs. {wt.basePricePKR}
                  </span>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700 text-transparent'}`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
