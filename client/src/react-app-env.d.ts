/// <reference types="react-scripts" />

export interface IProcessEnv {
    REACT_APP_SERVER_URL: string;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends IProcessEnv { }
    }
}
