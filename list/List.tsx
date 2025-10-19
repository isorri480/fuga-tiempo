import React, { useState, useEffect } from 'react';
import { getTimeLeaks, deleteTimeLeak, updateTimeLeak } from '../services/supabaseService';
import { TimeLeakRow, NotificationType, Page, TimeLeakUpdate } from '../types';
import { CATEGORIES } from '../constants/categories';
import { TEXTS } from '../constants/strings';
import { PencilIcon, TrashIcon } from '../components/Icons';
import EditModal from './EditModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const List: React.FC<{ setNotification: (notification: NotificationType) => void; setCurrentPage: (page: Page) => void; userId: string; }> = ({ setNotification, setCurrentPage, userId }) => {
    const [leaks, setLeaks] = useState<TimeLeakRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingLeak, setEditingLeak] = useState<TimeLeakRow | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const categoryIdToLabelMap = new Map(CATEGORIES.map(c => [c.id, c.label]));

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getTimeLeaks(userId);
            setLeaks(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : TEXTS.COMMON.ERROR_UNKNOWN;
            setNotification({ message: TEXTS.NOTIFICATIONS.GET_DATA_ERROR(errorMessage), type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleConfirmDelete = async () => {
        if (deletingId === null) return;

        try {
            await deleteTimeLeak(deletingId);
            setNotification({ message: TEXTS.NOTIFICATIONS.LEAK_DELETED_SUCCESS, type: 'success' });
            fetchData();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : TEXTS.COMMON.ERROR_UNKNOWN;
            setNotification({ message: TEXTS.NOTIFICATIONS.DELETE_ERROR(errorMessage), type: 'error' });
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaveEdit = async (updatedLeak: TimeLeakUpdate) => {
        if (!updatedLeak.id) return;
        try {
            await updateTimeLeak(updatedLeak.id, updatedLeak);
            setNotification({ message: TEXTS.NOTIFICATIONS.LEAK_UPDATED_SUCCESS, type: 'success' });
            setEditingLeak(null);
            fetchData();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : TEXTS.COMMON.ERROR_UNKNOWN;
            setNotification({ message: TEXTS.NOTIFICATIONS.UPDATE_ERROR(errorMessage), type: 'error' });
        }
    };

    if (isLoading) {
        return <p className="text-center text-text-secondary">{TEXTS.COMMON.LOADING}...</p>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            {editingLeak && <EditModal leak={editingLeak} onClose={() => setEditingLeak(null)} onSave={handleSaveEdit} />}
            {deletingId !== null && (
                <DeleteConfirmModal 
                    message={TEXTS.LIST.DELETE_CONFIRM}
                    onConfirm={handleConfirmDelete}
                    onClose={() => setDeletingId(null)}
                />
            )}
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">{TEXTS.LIST.TITLE}</h1>
                    <p className="text-text-muted mt-2">{TEXTS.LIST.SUBTITLE}</p>
                </div>
                <button
                    onClick={() => setCurrentPage('dataEntry')}
                    className="flex-shrink-0 py-2 px-5 font-medium text-white bg-brand-primary hover:bg-brand-dark rounded-md shadow-sm transition-colors"
                >
                    {TEXTS.COMMON.NEW_ENTRY}
                </button>
            </header>

            <div className="bg-background-light shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text-primary uppercase bg-background-lighter">
                            <tr>
                                <th scope="col" className="px-6 py-3">{TEXTS.LIST.TABLE_HEADER_CATEGORY}</th>
                                <th scope="col" className="px-6 py-3">{TEXTS.LIST.TABLE_HEADER_DATETIME}</th>
                                <th scope="col" className="px-6 py-3">{TEXTS.LIST.TABLE_HEADER_DURATION}</th>
                                <th scope="col" className="px-6 py-3">{TEXTS.LIST.TABLE_HEADER_DESCRIPTION}</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">{TEXTS.COMMON.ACTIONS}</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaks.length > 0 ? leaks.map((leak) => (
                                <tr key={leak.id} className="border-b border-background-lighter hover:bg-background-dark">
                                    <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">{categoryIdToLabelMap.get(leak.tipo_fuga) || leak.tipo_fuga}</td>
                                    <td className="px-6 py-4">{new Date(leak.fecha_hora_registro).toLocaleString()}</td>
                                    <td className="px-6 py-4">{leak.minutos_duracion}</td>
                                    <td className="px-6 py-4 max-w-sm truncate" title={leak.descripcion_adicional || ''}>{leak.descripcion_adicional}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            <button onClick={() => setEditingLeak(leak)} className="font-medium text-brand-light hover:text-brand-primary"><PencilIcon className="w-5 h-5" /></button>
                                            <button onClick={() => setDeletingId(leak.id)} className="font-medium text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-text-muted">{TEXTS.LIST.NO_RECORDS}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default List;