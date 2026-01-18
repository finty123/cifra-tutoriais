import { useState, useEffect } from 'react';
import { Modulo } from '../types';

export function useModulos() {
  const [modulos, setModulos] = useState<Modulo[]>([]);

  // Carregar do LocalStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem('@cifra-tutoriais:modulos');
    if (saved) {
      setModulos(JSON.parse(saved));
    }
  }, []);

  // Função para salvar um novo ou editar
  const salvarModulo = (modulo: Modulo) => {
    const novosModulos = [...modulos];
    const index = novosModulos.findIndex(m => m.id === modulo.id);

    if (index >= 0) {
      novosModulos[index] = modulo;
    } else {
      novosModulos.push(modulo);
    }

    setModulos(novosModulos);
    localStorage.setItem('@cifra-tutoriais:modulos', JSON.stringify(novosModulos));
  };

  return { modulos, salvarModulo };
}