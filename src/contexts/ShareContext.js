import React, { createContext, useContext, useState, useEffect } from 'react';

const ShareContext = createContext();
const DISMISSED_KEY = 'shareEncouragementDismissed';

export const useShare = () => {
    const context = useContext(ShareContext);
    if (!context) {
        throw new Error('useShare must be used within ShareProvider');
    }
    return context;
};

export const ShareProvider = ({ children }) => {
    const [showEncouragement, setShowEncouragement] = useState(false);
    const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

    // Check if user has previously dismissed the bubble
    useEffect(() => {
        const dismissed = localStorage.getItem(DISMISSED_KEY);
        if (dismissed === 'true') {
            setHasBeenDismissed(true);
        }
    }, []);

    const showEncouragementBubble = () => {
        // Only show if it hasn't been dismissed
        if (!hasBeenDismissed) {
            setShowEncouragement(true);
        }
    };

    const hideEncouragementBubble = () => {
        setShowEncouragement(false);
        // Mark as dismissed and save to localStorage
        setHasBeenDismissed(true);
        localStorage.setItem(DISMISSED_KEY, 'true');
    };

    return (
        <ShareContext.Provider value={{ showEncouragement, showEncouragementBubble, hideEncouragementBubble }}>
            {children}
        </ShareContext.Provider>
    );
};

