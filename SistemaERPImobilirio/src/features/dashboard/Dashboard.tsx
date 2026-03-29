import { useEffect, useMemo, useState } from 'react';
import { Home, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { getDashboardSummary, type DashboardSummaryApiModel } from '../../services/api';

type PeriodFilter = '30d' | 'quarter' | 'year';

type SalesPoint = {
  name: string;
  vendas: number;
  alugueis: number;
};

type PortfolioPoint = {
  name: string;
  value: number;
};

type StatSummary = {
  totalProperties: { value: string; trend: string; trendUp: boolean };
  newClients: { value: string; trend: string; trendUp: boolean };
  closedContracts: { value: string; trend: string; trendUp: boolean };
  monthlyRevenue: { value: string; trend: string; trendUp: boolean };
};

type DashboardRange = {
  salesData: SalesPoint[];
  typeData: PortfolioPoint[];
  stats: StatSummary;
};

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number }>;
  trend: string;
  trendUp: boolean;
  delay: number;
};

const periodLabels: Record<PeriodFilter, string> = {
  '30d': 'Últimos 30 dias',
  quarter: 'Este trimestre',
  year: 'Este ano',
};

const dashboardByPeriod: Record<PeriodFilter, DashboardRange> = {
  '30d': {
    salesData: [
      { name: 'Sem 1', vendas: 1800, alugueis: 1200 },
      { name: 'Sem 2', vendas: 2200, alugueis: 1400 },
      { name: 'Sem 3', vendas: 2500, alugueis: 1600 },
      { name: 'Sem 4', vendas: 2800, alugueis: 1700 },
    ],
    typeData: [
      { name: 'Casa', value: 112 },
      { name: 'Apto', value: 86 },
      { name: 'Comercial', value: 54 },
      { name: 'Terreno', value: 28 },
    ],
    stats: {
      totalProperties: { value: '1.032', trend: '+3.1%', trendUp: true },
      newClients: { value: '128', trend: '+6.0%', trendUp: true },
      closedContracts: { value: '18', trend: '+2.4%', trendUp: true },
      monthlyRevenue: { value: 'R$ 2.6M', trend: '+7.2%', trendUp: true },
    },
  },
  quarter: {
    salesData: [
      { name: 'Jan', vendas: 4000, alugueis: 2400 },
      { name: 'Fev', vendas: 3000, alugueis: 1398 },
      { name: 'Mar', vendas: 2000, alugueis: 9800 },
    ],
    typeData: [
      { name: 'Casa', value: 320 },
      { name: 'Apto', value: 250 },
      { name: 'Comercial', value: 210 },
      { name: 'Terreno', value: 140 },
    ],
    stats: {
      totalProperties: { value: '1.000', trend: '+12%', trendUp: true },
      newClients: { value: '124', trend: '+5.2%', trendUp: true },
      closedContracts: { value: '45', trend: '-2.1%', trendUp: false },
      monthlyRevenue: { value: 'R$ 2.4M', trend: '+18.4%', trendUp: true },
    },
  },
  year: {
    salesData: [
      { name: 'Jan', vendas: 4000, alugueis: 2400 },
      { name: 'Fev', vendas: 3000, alugueis: 1398 },
      { name: 'Mar', vendas: 2000, alugueis: 9800 },
      { name: 'Abr', vendas: 2780, alugueis: 3908 },
      { name: 'Mai', vendas: 1890, alugueis: 4800 },
      { name: 'Jun', vendas: 2390, alugueis: 3800 },
      { name: 'Jul', vendas: 3490, alugueis: 4300 },
      { name: 'Ago', vendas: 4200, alugueis: 4600 },
      { name: 'Set', vendas: 3900, alugueis: 4100 },
      { name: 'Out', vendas: 4500, alugueis: 4900 },
      { name: 'Nov', vendas: 5100, alugueis: 5200 },
      { name: 'Dez', vendas: 5600, alugueis: 5800 },
    ],
    typeData: [
      { name: 'Casa', value: 400 },
      { name: 'Apto', value: 300 },
      { name: 'Comercial', value: 300 },
      { name: 'Terreno', value: 200 },
    ],
    stats: {
      totalProperties: { value: '1.214', trend: '+19.6%', trendUp: true },
      newClients: { value: '462', trend: '+14.8%', trendUp: true },
      closedContracts: { value: '172', trend: '+9.5%', trendUp: true },
      monthlyRevenue: { value: 'R$ 3.1M', trend: '+21.3%', trendUp: true },
    },
  },
};

