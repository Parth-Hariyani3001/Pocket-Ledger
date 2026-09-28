/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useLayoutEffect, useState } from "react";

type ThemeContextType = {
    isDarkMode: boolean,
    toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const saved = localStorage.getItem('darkModePocketLedger');
        return saved ? JSON.parse(saved) : true;
    });

    useLayoutEffect(() => {
        localStorage.setItem('darkModePocketLedger', JSON.stringify(isDarkMode));

        if (isDarkMode)
            document.documentElement.classList.add("dark");
        else
            document.documentElement.classList.remove("dark");

    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode((d) => !d);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('You cannot use Theme context here');

    return { context };
}