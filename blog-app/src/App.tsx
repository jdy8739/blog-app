import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import { darkTheme, lightTheme } from './theme';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <GlobalStyle />
        
      </ThemeProvider>
    </div>
  );
}

export default App;
