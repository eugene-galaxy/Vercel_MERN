// City option interface
export interface IOption {
  label: string;
  value: string;
}

export interface ITravelInfo {
  origin: string;
  intermediateCities: Array<string>;
  destination: string;
  passengers: Number;
  date: string;
  distance: Array<number>;
  errors: Array<number>;
}
