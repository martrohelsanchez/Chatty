import {DefaultTheme} from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mobile: string;
    text: {
        primary: string;
        secondary: string;
    };
    dark: {
        primary: string;
        secondary: string;
        thirdly: string;
    };
    font: {
        primary: string;
    };
    placeholderColor: string; 
  }
}

const theme: DefaultTheme = {
    mobile: '700px',
    text: {
        primary: '#ffffff',
        secondary: '#003a47'
    },
    dark: {
        primary: '#003a47',
        secondary: '#00405c',
        thirdly: '#efa985'
    },
    font: {
        primary: "Calibri, 'Gill Sans', 'Gill Sans MT', 'Trebuchet MS', sans-serif"
    },
    placeholderColor: '#ffffff'
}

export default theme;