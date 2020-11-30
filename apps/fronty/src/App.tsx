import React from 'react';
import AppRouter from './router';
import GlobalStyle from './theme/Globalstyle';
import { defaultTheme } from './theme/index';
import { ThemeProvider } from 'styled-components';

const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;
