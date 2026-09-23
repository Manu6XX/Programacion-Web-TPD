import { useState, useMemo, useEffect } from 'react';
import './App.css';

function App() {
  const [tareas, setTareas] = useState(() => {
    const guardadas = localStorage.getItem('tareas');
    return guardadas ? JSON.parse(guardadas) : [];
  });
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [filtro, setFiltro] = useState('todas'); // 'todas' | 'pendientes' | 'completadas'

  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [tareas]);

  const agregarTarea = (e) => {
    e.preventDefault();
    if (nuevaTarea.trim() === '') return;

    const tarea = {
      id: Date.now(),
      texto: nuevaTarea.trim(),
      hecha: false,
    };

    setTareas([tarea, ...tareas]);
    setNuevaTarea('');
  };

  const marcarTerminada = (id) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, hecha: !tarea.hecha } : tarea
      )
    );
  };

  const borrarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };

  const tareasVisibles = useMemo(() => {
    if (filtro === 'pendientes') return tareas.filter((t) => !t.hecha);
    if (filtro === 'completadas') return tareas.filter((t) => t.hecha);
    return tareas;
  }, [tareas, filtro]);

  const completadas = tareas.filter((t) => t.hecha).length;

  const mensajeVacio = {
    todas: 'Tu lista está vacía. Agrega la primera tarea arriba.',
    pendientes: 'No tienes tareas pendientes. Bien hecho.',
    completadas: 'Todavía no has completado ninguna tarea.',
  };

  return (
    <div className="pagina">
      <div className="tarjeta">
        <header className="cabecera">
          <h1>Lista de Tareas</h1>
          {tareas.length > 0 && (
            <p className="contador">
              {completadas} / {tareas.length} completadas
            </p>
          )}
        </header>

        <form onSubmit={agregarTarea} className="formulario">
          <input
            type="text"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="¿Qué tienes que hacer?"
          />
          <button type="submit">Agregar</button>
        </form>

        {tareas.length > 0 && (
          <div className="filtros">
            {['todas', 'pendientes', 'completadas'].map((f) => (
              <button
                key={f}
                className={filtro === f ? 'filtro activo' : 'filtro'}
                onClick={() => setFiltro(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        <ul className="lista">
          {tareasVisibles.length === 0 && (
            <p className="vacio">{mensajeVacio[filtro]}</p>
          )}
          {tareasVisibles.map((tarea) => (
            <li key={tarea.id} className="tarea">
              <label className="casilla">
                <input
                  type="checkbox"
                  checked={tarea.hecha}
                  onChange={() => marcarTerminada(tarea.id)}
                />
                <span className="marca"></span>
              </label>

              <span className={tarea.hecha ? 'texto hecha' : 'texto'}>
                {tarea.texto}
              </span>

              <button
                className="borrar"
                onClick={() => borrarTarea(tarea.id)}
                aria-label="Borrar tarea"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <footer className="pie">
          <span>Juan Manuel Espitia Salguero y Juan José Barreiro Guapacha</span>
          <span>Docente: Rafael Alberto Moreno Parra</span>
        </footer>
      </div>
    </div>
  );
}

export default App;