import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getProduct } from 'api/product';
import { getBoard } from 'api/board';
import { addBasket } from 'api/basket';

import { comma } from 'utils/commaReplace';
import createCode from 'utils/createCode';

import Loading from 'components/loding/Loading';

import * as Style from "assets/styleComponent/main/main"
import mainbanner from "assets/images/main/mainBanner.jpg";
import noImg from "assets/images/noImg.gif";
import { ReactComponent as Star } from 'assets/images/star.svg';

const Main = () => {
    const [result, setResult] = useState(null);
    const [mainReview, setMainReview] = useState(null);

    useEffect(() => {
        getProduct({ sort_type: "all" }, setResult);
        getBoard({
            boardPage: 1,
            boardType: "review"
        }, setMainReview);
    }, []);


    return (
        result === null || mainReview === null
            ? <Loading />
            : <main>
                <Style.Banner>
                    <img src={mainbanner} alt="" />
                    <div className="content">
                        <div>
                            <h2>
                                귀한분께 드리는 <br />
                                <b>더 귀한 말굽버섯</b>
                            </h2>
                        </div>
                        <a href="#">Shop Now</a>
                    </div>
                </Style.Banner>

                <Style.BrandStory>
                    <div className="wrap">
                        <h2>Brand Story</h2>
                        <h3>라이프힘이 <br />특별한 이유</h3>

                        <p>라이프힘이 특별한 이유에 대한 설명을 기술하시오.</p>
                        <p>라이프힘이 특별한 이유에 대한 설명을 기술하시오.</p>
                        <p>라이프힘이 특별한 이유에 대한 설명을 기술하시오.</p>
                    </div>
                </Style.BrandStory>

                <Style.ViewMore>
                    <div className="wrap">
                        <div></div>
                        <h2>VIEW MORE</h2>
                        <ul>
                            <li>
                                <div>
                                    <h3>
                                        <span>100% 말굽버섯 생산</span>
                                        <p>첨가물 없이 순수한 영양분 그대로</p>
                                    </h3>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <h3>
                                        <span>100% 말굽버섯 생산</span>
                                        <p>첨가물 없이 순수한 영양분 그대로</p>
                                    </h3>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <h3>
                                        <span>100% 말굽버섯 생산</span>
                                        <p>첨가물 없이 순수한 영양분 그대로</p>
                                    </h3>
                                </div>
                            </li>
                        </ul>
                    </div>
                </Style.ViewMore>

                <Style.Best>
                    <div className="wrap">
                        <h3>라이프힘 베스트</h3>
                        {
                            result[0]?.length > 0
                                ? <ul>
                                    {
                                        result[0]?.slice(0, 4).map((a, i) => {
                                            return (
                                                <li key={i}>
                                                    <div className="hoverBox">
                                                        <Link to={`/product/detail/${a.goods_code}`}>
                                                            <img src={a.goods_img === "" ? noImg : a.goods_img} alt="상품이미지" />
                                                        </Link>
                                                        <ul>
                                                            <li onClick={() => {
                                                                addBasket({
                                                                    user_id: sessionStorage.getItem("userId"),
                                                                    product_code: a.goods_code,
                                                                    product_count: 1,
                                                                    option: null,
                                                                    basket_count: createCode(),
                                                                }, 1)
                                                            }}><i className="fa-solid fa-basket-shopping"></i></li>
                                                        </ul>
                                                        {
                                                            a.goods_sale > 0
                                                                ? <div className="sale">{a.goods_sale}% <br /> 할인!</div>
                                                                : null
                                                        }
                                                    </div>
                                                    <div className="name">{a.goods_nm}</div>
                                                    {
                                                        Number(a.goods_sale) <= 0
                                                            ? <div className="pay">{
                                                                comma(a.goods_price)}원
                                                            </div>
                                                            : <div className="pay discount">
                                                                <p>
                                                                    {comma(a.goods_price)}원
                                                                </p>
                                                                <p>{comma(Math.ceil((a.goods_price - (a.goods_price * (a.goods_sale * 0.01)))))}원</p>
                                                            </div>
                                                    }
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                : <p style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>등록된 상품이 없습니다.</p>
                        }
                    </div>
                </Style.Best>

                <Style.Review>
                    <div className="wrap">
                        <h3>REAL REVIEW</h3>

                        {
                            mainReview.list.length > 0
                                ? <ul>
                                    {
                                        mainReview.list.slice(0, 4).map((a, i) => {
                                            return (
                                                <li key={i}>

                                                    <a href="/community/review/all/1">
                                                        <div>
                                                            <img src={a.firstImg ? a.firstImg : a.goods_img ? a.goods_img : noImg} alt={`리뷰이미지` + i} />
                                                        </div>
                                                        <div className="content">
                                                            <div className="star">
                                                                {
                                                                    [...Array(a.grade)].map((a, i) => (
                                                                        <Star key={i} fill='#ffd900'></Star>
                                                                    ))
                                                                }
                                                            </div>
                                                            <h4>{a.title.length === 16 ? a.title + '...' : a.title}</h4>
                                                            <p dangerouslySetInnerHTML={{ __html: a.content.length === 40 ? `${a.content} ...` : a.content }}></p>
                                                        </div>
                                                        <div className="bar"></div>
                                                        <div className="productName">
                                                            <div><img src={a.goods_img ? a.goods_img : noImg} alt={`제품이미지` + i} /></div>
                                                            {a.goods_nm}
                                                        </div>
                                                    </a>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                : <p style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>등록된 리뷰가 없습니다.</p>
                        }

                        <div className="button">
                            <a className="more" href="/community/review/all/1">리뷰 모두 보기</a>
                        </div>
                    </div>
                </Style.Review>
            </main>
    );
};

export default Main;