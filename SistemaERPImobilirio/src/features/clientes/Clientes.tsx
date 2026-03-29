import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mail, Phone, User, Download } from 'lucide-react';
import { ClientForm, type FormattedClient } from './ClientForm';
import { AdvancedFilter } from '../../components/ui/AdvancedFilter';
import { createClient, getClients, updateClient, type ClientApiModel } from '../../services/api';

type Client = FormattedClient;
type ClientFilters = Record<string, string | number | null | undefined>;

const filterOptions = [
  { id: 'type', label: 'Tipo de Cliente', type: 'select' as const, options: [
    { value: 'Comprador', label: 'Comprador' },
    { value: 'Vendedor', label: 'Vendedor' },
    { value: 'Locatário', label: 'Locatário' },
    { value: 'Locador', label: 'Locador' }
  ]},
  { id: 'propertyType', label: 'Interesse (Tipo Imóvel)', type: 'select' as const, options: [
    { value: 'Casa', label: 'Casa' },
    { value: 'Apartamento', label: 'Apartamento' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Cobertura', label: 'Cobertura' }
  ]},
];

const Clientes = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ClientFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await getClients({ page: 1, pageSize: 200 });
        setClients(response.items.map(mapClientFromApi));
      } finally {
        setIsLoading(false);
      }
    };

    void loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchType = !filters.type || client.type === filters.type;
      const matchPropertyType = !filters.propertyType || client.interest?.propertyType === filters.propertyType;
      
      return matchSearch && matchType && matchPropertyType;
    }).slice(0, 50);
  }, [clients, searchTerm, filters]);

  const handleAddClient = async (newClient: Client) => {
    if (selectedClient) {
      const updated = await updateClient(newClient.id, {
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        type: newClient.type,
        interestPropertyType: newClient.interest?.propertyType,
        interestMaxPrice: newClient.interest?.maxPrice
      });
      setClients(prev => prev.map(c => c.id === updated.id ? mapClientFromApi(updated) : c));
      return;
    }

    const created = await createClient({
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      type: newClient.type,
      interestPropertyType: newClient.interest?.propertyType,
      interestMaxPrice: newClient.interest?.maxPrice
    });
    setClients(prev => [mapClientFromApi(created), ...prev]);
  };

  const handleExportCSV = () => {
    const headers = ['Nome', 'Tipo', 'Email', 'Telefone', 'Interesse', 'Valor Max'];
    const csvContent = [
      headers.join(','),
      ...clients.slice(0, 100).map(c => 
        `"${c.name}","${c.type}","${c.email}","${c.phone}","${c.interest?.propertyType || ''}","${c.interest?.maxPrice || ''}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clientes.csv';
    link.click();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Comprador': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'Vendedor': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400';
      case 'Locatário': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Locador': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestão de Clientes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie compradores, vendedores e locatários</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button 
            onClick={handleExportCSV}
            className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Download size={18} />
            Exportar
          </button>
          <button 
            onClick={() => { setSelectedClient(null); setIsFormOpen(true); }}
            className="w-full sm:w-auto bg-[var(--color-primary)] hover:opacity-90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-opacity shadow-sm"
          >
            <Plus size={18} />
            Novo Cliente
          </button>
        </div>
      </div>

      <AdvancedFilter 
        onSearch={setSearchTerm} 
        onFilterChange={setFilters} 
        filterOptions={filterOptions} 
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Interesse</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {!isLoading && filteredClients.map((client, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  key={client.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{client.name}</p>
                        <p className="text-xs text-slate-500">Cadastrado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" /> {client.email}
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" /> {client.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(client.type)}`}>
                      {client.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {client.interest ? (
                      <div>
                        <p className="text-sm text-slate-900 dark:text-white">{client.interest.propertyType}</p>
                        <p className="text-xs text-slate-500">
                          Até {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.interest.maxPrice ?? 0)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedClient(client); setIsFormOpen(true); }}
                      className="text-sm font-medium text-[var(--color-primary)] hover:underline opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    >
                      Editar
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {!isLoading && filteredClients.length === 0 && (
            <div className="p-12 text-center">
              <User className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Nenhum cliente encontrado</h3>
              <p className="text-slate-500 mt-1">Tente ajustar seus filtros de busca.</p>
            </div>
          )}

          {isLoading && (
            <div className="p-12 text-center text-slate-500">
              Carregando clientes...
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <ClientForm 
            client={selectedClient ?? undefined}
            onClose={() => setIsFormOpen(false)} 
            onSubmit={handleAddClient} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clientes;

function mapClientFromApi(client: ClientApiModel): FormattedClient {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    type: client.type,
    interest: client.interest ? {
      propertyType: client.interest.propertyType,
      maxPrice: client.interest.maxPrice
    } : null,
    createdAt: client.createdAt
  };
}
