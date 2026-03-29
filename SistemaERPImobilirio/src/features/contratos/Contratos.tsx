import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, AlertTriangle, CheckCircle, Clock, Edit } from 'lucide-react';
import { ContractForm, type FormattedContract } from './ContractForm';
import { AdvancedFilter } from '../../components/ui/AdvancedFilter';
import { createContract, getClients, getContracts, getProperties, updateContract, type ContractApiModel } from '../../services/api';

type Contract = FormattedContract;
type ContractFilters = Record<string, string | number | null | undefined>;

const filterOptions = [
  { id: 'status', label: 'Status', type: 'select' as const, options: [
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Pendente Assinatura', label: 'Pendente Assinatura' },
    { value: 'Finalizado', label: 'Finalizado' },
    { value: 'Cancelado', label: 'Cancelado' }
  ]},
  { id: 'type', label: 'Tipo de Contrato', type: 'select' as const, options: [
    { value: 'Venda', label: 'Venda' },
    { value: 'Aluguel', label: 'Aluguel' }
  ]},
];

const Contratos = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Array<{ id: string; name: string; type: string }>>([]);
  const [properties, setProperties] = useState<Array<{ id: string; title: string; type: string; price: number }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ContractFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contractsResponse, clientsResponse, propertiesResponse] = await Promise.all([
          getContracts({ page: 1, pageSize: 200 }),
          getClients({ page: 1, pageSize: 200 }),
          getProperties({ page: 1, pageSize: 200 })
        ]);
        setContracts(contractsResponse.items.map(mapContractFromApi));
        setClients(clientsResponse.items.map(item => ({ id: item.id, name: item.name, type: item.type })));
        setProperties(propertiesResponse.items.map(item => ({ id: item.id, title: item.title, type: item.type, price: item.price })));
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Cliente não encontrado';
  const getPropertyTitle = (id: string) => properties.find(p => p.id === id)?.title || 'Imóvel não encontrado';

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const clientName = getClientName(contract.clientId).toLowerCase();
      const propertyTitle = getPropertyTitle(contract.propertyId).toLowerCase();
      const matchSearch = clientName.includes(searchTerm.toLowerCase()) || propertyTitle.includes(searchTerm.toLowerCase());
      
      const matchStatus = !filters.status || contract.status === filters.status;
      const matchType = !filters.type || contract.type === filters.type;
      
      return matchSearch && matchStatus && matchType;
    }).slice(0, 50);
  }, [contracts, searchTerm, filters]);

  const handleSaveContract = async (newContract: Contract) => {
    if (selectedContract) {
      const updated = await updateContract(newContract.id, {
        type: newContract.type,
        propertyId: newContract.propertyId,
        clientId: newContract.clientId,
        value: newContract.value,
        status: newContract.status,
        startDate: newContract.startDate,
        endDate: newContract.endDate,
        signedAt: newContract.signedAt
      });
      setContracts(prev => prev.map(c => c.id === updated.id ? mapContractFromApi(updated) : c));
      return;
    }

    const created = await createContract({
      type: newContract.type,
      propertyId: newContract.propertyId,
      clientId: newContract.clientId,
      value: newContract.value,
      status: newContract.status,
      startDate: newContract.startDate,
      endDate: newContract.endDate,
      signedAt: newContract.signedAt
    });
    setContracts(prev => [mapContractFromApi(created), ...prev]);
  };

  const getStatusBadge = (status: string, endDate: string) => {
    const isExpiringSoon = new Date(endDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000; // 30 days

    switch (status) {
      case 'Ativo':
        if (isExpiringSoon) {
          return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 flex items-center gap-1 w-max"><AlertTriangle size={12}/> Vence em breve</span>;
        }
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center gap-1 w-max"><CheckCircle size={12}/> Ativo</span>;
      case 'Pendente Assinatura':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 flex items-center gap-1 w-max"><Clock size={12}/> Aguardando Assinatura</span>;
      case 'Finalizado':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1 w-max"><CheckCircle size={12}/> Finalizado</span>;
      case 'Cancelado':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 flex items-center gap-1 w-max"><AlertTriangle size={12}/> Cancelado</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">{status}</span>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestão de Contratos</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Controle de vigência, assinaturas e documentos</p>
        </div>
        <button 
          onClick={() => { setSelectedContract(null); setIsFormOpen(true); }}
          className="w-full sm:w-auto bg-[var(--color-primary)] hover:opacity-90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-opacity shadow-sm"
        >
          <Plus size={18} />
          Novo Contrato
        </button>
      </div>

      <AdvancedFilter 
        onSearch={setSearchTerm} 
        onFilterChange={setFilters} 
        filterOptions={filterOptions} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {!isLoading && filteredContracts.map((contract, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={contract.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
          >
            <div className="flex flex-wrap gap-3 justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                <FileText size={20} />
              </div>
              {getStatusBadge(contract.status, contract.endDate)}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Cliente</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{getClientName(contract.clientId)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Imóvel</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{getPropertyTitle(contract.propertyId)}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500">Valor</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(contract.value)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tipo</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{contract.type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                <div>
                  <p className="text-xs text-slate-500">Início</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{new Date(contract.startDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Término</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{new Date(contract.endDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => { setSelectedContract(contract); setIsFormOpen(true); }}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:text-[var(--color-primary)] transition-colors"
              >
                <Edit size={16} />
              </button>
            </div>
          </motion.div>
        ))}

        {!isLoading && filteredContracts.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Nenhum contrato encontrado</h3>
            <p className="text-slate-500 mt-1">Tente ajustar seus filtros de busca.</p>
          </div>
        )}

        {isLoading && (
          <div className="col-span-full p-12 text-center text-slate-500">
            Carregando contratos...
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <ContractForm 
            contract={selectedContract ?? undefined}
            clients={clients}
            properties={properties}
            onClose={() => setIsFormOpen(false)} 
            onSubmit={handleSaveContract} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contratos;

function mapContractFromApi(contract: ContractApiModel): FormattedContract {
  return {
    id: contract.id,
    type: contract.type,
    propertyId: contract.propertyId,
    clientId: contract.clientId,
    value: contract.value,
    status: contract.status,
    startDate: contract.startDate,
    endDate: contract.endDate,
    signedAt: contract.signedAt ?? null
  };
}
