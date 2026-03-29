import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Wallet, Users, ArrowRight, Star, CheckCircle2, PlayCircle } from 'lucide-react';

const services = [
  {
    title: 'Gerenciamento de Propriedades',
    description: 'Centralize captação, atualização e performance dos imóveis em um único painel inteligente.',
    icon: Building2,
  },
  {
    title: 'Controle Financeiro',
    description: 'Acompanhe receitas, comissões e contratos com indicadores estratégicos em tempo real.',
    icon: Wallet,
  },
  {
    title: 'CRM de Clientes',
    description: 'Organize leads, funil comercial e histórico de interações para elevar a conversão.',
    icon: Users,
  },
];

const testimonials = [
  {
    name: 'Patrícia Almeida',
    role: 'Diretora Comercial • Prime Imóveis',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
    quote: 'Conseguimos reduzir o tempo de fechamento de contratos e aumentar a produtividade do time comercial.',
  },
  {
    name: 'Carlos Nogueira',
    role: 'Gestor de Operações • Urban Realty',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    quote: 'A integração entre imóveis, financeiro e CRM trouxe previsibilidade e agilidade para toda a operação.',
  },
  {
    name: 'Fernanda Lopes',
    role: 'CEO • Horizonte Negócios Imobiliários',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
    quote: 'A experiência da plataforma é excelente em mobile e desktop, com dados confiáveis para tomada de decisão.',
  },
];

const metrics = [
  { value: '1.2K+', label: 'Imóveis gerenciados' },
  { value: '98%', label: 'Satisfação de clientes' },
  { value: '35%', label: 'Ganho médio de eficiência' },
  { value: '24/7', label: 'Disponibilidade da plataforma' },
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

const HomePage = () => {
  useEffect(() => {
    document.title = 'Home | ERP Imobiliário';
    setMetaTag('description', 'ERP Imobiliário completo para gestão de propriedades, controle financeiro e CRM de clientes com alta performance.');
    setMetaTag('og:title', 'Home | ERP Imobiliário', 'property');
    setMetaTag('og:description', 'Conheça o ERP Imobiliário com dashboards, automações e experiência profissional para imobiliárias.', 'property');
  }, []);

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt="Fachada de empreendimento residencial de alto padrão"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/75 to-slate-900/40" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100">
            <CheckCircle2 size={14} />
            Plataforma Imobiliária de Alta Performance
          </p>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Gestão imobiliária moderna com dados, automação e experiência premium
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
            Transforme processos operacionais em crescimento comercial com um ERP completo para imóveis, contratos, clientes e inteligência financeira.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/settings"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Solicitar demonstração
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/pipeline"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Ver fluxo comercial
              <PlayCircle size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      <section aria-labelledby="servicos-title" className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="servicos-title" className="text-2xl font-bold text-slate-900 dark:text-white">
              Serviços essenciais para imobiliárias
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Módulos integrados para acelerar vendas, locações e pós-venda.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[var(--color-primary)] dark:bg-slate-800">
                <service.icon size={22} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{service.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section aria-labelledby="estatisticas-title" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 id="estatisticas-title" className="text-2xl font-bold text-slate-900 dark:text-white">
          Indicadores da empresa
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Resultados reais impulsionados pela transformação digital imobiliária.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-800/60">
              <p className="text-xl font-bold text-[var(--color-primary)] sm:text-2xl">{metric.value}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="depoimentos-title" className="space-y-4">
        <h2 id="depoimentos-title" className="text-2xl font-bold text-slate-900 dark:text-white">
          Depoimentos de clientes
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.09 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={`Foto de ${testimonial.name}`}
                  className="h-12 w-12 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </div>
              <div className="mb-3 flex items-center gap-1 text-amber-500" aria-label="Avaliação 5 de 5">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{testimonial.quote}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pronto para escalar sua imobiliária?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Agende uma demonstração e descubra como acelerar vendas e locações com inteligência operacional.
        </p>
        <div className="mt-5">
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
          >
            Quero ver a demonstração
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
