// src/components/ImageLoader.js
import React, { useEffect, useState } from "react";
import app from "../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const ImageLoader = () => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const storage = getStorage(app);
        const imageRef = ref(storage, "images/myImage.jpg"); // Storage 경로에 맞게 수정

        getDownloadURL(imageRef)
            .then((url) => {
                setImageUrl(url);
            })
            .catch((error) => {
                console.error("이미지 불러오기 실패:", error);
            });
    }, []);

    return (
        <div>
            {imageUrl ? (
                <img src={imageUrl} alt="불러온 이미지" style={{ width: "300px" }} />
            ) : (
                <p>이미지를 불러오는 중...</p>
            )}
        </div>
    );
};

export default ImageLoader;