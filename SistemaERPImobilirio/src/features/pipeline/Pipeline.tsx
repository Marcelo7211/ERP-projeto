import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus, Calendar, User, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { NovaNegociacaoForm } from './NovaNegociacaoForm';
import { createPipelineDeal, getClients, getPipelineDeals, getProperties, updatePipelineDeal } from '../../services/api';

type ColumnId = 'leads' | 'visitas' | 'propostas' | 'fechamento';

interface PipelineItem {
  id: string;
  title: string;
  clientId: string;
  propertyId: string;
  client: string;
  value: number;
  date: string;
  lastInteractionAt: string;
}

interface PipelineColumn {
  id: ColumnId;
  title: string;
  items: PipelineItem[];
}

const columnTitles: Record<ColumnId, string> = {
  leads: 'Leads (Novos)',
  visitas: 'Visitas Agendadas',
  propostas: 'Propostas em Análise',
  fechamento: 'Em Fechamento'
};

const stageOrder: ColumnId[] = ['leads', 'visitas', 'propostas', 'fechamento'];

const Pipeline = () => {
  const [columns, setColumns] = useState<Record<ColumnId, PipelineColumn>>({
    leads: { id: 'leads', title: columnTitles.leads, items: [] },
    visitas: { id: 'visitas', title: columnTitles.visitas, items: [] },
    propostas: { id: 'propostas', title: columnTitles.propostas, items: [] },
    fechamento: { id: 'fechamento', title: columnTitles.fechamento, items: [] }
  });
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [properties, setProperties] = useState<Array<{ id: string; title: string; price: number }>>([]);
  const [draggedItem, setDraggedItem] = useState<{ id: string, sourceColId: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<ColumnId>('leads');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dealsResponse, clientsResponse, propertiesResponse] = await Promise.all([
          getPipelineDeals({ page: 1, pageSize: 400 }),
          getClients({ page: 1, pageSize: 200 }),
          getProperties({ page: 1, pageSize: 200 })
        ]);

        setClients(clientsResponse.items.map(item => ({ id: item.id, name: item.name })));
        setProperties(propertiesResponse.items.map(item => ({ id: item.id, title: item.title, price: item.price })));

        const grouped: Record<ColumnId, PipelineColumn> = {
          leads: { id: 'leads', title: columnTitles.leads, items: [] },
          visitas: { id: 'visitas', title: columnTitles.visitas, items: [] },
          propostas: { id: 'propostas', title: columnTitles.propostas, items: [] },
          fechamento: { id: 'fechamento', title: columnTitles.fechamento, items: [] }
        };

        dealsResponse.items.forEach((deal) => {
          const columnId = mapStageToColumn(deal.stage);
          grouped[columnId].items.push({
            id: deal.id,
            title: deal.title,
            clientId: deal.clientId,
            propertyId: deal.propertyId,
            client: deal.clientName,
            value: deal.value,
            date: formatRelativeDate(deal.lastInteractionAt),
            lastInteractionAt: deal.lastInteractionAt
          });
        });

        setColumns(grouped);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const metrics = useMemo(() => {
    let totalDeals = 0;
    let totalValue = 0;
    
    Object.values(columns).forEach(col => {
      totalDeals += col.items.length;
      col.items.forEach(item => {
        totalValue += item.value;
      });
    });

    const conversionRate = totalDeals > 0 ? Math.round((columns.fechamento.items.length / totalDeals) * 100) : 0;

    return {
      totalDeals,
      totalValue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue),
      conversionRate
    };
  }, [columns]);

  const handleDragStart = (e: React.DragEvent, itemId: string, colId: string) => {
    setDraggedItem({ id: itemId, sourceColId: colId });
    e.dataTransfer.effectAllowed = 'move';
    // Transparent image for better drag visual handled by Framer Motion conceptually
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { id, sourceColId } = draggedItem;
    if (sourceColId === targetColId) return;

    const sourceCol = columns[sourceColId as keyof typeof columns];
    const targetCol = columns[targetColId as keyof typeof columns];

    const item = sourceCol.items.find(i => i.id === id);
    if (!item) return;

    await updatePipelineDeal(item.id, {
      title: item.title,
      clientId: item.clientId,
      propertyId: item.propertyId,
      value: item.value,
      stage: targetColId,
      lastInteractionAt: new Date().toISOString()
    });

    setColumns({
      ...columns,
      [sourceColId]: {
        ...sourceCol,
        items: sourceCol.items.filter(i => i.id !== id)
      },
      [targetColId]: {
        ...targetCol,
        items: [...targetCol.items, { ...item, date: 'Hoje', lastInteractionAt: new Date().toISOString() }]
      }
    });
    setDraggedItem(null);
  };

  const handleAddNegociacao = async (data: PipelineItem & { columnId: string }) => {
    const { columnId, ...item } = data;
    if (!(columnId in columns)) return;
    const typedColumnId = columnId as ColumnId;
    const created = await createPipelineDeal({
      title: item.title,
      clientId: item.clientId,
      propertyId: item.propertyId,
      value: item.value,
      stage: typedColumnId,
      lastInteractionAt: new Date().toISOString()
    });

    const mappedItem: PipelineItem = {
      id: created.id,
      title: created.title,
      clientId: created.clientId,
      propertyId: created.propertyId,
      client: created.clientName,
      value: created.value,
      date: formatRelativeDate(created.lastInteractionAt),
      lastInteractionAt: created.lastInteractionAt
    };

    setColumns((prev) => ({
      ...prev,
      [typedColumnId]: {
        ...prev[typedColumnId],
        items: [...prev[typedColumnId].items, mappedItem]
      }
    }));
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pipeline de Vendas</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Arraste os cards para atualizar o status da negociação</p>
        </div>
        <button 
          onClick={() => {
            setSelectedColumnId('leads');
            setIsFormOpen(true);
          }}
          className="w-full sm:w-auto bg-[var(--color-primary)] hover:opacity-90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-opacity"
        >
          <Plus size={18} />
          Nova Negociação
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Previsão de Receita</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{metrics.totalValue}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Taxa de Conversão</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{metrics.conversionRate}%</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Negociações Ativas</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{metrics.totalDeals}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden flex gap-4 sm:gap-6 pb-2 sm:pb-4 snap-x snap-mandatory">
        {!isLoading && stageOrder.map((columnId) => {
          const column = columns[columnId];
          return (
          <div 
            key={column.id}
            className="flex flex-col w-[min(22rem,88vw)] sm:w-[320px] shrink-0 snap-start bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                {column.title}
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">
                  {column.items.length}
                </span>
              </h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
              <AnimatePresence>
                {column.items.map(item => (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    draggable
                    onDragStartCapture={(e) => handleDragStart(e, item.id, column.id)}
                    className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:border-[var(--color-primary)] transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    
                    <p className="text-[var(--color-primary)] font-bold text-sm mb-3">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700 gap-2">
                      <div className="flex items-center gap-1 truncate min-w-0 max-w-[140px]">
                        <User size={12} />
                        <span className="truncate">{item.client}</span>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <Calendar size={12} />
                        {item.date}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setSelectedColumnId(column.id as ColumnId);
                setIsFormOpen(true);
              }}
              className="mt-3 w-full py-2 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>
          );
        })}

        {isLoading && (
          <div className="text-slate-500 px-2 py-8">
            Carregando pipeline...
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <NovaNegociacaoForm 
            columns={stageOrder.map((columnId) => columns[columnId])}
            clients={clients}
            properties={properties}
            initialColumnId={selectedColumnId}
            onClose={() => setIsFormOpen(false)} 
            onSubmit={handleAddNegociacao} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pipeline;

function mapStageToColumn(stage: string): ColumnId {
  if (stage === 'visitas' || stage === 'propostas' || stage === 'fechamento') {
    return stage;
  }
  return 'leads';
}

function formatRelativeDate(value: string): string {
  const date = new Date(value);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  if (diff < dayMs) {
    return 'Hoje';
  }
  if (diff < dayMs * 2) {
    return 'Ontem';
  }
  return `Há ${Math.floor(diff / dayMs)} dias`;
}
