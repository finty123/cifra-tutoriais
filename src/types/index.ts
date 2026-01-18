export interface Aula {
  id: string;
  titulo: string;
  duracao: string;
  thumbUrl: string;
  videoUrl: string;
}

export interface Modulo {
  id: string;
  titulo: string;
  descricao: string;
  capaUrl: string;
  aulas: Aula[];
}