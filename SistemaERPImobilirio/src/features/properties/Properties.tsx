import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, MapPin, Home, X } from 'lucide-react';
import { PropertyForm } from './PropertyForm';
import { ContractForm } from '../contratos/ContractForm';
import { AdvancedFilter } from '../../components/ui/AdvancedFilter';
import { createContract, createProperty, getClients, getProperties, updateProperty, type PropertyApiModel } from '../../services/api';

interface Property {
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

interface ContractInitialData {
  type?: string;
  clientId?: string;
  propertyId?: string;
  value?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

const filterOptions = [
  { id: 'type', label: 'Tipo de Imóvel', type: 'select' as const, options: [
    { value: 'Casa', label: 'Casa' },
    { value: 'Apartamento', label: 'Apartamento' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Terreno', label: 'Terreno' },
    { value: 'Cobertura', label: 'Cobertura' }
  ]},
  { id: 'status', label: 'Status', type: 'select' as const, options: [
    { value: 'Disponível', label: 'Disponível' },
    { value: 'Vendido', label: 'Vendido' },
    { value: 'Alugado', label: 'Alugado' },
    { value: 'Em Negociação', label: 'Em Negociação' }
  ]},
  { id: 'minPrice', label: 'Preço Mínimo', type: 'number' as const },
  { id: 'maxPrice', label: 'Preço Máximo', type: 'number' as const },
  { id: 'bedrooms', label: 'Quartos', type: 'number' as const },
];

const Properties = () => {
  const [propertiesData, setPropertiesData] = useState<Property[]>([]);
  const [clients, setClients] = useState<Array<{ id: string; name: string; type: string }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string | number | null | undefined>>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isContractFormOpen, setIsContractFormOpen] = useState(false);
  const [contractInitialData, setContractInitialData] = useState<ContractInitialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [propertiesResponse, clientsResponse] = await Promise.all([
          getProperties({ page: 1, pageSize: 200 }),
          getClients({ page: 1, pageSize: 200 })
        ]);
        setPropertiesData(propertiesResponse.items.map(mapPropertyFromApi));
        setClients(clientsResponse.items.map(item => ({ id: item.id, name: item.name, type: item.type })));
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const handleSaveProperty = async (propertyData: Property) => {
    if (editingProperty) {
      const updated = await updateProperty(propertyData.id, {
        title: propertyData.title,
        type: propertyData.type,
        address: propertyData.address,
        price: propertyData.price,
        rentPrice: propertyData.rentPrice,
        status: propertyData.status,
        image: propertyData.image,
        description: propertyData.description,
        bedrooms: propertyData.features.bedrooms,
        bathrooms: propertyData.features.bathrooms,
        parking: propertyData.features.parking,
        area: propertyData.features.area
      });
      const mapped = mapPropertyFromApi(updated);
      setPropertiesData(prev => prev.map(item => item.id === mapped.id ? mapped : item));
      if (selectedProperty?.id === mapped.id) {
        setSelectedProperty(mapped);
      }
    } else {
      const created = await createProperty({
        title: propertyData.title,
        type: propertyData.type,
        address: propertyData.address,
        price: propertyData.price,
        rentPrice: propertyData.rentPrice,
        status: propertyData.status,
        image: propertyData.image,
        description: propertyData.description,
        bedrooms: propertyData.features.bedrooms,
        bathrooms: propertyData.features.bathrooms,
        parking: propertyData.features.parking,
        area: propertyData.features.area
      });
      setPropertiesData(prev => [mapPropertyFromApi(created), ...prev]);
    }
    setEditingProperty(null);
    setIsFormOpen(false);
  };

  const handleOpenNewProperty = () => {
    setEditingProperty(null);
    setIsFormOpen(true);
  };

  const handleEditProperty = () => {
    if (!selectedProperty) return;
    setEditingProperty(selectedProperty);
    setSelectedProperty(null);
    setIsFormOpen(true);
  };

  const handleOpenContractForm = () => {
    if (!selectedProperty) return;
    setContractInitialData({
      propertyId: selectedProperty.id,
      value: selectedProperty.price,
      type: 'Venda',
      status: 'Pendente Assinatura',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    });
    setIsContractFormOpen(true);
  };

  const handleCreateContract = async (data: { clientId: string; type: string; value: number; status: string; startDate: string; endDate: string; signedAt: string | null }) => {
    if (!selectedProperty) return;
    await createContract({
      type: data.type,
      clientId: data.clientId,
      propertyId: selectedProperty.id,
      value: data.value,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      signedAt: data.signedAt
    });
    setPropertiesData(prev =>
      prev.map(item =>
        item.id === selectedProperty.id ? { ...item, status: 'Em Negociação' } : item
      )
    );
    setSelectedProperty(prev => prev ? { ...prev, status: 'Em Negociação' } : prev);
    setIsContractFormOpen(false);
    setContractInitialData(null);
  };

  // Memoized filtering
  const filteredProperties = useMemo(() => {
    return propertiesData.filter(prop => {
      const matchSearch = prop.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prop.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchType = !filters.type || prop.type === filters.type;
      const matchStatus = !filters.status || prop.status === filters.status;
      const matchMinPrice = !filters.minPrice || prop.price >= Number(filters.minPrice);
      const matchMaxPrice = !filters.maxPrice || prop.price <= Number(filters.maxPrice);
      const matchBedrooms = !filters.bedrooms || prop.features.bedrooms >= Number(filters.bedrooms);
      
      return matchSearch && matchType && matchStatus && matchMinPrice && matchMaxPrice && matchBedrooms;
    }).slice(0, 50); // Limit to 50 for performance in this demo
  }, [searchTerm, filters, propertiesData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'Vendido': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400';
      case 'Alugado': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Em Negociação': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestão de Imóveis</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie o portfólio de imóveis da imobiliária</p>
        </div>
        <button 
          onClick={handleOpenNewProperty}
          className="w-full sm:w-auto bg-[var(--color-primary)] hover:opacity-90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-opacity shadow-sm"
        >
          <Plus size={18} />
          Novo Imóvel
        </button>
      </div>

      {/* Filters Bar */}
      <AdvancedFilter 
        onSearch={setSearchTerm} 
        onFilterChange={setFilters} 
        filterOptions={filterOptions} 
      />

      {/* Properties Table/List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Imóvel</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor (Venda)</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {!isLoading && filteredProperties.map((prop, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={prop.id}
                  onClick={() => setSelectedProperty(prop)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{prop.title}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 line-clamp-1">
                          <MapPin size={12} /> {prop.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{prop.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatCurrency(prop.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(prop.status)}`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {!isLoading && filteredProperties.length === 0 && (
            <div className="p-12 text-center">
              <Home className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Nenhum imóvel encontrado</h3>
              <p className="text-slate-500 mt-1">Tente ajustar seus filtros de busca.</p>
            </div>
          )}

          {isLoading && (
            <div className="p-12 text-center text-slate-500">
              Carregando imóveis...
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-1rem)] sm:w-full max-w-2xl max-h-[calc(100dvh-1rem)] sm:max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-50 border border-slate-200 dark:border-slate-800"
            >
              <div className="relative h-48 sm:h-64 w-full">
                <img src={selectedProperty.image} alt="Imóvel" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedProperty(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-md ${
                    selectedProperty.status === 'Disponível' ? 'bg-emerald-500/80 text-white' : 
                    selectedProperty.status === 'Vendido' ? 'bg-rose-500/80 text-white' : 
                    'bg-slate-800/80 text-white'
                  }`}>
                    {selectedProperty.status}
                  </span>
                </div>
              </div>
              
              <div className="p-5 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="min-w-0">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedProperty.title}</h2>
                    <p className="text-slate-500 flex items-center gap-1 mt-2 break-words">
                      <MapPin size={16} /> {selectedProperty.address}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Valor de Venda</p>
                    <p className="text-2xl font-bold text-[var(--color-primary)]">
                      {formatCurrency(selectedProperty.price)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{selectedProperty.features.bedrooms}</p>
                    <p className="text-xs text-slate-500 font-medium uppercase mt-1">Quartos</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{selectedProperty.features.bathrooms}</p>
                    <p className="text-xs text-slate-500 font-medium uppercase mt-1">Banheiros</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{selectedProperty.features.parking}</p>
                    <p className="text-xs text-slate-500 font-medium uppercase mt-1">Vagas</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{selectedProperty.features.area}m²</p>
                    <p className="text-xs text-slate-500 font-medium uppercase mt-1">Área Útil</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleEditProperty}
                    className="flex-1 py-3 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-xl font-medium transition-opacity"
                  >
                    Editar Imóvel
                  </button>
                  <button
                    onClick={handleOpenContractForm}
                    className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
                  >
                    Gerar Contrato
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {isFormOpen && (
          <PropertyForm 
            property={editingProperty ?? undefined}
            onClose={() => {
              setEditingProperty(null);
              setIsFormOpen(false);
            }}
            onSubmit={handleSaveProperty} 
          />
        )}

        {isContractFormOpen && (
          <ContractForm
            clients={clients}
            properties={propertiesData.map(item => ({ id: item.id, title: item.title, type: item.type, price: item.price }))}
            initialData={contractInitialData ?? undefined}
            onClose={() => {
              setIsContractFormOpen(false);
              setContractInitialData(null);
            }}
            onSubmit={(contract) =>
              handleCreateContract({
                clientId: contract.clientId,
                type: contract.type,
                value: contract.value,
                status: contract.status,
                startDate: contract.startDate,
                endDate: contract.endDate,
                signedAt: contract.signedAt
              })
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Properties;

function mapPropertyFromApi(property: PropertyApiModel): Property {
  return {
    id: property.id,
    title: property.title,
    type: property.type,
    address: property.address,
    price: property.price,
    rentPrice: property.rentPrice,
    status: property.status,
    createdAt: property.createdAt,
    image: property.image,
    description: property.description ?? undefined,
    features: {
      bedrooms: property.features.bedrooms,
      bathrooms: property.features.bathrooms,
      parking: property.features.parking,
      area: property.features.area
    }
  };
}
