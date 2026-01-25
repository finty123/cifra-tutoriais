export interface Aula {
  id: string;
  titulo: string;
  descricao: string; // Este campo será usado para a legenda
  videoUrl: string;
}

export interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  capaUrl: string;
  aulas: Aula[];
}