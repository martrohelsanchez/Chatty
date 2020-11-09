/// <reference types="react-scripts" />

export interface IProcessEnv {
    REACT_APP_SERVER_URL: string;
    REACT_APP_ALLOW_DELETION: 'true' | 'false';
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends IProcessEnv { }
    }
}
