import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getProductReivew, getDetailProduct } from 'api/product';
import { addBasket } from 'api/basket';

import { comma } from 'utils/commaReplace';
import createCode from 'utils/createCode';
import loginCheck from 'utils/loginCheck';
import Loading from 'components/loding/Loading';

import * as Style from "assets/styleComponent/product/detail"

import noImg from "assets/images/noImg.gif";
import { ReactComponent as Star } from 'assets/images/star.svg';

const Detail = ({ setOrderData }) => {
    const nav = useNavigate();
    const { productCode } = useParams();
    const [productDetail, setProductDetail] = useState(null);
    const [review, setReview] = useState();
    const [count, setCount] = useState(1);

    const [option, setOption] = useState(null);
    const [optionValue, setOptionValue] = useState({
        goods_code: null,
        option_name: null,
        option_price: 0
    });

    const [avgStar, setAvgStar] = useState();
    const [totalStar, setTotalStar] = useState(0);

    const [price, setPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [deliveryPay, setDeliveryPay] = useState(2500);

    const DescriptionRef = useRef();
    const returnRef = useRef();
    const reviewRef = useRef();

    //해당 페이지 상품 디테일 가져오기
    useEffect(() => {
        // selFav();
        getDetailProduct({ goods_code: productCode }, setProductDetail);
        getReviewList();
    }, []);

    // 상품 리뷰 평점 세팅
    useEffect(() => {
        if (productDetail?.review_avg.grade_count !== 0) {
            setAvgStar(productDetail?.review_avg.avg_grade.substring(0, 3));
            setTotalStar(productDetail?.review_avg.grade_count);
        }
        if (productDetail?.option_data.length > 0) {
            setOption(productDetail?.option_data);
        }
    }, [productDetail])

    // 상품 갯수별 금액 변경
    useEffect(() => {
        setPrice(Math.ceil(Number(productDetail?.goods_data.goods_price) - Number(productDetail?.goods_data.goods_price * (productDetail?.goods_data.goods_sale * 0.01)) + Number(optionValue.option_price)));
        setTotalPrice(price * count);
    }, [optionValue, count, productDetail, price])

    //상품갯수증가
    const countUp = () => {
        setCount(count + 1);
    }

    //상품갯수감소
    const countDown = () => {
        if (count <= 1) {
            alert("1보다 작을수는 없습니다.");
            return;
        }
        setCount(count - 1);
    }

    //리뷰리스트 가져오기
    const getReviewList = () => {
        const data = {
            boardType: "review",
            boardPage: 1,
            goodsCode: productCode,
        }
        getProductReivew(data, setReview)
    }

    //구매 클릭
    const orderClick = () => {
        if (loginCheck(true) === true) {
            return;
        }

        if (productDetail.goods_data.goods_stock === 0) {
            alert("재고가 없습니다. 판매자에게 문의바랍니다");
            return
        }

        const data = {
            product_code: productCode,
            product_name: productDetail.goods_data.goods_nm,
            product_img: productDetail.goods_data.goods_img,
            deliveryPay: deliveryPay,
            price: productDetail.goods_data.goods_price,
            sale: productDetail.goods_data.goods_sale,
            option_name: optionValue.option_name,
            product_count: count,
            total_price: totalPrice
        }

        setOrderData([data]);
        nav("/order/info");
    }

    //스크롤 이동
    const moveScroll = (location) => {
        location.current.scrollIntoView({ behavior: "smooth" })
    }

    // 장바구니 담기
    const addBasketData = () => {
        const data = {
            user_id: sessionStorage.getItem("userId"),
            product_code: productCode,
            option: optionValue.option_name,
            product_count: count,
            basket_count: createCode(),
        }

        addBasket(data);
    }

    // 옵션 변경
    const onOptionChange = (e) => {
        const value = e.target.value;
        if (value === "선택 안함" || value === 0) {
            setOptionValue({
                goods_code: null,
                option_name: null,
                option_price: 0
            })
        }
        option.forEach(el => {
            if (el.option_name === value) {
                setOptionValue(el);
            }
        });
    }

    return (
        productDetail === null
            ? <Loading />
            : <Style.Padding>
                <div className="wrap">
                    <Style.Info>

                        <Style.ImageInfo>
                            <img src={productDetail.goods_data.goods_img === "" ? noImg : productDetail.goods_data.goods_img} alt="" />
                            {/* 확대보기 버튼
                        <button>
                            <i className="fa-solid fa-magnifying-glass"></i>
                            확대보기
                        </button>
                        */}
                        </Style.ImageInfo>

                        <Style.Content>
                            <h2>{productDetail.goods_data.goods_nm}</h2>

                            <div className="info">

                                <Style.DetailInfo>
                                    <li>
                                        <b>평점</b>
                                        {
                                            avgStar === undefined
                                                ? <span>리뷰없음</span>
                                                : <span><Star style={{ paddingBottom: "5px" }} fill='#ffd900' />{avgStar}({totalStar})
                                                </span>
                                        }
                                    </li>
                                    <li><b>판매가</b><span className="pay">{comma(productDetail.goods_data.goods_price)}원</span></li>
                                    <li><b>할인률</b><span>{productDetail.goods_data.goods_sale}%</span></li>
                                    <li><b>국내해외배송</b><span>국내배송</span></li>
                                    <li><b>배송방법</b><span>택배</span></li>
                                    <li><b>배송비</b><span>{comma(deliveryPay)} (50,000 이상 구매시 무료)</span></li>
                                </Style.DetailInfo>

                                <p>(최소주문수량 1개 이상)</p>
                                {
                                    option?.length > 0
                                        ?
                                        <Style.OptionSelect><select name='option' onChange={onOptionChange}>
                                            <option value="선택 안함">선택 안함  + 0원</option>
                                            {
                                                option?.map((a, i) => {
                                                    return <option key={i} value={a.option_name}>
                                                        {a.option_name} + {comma(a.option_price)}원
                                                    </option>
                                                })
                                            }
                                        </select>
                                            <i className="fa-solid fa-sort-down"></i>
                                        </Style.OptionSelect>
                                        : null
                                }

                                <Style.Quantity>
                                    <div className="name">{productDetail.goods_data.goods_nm}</div>
                                    <div className="num">
                                        <i className="fa-solid fa-minus" onClick={countDown}></i>
                                        <span>{count}</span>
                                        <i className="fa-solid fa-plus" onClick={countUp}></i>
                                    </div>
                                    <div className="money">{comma(price)}원</div>
                                </Style.Quantity>

                                <Style.Total>
                                    <span><b>총 상품가격</b></span>
                                    <b>{comma(totalPrice)}원</b>
                                </Style.Total>

                                <Style.ButtonBox>
                                    {productDetail.goods_data.goods_stock == 0
                                        ? <Style.Button cursor={"default"} style={{ color: "tomato" }} >재고부족</Style.Button>
                                        : <Style.Button onClick={orderClick} color={"black"} to={`/order/info`}>바로구매하기</Style.Button>
                                    }

                                    <Style.Button onClick={addBasketData}>장바구니 담기</Style.Button>
                                </Style.ButtonBox>

                            </div>
                        </Style.Content>
                    </Style.Info>

                    <Style.Description>
                        <Style.DescriptionMenu>
                            <ul ref={DescriptionRef}>
                                <li>상세정보</li>
                                <li onClick={() => {
                                    moveScroll(reviewRef);
                                }}>상품후기</li>
                                <li onClick={() => {
                                    moveScroll(returnRef);
                                }}>교환/반품</li>
                            </ul>
                        </Style.DescriptionMenu>

                        <Style.DescriptionShow>
                            <div dangerouslySetInnerHTML={{ __html: productDetail.goods_data.goods_detail }}></div>
                        </Style.DescriptionShow>

                        <Style.Review>
                            <div className="nav">
                                <ul ref={reviewRef}>
                                    <li onClick={() => {
                                        moveScroll(DescriptionRef)
                                    }}>상세정보</li>
                                    <li onClick={() => {
                                        moveScroll(reviewRef);
                                    }}>상품후기</li>
                                    <li onClick={() => {
                                        moveScroll(returnRef);
                                    }}>교환/반품</li>
                                </ul>
                            </div>
                            <h2>상품 후기</h2>
                            {
                                review !== undefined &&
                                review.data.map((a, i) => {
                                    return (
                                        <div key={i}>
                                            <div className='grid'>
                                                <div className='userId'>{a.user_id}</div>
                                                <div className='reviewDetail'>
                                                    <p className='optionList'>{a.title}</p>
                                                    <p>{a.content}</p>
                                                    <p>{a.create_date}</p>
                                                    <div className="star">
                                                        {
                                                            [...Array(a.grade)].map((a, i) => (
                                                                <Star key={i} fill='#ffd900'></Star>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Style.Review>

                        <Style.Return>
                            <div className='nav'>
                                <ul ref={returnRef}>
                                    <li onClick={() => {
                                        moveScroll(DescriptionRef)
                                    }}>상세정보</li>
                                    <li onClick={() => {
                                        moveScroll(reviewRef);
                                    }}>상품후기</li>
                                    <li onClick={() => {
                                        moveScroll(returnRef);
                                    }}>교환/반품</li>
                                </ul>
                            </div>
                            <div className='info'>
                                <h4>교환/반품 정보</h4>
                                <ul>
                                    <li>반품배송비(편도) : 3,500원 (최초 배송비 미결제시 7,000원 부과)</li>
                                    <li>교환배송비(왕복) : 7,000원</li>
                                    <li>보내실곳 : 회사 주소</li>
                                    <li>단, 교환/반품 비용은 상품 및 교환/반품 사유에 따라 변경될 수 있으므로 교환/반품 신청 화면 확인 부탁드립니다.</li>
                                </ul>
                            </div>
                            <div className='period'>
                                <h4>교환/반품 사유에 따른 요청 가능 기간</h4>
                                <ul>
                                    <li>구매자 단순 변심 : 상품 수령 후 7일 이내(구매자 반품 배송비 부담)</li>
                                    <li>표시/광고와 상이, 계약 내용과 다르게 이행된 경우<br />
                                        상품 수령 후 3개월 이내 혹은 표시/광고와 다른 사실을 안 날로부터 30일 이내(판매자 반품 배송비 부담)</li>
                                </ul>
                            </div>
                            <div className='refuse'>
                                <h4>교환/반품이 불가한 경우</h4>
                                <ul>
                                    <li>교환/반품 요청이 기간이 지난 경우</li>
                                    <li>소비자의 책임 있는 사유로 상품 등이 분실/파손/훼손된 경우(단, 확인을 위한 포장훼손 제외)</li>
                                    <li>소비자의 사용/소비에 의해 상품 등의 가치가 현저히 감소한 경우 (예: 식품, 화장품, 향수, 음반)</li>
                                    <li>제품을 설치 또는 장착하였거나 개통한 경우 (예 : 전자제품, 컴퓨터, 휴대폰 등)</li>
                                    <li>시간의 경과에 의해 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우 (신선식품과 같이 유통기한이 정해져 있는 상품)</li>
                                    <li>복제가 가능한 상품 등의 포장을 훼손한 경우 (CD/DVD/GAME/BOOK의 경우 포장 개봉 시)</li>
                                    <li>주문제작 상품 중 상품제작에 들어간 경우(주문접수 후 개별생산, 맞춤 제작 등)</li>
                                </ul>
                            </div>
                            <div className='condition'>
                                <h4>거래 조건에 대한 정보</h4>
                                <ul>
                                    <li>소화물 택배의 배송은 발송일로부터 1~2 영업일이 소요되나, <br />
                                        지역/대형 화물/설치/예약/발송지체 등의 특이사항에 따라 배송기간은 달라 질 수 있습니다.</li>
                                    <li>`전자상거래등에서의 소비자보호에 관한 법률`이 정하는 바에 따라 소비자의 청약철회 후 판매자가 재화 등을 반환 받은 날로부터 3영업일 이내에 지급받은 대금의 환급을 정당한 사유없이 지연하는 때에는 소비자는 지연기간에 대해서 전상법 시행령으로 정하는 이율을 곱하여 산정한 지연이자(지연배상금)을 신청할 수 있습니다.</li>
                                </ul>
                            </div>
                        </Style.Return>
                    </Style.Description>
                </div>
            </Style.Padding >
    );
};

export default Detail;