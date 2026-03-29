import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { X, Upload, Check, AlertCircle } from 'lucide-react';

const propertySchema = z.object({
  title: z.string().min(5, 'O título deve ter no mínimo 5 caracteres'),
  type: z.string().min(1, 'Selecione um tipo'),
  address: z.string().min(10, 'O endereço deve ter no mínimo 10 caracteres'),
  area: z.coerce.number().min(1, 'A área deve ser maior que 0'),
  bedrooms: z.coerce.number().min(0, 'Não pode ser negativo'),
  bathrooms: z.coerce.number().min(0, 'Não pode ser negativo'),
  price: z.coerce.number().min(1, 'O preço deve ser maior que 0'),
  description: z.string().min(20, 'A descrição deve ter no mínimo 20 caracteres'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyRecord {
  id: string;
  title: string;
  type: string;
  address: string;
  price: number;
  rentPrice: number;
  status: string;
  createdAt: string;
  image: string;
  description?: string;
  images?: string[];
  features: {
    bedrooms: number;
    bathrooms: number;
    parking: number;
    area: number;
  };
}

interface PropertyFormProps {
  property?: PropertyRecord;
  onClose: () => void;
  onSubmit: (data: PropertyRecord) => Promise<void> | void;
}

export const PropertyForm = ({ property, onClose, onSubmit }: PropertyFormProps) => {
  const [images, setImages] = useState<string[]>(property?.image ? [property.image] : []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      type: '',
      address: '',
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      price: 0,
      description: '',
    }
  });

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        type: property.type,
        address: property.address,
        area: property.features?.area ?? 0,
        bedrooms: property.features?.bedrooms ?? 0,
        bathrooms: property.features?.bathrooms ?? 0,
        price: property.price,
        description: property.description || `${property.title} localizado em ${property.address}.`,
      });
      return;
    }
    reset({
      title: '',
      type: '',
      address: '',
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      price: 0,
      description: '',
    });
  }, [property, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 5)); // Limit to 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    
    const fallbackImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000';
    const generatedId = `prop-${`${data.title}-${data.address}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 28)}`;

    await onSubmit({
      id: property?.id ?? generatedId,
      title: data.title,
      type: data.type,
      address: data.address,
      price: data.price,
      rentPrice: property?.rentPrice ?? Math.round(data.price * 0.004),
      image: images[0] || property?.image || fallbackImage,
      images: images.length > 0 ? images : [property?.image || fallbackImage],
      status: property?.status ?? 'Disponível',
      createdAt: property?.createdAt ?? new Date().toISOString(),
      description: data.description,
      features: {
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parking: property?.features?.parking ?? 0,
        area: data.area,
      },
    });
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden my-8 flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{property ? 'Editar Imóvel' : 'Novo Imóvel'}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="property-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Título do Anúncio</label>
                <input 
                  {...register('title')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                  placeholder="Ex: Apartamento de Luxo no Centro"
                />
                {errors.title && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Imóvel</label>
                <select 
                  {...register('type')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                >
                  <option value="">Selecione...</option>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Terreno">Terreno</option>
                </select>
                {errors.type && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.type.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Endereço Completo</label>
              <input 
                {...register('address')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                placeholder="Rua, Número, Bairro, Cidade - Estado"
              />
              {errors.address && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Área (m²)</label>
                <input 
                  type="number"
                  {...register('area')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                  placeholder="0"
                />
                {errors.area && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.area.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quartos</label>
                <input 
                  type="number"
                  {...register('bedrooms')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                />
                {errors.bedrooms && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.bedrooms.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Banheiros</label>
                <input 
                  type="number"
                  {...register('bathrooms')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                />
                {errors.bathrooms && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.bathrooms.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Valor (R$)</label>
                <input 
                  type="number"
                  {...register('price')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                  placeholder="0.00"
                />
                {errors.price && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.price.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Descrição Detalhada</label>
              <textarea 
                {...register('description')}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all resize-none"
                placeholder="Descreva os diferenciais do imóvel..."
              />
              {errors.description && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fotos do Imóvel</label>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-700">
                    <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="text-white" size={20} />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[var(--color-primary)] dark:hover:border-[var(--color-primary)] flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-[var(--color-primary)] transition-colors bg-slate-50 dark:bg-slate-900">
                    <Upload size={24} />
                    <span className="text-xs mt-1 font-medium">Adicionar</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-slate-500">Máximo de 5 fotos. Formatos suportados: JPG, PNG.</p>
            </div>
          </form>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="property-form"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--color-primary)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Check size={18} />
                Salvar Imóvel
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
