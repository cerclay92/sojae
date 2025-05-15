'use client';

import { DailyViewsChart, CategoryChart } from './statistics-charts';

interface DailyViewsData {
  date: string;
  views: number;
}

interface CategoryData {
  name: string;
  value: number;
}

export function DailyViewsChartWrapper({ data }: { data: DailyViewsData[] }) {
  return <DailyViewsChart data={data} />;
}

export function CategoryChartWrapper({ data }: { data: CategoryData[] }) {
  return <CategoryChart data={data} />;
} 