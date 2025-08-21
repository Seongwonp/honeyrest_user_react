import { BrowserRouter } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import ScrollToTop from "./ScrollToTop.jsx";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop/>
            <AppWrapper />
        </BrowserRouter>
    );
}

export default App;