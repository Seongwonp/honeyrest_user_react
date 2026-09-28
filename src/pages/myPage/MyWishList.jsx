import { useEffect, useState } from "react";
import useApiRequest from "@/api/useApiRequest";
import WishToggleButton from "@/components/WishToggleButton";
import { useAuth } from "@/hooks/useAuth"; // ✅ 인증 훅 추가
import SafeImage from "@/components/SafeImage.jsx";

function MyWishList() {
    const { user } = useAuth(); // ✅ 사용자 정보 가져오기
    const userId = user?.userId;

    const { request, isLoading } = useApiRequest();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        if (userId) {
            request(
                {
                    method: "GET",
                    url: "/api/user/wishlist?page=0&size=12",
                },
                {
                    label: "wishlist",
                    onSuccess: (data) => {
                        setWishlist(data.content);
                    },
                    errorMessage: "찜 목록을 불러오지 못했습니다.",
                }
            );
        }
    }, [userId]);

    if (!userId) {
        return (
            <section className="max-w-4xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-6">내 찜 목록</h2>
                <p className="text-gray-500">로그인 후 찜 목록을 확인할 수 있습니다.</p>
            </section>
        );
    }

    return (
        <section className="max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-6">내 찜 목록</h2>

            {isLoading("wishlist") ? (
                <p className="text-gray-500">불러오는 중...</p>
            ) : wishlist.length === 0 ? (
                <p className="text-gray-500">찜한 숙소가 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {wishlist.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center gap-4 border rounded-lg p-3 hover:shadow transition"
                        >
                            <SafeImage
                                src={item.thumbnail}
                                alt={item.name}
                                className="w-24 h-20 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {item.mainRegion} · {item.subRegion}
                                </p>
                                <p className="text-red-500 font-bold mt-1">
                                    ₩{item.price.toLocaleString()}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <button
                                    className="text-sm text-blue-500 hover:underline"
                                    onClick={() =>
                                        window.location.href = `/accommodations/${item.id}`
                                    }
                                >
                                    상세 보기
                                </button>
                                <WishToggleButton
                                    accommodationId={item.id}
                                    initialLiked={true}
                                    userId={userId}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default MyWishList;