// src/context/index.d.ts
import { Context } from 'react';
declare module './index' {
    export const MyContext: Context<any>;
    export const MyContextProvider: React.FC<{ children: React.ReactNode }>;
}