import { BrowserRouter } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import ScrollToTop from "./ScrollToTop.jsx";

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop/>
            <AppWrapper />
        </BrowserRouter>
    );
}

export default App;