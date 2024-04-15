// ========== 현재 안씀 ===========//

import React from 'react';
import { Link } from 'react-router-dom';

import noImg from "assets/images/noImg.gif";

const ReviewPhoto = () => {
    return (
        <>
            <h4>베스트 포토리뷰</h4>
            <ul className="photo">
                <li>
                    <Link to="/pages/review.php?board=photoReview&detail=1">
                        <img src={noImg} alt="" />
                        <div className="content">
                            <div className="star">★★★★★</div>
                            <h4>포토리뷰는 앱 특성상 게시글이 반영되기까지 시간이
                                다소 소요됩니다.</h4>
                            <p>말굽버섯을 즙으로 먹어본 적이 없어서 많이 생경했지만, 성분이 좋다는
                                이야기는 많이 들어서 마침 선물을 해 드릴 일이 있어서 처음 구매해봤습니다.
                                패키지도 고급지고 우선 받으시는 분이 좋아해주셔서 뿌듯했습니다.</p>
                        </div>
                        <div className="productName">
                            <div><img src={noImg} alt="" /></div>
                            더 진한 말굽버섯 1Box
                        </div>
                    </Link>
                </li>
            </ul>
            <div className="bar"></div>
            <ul className="photo">
                <li>
                    <Link to="#">
                        <img src={noImg} alt="" />
                        <div className="content">
                            <div className="star">★★★★★</div>
                            <h4>포토리뷰는 앱 특성상 게시글이 반영되기까지 시간이
                                다소 소요됩니다.</h4>
                            <p>말굽버섯을 즙으로 먹어본 적이 없어서 많이 생경했지만, 성분이 좋다는
                                이야기는 많이 들어서 마침 선물을 해 드릴 일이 있어서 처음 구매해봤습니다.
                                패키지도 고급지고 우선 받으시는 분이 좋아해주셔서 뿌듯했습니다.</p>
                        </div>
                        <div className="productName">
                            <div><img src={noImg} alt="" /></div>
                            더 진한 말굽버섯 1Box
                        </div>
                    </Link>
                </li>
            </ul>

            <div className="pagention">
                <Link to="#"><i className="fa-solid fa-angles-left"></i></Link>
                <Link to="#"><i className="fa-solid fa-angle-left"></i></Link>
                <span>1</span>
                <Link to="#"><i className="fa-solid fa-angle-right"></i></Link>
                <Link to="#"><i className="fa-solid fa-angles-right"></i></Link>
            </div>

            <div className="photoReviewDetail">
                <div className="close"><i className="fa-solid fa-xmark"></i></div>
                <ul>
                    <li><img src="/image/shop/shop.png" alt="" /></li>
                    <li>
                        <h3>
                            <div><img src="/image/shop/shop.png" alt="" /></div>
                            더 진한 말굽버섯 1Box
                        </h3>
                        <div className="content">
                            <div className="star">★★★★★</div>
                            <h4>제목입니다.</h4>
                            <p>
                                내용입니다.
                            </p>
                            <div className="user">
                                <span>l*****</span>
                                <span>2022/04/01</span>
                            </div>
                        </div>
                        <div className="comments">
                            <div>댓글 [1]</div>
                            <ol>
                                <li>
                                    <div className="name">관리자</div>
                                    <p>
                                        앞으로도 많은 사랑 부탁드려요~
                                    </p>
                                    <div className="days">22/04/04</div>
                                </li>
                                <li>
                                    <div className="name">관리자</div>
                                    <p>
                                        앞으로도 많은 사랑 부탁드려요~
                                    </p>
                                    <div className="days">22/04/04</div>
                                </li>
                                <li>
                                    <div className="name">관리자</div>
                                    <p>
                                        앞으로도 많은 사랑 부탁드려요~
                                    </p>
                                    <div className="days">22/04/04</div>
                                </li>
                            </ol>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="bg"></div>
        </>
    );
};

export default ReviewPhoto;