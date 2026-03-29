import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Save, Bookmark } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'date';
  options?: { value: string; label: string }[];
}

type FilterValue = string | number | null | undefined;
type FiltersMap = Record<string, FilterValue>;

interface AdvancedFilterProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: FiltersMap) => void;
  filterOptions: FilterOption[];
}

export const AdvancedFilter = ({ onSearch, onFilterChange, filterOptions }: AdvancedFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FiltersMap>({});
  const [savedFilters, setSavedFilters] = useState<{name: string, filters: FiltersMap}[]>([]);
  const [isSavingFilter, setIsSavingFilter] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  const handleFilterChange = (id: string, value: FilterValue) => {
    const newFilters = { ...filters, [id]: value };
    if (!value || value === 'Todos') {
      delete newFilters[id];
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const saveCurrentFilter = () => {
    const normalizedName = newFilterName.trim();
    if (!normalizedName) return;
    setSavedFilters([...savedFilters, { name: normalizedName, filters: { ...filters } }]);
    setNewFilterName('');
    setIsSavingFilter(false);
  };

  const applySavedFilter = (saved: FiltersMap) => {
    setFilters(saved);
    onFilterChange(saved);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Busca rápida em tempo real..." 
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:text-white transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all border ${
              isExpanded || Object.keys(filters).length > 0 
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400' 
                : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filtros Avançados
            {Object.keys(filters).length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
          >
            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filterOptions.map(option => (
                  <div key={option.id} className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {option.label}
                    </label>
                    
                    {option.type === 'select' && option.options ? (
                      <select 
                        value={filters[option.id] || ''}
                        onChange={(e) => handleFilterChange(option.id, e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:text-white"
                      >
                        <option value="Todos">Todos</option>
                        {option.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : option.type === 'number' ? (
                      <input 
                        type="number"
                        value={filters[option.id] || ''}
                        onChange={(e) => handleFilterChange(option.id, e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:text-white"
                      />
                    ) : (
                      <input 
                        type="text"
                        value={filters[option.id] || ''}
                        onChange={(e) => handleFilterChange(option.id, e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:text-white"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-2 min-w-0">
                  {savedFilters.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      <Bookmark size={14} className="text-slate-400" />
                      {savedFilters.map((sf, idx) => (
                        <button 
                          key={idx}
                          onClick={() => applySavedFilter(sf.filters)}
                          className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md hover:border-[var(--color-primary)] transition-colors"
                        >
                          {sf.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center gap-1"
                  >
                    <X size={14} /> Limpar
                  </button>
                  <button
                    onClick={() => setIsSavingFilter(true)}
                    disabled={Object.keys(filters).length === 0}
                    className="text-sm text-[var(--color-primary)] hover:opacity-80 flex items-center justify-center gap-1 font-medium disabled:opacity-50"
                  >
                    <Save size={14} /> Salvar Filtro
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {isSavingFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-4 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <input
                        type="text"
                        value={newFilterName}
                        onChange={(e) => setNewFilterName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            saveCurrentFilter();
                          }
                        }}
                        placeholder="Nome do filtro"
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsSavingFilter(false);
                            setNewFilterName('');
                          }}
                          className="flex-1 sm:flex-none px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={saveCurrentFilter}
                          disabled={!newFilterName.trim()}
                          className="flex-1 sm:flex-none px-3 py-2 text-sm rounded-lg bg-[var(--color-primary)] text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
