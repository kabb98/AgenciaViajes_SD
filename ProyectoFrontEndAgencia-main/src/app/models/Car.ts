export interface Car {
  _id?: string;
  nombre: string;
  origen: string;
  destino: string;
  fechaIda: Date;
  fechaVuelta: Date;
  precio: number;
  reservado?: boolean;
  client?: string;
}
