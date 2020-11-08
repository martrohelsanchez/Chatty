import {createGlobalStyle} from 'styled-components';

export default createGlobalStyle`
    html {
        font-size: 16px;
        font-family: ${({theme}) => theme.font.primary};
    }

    html, body {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    #root {
        height: 100%;
        width: 100%;
    }

    ::placeholder {
        color: ${({theme}) => theme.placeholderColor};
        margin-left: 10px;
    }

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background: #ead3b7;
        border-radius: 10px;
    }
`;