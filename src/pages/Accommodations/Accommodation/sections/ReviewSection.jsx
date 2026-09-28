import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { HiStar } from "react-icons/hi";
import SafeImage from "@/components/SafeImage.jsx";

// 고객 리뷰 목록 (좋아요 상태는 부모의 reviewStates 사용)
function ReviewSection({ reviews, reviewStates, sectionRefs }) {
    return (
        <section id="reviews" ref={(el) => (sectionRefs.current["reviews"] = el)} className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-deep-gray">고객 리뷰</h2>
                <span className="px-4 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-400">{reviews.length} total reviews</span>
            </div>
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-[2rem]">
                        <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">No reviews yet</p>
                    </div>
                ) : (
                    reviews.map((r, i) => {
                        const state = reviewStates.find((s) => s.reviewId === r.reviewId);
                        const isLiked = state?.isLiked ?? false;
                        const likeCount = state?.likeCount ?? 0;
                        return (
                            <div key={r.reviewId ?? i} className="p-8 bg-white rounded-[2rem] border border-gray-50 shadow-sm space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-honey-yellow/10 flex items-center justify-center font-black text-honey-yellow-dark">
                                            {r.nickname[0]}
                                        </div>
                                        <div>
                                            <p className="font-black text-deep-gray">{r.nickname}</p>
                                            <div className="flex items-center gap-1 text-honey-yellow mt-0.5">
                                                <HiStar />
                                                <span className="text-xs font-black">{r.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-300 tracking-wider uppercase">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 font-medium leading-relaxed">{r.content}</p>
                                {r.images?.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                        {r.images.map((url, idx) => (
                                            <SafeImage key={url || idx} src={url} alt="Review" className="w-24 h-24 rounded-2xl object-cover border border-gray-100" />
                                        ))}
                                    </div>
                                )}
                                <div className="pt-4 border-t border-gray-50 flex items-center gap-6">
                                    <button className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest">
                                        <FaThumbsDown />
                                        <span>Helpful?</span>
                                    </button>
                                    <button onClick={() => {}} className={`flex items-center gap-2 ${isLiked ? 'text-leaf-green' : 'text-gray-300'} hover:text-leaf-green transition-colors text-xs font-bold uppercase tracking-widest`}>
                                        <FaThumbsUp />
                                        <span>Like {likeCount}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}

export default ReviewSection;
