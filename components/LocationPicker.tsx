import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Navigation, Search, Loader2, Target, Globe, ArrowRight } from 'lucide-react';
import { COLORS } from '../constants';

export interface LocationSettings {
  name: string;
  lat: number | null;
  lng: number | null;
  radiusKm: number;
  country: string | null;
}

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (settings: LocationSettings) => void;
  initialSettings: LocationSettings;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    province?: string;
    country?: string;
    country_code?: string;
  };
}

const RADIUS_PRESETS = [10, 25, 50, 100, 250, 500];

const LocationPicker: React.FC<LocationPickerProps> = ({ isOpen, onClose, onApply, initialSettings }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSettings>(initialSettings);
  const [radius, setRadius] = useState(initialSettings.radiusKm);
  const [isLocating, setIsLocating] = useState(false);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedLocation(initialSettings);
      setRadius(initialSettings.radiusKm);
      setQuery('');
      setResults([]);
    }
  }, [isOpen, initialSettings]);

  const searchLocations = async (searchTerm: string) => {
    if (searchTerm.length < 3) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      // Removed country restrictions for a truly global search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchTerm
        )}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      searchLocations(val);
    }, 300);
  };

  const handleSelect = (res: SearchResult) => {
    const city = res.address.city || res.address.town || res.address.village || '';
    const state = res.address.state || res.address.province || '';
    const countryCode = res.address.country_code?.toUpperCase() || null;
    const name = city && state ? `${city}, ${state}` : res.display_name.split(',')[0];

    setSelectedLocation({
      ...selectedLocation,
      name,
      lat: parseFloat(res.lat),
      lng: parseFloat(res.lon),
      country: countryCode
    });
    setQuery('');
    setResults([]);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&addressdetails=1`
          );
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || 'My Location';
          const state = data.address.state || data.address.province || '';
          setSelectedLocation({
            ...selectedLocation,
            name: `${city}${state ? ', ' + state : ''}`,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            country: data.address.country_code?.toUpperCase() || null
          });
        } catch (e) {
          setSelectedLocation({ ...selectedLocation, name: 'Current Location', lat: pos.coords.latitude, lng: pos.coords.longitude, country: null });
        } finally {
          setIsLocating(false);
        }
      },
      () => setIsLocating(false)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-bottom-full sm:zoom-in-95 sm:slide-in-from-bottom-10 duration-500 border-t sm:border border-white/20 max-h-[92vh] flex flex-col">
        
        {/* Header - High Contrast */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 flex items-center justify-between flex-shrink-0">
            <div>
                <h2 className="text-2xl sm:text-3xl font-display text-slate-900 tracking-tight leading-none uppercase italic">CHOOSE YOUR BID RADIUS</h2>
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                  <Globe size={10} strokeWidth={3} /> GLOBAL SEARCH ACTIVE
                </p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-900 transition-all active:scale-90"
            >
              <X size={20} strokeWidth={3} />
            </button>
        </div>

        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 overflow-y-auto no-scrollbar flex-1">
          
          {/* Search Box - Improved Contrast */}
          <div className="relative mb-6">
            <div className={`
                relative flex items-center gap-3 px-5 py-4 bg-slate-100 border-2 rounded-[20px] transition-all duration-300
                ${results.length > 0 ? 'border-[#2238ff] bg-white ring-4 ring-blue-50' : 'border-transparent hover:bg-slate-200/50 focus-within:bg-white focus-within:border-[#2238ff] focus-within:ring-4 focus-within:ring-blue-50'}
            `}>
                <Search size={22} className={isLoading ? 'text-[#2238ff] animate-pulse' : 'text-slate-800'} strokeWidth={3} />
                <input 
                  type="text"
                  placeholder="Enter any city worldwide..."
                  value={query}
                  onChange={handleQueryChange}
                  className="bg-transparent flex-1 text-lg font-bold text-slate-900 focus:outline-none placeholder:text-slate-500 tracking-tight"
                />
            </div>

            {/* High Contrast Results Dropdown */}
            {results.length > 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border-2 border-slate-200 rounded-[24px] shadow-[0_24px_48px_rgba(0,0,0,0.2)] z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    {results.map((res, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelect(res)}
                          className="w-full text-left px-6 py-4 hover:bg-blue-50 flex items-center justify-between border-b border-slate-100 last:border-0 group transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-base font-bold text-slate-900 group-hover:text-[#2238ff] transition-colors">
                              {res.address.city || res.address.town || res.address.village || res.display_name.split(',')[0]}
                              <span className="text-slate-800 font-bold ml-2">
                                {res.address.state || res.address.province || ''}
                              </span>
                            </span>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5">
                              {res.address.country || 'International'}
                            </span>
                          </div>
                          <ArrowRight size={18} strokeWidth={3} className="text-slate-900 group-hover:text-[#2238ff] group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>
            )}
          </div>

          {/* Location Context - High Contrast */}
          <div className="flex flex-col gap-3 mb-8">
              {selectedLocation.lat ? (
                <div className="group flex items-center gap-4 bg-slate-50 p-4 rounded-[24px] border border-slate-300 animate-in zoom-in-95 duration-500">
                   <div className="w-12 h-12 rounded-xl bg-[#2238ff] flex items-center justify-center text-white shadow-lg shadow-blue-200/50 flex-shrink-0">
                        <Target size={22} strokeWidth={3} className="animate-pulse" />
                   </div>
                   <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black text-[#2238ff] uppercase tracking-[0.2em] block mb-0.5">CURRENT CENTER</span>
                        <h4 className="text-lg font-display uppercase tracking-tight text-slate-900 truncate">{selectedLocation.name}</h4>
                   </div>
                   <button 
                    onClick={() => setSelectedLocation({ name: 'All locations', lat: null, lng: null, radiusKm: 50, country: null })}
                    className="w-8 h-8 rounded-full bg-slate-200 hover:bg-red-500 hover:text-white text-slate-800 transition-all flex items-center justify-center flex-shrink-0"
                   >
                       <X size={16} strokeWidth={3} />
                   </button>
                </div>
              ) : (
                <button 
                  onClick={useCurrentLocation}
                  disabled={isLocating}
                  className="group flex items-center gap-4 p-4 rounded-[24px] border-2 border-dashed border-slate-300 hover:border-[#2238ff] hover:bg-blue-50 transition-all active:scale-[0.98]"
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${isLocating ? 'bg-[#2238ff] text-white' : 'bg-slate-200 text-slate-800 group-hover:bg-white group-hover:text-[#2238ff]'}`}>
                        {isLocating ? <Loader2 size={24} className="animate-spin" /> : <Navigation size={24} strokeWidth={3} />}
                    </div>
                    <div className="text-left">
                        <h4 className={`text-base font-black uppercase tracking-tight ${isLocating ? 'text-[#2238ff]' : 'text-slate-900'}`}>Use Current Location</h4>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Find deals exactly where you are</p>
                    </div>
                </button>
              )}
          </div>

          {/* Radius Engine - Tactile & Clear */}
          <div className={`space-y-4 mb-8 transition-all duration-700 ${!selectedLocation.lat ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
             <div className="flex items-end justify-between px-1">
                <div>
                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">RADIUS CIRCLE</label>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                        Searching <span className="text-[#2238ff] font-black">{radius} km</span> around center
                    </p>
                </div>
                <div className="text-3xl font-display text-slate-900 tracking-tighter italic">
                    {radius}<span className="text-sm ml-1 text-slate-800 not-italic font-sans font-black uppercase tracking-tight">km</span>
                </div>
             </div>

             {/* Tactile Slider */}
             <div className="relative h-10 flex items-center group/slider">
                <div className="absolute inset-x-0 h-3 bg-slate-200 rounded-full" />
                <div 
                   className="absolute h-3 bg-[#2238ff] rounded-full shadow-[0_2px_8px_rgba(0,34,255,0.4)] transition-all duration-300 ease-out" 
                   style={{ width: `${Math.min(100, (radius / 500) * 100)}%` }} 
                />
                <input 
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
                />
                <div 
                   className="absolute h-9 w-9 bg-white border-[4px] border-[#2238ff] rounded-full shadow-xl pointer-events-none transition-all duration-300 ease-out z-10 flex items-center justify-center group-hover/slider:scale-105"
                   style={{ left: `calc(${Math.min(100, (radius / 500) * 100)}% - 18px)` }}
                >
                   <div className="w-1.5 h-1.5 bg-[#2238ff] rounded-full" />
                </div>
             </div>

             {/* Preset Chips */}
             <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 justify-center">
                {RADIUS_PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setRadius(p)}
                    className={`
                      py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border-2
                      ${radius === p ? 'bg-[#2238ff] text-white border-[#2238ff] shadow-md' : 'bg-white text-slate-900 border-slate-100 hover:border-slate-300'}
                    `}
                  >
                    {p} km
                  </button>
                ))}
             </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => {
                  setSelectedLocation({ name: 'All locations', lat: null, lng: null, radiusKm: 50, country: null });
                  setRadius(50);
              }}
              className="px-6 py-4 rounded-[20px] font-black text-slate-800 uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={() => onApply({ ...selectedLocation, radiusKm: radius })}
              className="flex-1 py-4.5 bg-[#2238ff] rounded-[24px] font-black text-white uppercase tracking-widest text-sm shadow-[0_12px_32px_rgba(0,34,255,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              SYNC RESULTS <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;