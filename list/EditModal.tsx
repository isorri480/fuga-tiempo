import React, { useState } from 'react';
import { TimeLeakRow, TimeLeakUpdate } from '../types';
import { CATEGORIES } from '../constants/categories';
import { TEXTS } from '../constants/strings';
import { formatDateTimeLocal } from '../utils/date';

interface EditModalProps {
    leak: TimeLeakRow;
    onClose: () => void;
    onSave: (updatedLeak: TimeLeakUpdate) => void;
}

const EditModal: React.FC<EditModalProps> = ({ leak, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        tipo_fuga: leak.tipo_fuga,
        fecha_hora_registro: formatDateTimeLocal(new Date(leak.fecha_hora_registro)),
        minutos_duracion: leak.minutos_duracion || '',
        descripcion_adicional: leak.descripcion_adicional || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedData: TimeLeakUpdate = {
            ...leak,
            tipo_fuga: formData.tipo_fuga,
            fecha_hora_registro: new Date(formData.fecha_hora_registro).toISOString(),
            minutos_duracion: formData.minutos_duracion ? parseInt(String(formData.minutos_duracion), 10) : null,
            descripcion_adicional: formData.descripcion_adicional,
        };
        onSave(updatedData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-background-light rounded-xl shadow-2xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-text-primary mb-6">{TEXTS.EDIT_MODAL.TITLE}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="tipo_fuga" className="block text-sm font-medium text-text-secondary mb-1">{TEXTS.EDIT_MODAL.CATEGORY_LABEL}</label>
                        <select
                            id="tipo_fuga"
                            name="tipo_fuga"
                            value={formData.tipo_fuga}
                            onChange={handleChange}
                            className="w-full bg-background-dark text-text-primary border border-background-lighter rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        >
                            {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="fecha_hora_registro" className="block text-sm font-medium text-text-secondary mb-1">{TEXTS.EDIT_MODAL.DATETIME_LABEL}</label>
                        <input
                            id="fecha_hora_registro"
                            name="fecha_hora_registro"
                            type="datetime-local"
                            value={formData.fecha_hora_registro}
                            onChange={handleChange}
                            className="w-full bg-background-dark text-text-primary border border-background-lighter rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="minutos_duracion" className="block text-sm font-medium text-text-secondary mb-1">{TEXTS.EDIT_MODAL.DURATION_LABEL}</label>
                        <input
                            id="minutos_duracion"
                            name="minutos_duracion"
                            type="number"
                            min="0"
                            value={formData.minutos_duracion}
                            onChange={handleChange}
                            className="w-full bg-background-dark text-text-primary border border-background-lighter rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="descripcion_adicional" className="block text-sm font-medium text-text-secondary mb-1">{TEXTS.EDIT_MODAL.DESCRIPTION_LABEL}</label>
                        <textarea
                            id="descripcion_adicional"
                            name="descripcion_adicional"
                            rows={3}
                            value={formData.descripcion_adicional}
                            onChange={handleChange}
                            className="w-full bg-background-dark text-text-primary border border-background-lighter rounded-md p-2"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-text-secondary hover:bg-background-lighter">{TEXTS.COMMON.CANCEL}</button>
                        <button type="submit" className="py-2 px-4 rounded-md bg-brand-primary text-white hover:bg-brand-dark">{TEXTS.COMMON.SAVE_CHANGES}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;