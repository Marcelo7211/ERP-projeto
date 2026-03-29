import { useEffect, useState, type FormEvent } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { motion } from 'framer-motion';
import { Save, Palette, Building, Image as ImageIcon } from 'lucide-react';
import { getCurrentSetting, updateSetting } from '../../services/api';

const presetColors = [
  { name: 'Slate (Default)', value: '#0f172a' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Orange', value: '#ea580c' },
];

const defaultPrimaryColor = '#0f172a';

const normalizeHexColor = (value: string) => {
  const normalized = value.trim().toUpperCase();
  return /^#[0-9A-F]{6}$/.test(normalized) ? normalized : defaultPrimaryColor;
};

const Settings = () => {
  const { config, setConfig } = useAppStore();
  const [formData, setFormData] = useState(config);
  const [saved, setSaved] = useState(false);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  useEffect(() => {
    const loadCurrentSetting = async () => {
      try {
        const current = await getCurrentSetting();
        const normalizedPrimaryColor = normalizeHexColor(current.primaryColor);
        const normalizedConfig = {
          companyName: current.companyName,
          primaryColor: normalizedPrimaryColor,
          logoUrl: current.logoUrl
        };
        setSettingId(current.id);
        setConfig(normalizedConfig);
        setFormData(normalizedConfig);
        document.documentElement.style.setProperty('--color-primary', normalizedPrimaryColor);
      } catch {
        setSettingId(null);
      }
    };

    void loadCurrentSetting();
  }, [setConfig]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settingId) {
      return;
    }
    setIsSaving(true);
    const normalizedPrimaryColor = normalizeHexColor(formData.primaryColor);
    const normalizedConfig = { ...formData, primaryColor: normalizedPrimaryColor };
    await updateSetting(settingId, {
      companyName: normalizedConfig.companyName,
      primaryColor: normalizedConfig.primaryColor,
      logoUrl: normalizedConfig.logoUrl,
      isActive: true
    });
    setConfig(normalizedConfig);
    setFormData(normalizedConfig);
    document.documentElement.style.setProperty('--color-primary', normalizedPrimaryColor);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações White-Label</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Personalize a identidade visual do ERP para a sua imobiliária.</p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Company Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-2">
              <Building size={18} className="text-slate-400" />
              Nome da Imobiliária
            </label>
            <input 
              type="text" 
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              placeholder="Ex: Imobiliária Prime"
            />
            <p className="text-xs text-slate-500 mt-2">Este nome aparecerá no menu lateral e nos relatórios gerados.</p>
          </div>

          {/* Primary Color */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-4">
              <Palette size={18} className="text-slate-400" />
              Cor Principal da Marca
            </label>
            
            <div className="flex flex-wrap gap-4 mb-4">
              {presetColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, primaryColor: color.value })}
                  className={`w-12 h-12 rounded-full cursor-pointer transition-transform flex items-center justify-center ${
                    formData.primaryColor === color.value ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.value, '--tw-ring-color': color.value } as React.CSSProperties}
                  title={color.name}
                >
                  {formData.primaryColor === color.value && (
                    <div className="w-4 h-4 bg-white rounded-full opacity-50" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Cor customizada HEX:</span>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="h-8 w-14 p-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-24 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-2">
              <ImageIcon size={18} className="text-slate-400" />
              URL do Logotipo (Opcional)
            </label>
            <input 
              type="url" 
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              placeholder="https://sua-empresa.com/logo.png"
            />
          </div>

        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            As configurações são salvas localmente no seu navegador.
          </p>
          <button 
            type="submit"
            disabled={isSaving || !settingId}
            className="px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm"
          >
            <Save size={18} />
            {isSaving ? 'Salvando...' : saved ? 'Configurações Salvas!' : 'Salvar Alterações'}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default Settings;
