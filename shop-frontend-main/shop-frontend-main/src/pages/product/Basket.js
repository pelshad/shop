import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { deleteBasket, getBasket } from 'api/basket';

import loginCheck from 'utils/loginCheck';
import { comma } from 'utils/commaReplace';
import Loading from 'components/loding/Loading';

import * as Style from "assets/styleComponent/product/basket"

import noImg from "assets/images/noImg.gif";

const Basket = ({ setOrderData }) => {
    const nav = useNavigate();
    const [basketData, setBasketData] = useState(null);
    const [checkData, setCheckData] = useState([]);
    const [reload, setReload] = useState(basketData === null ? 0 : basketData?.length);

    //전체 선택
    const allCheck = (checked) => {
        if (checked) {
            const arr = [];

            basketData.forEach(el => {
                if (el.goods_stock != 0) {
                    arr.push(el.basket_count);
                }
            });
            setCheckData(arr);
        } else {
            setCheckData([]);
        }
    }

    //선택상품 확인
    const singCheck = (checked, code) => {
        if (checked) {
            setCheckData(prev => [...prev, code]);
        } else {
            setCheckData(checkData.filter((el) => el !== code));
        }
    }

    // 장바구니 선택삭제
    const delBasket = async () => {
        const copy = basketData;
        const delData = [];
        const confirm = window.confirm("정말로 삭제하시겠습니까?");
        if (confirm) {
            for (let i = 0; i < copy.length; i++) {
                for (let j = 0; j < checkData.length; j++) {
                    if (checkData[j] === copy[i].basket_count) {
                        delData.push(copy[i].basket_count);
                    }
                }
            }
        }
        const data = {
            user_id: sessionStorage.getItem("userId"),
            basket_count: delData,
        }
        await deleteBasket(data);
        setReload(basketData.length);
    }

    // 장바구니 선택 구매
    const selectBasket = () => {
        const arr = [];
        for (let i = 0; i < basketData.length; i++) {
            for (let j = 0; j < checkData.length; j++) {
                if (checkData[j] === basketData[i].basket_count) {
                    arr.push(basketData[i]);
                }
            }
        }
        return arr;
    }

    //주문하기
    const basketOrder = () => {
        const selectData = selectBasket();
        let data = [];

        if (loginCheck(true) === true) {
            return;
        }

        if (selectData.length === 0) {
            alert("상품을 선택해주세요");
            return;
        }

        for (let i = 0; i < selectData.length; i++) {
            data.push(
                {
                    basket_count: selectData[i].basket_count,
                    product_code: selectData[i].product_code,
                    product_name: selectData[i].product_name,
                    product_img: selectData[i].product_img,
                    price: selectData[i].price,
                    sale: selectData[i].sale,
                    product_count: selectData[i].product_count,
                    option_name: selectData[i].option_name,
                    total_price: Math.ceil(selectData[i].price - (selectData[i].price * (selectData[i].sale * 0.01)) + Number(selectData[i].option_price)) * selectData[i].product_count
                }
            )
        }

        setOrderData(data);
        nav("/order/info");
    }

    useEffect(() => {
        getBasket({ user_id: sessionStorage.getItem("userId") }, setBasketData);
    }, [reload]);

    return (
        basketData === null
            ? <Loading />
            : <Style.Basket>
                <div className="wrap">
                    <Style.Title>장바구니</Style.Title>
                    <Style.Purchase>
                        <ul className='title'>
                            <li>
                                <input type="checkbox"
                                    onChange={(e) => { allCheck(e.target.checked) }}
                                    checked={checkData.length === basketData?.length ? true : false}
                                />
                            </li>
                            <li>상품정보<br />(옵션)</li>
                            <li>수량</li>
                            <li>할인율</li>
                            <li>상품금액 <br />(할인적용)</li>
                        </ul>
                        {
                            basketData === null || basketData?.length === 0
                                ? <p>현재 장바구니에 담긴 상품이 없습니다.</p>
                                : basketData.map((a, i) => {
                                    return (
                                        <ul className="productInfo" key={i}>
                                            <li>
                                                {
                                                    a.goods_stock != 0
                                                        ? <input type="checkbox"
                                                            onChange={(e) => singCheck(e.target.checked, a.basket_count)}
                                                            checked={checkData.includes(a.basket_count) ? true : false}
                                                        />
                                                        : <input type="checkbox" disabled />
                                                }

                                            </li>
                                            <li>
                                                <img src={a.product_img === "" ? noImg : a.product_img} alt="" />
                                                <div className="content">
                                                    <div className="title">{a.product_name} <br />{a.option_name === null ? "" : `(${a.option_name})`}</div>
                                                    {
                                                        a.goods_stock == 0
                                                            ? <div className='stockZero'>재고 부족</div>
                                                            : ""
                                                    }
                                                </div>
                                            </li>
                                            <li className='count'>
                                                {a.product_count}개
                                            </li>
                                            <li>{a.sale}%</li>
                                            <li>{comma(Math.ceil(Number(a.price - (a.price * (a.sale * 0.01))) + Number(a.option_price)) * a.product_count)}원</li>
                                        </ul>
                                    )
                                })
                        }
                    </Style.Purchase>

                    <Style.Button>
                        <button onClick={delBasket}>선택삭제</button>
                        <button onClick={basketOrder}>선택 구매하기</button>
                    </Style.Button>
                </div>
            </Style.Basket>
    );
};

export default Basket;