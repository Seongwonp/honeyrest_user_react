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

/**
 * 숙소 태그 아이콘 매핑
 * - 서버(accommodation_tag.icon_name)에서 내려오는 아이콘 이름을 컴포넌트로 변환
 * - 전체 아이콘 세트를 import 하지 않도록 실제 사용하는 아이콘만 명시적으로 등록
 * - 새 태그 아이콘이 추가되면 이 목록에도 추가해야 화면에 표시됨
 */
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

// 아이콘 이름으로 컴포넌트 조회 (등록되지 않은 이름이면 null)
export const getTagIcon = (iconName) => (iconName && TAG_ICONS[iconName]) || null;
