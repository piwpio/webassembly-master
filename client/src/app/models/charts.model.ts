export interface ChartCardData {
  name: string;
  value: number;
  extra?: {
    code: string;
  };
}

export interface ChartBarsData {
  name: string;
  series: ChartCardData[];
}
