import React, { useState, useEffect } from 'react';
import { getTimeLeaks } from '../services/supabaseService';
import { TimeLeakRow, NotificationType } from '../types';
import { CATEGORIES } from '../constants/categories';
import { TEXTS } from '../constants/strings';
import { formatDateForInput } from '../utils/date';
import BarChart from './BarChart';

type ChartData = { [key: string]: number };

const Statistics: React.FC<{ setNotification: (notification: NotificationType) => void; userId: string; }> = ({ setNotification, userId }) => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const [startDate, setStartDate] = useState(formatDateForInput(oneMonthAgo));
    const [endDate, setEndDate] = useState(formatDateForInput(today));
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const categoryIdToLabelMap = new Map(CATEGORIES.map(c => [c.id, c.label]));

    const handleGenerateChart = async () => {
        setIsLoading(true);
        setChartData(null);
        setNotification(null);
        try {
            const leaks: TimeLeakRow[] = await getTimeLeaks(userId, startDate, endDate);

            const totalMinutesPerCategory = leaks.reduce((acc, leak) => {
                const label = categoryIdToLabelMap.get(leak.tipo_fuga) || 'Desconocido';
                const duration = leak.minutos_duracion || 0;
                acc[label] = (acc[label] || 0) + duration;
                return acc;
            }, {} as ChartData);

            setChartData(totalMinutesPerCategory);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : TEXTS.COMMON.ERROR_UNKNOWN;
            setNotification({ message: TEXTS.NOTIFICATIONS.GET_DATA_ERROR(errorMessage), type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleGenerateChart();
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">{TEXTS.STATISTICS.TITLE}</h1>
                <p className="text-text-muted mt-2">{TEXTS.STATISTICS.SUBTITLE}</p>
            </header>

            <div className="bg-background-light p-6 rounded-xl mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="w-full md:w-auto">
                    <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary mb-1">{TEXTS.STATISTICS.START_DATE_LABEL}</label>
                    <input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-background-dark text-text-primary border border-background-lighter rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>
                <div className="w-full md:w-auto">
                    <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary mb-1">{TEXTS.STATISTICS.END_DATE_LABEL}</label>
                    <input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-background-dark text-text-primary border border-background-lighter rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>
                <button
                    onClick={handleGenerateChart}
                    disabled={isLoading}
                    className="w-full md:w-auto mt-4 md:mt-0 self-end py-2.5 px-6 border border-transparent rounded-md shadow-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-brand-primary disabled:bg-gray-500"
                >
                    {isLoading ? TEXTS.STATISTICS.GENERATE_BUTTON_LOADING : TEXTS.STATISTICS.GENERATE_BUTTON}
                </button>
            </div>

            <div className="mt-8">
                {isLoading && <p className="text-center text-text-secondary">{TEXTS.STATISTICS.LOADING_DATA}</p>}
                {chartData && <BarChart data={chartData} />}
            </div>
        </div>
    );
};

export default Statistics;