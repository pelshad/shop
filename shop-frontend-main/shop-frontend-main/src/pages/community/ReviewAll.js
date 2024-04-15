import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { getBoard } from 'api/board.js';

import Loading from 'components/loding/Loading';
import Pageing from 'components/board/Pageing';

import * as Style from "assets/styleComponent/community/review"

import { ReactComponent as Star } from 'assets/images/star.svg';

const ReviewAll = () => {
    const nav = useNavigate();
    const regex = /.*<br>.*/;
    const [searchParams, setSearchParams] = useSearchParams();
    const { boardPage } = useParams();
    const [boardList, setBoardList] = useState(null);
    const [imageSrc, setImageSrc] = useState();
    const [isImage, setIsImage] = useState(false);
    const [more, setMore] = useState();

    // 이미지 클릭시 큰 이미지 팝업
    const imagePopup = (src) => {
        setIsImage(true);
        setImageSrc(src);
    }

    // 게시글 가져오기
    useEffect(() => {
        const data = {
            boardPage: boardPage,
            boardType: "review"
        }
        if (searchParams.get("search") === null) {
            data.search = searchParams.get("search");
        }
        setBoardList(null);
        getBoard(data, setBoardList);
    }, [nav])

    return (
        boardList === null
            ? <Loading />
            : <>
                <ul className="all">
                    {
                        boardList.list.length > 0 ?
                            boardList.list.map((a, i) => {
                                return (
                                    <li key={i}>
                                        <div className="content">
                                            <div className="star">
                                                {
                                                    [...Array(a.grade)].map((a, i) => (
                                                        <Star key={i} fill='#ffd900'></Star>
                                                    ))
                                                }
                                            </div>
                                            <h3>{a.title}</h3>
                                            {
                                                regex.test(a.content)
                                                    ? <p style={i === more ? { maxHeight: "unset" } : { maxHeight: "40px" }} dangerouslySetInnerHTML={{ __html: a.content }}></p>
                                                    : a.content.length > 50
                                                        ? <p dangerouslySetInnerHTML={i === more ? { __html: a.content } : { __html: a.content.substring(0, 50) + "..." }}></p>
                                                        : <p dangerouslySetInnerHTML={{ __html: a.content }}></p>
                                            }
                                            {
                                                regex.test(a.content)
                                                    ? <button onClick={() => {
                                                        i === more
                                                            ? setMore(null)
                                                            : setMore(i)
                                                    }}>더보기</button>
                                                    : a.content.length > 50
                                                        ? <button onClick={() => {
                                                            i === more
                                                                ? setMore(null)
                                                                : setMore(i)
                                                        }}>더보기</button>
                                                        : null
                                            }
                                            <div className="imageView">
                                                {
                                                    a.firstImg !== ""
                                                        ? <img onClick={() => { imagePopup(a.firstImg) }} src={a.firstImg} alt="" />
                                                        : null
                                                }
                                                {
                                                    a.secondImg !== ""
                                                        ? <img onClick={() => { imagePopup(a.secondImg) }} src={a.secondImg} alt="" />
                                                        : null
                                                }
                                            </div>
                                        </div>
                                        <div className="reviewInfo">
                                            <ul>
                                                <li><span>상품명</span>{a.goods_nm}</li>
                                                <li><span>작성자</span>{a.user_id}</li>
                                                <li><span>작성일</span>{a.create_date}</li>
                                            </ul>
                                        </div>
                                    </li>
                                )
                            })
                            : <p style={{ textAlign: "center", lineHeight: "200px", fontSize: "18px" }}>등록된 리뷰가 없습니다</p>
                    }
                </ul>

                <Style.Popup style={isImage === true ? { display: "block" } : { display: "none" }}>
                    <div onClick={() => { setIsImage(false) }} className="popupBg"></div>
                    <img src={imageSrc} alt="" />
                    <i onClick={() => { setIsImage(false) }} className="fa-solid fa-xmark"></i>
                </Style.Popup>

                {
                    boardList.list.length > 0 &&
                    <Pageing boardPage={boardPage} boardLength={boardList?.count.page_count} url={"/community/review/all"} />
                }
            </>
    );
};

export default ReviewAll;