import {createGlobalStyle} from 'styled-components';

export default createGlobalStyle`
    html {
        font-size: 16px;
    }

    ::placeholder {
        color: ${({theme}) => theme.placeholderColor};
        margin-left: 10px;
    }

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background: ${({theme}) => theme.dark.thirdly}; 
        border-radius: 10px;
    }
`;