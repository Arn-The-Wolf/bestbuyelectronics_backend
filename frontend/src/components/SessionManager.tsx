import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

export default function SessionManager({ children }: { children: React.ReactNode }) {
    const timerRef = useRef<NodeJS.Timeout>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const logout = () => {
        if (localStorage.getItem('auth_token')) {
            localStorage.removeItem('auth_token');
            toast({
                title: "Session Expired",
                description: "You have been logged out due to inactivity.",
                variant: "destructive"
            });
            navigate('/auth');
        }
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(logout, INACTIVITY_LIMIT);
    };

    useEffect(() => {
        // Events to monitor
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimer();
        };

        // Initial start
        resetTimer();

        // Attach listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, []);

    return <>{children}</>;
}
