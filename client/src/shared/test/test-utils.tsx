import React from 'react';
import {render} from '@testing-library/react';
import {Provider} from "react-redux";
import {BrowserRouter as Router} from 'react-router-dom';
import {ThemeProvider} from "styled-components";
import theme from "shared/theme";

import store from "../../redux/store"

const AllTheProviders: React.FC = ({children}) => {
    return (
        <Provider store={store}>
            <Router>
                <ThemeProvider theme={theme}>
                    {children}
                </ThemeProvider>
            </Router>
        </Provider>
    )
}

export const renderWithProviders = (
  ui: Parameters<typeof render>[0],
  options?: Parameters<typeof render>[1]
) => { 
    return render(ui, { wrapper: AllTheProviders, ...options }); 
}