const StatCard = ({ title, value, icon: Icon, trend, trendUp, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
      </div>
      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[var(--color-primary)]">
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className={`flex items-center font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trendUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
        {trend}
      </span>
      <span className="text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">vs mês anterior</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('30d');
  const [summary, setSummary] = useState<DashboardSummaryApiModel | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      const data = await getDashboardSummary();
      setSummary(data);
    };
    void loadSummary();
  }, []);

  const currentRange = useMemo(() => {
    const base = dashboardByPeriod[periodFilter];
    if (!summary) {
      return base;
    }

    return {
      ...base,
      stats: {
        totalProperties: { value: summary.totalProperties.toLocaleString('pt-BR'), trend: '+0.0%', trendUp: true },
        newClients: { value: summary.totalClients.toLocaleString('pt-BR'), trend: '+0.0%', trendUp: true },
        closedContracts: { value: summary.totalContracts.toLocaleString('pt-BR'), trend: '+0.0%', trendUp: true },
        monthlyRevenue: {
          value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalPipelineValue),
          trend: '+0.0%',
          trendUp: true
        }
      }
    };
  }, [periodFilter, summary]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Visão geral das métricas operacionais</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value as PeriodFilter)}
            className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {Object.entries(periodLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Imóveis"
          value={currentRange.stats.totalProperties.value}
          icon={Home}
          trend={currentRange.stats.totalProperties.trend}
          trendUp={currentRange.stats.totalProperties.trendUp}
          delay={0.1}
        />
        <StatCard
          title="Novos Clientes"
          value={currentRange.stats.newClients.value}
          icon={Users}
          trend={currentRange.stats.newClients.trend}
          trendUp={currentRange.stats.newClients.trendUp}
          delay={0.2}
        />
        <StatCard
          title="Contratos Fechados"
          value={currentRange.stats.closedContracts.value}
          icon={TrendingUp}
          trend={currentRange.stats.closedContracts.trend}
          trendUp={currentRange.stats.closedContracts.trendUp}
          delay={0.3}
        />
        <StatCard
          title="Receita (Mensal)"
          value={currentRange.stats.monthlyRevenue.value}
          icon={DollarSign}
          trend={currentRange.stats.monthlyRevenue.trend}
          trendUp={currentRange.stats.monthlyRevenue.trendUp}
          delay={0.4}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Evolução de Negócios</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentRange.salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAlugueis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="vendas" name="Vendas (R$)" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorVendas)" />
                <Area type="monotone" dataKey="alugueis" name="Aluguéis (R$)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAlugueis)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Distribuição de Portfólio</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentRange.typeData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b' }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Bar dataKey="value" name="Quantidade" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity List (Simulated Event Queue) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Atividade Recente (Integrações)</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[
            { msg: 'Novo contrato gerado via API', time: 'Há 5 min', type: 'success' },
            { msg: 'Sincronização com portal Zap Imóveis concluída', time: 'Há 12 min', type: 'info' },
            { msg: 'Análise de crédito cliente #4922 aprovada', time: 'Há 1 hora', type: 'success' },
            { msg: 'Falha ao atualizar anúncio #1092', time: 'Há 2 horas', type: 'error' },
          ].map((item, i) => (
            <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full ${
                  item.type === 'success' ? 'bg-emerald-500' : 
                  item.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                }`} />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 break-words">{item.msg}</p>
              </div>
              <span className="text-xs text-slate-500">{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
