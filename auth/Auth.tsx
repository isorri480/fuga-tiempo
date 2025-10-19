import React, { useState } from 'react';
import { supabase } from '../services/supabaseService';
import { TEXTS } from '../constants/strings';

const AuthContainer: React.FC<{ children: React.ReactNode; title: string; subtitle: string }> = ({ children, title, subtitle }) => (
    <div className="w-full max-w-md mx-auto bg-background-light shadow-2xl rounded-2xl p-8">
        <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">{title}</h1>
            <p className="text-text-muted mt-2">{subtitle}</p>
        </header>
        {children}
    </div>
);

const Auth: React.FC = () => {
    const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

    const handleAuthAction = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');
        setMessageType(null);
        
        try {
            if (mode === 'signIn') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                // Session will be updated by onAuthStateChange in App.tsx
            } else { // signUp mode
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage(TEXTS.AUTH.SIGN_UP_SUCCESS);
                setMessageType('success');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : TEXTS.COMMON.ERROR_UNKNOWN;
            const messageText = mode === 'signIn' ? TEXTS.AUTH.LOGIN_ERROR(errorMessage) : TEXTS.AUTH.SIGN_UP_ERROR(errorMessage);
            setMessage(messageText);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };
    
    const messageColorClass = messageType === 'success' ? 'text-green-400' : 'text-red-500';

    return (
        <AuthContainer title={TEXTS.AUTH.WELCOME_TITLE} subtitle={TEXTS.AUTH.WELCOME_SUBTITLE}>
            
            <div className="flex border-b border-background-lighter mb-6">
                <button 
                    onClick={() => setMode('signIn')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'signIn' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                >
                    {TEXTS.AUTH.SIGN_IN_TAB}
                </button>
                <button 
                    onClick={() => setMode('signUp')}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'signUp' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-text-muted hover:text-text-primary'}`}
                >
                    {TEXTS.AUTH.SIGN_UP_TAB}
                </button>
            </div>

            {message && <p className={`text-center mb-4 text-sm ${messageColorClass}`}>{message}</p>}
            
            <form onSubmit={handleAuthAction} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                        {TEXTS.AUTH.EMAIL_LABEL}
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={TEXTS.AUTH.EMAIL_PLACEHOLDER}
                        className="w-full bg-background-dark text-text-primary border border-background-lighter rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                        {TEXTS.AUTH.PASSWORD_LABEL}
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder={TEXTS.AUTH.PASSWORD_PLACEHOLDER}
                        className="w-full bg-background-dark text-text-primary border border-background-lighter rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-brand-primary disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? TEXTS.AUTH.LOADING : (mode === 'signIn' ? TEXTS.AUTH.SIGN_IN_BUTTON : TEXTS.AUTH.SIGN_UP_BUTTON)}
                    </button>
                </div>
            </form>
        </AuthContainer>
    );
};

export default Auth;