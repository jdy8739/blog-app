import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import NavigationBar from './components/NavigationBar';
import { GlobalStyle } from './GlobalStyle';
import Exception from './routes/Exception';
import Home from './routes/Home';
import Signup from './routes/Signup/Signup';
import { darkTheme, lightTheme } from './theme';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <GlobalStyle />
        <NavigationBar />
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<Exception />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
