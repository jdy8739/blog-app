import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import NavigationBar from './components/NavigationBar';
import { GlobalStyle } from './GlobalStyle';
import Exception from './routes/Exception';
import Home from './routes/Home';
import Posts from './routes/Posts/Posts';
import Signup from './routes/Signup/Signup';
import { darkTheme, lightTheme } from './theme';

function App() {

  const isDarkMode = 
    useSelector((state: { value: boolean }) => state.value);

  return (
    <div className="App">
      <ThemeProvider theme={isDarkMode ? lightTheme : darkTheme}>
        <GlobalStyle />
        <NavigationBar />
        <BrowserRouter>
          <Routes>
            <Route path="/posts/*" element={<Posts />} />
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
