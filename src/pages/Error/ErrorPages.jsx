import {Route} from 'react-router-dom';
import NotFoundPage from "./NotFoundPage.jsx";
import ServerErrorPage from "./ServerErrorPage.jsx";
import UnauthorizedPage from "./UnauthorizedPage.jsx";
import ForbiddenPage from "./ForbiddenPage.jsx";
import BadRequestPage from "./BadRequestPage.jsx";
import EmailErrorPage from "./EmailErrorPage.jsx";

function ErrorPages() {
    return (
        <>
            <Route path="/error/400" element={<BadRequestPage/>}/>
            <Route path="/error/401" element={<UnauthorizedPage/>}/>
            <Route path="/error/403" element={<ForbiddenPage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
            <Route path="/error/500" element={<ServerErrorPage/>}/>
            <Route path="/error/email" element={<EmailErrorPage/>}/>
        </>
    );
}

export default ErrorPages;