import React, { useState } from "react";
import { FaImages } from "react-icons/fa";
import ImageModal from "./ImageModal";
import SafeImage from "@/components/SafeImage.jsx";

export default function RoomImageViewer({ images }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-md">
                <SafeImage src={images?.[0]} alt="대표 이미지" className="w-full h-full object-cover" />

                {images?.length > 1 && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="absolute bottom-4 right-4 flex items-center gap-2 bg-neutral-900/50 text-white px-3 py-2 rounded-full hover:bg-neutral-900/70 transition"
                    >
                        <FaImages className="text-lg" />
                        <span className="text-sm font-medium">{images.length}+</span>
                    </button>
                )}
            </div>

            {showModal && images?.length > 0 && (
                <ImageModal images={images} onClose={() => setShowModal(false)} />
            )}
        </>
    );
}
