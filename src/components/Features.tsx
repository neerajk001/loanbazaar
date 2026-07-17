import React from 'react';
import { Wallet, FileText, Clock, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: 'Multiple Options',
      description: 'Compare 20+ Banks & NBFCs to find the best fit for you.',
      Icon: Wallet,
      accent: {
        border: 'border-blue-200',
        strip: 'bg-blue-600',
        iconBg: 'bg-blue-50',
        iconText: 'text-blue-700',
      },
    },
    {
      title: 'Expert File Prep',
      description: 'We optimize your application to maximize approval chances.',
      Icon: FileText,
      accent: {
        border: 'border-orange-200',
        strip: 'bg-orange-600',
        iconBg: 'bg-orange-50',
        iconText: 'text-orange-700',
      },
    },
    {
      title: 'Quick Processing',
      description: 'Fast-track approvals for urgent financial needs.',
      Icon: Clock,
      accent: {
        border: 'border-emerald-200',
        strip: 'bg-emerald-600',
        iconBg: 'bg-emerald-50',
        iconText: 'text-emerald-700',
      },
    },
    {
      title: 'End-to-End Support',
      description: 'Dedicated relationship managers guide you until disbursement.',
      Icon: Users,
      accent: {
        border: 'border-slate-200',
        strip: 'bg-slate-900',
        iconBg: 'bg-slate-100',
        iconText: 'text-slate-800',
      },
    },
  ];

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-white px-4 py-1.5 text-sm font-bold tracking-wide text-blue-700">
            WHY CHOOSE US
          </span>
          <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Why India Trusts Loanbazaar
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
            Clear guidance, fast processing, and support that stays with you from application to disbursement.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              Icon={feature.Icon}
              accent={feature.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  title,
  description,
  Icon,
  accent,
}: {
  title: string;
  description: string;
  Icon: React.ElementType;
  accent: { border: string; strip: string; iconBg: string; iconText: string };
}) => (
  <div
    className={`group relative h-full overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accent.border}`}
  >
    {/* Accent bar */}
    <div className={`absolute left-0 top-0 h-full w-1.5 ${accent.strip}`} />

    {/* Subtle accent shapes (solid colors only) */}
    <div className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full ${accent.strip} opacity-[0.08]`} />
    <div className={`pointer-events-none absolute -right-6 -bottom-8 h-20 w-20 rounded-2xl ${accent.strip} opacity-[0.06] rotate-12`} />

    <div className="flex items-start gap-4">
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center border border-slate-200 ${accent.iconBg}`}
      >
        <Icon className={`h-6 w-6 ${accent.iconText}`} />
      </div>

      <div className="min-w-0">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>

    <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500">
      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-400" />
      Trusted guidance. Transparent process.
    </div>
  </div>
);

export default Features;
