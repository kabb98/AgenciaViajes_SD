export interface Hotel {
  _id?: string;
  nombre: string;
  numHab: number;
  fecha: Date;
  precio: number;
  ciudad: string;
  reservado?: boolean;
  client?: string;
}
