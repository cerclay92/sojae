'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LabelList
} from 'recharts';
import { format, parse, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

// 차트 색상 팔레트
const COLORS = [
  '#10b981', // emerald-500
  '#22c55e', // green-500
  '#06b6d4', // cyan-500
  '#0ea5e9', // sky-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#d946ef', // fuchsia-500
  '#f43f5e', // rose-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
];

interface DailyViewsChartProps {
  data: Array<{
    date: string;
    views: number;
  }>;
}

export function DailyViewsChart({ data }: DailyViewsChartProps) {
  // 차트 데이터 변환 - 날짜 포맷 변경
  const chartData = data.map(item => {
    try {
      const parsedDate = parse(item.date, 'yyyy-MM-dd', new Date());
      const formattedDate = isValid(parsedDate) 
        ? format(parsedDate, 'M/d', { locale: ko })
        : '날짜 없음';
      
      return {
        date: item.date,
        views: item.views,
        formattedDate: formattedDate,
      };
    } catch (e) {
      console.error('날짜 파싱 오류:', item.date, e);
      return {
        date: item.date,
        views: item.views,
        formattedDate: '날짜 오류',
      };
    }
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      try {
        const dateObj = parse(label, 'yyyy-MM-dd', new Date());
        if (!isValid(dateObj)) {
          return (
            <div className="bg-white dark:bg-gray-800 p-3 border shadow-md rounded-md">
              <p className="font-medium text-sm">날짜 오류</p>
              <p className="text-emerald-600 font-bold">
                {payload[0].value.toLocaleString()}회 조회
              </p>
            </div>
          );
        }
        
        return (
          <div className="bg-white dark:bg-gray-800 p-3 border shadow-md rounded-md">
            <p className="font-medium text-sm">{format(dateObj, 'yyyy년 M월 d일', { locale: ko })}</p>
            <p className="text-emerald-600 font-bold">
              {payload[0].value.toLocaleString()}회 조회
            </p>
          </div>
        );
      } catch (e) {
        console.error('툴팁 날짜 파싱 오류:', label, e);
        return (
          <div className="bg-white dark:bg-gray-800 p-3 border shadow-md rounded-md">
            <p className="font-medium text-sm">날짜 오류</p>
            <p className="text-emerald-600 font-bold">
              {payload[0].value.toLocaleString()}회 조회
            </p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
      >
        <defs>
          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
        <XAxis 
          dataKey="formattedDate" 
          tick={{ fontSize: 12 }}
          tickMargin={10}
          axisLine={{ stroke: '#ccc' }}
          tickLine={false}
          interval={3}
        />
        <YAxis 
          tickFormatter={(value) => value.toLocaleString()}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#ccc' }}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="views" 
          stroke="#10b981" 
          fillOpacity={1} 
          fill="url(#viewsGradient)" 
          strokeWidth={2}
          activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: '#10b981' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface CategoryChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

// 카테고리별 조회수 차트
export function CategoryChart({ data }: CategoryChartProps) {
  // 데이터가 없을 경우 대체 컨텐츠
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center">
          카테고리 데이터가 없습니다.
        </p>
      </div>
    );
  }

  // 모바일 화면에서는 BarChart가 더 보기 좋음
  return (
    <div className="flex flex-col h-full">
      <div className="hidden sm:block h-full">
        <PieChartView data={data} />
      </div>
      <div className="block sm:hidden h-full">
        <BarChartView data={data} />
      </div>
    </div>
  );
}

// 파이 차트 (큰 화면)
function PieChartView({ data }: CategoryChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border shadow-md rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-emerald-600 font-bold">
            {payload[0].value.toLocaleString()}회 조회
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          formatter={(value, entry, index) => (
            <span className="text-sm">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// 바 차트 (작은 화면)
function BarChartView({ data }: CategoryChartProps) {
  // 데이터를 조회수로 내림차순 정렬
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#ccc" opacity={0.2} />
        <XAxis 
          type="number" 
          tickFormatter={(value) => value.toLocaleString()}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#ccc' }}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#ccc' }}
          tickLine={false}
          width={70}
        />
        <Tooltip 
          formatter={(value: number) => [value.toLocaleString() + "회", "조회수"]}
          labelFormatter={(label) => label}
        />
        <Bar 
          dataKey="value" 
          name="조회수"
          barSize={20}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList dataKey="value" position="right" formatter={(value: number) => value.toLocaleString()} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// 객체로도 export
export const StatisticsCharts = {
  DailyViewsChart,
  CategoryChart,
}; 