import React from 'react';
import { Page } from '../types';
import { PlusCircleIcon, ChartBarIcon, ListBulletIcon, ArrowRightStartOnRectangleIcon } from '../components/Icons';
import { TEXTS } from '../constants/strings';
import { supabase } from '../services/supabaseService';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    const navItems = [
        { id: 'dataEntry', label: TEXTS.SIDEBAR.NAV_DATA_ENTRY, icon: <PlusCircleIcon className="w-6 h-6" /> },
        { id: 'list', label: TEXTS.SIDEBAR.NAV_LIST, icon: <ListBulletIcon className="w-6 h-6" /> },
        { id: 'statistics', label: TEXTS.SIDEBAR.NAV_STATISTICS, icon: <ChartBarIcon className="w-6 h-6" /> },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <aside className="w-64 bg-background-light p-4 flex flex-col flex-shrink-0 justify-between">
            <div>
                <header className="px-3 mb-8">
                    <h1 className="text-2xl font-bold text-text-primary tracking-tight">{TEXTS.SIDEBAR.TITLE}</h1>
                </header>
                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id as Page)}
                            className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                                currentPage === item.id
                                    ? 'bg-brand-primary text-white'
                                    : 'text-text-secondary hover:bg-background-lighter hover:text-text-primary'
                            }`}
                            aria-current={currentPage === item.id}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <div>
                 <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 w-full text-text-secondary hover:bg-background-lighter hover:text-text-primary"
                >
                    <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
                    <span className="font-medium">{TEXTS.SIDEBAR.NAV_LOGOUT}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;