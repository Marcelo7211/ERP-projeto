import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { X, Check, AlertCircle, FileSignature } from 'lucide-react';

const contractSchema = z.object({
  type: z.string().min(1, 'Selecione um tipo'),
  clientId: z.string().min(1, 'Selecione um cliente'),
  propertyId: z.string().min(1, 'Selecione um imóvel'),
  value: z.coerce.number().min(1, 'Valor inválido'),
  status: z.string().min(1, 'Selecione o status'),
  startDate: z.string().min(1, 'Data inicial obrigatória'),
  endDate: z.string().min(1, 'Data final obrigatória'),
});

type ContractFormData = z.infer<typeof contractSchema>;

export interface FormattedContract extends ContractFormData {
  id: string;
  startDate: string;
  endDate: string;
  signedAt: string | null;
}

interface ContractFormProps {
  contract?: FormattedContract;
  clients: Array<{ id: string; name: string; type?: string }>;
  properties: Array<{ id: string; title: string; type?: string; price: number }>;
  initialData?: {
    type?: string;
    clientId?: string;
    propertyId?: string;
    value?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  };
  onClose: () => void;
  onSubmit: (data: FormattedContract) => Promise<void> | void;
}

export const ContractForm = ({ contract, clients, properties, initialData, onClose, onSubmit }: ContractFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const defaultValues = {
    type: '',
    clientId: '',
    propertyId: '',
    value: 0,
    status: 'Pendente Assinatura',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
  };

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(contractSchema),
    defaultValues
  });

  const watchPropertyId = watch('propertyId');
  const watchStatus = watch('status');

  useEffect(() => {
    if (contract) {
      reset({
        type: contract.type,
        clientId: contract.clientId,
        propertyId: contract.propertyId,
        value: contract.value,
        status: contract.status,
        startDate: contract.startDate.split('T')[0],
        endDate: contract.endDate.split('T')[0],
      });
      return;
    }
    if (initialData) {
      reset({
        ...defaultValues,
        ...initialData,
      });
      return;
    }
    reset(defaultValues);
  }, [contract, initialData, reset]);

  useEffect(() => {
    // Auto-fill value based on property if not editing
    if (!contract && watchPropertyId) {
      const property = properties.find(p => p.id === watchPropertyId);
      if (property) {
        setValue('value', property.price);
      }
    }
  }, [watchPropertyId, contract, properties, setValue]);

  const handleFormSubmit = async (data: ContractFormData) => {
    setIsSubmitting(true);
    
    const formattedData = {
      id: contract ? contract.id : `ctrt-${Date.now()}`,
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      signedAt: watchStatus === 'Ativo' ? new Date().toISOString() : null,
    };
    
    await onSubmit(formattedData);
    setIsSubmitting(false);
    onClose();
  };

  const handleSimulateSignature = async () => {
    setIsSigning(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    setValue('status', 'Ativo');
    setIsSigning(false);
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
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {contract ? 'Editar Contrato' : 'Novo Contrato'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="contract-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Contrato</label>
                <select 
                  {...register('type')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                >
                  <option value="">Selecione...</option>
                  <option value="Venda">Venda</option>
                  <option value="Aluguel">Aluguel</option>
                </select>
                {errors.type && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.type.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select 
                  {...register('status')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                >
                  <option value="Pendente Assinatura">Pendente Assinatura</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
                {errors.status && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.status.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cliente</label>
                <select 
                  {...register('clientId')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                >
                  <option value="">Selecione...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name} - {client.type}</option>
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
                  <option value="">Selecione...</option>
                  {properties.map(prop => (
                    <option key={prop.id} value={prop.id}>{prop.title} - {prop.type}</option>
                  ))}
                </select>
                {errors.propertyId && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.propertyId.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Valor do Contrato (R$)</label>
                <input 
                  type="number"
                  {...register('value')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                />
                {errors.value && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.value.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Data de Início</label>
                <input 
                  type="date"
                  {...register('startDate')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                />
                {errors.startDate && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.startDate.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Data de Término</label>
                <input 
                  type="date"
                  {...register('endDate')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                />
                {errors.endDate && <p className="text-rose-500 text-xs flex items-center gap-1"><AlertCircle size={12} />{errors.endDate.message as string}</p>}
              </div>
            </div>

            {/* Simulação de Assinatura Digital */}
            {watchStatus === 'Pendente Assinatura' && (
              <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                    <FileSignature size={18} />
                    Assinatura Digital
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Simule o envio e assinatura digital do contrato pelos envolvidos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSimulateSignature}
                  disabled={isSigning}
                  className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSigning ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processando...</>
                  ) : (
                    'Simular Assinatura'
                  )}
                </button>
              </div>
            )}
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
            form="contract-form"
            disabled={isSubmitting || isSigning}
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
                Salvar Contrato
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
