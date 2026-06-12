import React, { useState, useEffect } from 'react';
import PanelControlSeguridad from './COMPONENTE_PANEL_DE_CONTROL/PanelControlSeguridad';
import MotorCoherencia from './COMPONENTE_MOTOR_COHERENCIA/MotorCoherencia';
import MantenimientoSistema from './COMPONENTE_MANTENIMIENTO_DEL_SISTEMA/MantenimientoSistema';

const AdminPage: React.FC = () => {
  const [seguridad, setSeguridad] = useState<any>(null);
  const [mantenimiento, setMantenimiento] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [segRes, mantRes] = await Promise.all([
        fetch('/api/admin/panel'),
        fetch('/api/admin/mantenimiento')
      ]);
      
      setSeguridad(await segRes.json());
      setMantenimiento(await mantRes.json());
    } catch (error) {
      console.error("Error al cargar datos administrativos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccionMantenimiento = async (accion: string) => {
    let endpoint = '';
    switch (accion) {
      case 'BACKUP': endpoint = '/mantenimiento/respaldo'; break;
      case 'CACHE_CLEAR': endpoint = '/mantenimiento/limpiar-cache'; break;
      case 'IMPORT_LEYES': endpoint = '/importar-leyes'; break;
    }

    try {
      await fetch(`/api/admin${endpoint}`, { method: 'POST' });
      alert(`Acción ${accion} ejecutada correctamente`);
      fetchData(); // Refrescar info
    } catch (error) {
      console.error(`Error al ejecutar ${accion}:`, error);
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm("¿Deseas poblar la base de datos con datos de ejemplo? Esto solo funcionará si la base de datos está vacía.")) return;
    
    try {
      const response = await fetch('/api/admin/seed', { method: 'POST' });
      if (response.ok) {
        alert("Base de datos poblada correctamente.");
        fetchData();
      } else {
        alert("Error al poblar la base de datos.");
      }
    } catch (error) {
      console.error("Error en seed:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto animate-pulse space-y-8">
        <div className="bg-white h-48 rounded-xl border border-slate-200"></div>
        <div className="bg-white h-96 rounded-xl border border-slate-200"></div>
        <div className="bg-white h-64 rounded-xl border border-slate-200"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black text-primary-navy uppercase tracking-tighter">Panel de Control y Administración</h2>
          <p className="text-slate-500">Gestión de auditoría ciudadana, seguridad y mantenimiento de infraestructura</p>
        </div>
        <button 
          onClick={handleSeedDatabase}
          className="px-4 py-2 bg-accent-blue text-white rounded-lg text-xs font-bold shadow-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          POBLAR BASE DE DATOS (SEED)
        </button>
      </div>

      <PanelControlSeguridad 
        titulo={seguridad.tituloSeccion}
        opciones={seguridad.opciones}
      />

      <MotorCoherencia />

      <MantenimientoSistema 
        info={mantenimiento}
        onAccion={handleAccionMantenimiento}
      />
    </div>
  );
};

export default AdminPage;
