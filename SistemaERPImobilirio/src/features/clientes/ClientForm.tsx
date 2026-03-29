import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { X, Check, AlertCircle } from 'lucide-react';

const clientSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  type: z.string().min(1, 'Selecione um tipo'),
  interestPropertyType: z.string().optional(),
  interestMaxPrice: z.coerce.number().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export interface FormattedClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  interest: {
    propertyType: string;
    maxPrice?: number;
  } | null;
  createdAt: string;
}

interface ClientFormProps {
  client?: FormattedClient;
  onClose: () => void;
  onSubmit: (data: FormattedClient) => Promise<void> | void;
}

export const ClientForm = ({ client, onClose, onSubmit }: ClientFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      type: '',
      interestPropertyType: '',
      interestMaxPrice: 0,
    }
  });

  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        email: client.email,
        phone: client.phone,
        type: client.type,
        interestPropertyType: client.interest?.propertyType || '',
        interestMaxPrice: client.interest?.maxPrice || 0,
      });
    }
  }, [client, reset]);

  const handleFormSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    
    const formattedData = {
      id: client ? client.id : `cli-${data.email.split('@')[0]}-${data.phone.replace(/\D/g, '').slice(-6)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      interest: data.interestPropertyType ? {
        propertyType: data.interestPropertyType,
        maxPrice: data.interestMaxPrice
      } : null,
      createdAt: client ? client.createdAt : new Date().toISOString(),
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
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {client ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="client-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nome Completo</label>
                <input 
                  {...register('name')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                  placeholder="Ex: João da Silva"
                />
                {errors.name && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.name.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Cliente</label>
                <select 
                  {...register('type')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                >
                  <option value="">Selecione...</option>
                  <option value="Comprador">Comprador</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Locatário">Locatário</option>
                  <option value="Locador">Locador</option>
                </select>
                {errors.type && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.type.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input 
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                  placeholder="joao@exemplo.com"
                />
                {errors.email && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.email.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Telefone</label>
                <input 
                  {...register('phone')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                  placeholder="(11) 99999-9999"
                />
                {errors.phone && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.phone.message as string}</p>}
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Interesse (Opcional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Imóvel</label>
                  <select 
                    {...register('interestPropertyType')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Cobertura">Cobertura</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Valor Máximo (R$)</label>
                  <input 
                    type="number"
                    {...register('interestMaxPrice')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
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
            form="client-form"
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
                Salvar Cliente
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
