import {
    FaArrowCircleDown, FaArrowCircleUp, FaBan, FaBath, FaBed, FaBicycle,
    FaBinoculars, FaBolt, FaBone, FaBook, FaBreadSlice, FaBroom,
    FaBuilding, FaBus, FaCalendarDay, FaCameraRetro, FaCampground, FaCar,
    FaCarSide, FaCat, FaChair, FaChargingStation, FaChild, FaCity,
    FaClock, FaCoffee, FaCouch, FaCrown, FaDog, FaDumbbell,
    FaFilm, FaFire, FaFireExtinguisher, FaFish, FaGlassCheers, FaGlassMartiniAlt,
    FaHandsHelping, FaHeart, FaHiking, FaHome, FaHotTub, FaHotel,
    FaInfinity, FaLandmark, FaLayerGroup, FaLeaf, FaLightbulb, FaLock,
    FaMapMarkerAlt, FaMedal, FaMountain, FaPagelines, FaParking, FaPaw,
    FaPercent, FaPlane, FaPlayCircle, FaPlug, FaRegSun, FaShieldVirus,
    FaShoppingBag, FaShower, FaSkiing, FaSmoking, FaSnowflake, FaSortAmountUp,
    FaSpa, FaStore, FaSuitcase, FaSun, FaSwimmingPool, FaSync,
    FaTags, FaThLarge, FaThumbsUp, FaTicketAlt, FaToilet, FaTrain,
    FaTree, FaTshirt, FaTv, FaUmbrellaBeach, FaUser, FaUserFriends,
    FaUserSecret, FaUserShield, FaUsers, FaUtensils, FaVolumeMute, FaVolumeUp,
    FaWalking, FaWarehouse, FaWater, FaWifi,
} from "react-icons/fa";

// accommodation_tag.icon_name → 아이콘 컴포넌트. 번들 크기 때문에 쓰는 것만 등록 (새 아이콘은 여기 추가)
const TAG_ICONS = {
    FaArrowCircleDown, FaArrowCircleUp, FaBan, FaBath, FaBed, FaBicycle,
    FaBinoculars, FaBolt, FaBone, FaBook, FaBreadSlice, FaBroom,
    FaBuilding, FaBus, FaCalendarDay, FaCameraRetro, FaCampground, FaCar,
    FaCarSide, FaCat, FaChair, FaChargingStation, FaChild, FaCity,
    FaClock, FaCoffee, FaCouch, FaCrown, FaDog, FaDumbbell,
    FaFilm, FaFire, FaFireExtinguisher, FaFish, FaGlassCheers, FaGlassMartiniAlt,
    FaHandsHelping, FaHeart, FaHiking, FaHome, FaHotTub, FaHotel,
    FaInfinity, FaLandmark, FaLayerGroup, FaLeaf, FaLightbulb, FaLock,
    FaMapMarkerAlt, FaMedal, FaMountain, FaPagelines, FaParking, FaPaw,
    FaPercent, FaPlane, FaPlayCircle, FaPlug, FaRegSun, FaShieldVirus,
    FaShoppingBag, FaShower, FaSkiing, FaSmoking, FaSnowflake, FaSortAmountUp,
    FaSpa, FaStore, FaSuitcase, FaSun, FaSwimmingPool, FaSync,
    FaTags, FaThLarge, FaThumbsUp, FaTicketAlt, FaToilet, FaTrain,
    FaTree, FaTshirt, FaTv, FaUmbrellaBeach, FaUser, FaUserFriends,
    FaUserSecret, FaUserShield, FaUsers, FaUtensils, FaVolumeMute, FaVolumeUp,
    FaWalking, FaWarehouse, FaWater, FaWifi,
};

// 등록되지 않은 이름이면 null
export const getTagIcon = (iconName) => (iconName && TAG_ICONS[iconName]) || null;
