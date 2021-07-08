import { Flight } from './Flight';
import { Car } from "./Car";
import { Hotel } from "./Hotel";

export interface Book {
  _id?: string;
  usuario: string;
  servicios: (Car|Hotel|Flight)[]
  precio: number;
  fecha?: Date;
}
