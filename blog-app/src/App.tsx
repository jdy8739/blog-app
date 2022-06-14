import { QueryClient, QueryClientProvider } from 'react-query';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import NavigationBar from './components/NavigationBar';
import { GlobalStyle } from './GlobalStyle';
import Exception from './routes/Exception';
import Home from './routes/Home';
import PostDetail from './routes/PostDetail/PostDetail';
import Posts from './routes/Posts/Posts';
import Signup from './routes/Signup/Signup';
import WritePost from './routes/WritePost/WritePost';
import { darkTheme, lightTheme } from './theme';

function App() {
	const isDarkMode = useSelector((state: { modeChanger: { value: boolean } }) => {
		return state.modeChanger.value;
	});

	const queryClient = new QueryClient();

	return (
		<div className="App">
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={isDarkMode ? lightTheme : darkTheme}>
					<GlobalStyle />
					<BrowserRouter>
						<NavigationBar isDarkMode={isDarkMode} />
						<Routes>
							<Route path="/write/*" element={<WritePost />} />
							<Route path="/modify/*" element={<WritePost />} />
							<Route
								path="/posts/detail/:id"
								element={<PostDetail />}
							/>
							<Route path="/posts/*" element={<Posts />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/exception" element={<Exception />} />
							<Route path="/" element={<Home />} />
							<Route path="/*" element={<Exception />} />
						</Routes>
					</BrowserRouter>
					<ToastContainer />
				</ThemeProvider>
			</QueryClientProvider>
		</div>
	);
}

export default App;
