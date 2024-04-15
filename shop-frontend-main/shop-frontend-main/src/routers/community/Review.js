import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import ReviewPhoto from 'pages/community/ReviewPhoto';
import ReviewAll from 'pages/community/ReviewAll';

import * as Style from "assets/styleComponent/community/review";

const Review = () => {
    const nav = useNavigate();
    const location = useLocation();
    const [url, setUrl] = useState(0);

    // 리뷰 사진, 전체 리뷰 url 나누기
    useEffect(() => {
        const regexArr = [/.*photo.*/, /.*all.*/];
        for (let i = 0; i < regexArr.length; i++) {
            if (regexArr[i].test(location.pathname)) {
                setUrl(i);
            }
        }
    }, [nav])
    return (
        <Style.ReviewBoard>
            <div className="wrap">
                <h3>리뷰보기</h3>
                <p>라이프힘을 이용해주신 고객님께서 작성해주신 상품 사용 후기입니다.</p>

                <Routes>
                    <Route path='/all/:boardPage' element={<ReviewAll />} />
                </Routes>
            </div>
        </Style.ReviewBoard>
    );
};

export default Review;