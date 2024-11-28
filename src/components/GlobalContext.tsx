import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the context's state
interface GlobalContextType {
    globalVariable: string;
    setGlobalVariable: (value: string) => void;
}

// Create the context with a default value
const defaultContextValue: GlobalContextType = {
    globalVariable: '',
    setGlobalVariable: () => { },
};

export type { GlobalContextType };

export const GlobalContext = createContext<GlobalContextType>(defaultContextValue)