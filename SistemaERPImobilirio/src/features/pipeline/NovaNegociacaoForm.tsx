import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { X, Check, AlertCircle } from 'lucide-react';

const negociacaoSchema = z.object({
  title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres'),
  clientId: z.string().min(1, 'Selecione um cliente'),
  propertyId: z.string().min(1, 'Selecione um imóvel'),
  value: z.coerce.number().min(1, 'Valor inválido'),
  columnId: z.string().min(1, 'Selecione a etapa'),
});

type NegotiationFormInput = z.input<typeof negociacaoSchema>;
type NegotiationFormData = z.output<typeof negociacaoSchema>;

interface PipelineColumn {
  id: string;
  title: string;
}

interface PipelineItem {
  id: string;
  title: string;
  clientId: string;
  propertyId: string;
  client: string;
  value: number;
  date: string;
  lastInteractionAt: string;
  columnId: string;
}

interface NovaNegociacaoFormProps {
  onClose: () => void;
  onSubmit: (data: PipelineItem) => Promise<void> | void;
  columns: PipelineColumn[];
  clients: Array<{ id: string; name: string }>;
  properties: Array<{ id: string; title: string; price: number }>;
  initialColumnId: string;
}

export const NovaNegociacaoForm = ({ onClose, onSubmit, columns, clients, properties, initialColumnId }: NovaNegociacaoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<NegotiationFormInput, undefined, NegotiationFormData>({
    resolver: zodResolver(negociacaoSchema),
    defaultValues: {
      title: '',
      clientId: '',
      propertyId: '',
      value: 0,
      columnId: initialColumnId,
    }
  });

  const watchPropertyId = watch('propertyId');

  // Auto-fill value and title when property is selected
  useEffect(() => {
    if (watchPropertyId) {
      const property = properties.find(p => p.id === watchPropertyId);
      if (property) {
        setValue('value', property.price);
        setValue('title', `Negociação: ${property.title}`);
      }
    }
  }, [watchPropertyId, properties, setValue]);

  useEffect(() => {
    setValue('columnId', initialColumnId);
  }, [initialColumnId, setValue]);

  const handleFormSubmit = async (data: NegotiationFormData) => {
    setIsSubmitting(true);
    
    const client = clients.find(c => c.id === data.clientId);
    
    const formattedData = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      clientId: data.clientId,
      propertyId: data.propertyId,
      client: client ? client.name : 'Cliente',
      value: data.value,
      date: 'Hoje',
      lastInteractionAt: new Date().toISOString(),
      columnId: data.columnId
    };
    
    await onSubmit(formattedData);
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
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden my-8 flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Nova Negociação</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="negociacao-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Título da Negociação</label>
              <input 
                {...register('title')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                placeholder="Ex: Interesse em Casa Jardins"
              />
              {errors.title && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.title.message as string}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cliente</label>
                <select 
                  {...register('clientId')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                >
                  <option value="">Selecione o cliente...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
                {errors.clientId && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.clientId.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Imóvel</label>
                <select 
                  {...register('propertyId')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                >
                  <option value="">Selecione o imóvel...</option>
                  {properties.map(prop => (
                    <option key={prop.id} value={prop.id}>{prop.title}</option>
                  ))}
                </select>
                {errors.propertyId && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.propertyId.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Valor Estimado (R$)</label>
                <input 
                  type="number"
                  {...register('value')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                />
                {errors.value && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.value.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Etapa do Funil</label>
                <select 
                  {...register('columnId')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                >
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
                {errors.columnId && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.columnId.message as string}</p>}
              </div>
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
            form="negociacao-form"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--color-primary)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Check size={18} />
                Criar Negociação
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
