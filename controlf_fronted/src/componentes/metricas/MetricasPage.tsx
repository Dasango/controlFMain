import React, { useEffect, useMemo, useState } from 'react';

interface MetricaItem {
  etiqueta: string;
  valor: number;
}

interface Metricas {
  categoriaFiltro: string | null;
  estadoFiltro: string | null;
  desde: string | null;
  hasta: string | null;
  totalLeyes: number;
  totalVotos: number;
  promedioCoherenciaGlobal: number;
  leyesPorEstado: MetricaItem[];
  leyesPorCategoria: MetricaItem[];
  votosPorTipo: MetricaItem[];
  coherenciaPorCategoria: MetricaItem[];
  serieVotosPorMes: MetricaItem[];
}

const PALETA = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d'];

const HorizontalBars: React.FC<{ datos: MetricaItem[]; sufijo?: string; max?: number }> = ({ datos, sufijo = '', max }) => {
  const maximo = max ?? Math.max(1, ...datos.map((d) => d.valor));
  if (datos.length === 0) {
    return <p className="text-sm text-slate-400 italic">Sin datos para los filtros actuales.</p>;
  }
  return (
    <div className="space-y-3">
      {datos.map((d, i) => (
        <div key={d.etiqueta}>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span className="truncate">{d.etiqueta}</span>
            <span>{d.valor}{sufijo}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(d.valor / maximo) * 100}%`, backgroundColor: PALETA[i % PALETA.length] }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// Convierte una etiqueta "yyyy-MM" en un mes legible + año corto ("Ene" / "'24").
const formatearMes = (etiqueta: string): { mes: string; anio: string } => {
  const m = /^(\d{4})-(\d{2})$/.exec(etiqueta);
  if (!m) return { mes: etiqueta, anio: '' };
  const idx = parseInt(m[2], 10) - 1;
  return { mes: MESES_CORTOS[idx] ?? m[2], anio: `'${m[1].slice(2)}` };
};

const ColumnChart: React.FC<{ datos: MetricaItem[] }> = ({ datos }) => {
  // Animación de crecimiento: al montar, las barras parten de 0 y transicionan
  // hasta su altura real. El componente se remonta en cada carga (skeleton de
  // isLoading), por lo que la animación se repite al aplicar filtros.
  const [animado, setAnimado] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimado(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (datos.length === 0) {
    return <p className="text-sm text-slate-400 italic">Sin datos para los filtros actuales.</p>;
  }
  const maximo = Math.max(1, ...datos.map((d) => d.valor));
  const guias = [1, 0.75, 0.5, 0.25, 0]; // niveles de referencia (100%..0% del máximo)

  return (
    <div className="flex gap-3">
      {/* Eje Y con valores de referencia */}
      <div className="flex flex-col justify-between h-56 pt-6 pr-1 text-right text-[9px] font-bold text-slate-300 select-none">
        {guias.map((g) => (
          <span key={g} className="leading-none">{Math.round(maximo * g)}</span>
        ))}
      </div>

      <div className="flex-1 overflow-x-auto">
        {/* Zona de barras con líneas guía de fondo */}
        <div className="relative">
          <div className="absolute inset-0 flex flex-col justify-between pt-6 pointer-events-none">
            {guias.map((g) => (
              <div key={g} className="border-t border-dashed border-slate-100"></div>
            ))}
          </div>

          <div className="relative flex items-end gap-2 sm:gap-3 h-56 pt-6">
            {datos.map((d) => {
              const alturaPct = d.valor > 0 ? Math.max((d.valor / maximo) * 100, 3) : 0;
              return (
                <div key={d.etiqueta} className="group flex h-full min-w-[38px] flex-1 items-end justify-center">
                  <div
                    className="relative w-full max-w-[44px] rounded-t-md bg-gradient-to-t from-accent-blue/60 to-accent-blue shadow-[0_1px_3px_rgba(59,130,246,0.35)] transition-[height,background-color] duration-700 ease-out group-hover:from-accent-blue group-hover:to-primary-navy"
                    style={{ height: animado ? `${alturaPct}%` : '0%' }}
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-black text-slate-500 opacity-70 transition-all group-hover:text-accent-blue group-hover:opacity-100">
                      {d.valor}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Etiquetas de mes (fila alineada con las barras) */}
        <div className="flex gap-2 sm:gap-3 mt-2">
          {datos.map((d) => {
            const { mes, anio } = formatearMes(d.etiqueta);
            return (
              <div key={d.etiqueta} className="flex min-w-[38px] flex-1 flex-col items-center leading-none">
                <span className="text-[10px] font-black text-slate-500 whitespace-nowrap">{mes}</span>
                <span className="text-[8px] font-bold text-slate-300">{anio}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
    <h3 className="text-sm font-black text-primary-navy uppercase tracking-wide mb-4">{titulo}</h3>
    {children}
  </div>
);

const MetricasPage: React.FC = () => {
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [estados, setEstados] = useState<string[]>([]);

  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  useEffect(() => {
    fetch('/api/leyes/filtros')
      .then((res) => res.json())
      .then((data) => {
        setCategorias(Array.isArray(data?.categorias) ? data.categorias : []);
        setEstados(Array.isArray(data?.estados) ? data.estados : []);
      })
      .catch((err) => console.error('Error al cargar filtros:', err));
  }, []);

  const cargarMetricas = useMemo(
    () => async (params: { categoria: string; estado: string; desde: string; hasta: string }) => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (params.categoria) query.set('categoria', params.categoria);
        if (params.estado) query.set('estado', params.estado);
        if (params.desde) query.set('desde', params.desde);
        if (params.hasta) query.set('hasta', params.hasta);
        const res = await fetch(`/api/dashboard/metricas?${query.toString()}`);
        const data = await res.json();
        setMetricas(data);
      } catch (err) {
        console.error('Error al cargar métricas:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    cargarMetricas({ categoria: '', estado: '', desde: '', hasta: '' });
  }, [cargarMetricas]);

  const aplicar = () => cargarMetricas({ categoria, estado, desde, hasta });
  const limpiar = () => {
    setCategoria('');
    setEstado('');
    setDesde('');
    setHasta('');
    cargarMetricas({ categoria: '', estado: '', desde: '', hasta: '' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-black text-primary-navy uppercase tracking-tighter">Métricas de Cumplimiento</h2>
        <p className="text-slate-500">Explora las métricas con filtros, rangos de tiempo y comparaciones por categoría.</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Categoría</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-accent-blue focus:outline-none">
              <option value="">Todas</option>
              {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Estado</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-accent-blue focus:outline-none">
              <option value="">Todos</option>
              {estados.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Desde</label>
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-accent-blue focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hasta</label>
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-accent-blue focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={aplicar} className="flex-1 rounded-xl bg-primary-navy px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800 transition-all">Aplicar</button>
            <button onClick={limpiar} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Limpiar</button>
          </div>
        </div>
      </div>

      {isLoading || !metricas ? (
        <div className="animate-pulse grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="bg-white h-64 rounded-2xl border border-slate-200"></div>)}
        </div>
      ) : (
        <>
          {/* Totales */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm border-b-4 border-b-accent-blue">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Leyes (filtradas)</p>
              <p className="mt-2 text-3xl font-black text-primary-navy">{metricas.totalLeyes}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm border-b-4 border-b-success-green">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Votos (filtrados)</p>
              <p className="mt-2 text-3xl font-black text-primary-navy">{metricas.totalVotos}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm border-b-4 border-b-warning-amber">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coherencia global</p>
              <p className="mt-2 text-3xl font-black text-primary-navy">{metricas.promedioCoherenciaGlobal}%</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card titulo="Leyes por estado">
              <HorizontalBars datos={metricas.leyesPorEstado} />
            </Card>
            <Card titulo="Leyes por categoría">
              <HorizontalBars datos={metricas.leyesPorCategoria} />
            </Card>
            <Card titulo="Votos por tipo">
              <HorizontalBars datos={metricas.votosPorTipo} />
            </Card>
            <Card titulo="Cumplimiento (coherencia) por categoría">
              <HorizontalBars datos={metricas.coherenciaPorCategoria} sufijo="%" max={100} />
            </Card>
          </div>

          <Card titulo="Votos registrados por mes">
            <ColumnChart datos={metricas.serieVotosPorMes} />
          </Card>
        </>
      )}
    </div>
  );
};

export default MetricasPage;
