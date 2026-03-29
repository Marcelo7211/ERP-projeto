import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Blocks, CheckCircle2, Database, LayoutPanelTop, Rocket, ServerCog, Sparkles, Target } from 'lucide-react';

const technologies = [
  { area: 'Frontend', stack: 'React, TypeScript, Vite, Tailwind CSS e Framer Motion' },
  { area: 'Backend', stack: 'C# com ASP.NET Core Web API para serviços de negócio e integrações' },
  { area: 'Dados', stack: 'SQL Server para armazenamento transacional, relatórios e auditoria operacional' },
  { area: 'Arquitetura', stack: 'APIs REST, separação por camadas, estado global com Zustand e roteamento SPA' },
];

const objectives = [
  'Demonstrar um ERP imobiliário completo com foco em produtividade comercial e governança operacional.',
  'Exibir uma arquitetura escalável para gestão de imóveis, clientes, contratos e pipeline de negociações.',
  'Evidenciar como dados estruturados e automações suportam decisões rápidas de vendas e locação.',
];

const demoFeatures = [
  'Dashboard analítico com indicadores de receita, contratos e performance de carteira.',
  'Gestão de imóveis com filtros avançados, cadastro detalhado e atualização de portfólio.',
  'Módulo de clientes com histórico de relacionamento e dados consolidados para follow-up.',
  'Controle de contratos com fluxo de criação, status e acompanhamento de prazos.',
  'Pipeline comercial visual para evolução das negociações e priorização de oportunidades.',
  'Personalização white-label de identidade visual para demonstrações em diferentes marcas.',
];

const architectureLayers = [
  {
    icon: LayoutPanelTop,
    title: 'Camada de Apresentação',
    description: 'Interface React responsiva com navegação por módulos, componentes reutilizáveis e experiência fluida.',
  },
  {
    icon: ServerCog,
    title: 'Camada de Aplicação',
    description: 'Serviços ASP.NET Core em C# para regras de negócio, validações, integrações e segurança da API.',
  },
  {
    icon: Database,
    title: 'Camada de Persistência',
    description: 'SQL Server modelando entidades de imóveis, clientes, contratos e trilha de auditoria.',
  },
];

const useCases = [
  {
    title: 'Operação diária de imobiliárias',
    description: 'Gestores e corretores centralizam processos de captação, atendimento e fechamento em uma única plataforma.',
  },
  {
    title: 'Apresentação de conceito para clientes',
    description: 'Times de produto e comercial usam o sistema para demonstrar recursos típicos de um ERP setorial.',
  },
  {
    title: 'Validação técnica de arquitetura',
    description: 'Equipes de tecnologia avaliam padrões de frontend, backend e banco relacional com cenário realista.',
  },
];

const setMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  const selector = `${attribute}="${name}"`;
  let tag = document.querySelector(`meta[${selector}]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
};

const AboutPage = () => {
  useEffect(() => {
    document.title = 'Sobre | ERP Imobiliário';
    setMetaTag('description', 'Visão técnica da aplicação demonstrativa ERP Imobiliário com React, C#, ASP.NET Core e SQL Server.');
    setMetaTag('og:title', 'Sobre | ERP Imobiliário', 'property');
    setMetaTag('og:description', 'Conheça arquitetura, stack e funcionalidades do ERP Imobiliário demonstrativo.', 'property');
  }, []);

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">Sobre a aplicação</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          ERP Imobiliário demonstrativo para apresentação técnica de produto
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
          Esta solução foi criada para representar, de forma prática e profissional, as capacidades típicas de um ERP imobiliário moderno. O foco é demonstrar arquitetura, fluxo de dados, módulos de negócio e experiência de uso em um cenário realista.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Blocks size={20} className="text-[var(--color-primary)]" />
            Tecnologia utilizada
          </h2>
          <div className="space-y-3">
            {technologies.map((item) => (
              <article key={item.area} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.area}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.stack}</p>
              </article>
            ))}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Target size={20} className="text-[var(--color-primary)]" />
            Objetivos principais
          </h2>
          <ul className="space-y-3">
            {objectives.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 size={16} className="mt-0.5 text-[var(--color-primary)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.article>
      </section>

      <section aria-labelledby="features-title" className="space-y-4">
        <h2 id="features-title" className="text-2xl font-bold text-slate-900 dark:text-white">
          Funcionalidades demonstrativas e recursos disponíveis
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {demoFeatures.map((feature, index) => (
            <motion.article
              key={feature}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{feature}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section aria-labelledby="architecture-title" className="space-y-4">
        <h2 id="architecture-title" className="text-2xl font-bold text-slate-900 dark:text-white">
          Arquitetura do sistema
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {architectureLayers.map((layer, index) => (
            <motion.article
              key={layer.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.09 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[var(--color-primary)] dark:bg-slate-800">
                <layer.icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{layer.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{layer.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section aria-labelledby="cases-title" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {useCases.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 id={index === 0 ? 'cases-title' : undefined} className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <Rocket size={18} className="text-[var(--color-primary)]" />
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
          </motion.article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
          <Sparkles size={20} className="text-[var(--color-primary)]" />
          Características técnicas relevantes
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <article className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            Estrutura modular por domínio de negócio, facilitando evolução de funcionalidades sem acoplamento excessivo.
          </article>
          <article className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            Preparação para APIs REST em ASP.NET Core com autenticação, autorização e versionamento de endpoints.
          </article>
          <article className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            Persistência em SQL Server adequada para cenários de alto volume de contratos e transações imobiliárias.
          </article>
          <article className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            Interface otimizada para desktop e mobile, com foco em desempenho e usabilidade operacional diária.
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Exemplos práticos de uso
        </h2>
        <ul className="mt-4 space-y-3">
          <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <CheckCircle2 size={16} className="mt-0.5 text-[var(--color-primary)]" />
            <span>Registrar novo imóvel, vinculá-lo a clientes interessados e avançar a oportunidade no pipeline.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <CheckCircle2 size={16} className="mt-0.5 text-[var(--color-primary)]" />
            <span>Gerar contrato e monitorar status de assinatura, vigência e valor consolidado no dashboard.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <CheckCircle2 size={16} className="mt-0.5 text-[var(--color-primary)]" />
            <span>Comparar desempenho por período para direcionar ações comerciais com base em métricas.</span>
          </li>
        </ul>
      </section>
      <section className="rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/70">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Contexto demonstrativo
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Esta aplicação é demonstrativa e foi construída para apresentar potencial técnico, fluxo funcional e padrões de implementação comuns em ERPs imobiliários. Os módulos e dados exibidos simulam um ambiente corporativo para avaliação de produto, arquitetura e experiência de uso.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
