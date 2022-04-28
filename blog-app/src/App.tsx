import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import NavigationBar from './components/NavigationBar';
import { GlobalStyle } from './GlobalStyle';
import Exception from './routes/Exception';
import Home from './routes/Home';
import PostDetail from './routes/PostDetail/PostDetail';
import Posts from './routes/Posts/Posts';
import Signup from './routes/Signup/Signup';
import { darkTheme, lightTheme } from './theme';

function App() {

  const isDarkMode = 
    useSelector((state: { value: boolean }) => state.value);

  const queryClient = new QueryClient();

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={isDarkMode ? lightTheme : darkTheme}>
          <GlobalStyle />
          <BrowserRouter>
            <NavigationBar />
            <Routes>
              <Route path="/posts/detail/:id" element={<PostDetail />} />
              <Route path="/posts/*" element={<Posts />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Home />} />
              <Route path="/*" element={<Exception />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
