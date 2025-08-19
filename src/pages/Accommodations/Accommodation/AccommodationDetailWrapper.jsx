import { useParams } from "react-router-dom";
import Accommodation from "./Accommodation.jsx";

function AccommodationDetailWrapper() {
    const { id } = useParams();
    return <Accommodation accommodationId={id} />;
}

export default AccommodationDetailWrapper;