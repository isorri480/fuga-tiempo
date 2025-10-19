import React from 'react';
import { TEXTS } from '../constants/strings';

type ChartData = { [key: string]: number };

interface BarChartProps {
    data: ChartData;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    // FIX: Cast Object.entries result to [string, number][] to ensure correct type
    // inference for 'a' and 'b' in the sort callback and for 'value' in the map below,
    // resolving arithmetic and comparison errors.
    const entries = (Object.entries(data) as [string, number][]).sort(([, a], [, b]) => b - a);
    if (entries.length === 0) {
        return <p className="text-text-muted text-center mt-8 py-10 bg-background-light rounded-lg">{TEXTS.STATISTICS.NO_DATA}</p>;
    }

    // FIX: Cast Object.values result to number[] to satisfy Math.max's expected argument type.
    const maxValue = Math.max(...(Object.values(data) as number[]));
    const chartHeight = 300;
    const barWidth = 50;
    const barMargin = 30;
    const chartWidth = entries.length * (barWidth + barMargin);
    const colors = ['#4f46e5', '#7c3aed', '#a5b4fc', '#6d28d9', '#4338ca'];

    return (
        <div className="w-full overflow-x-auto p-4 bg-background-light rounded-lg">
            <svg width={chartWidth} height={chartHeight + 60} aria-label="Gráfico de barras de fugas de tiempo">
                <g>
                    {entries.map(([label, value], index) => {
                        const barHeight = value > 0 ? (value / maxValue) * chartHeight : 0;
                        const x = index * (barWidth + barMargin);
                        const y = chartHeight - barHeight;
                        const color = colors[index % colors.length];

                        return (
                            <g key={label} className="transition-all">
                                <rect x={x} y={y} width={barWidth} height={barHeight} fill={color} rx="4" ry="4">
                                    <title>{TEXTS.STATISTICS.CHART_BAR_TITLE(label, value)}</title>
                                </rect>
                                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                                    {value}
                                </text>
                                <text x={x + barWidth / 2} y={chartHeight + 25} textAnchor="middle" fill="white" fontSize="12" writingMode="tb" >
                                    {label}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

export default BarChart;
