import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './services/supabaseService';
import { Page, NotificationType } from './types';
import Notification from './components/Notification';
import Sidebar from './sidebar/Sidebar';
import DataEntry from './data-entry/DataEntry';
import Statistics from './statistics/Statistics';
import List from './list/List';
import Auth from './auth/Auth';
import { TEXTS } from './constants/strings';

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<Page>('dataEntry');
    const [notification, setNotification] = useState<NotificationType>(null);

    // Effect to manage the user session
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };
        
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const renderPage = () => {
        if (!session) return null;
        const userId = session.user.id;
        switch (currentPage) {
            case 'dataEntry':
                return <DataEntry setNotification={setNotification} userId={userId} />;
            case 'statistics':
                return <Statistics setNotification={setNotification} userId={userId} />;
            case 'list':
                return <List setNotification={setNotification} setCurrentPage={setCurrentPage} userId={userId} />;
            default:
                return <DataEntry setNotification={setNotification} userId={userId} />;
        }
    };
    
    if (loading) {
         return <div className="min-h-screen bg-background-dark text-text-primary flex items-center justify-center">{TEXTS.COMMON.LOADING}...</div>;
    }

    if (!session) {
        return (
             <div className="min-h-screen bg-background-dark text-text-primary flex items-center justify-center p-4">
                 <Auth />
             </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-text-primary flex">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

            <main className="flex-grow p-4 md:p-8 overflow-auto flex items-center justify-center">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;
