import { Route } from 'react-router-dom';
import NotFoundPage from "./NotFoundPage.jsx";
import ServerErrorPage from "./ServerErrorPage.jsx";
import UnauthorizedPage from "./UnauthorizedPage.jsx";
import ForbiddenPage from "./ForbiddenPage.jsx";
import BadRequestPage from "./BadRequestPage.jsx";
import EmailErrorPage from "./EmailErrorPage.jsx";
import ServiceUnavailablePage from "./ServiceUnavailablePage.jsx";
import TooManyRequestsPage from "./TooManyRequestsPage.jsx";
import RequestTimeoutPage from "./RequestTimeoutPage.jsx";
import UnprocessableEntityPage from "./UnprocessableEntityPage.jsx";
import PaymentErrorPage from "./PaymentErrorPage.jsx";
import AccountSuspendedPage from "./AccountSuspendedPage.jsx";

function ErrorPages() {
    return (
        <>
            <Route path="/error/400" element={<BadRequestPage />} />
            <Route path="/error/401" element={<UnauthorizedPage />} />
            <Route path="/error/403" element={<ForbiddenPage />} />
            <Route path="/error/422" element={<UnprocessableEntityPage />} />
            <Route path="/error/429" element={<TooManyRequestsPage />} />
            <Route path="/error/500" element={<ServerErrorPage />} />
            <Route path="/error/503" element={<ServiceUnavailablePage />} />
            <Route path="/error/408" element={<RequestTimeoutPage />} />
            <Route path="/error/email" element={<EmailErrorPage />} />
            <Route path="/error/payment" element={<PaymentErrorPage />} />
            <Route path="/error/suspended" element={<AccountSuspendedPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </>
    );
}

export default ErrorPages;