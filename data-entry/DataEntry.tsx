import React, { useState, useEffect } from 'react';
import { addTimeLeak } from '../services/supabaseService';
import { TimeLeakInsert, NotificationType } from '../types';
import { CATEGORIES } from '../constants/categories';
import { TEXTS } from '../constants/strings';
import { formatDateTimeLocal } from '../utils/date';


interface CategoryButtonProps {
    icon: React.ReactNode;
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ icon, label, isSelected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-xl transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-brand-primary ${
            isSelected
                ? 'bg-brand-primary text-white shadow-lg'
                : 'bg-background-light hover:bg-background-lighter text-text-secondary hover:text-text-primary'
        }`}
    >
        <div className="mb-2">{icon}</div>
        <span className="text-center text-sm font-medium">{label}</span>
    </button>
);


const DataEntry: React.FC<{ setNotification: (notification: NotificationType) => void; userId: string; }> = ({ setNotification, userId }) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [duration, setDuration] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setDateTime(formatDateTimeLocal(new Date()));
    }, []);

    const resetForm = () => {
        setSelectedCategoryId(null);
        setDescription('');
        setDuration('');
        setDateTime(formatDateTimeLocal(new Date()));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedCategoryId) {
            setNotification({ message: TEXTS.NOTIFICATIONS.SELECT_CATEGORY_ERROR, type: 'error' });
            return;
        }

        setIsLoading(true);
        setNotification(null);

        const leakData: TimeLeakInsert = {
            user_id: userId,
            fecha_hora_registro: new Date(dateTime).toISOString(),
            tipo_fuga: selectedCategoryId,
            descripcion_adicional: description,
            minutos_duracion: duration ? parseInt(duration, 10) : undefined,
        };

        try {
            await addTimeLeak(leakData);
            setNotification({ message: TEXTS.NOTIFICATIONS.LEAK_REGISTERED_SUCCESS, type: 'success' });
            resetForm();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : TEXTS.COMMON.ERROR_UNKNOWN;
            setNotification({ message: TEXTS.NOTIFICATIONS.REGISTER_ERROR(errorMessage), type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-background-light shadow-2xl rounded-2xl p-6 md:p-8">
            <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">{TEXTS.DATA_ENTRY.TITLE}</h1>
                <p className="text-text-muted mt-2">{TEXTS.DATA_ENTRY.SUBTITLE}</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">{TEXTS.DATA_ENTRY.STEP_1_LABEL}</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {CATEGORIES.map((cat) => (
                            <CategoryButton
                                key={cat.id}
                                icon={cat.icon}
                                label={cat.label}
                                isSelected={selectedCategoryId === cat.id}
                                onClick={() => setSelectedCategoryId(cat.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="datetime" className="block text-sm font-medium text-text-secondary mb-2">{TEXTS.DATA_ENTRY.STEP_2_LABEL}</label>
                        <input
                            id="datetime"
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            className="w-full bg-background-dark text-text-primary border border-background-lighter rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-text-secondary mb-2">{TEXTS.DATA_ENTRY.STEP_3_LABEL}</label>
                        <input
                            id="duration"
                            type="number"
                            min="0"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder={TEXTS.DATA_ENTRY.DURATION_PLACEHOLDER}
                            className="w-full bg-background-dark text-text-primary border border-background-lighter rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-2">{TEXTS.DATA_ENTRY.STEP_4_LABEL}</label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={TEXTS.DATA_ENTRY.DESCRIPTION_PLACEHOLDER}
                            className="w-full bg-background-dark text-text-primary border border-background-lighter rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        ></textarea>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading || !selectedCategoryId}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-brand-primary disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? TEXTS.DATA_ENTRY.SUBMIT_BUTTON_LOADING : TEXTS.DATA_ENTRY.SUBMIT_BUTTON}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DataEntry;