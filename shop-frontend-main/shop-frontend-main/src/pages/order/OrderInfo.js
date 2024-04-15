import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { requestOrder } from 'api/order.js'
import { getDefaultAddress, getUserPoint } from 'api/user.js'

import createCode from 'utils/createCode';
import { comma } from 'utils/commaReplace';

import DaumPost from 'components/daumPost/DaumPost';
import Inicis from 'components/inicis/Inicis';
import Loading from 'components/loding/Loading';
import { Toss } from 'components/toss/Toss';

import * as Style from "assets/styleComponent/order/order"

import noImg from "assets/images/noImg.gif";

const PAY_TYPE = "이니시스";

const OrderInfo = ({ orderData }) => {
    const nav = useNavigate();
    const [order, setOrder] = useState(null);
    const [buyerName, setBuyerName] = useState("");
    const [buyerTel, setBuyerTel] = useState("");
    const [buyerDetailAddress, setBuyerDetailAddress] = useState("");
    const [address, setAddress] = useState("");
    const [receiver, setReceiver] = useState("");
    const [zoneCode, setZoneCode] = useState("");
    const [payPoint, setPayPoint] = useState(0);
    const [userPoint, setUserPoint] = useState(0);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [isPurchase, setIsPurchase] = useState(0);
    const [payData, setPayData] = useState({});
    const delivery = '';
    const [userAddr, setUserAddr] = useState("");
    const [checkAddr, setCheckAddr] = useState("new");
    const [sumPay, setSumPay] = useState(0);
    const [totalPay, setTotalPay] = useState(0);
    const [deliveryPay, setDeliverPay] = useState(2500);


    useEffect(() => {
        // 새로고침이나 이상하게 접근해서 주문 정보없으면 메인으로
        if (orderData === null || orderData === undefined) {
            nav("/");
            return;
        }
        setOrder([...orderData]);
        getDefaultAddress({ user_id: sessionStorage.getItem('userId') }, setUserAddr);
        getUserPoint({ user_id: sessionStorage.getItem('userId') }, setUserPoint);
        calcPayment();
    }, [])

    // 포인트 계산
    useEffect(() => {
        if (userAddr !== undefined || userAddr !== "") {
            (userPoint - payPoint) >= 0
                ? setTotalPay(sumPay + deliveryPay - payPoint)
                : setTotalPay(sumPay + deliveryPay - userPoint);
        }
    }, [payPoint, userAddr])

    // 상품 총 가격 계산 및 특정 금액 이상이면 배달비 0원
    const calcPayment = () => {
        let sum = 0;
        for (let i = 0; i < orderData.length; i++) {
            sum += orderData[i].total_price;
        }
        setSumPay(sum);
        sum > 50000
            ? setDeliverPay(0)
            : setDeliverPay(2500);
    }

    // 기본배송지 및 배송지 직접 입력
    const checkRadio = (e) => {
        if (e.target.value === "old") {
            if (userAddr === "fail") {
                const ok = window.confirm("기본 배송지가 없습니다 등록하러 가시겠습니까?");
                if (ok) {
                    nav("/myPage/address");
                }
                e.target.checked = false;
                return;
            }
            setBuyerName(userAddr.user_id);
            setBuyerTel(userAddr.ship_phone);
            setReceiver(userAddr.ship_receiver);
            setAddress(userAddr.ship_address);
            setBuyerDetailAddress(userAddr.ship_detail_address);
        } else {
            setBuyerName("");
            setBuyerTel("");
            setReceiver("");
            setAddress("");
            setBuyerDetailAddress("");
        }
    }

    // 결제
    const payment = (e) => {
        e.preventDefault();
        let orderDatas = [];
        let orderCode = createCode();
        let basketCount = [];
        if (totalPay < 1000) {
            alert("1000원 이하는 결제가 불가능합니다.");
            return;
        }

        for (let i = 0; i < order.length; i++) {
            orderDatas.push({
                goods_code: order[i].product_code, // 상품코드
                goods_name: order[i].product_name, // 상품이름
                goods_sale: order[i].sale, // 할인율
                order_pay: order[i].total_price, // 총 상품가격
                order_count: order[i].product_count, //상품 갯수
                option: order[i].option, // 옵션

            });
            basketCount.push(order[i].basket_count); // 장바구니 전용
        }

        if (buyerName === "") {
            alert("주문자 입력해주세요");
            return;
        } else if (buyerTel === "") {
            alert("연락처 입력해주세요");
            return;
        } else if (buyerDetailAddress === "") {
            alert("상세주소 입력해주세요");
            return;
        } else if (receiver === "") {
            alert("받는 사람을 입력해주세요");
            return;
        }

        // 이니시스 전달용
        setPayData({
            mid: process.env.REACT_APP_MID, // 이니시스 mid
            mKey: process.env.REACT_APP_SIGNKEY, // 이니시스 signkey
            productName: orderData[0].product_name,
            buyerName: buyerName,
            buyerTel: Number(buyerTel),
            buyerEmail: "",
            productPrice: Number(totalPay),
            payStatus: 0,
            returnUrl: `${process.env.REACT_APP_URL}/backend/order/ini_transaction?orderCode=${orderCode}`,
            closeUrl: `${process.env.REACT_APP_URL}/close`,
        })

        // 백엔드 전달용
        const data = {
            mid: process.env.REACT_APP_MID, // 이니시스 mid
            mKey: process.env.REACT_APP_SIGNKEY, // 이니시스 signkey
            gopaymethod: "0", // 결제방법
            order_code: orderCode, // 주문코드
            user_id: sessionStorage.getItem("userId"), // 유저 아이디
            order_data: orderDatas,
            basket_count: basketCount,
            order_total_price: String(totalPay),
            buyer_name: buyerName, // 주문자 이름
            buyer_addr: address + "\n" + buyerDetailAddress, // 주문자 주소
            buyer_tel: buyerTel, // 주문자 번호
            delivery: delivery, // 주문처리현황
            // return_url: "http://localhost:3000/shop-backend/backend/order/ini_transaction", // 백엔드 리턴 url
            refund: "N", //환불여부
            receiver: receiver,
            pay_point: payPoint >= userPoint ? userPoint : payPoint,
            save_point: Math.ceil(sumPay / 100)
        }

        requestOrder(data);
        setIsPurchase(isPurchase + 1);
    }

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        switch (name) {
            case "buyerName":
                setBuyerName(value);
                break;
            case "receiver":
                setReceiver(value);
                break;
            case "buyerTel":
                setBuyerTel(value);
                break;
            case "receiver":
                setReceiver(value);
                break;
            case "buyerDetailAddress":
                setBuyerDetailAddress(value);
                break;
            case "payPoint":
                setPayPoint(value);
                break;
            default:
                break;
        }
    }

    return (
        userAddr === ""
            ? <Loading />
            : <Style.Order>
                <div className="wrap">
                    <Style.Title>주문/결제</Style.Title>
                    <Style.Purchase >
                        <ul className='title'>
                            <li>상품정보<br />(옵션)</li>
                            <li>수량</li>
                            <li>할인율</li>
                            <li>상품금액 <br />(할인적용)</li>
                        </ul>
                        {
                            order.map((a, i) => {
                                return (
                                    <ul className="productInfo" key={i}>
                                        <li>
                                            <img src={a.product_img === "" ? noImg : a.product_img} alt="" />
                                            <div className="content">
                                                <div className="title">{a.product_name} <br /> {a.option_name === null ? "" : `(${a.option_name})`}</div>
                                            </div>
                                        </li>
                                        <li>{a.product_count}개</li>
                                        <li>{a.sale}%</li>
                                        <li>{comma(a.total_price)}원</li>
                                    </ul>
                                )
                            })
                        }
                    </Style.Purchase>

                    <Style.Info>
                        <Style.Payment>
                            <Style.Form>
                                <Style.SubTitle>배송 정보</Style.SubTitle>
                                <div>
                                    <label htmlFor="">
                                        <span>직접 입력</span>
                                        <input type="radio" value="new" name="addr" onChange={checkRadio} />
                                        <span>기본 배송지</span>
                                        <input type="radio" value="old" name="addr" onChange={checkRadio} />
                                    </label>
                                </div>
                                <div>
                                    <span>주문자</span>
                                    <input type="text" onChange={onChange} name='buyerName' value={buyerName} />
                                </div>
                                <div>
                                    <span>받는 사람</span>
                                    <input type="text" onChange={onChange} name='receiver' value={receiver} />
                                </div>
                                <div>
                                    <span>연락처</span>
                                    <input type="text" onChange={onChange} name='buyerTel' value={buyerTel} />
                                </div>
                                <div>
                                    {
                                        checkAddr === "new"
                                            ? <span className='address' onClick={() => { setIsPostOpen(true) }}>주소찾기</span>
                                            : <span>주소</span>
                                    }
                                    <input readOnly name='orderAddress' value={address} />
                                    <input type="text" onChange={onChange} name='buyerDetailAddress' value={buyerDetailAddress} placeholder='상세주소입력' />
                                </div>
                                {
                                    isPostOpen && <DaumPost
                                        setIsPostOpen={setIsPostOpen}
                                        setZoneCode={setZoneCode}
                                        setAddress={setAddress}
                                    ></DaumPost>
                                }
                            </Style.Form>
                            <Style.payForm>
                                <Style.SubTitle>결제 정보</Style.SubTitle>
                                <div>
                                    <span>총 상품금액</span>
                                    <span>{comma(sumPay)}원</span>
                                </div>
                                <div>
                                    <span>배송비
                                        <span className='light'>(5만원 이상 무료)</span>
                                    </span>
                                    <span>{comma(deliveryPay)}원</span>
                                </div>
                                <div>
                                    <span>보유 적립금 <span className='light'></span> </span>
                                    <span>{(userPoint - payPoint) >= 0
                                        ? comma(userPoint - payPoint)
                                        : 0}</span>
                                </div>
                                <div className='point'>
                                    <span>사용 적립금</span>
                                    <input type="text"
                                        onChange={onChange}
                                        name='payPoint'
                                        value={(payPoint < userPoint)
                                            ? payPoint > 0
                                                ? payPoint
                                                : 0
                                            : userPoint} />
                                </div>
                                <div>
                                    <span>적립 예정금</span>
                                    <span>{Math.ceil(sumPay / 100)}</span>
                                </div>
                                <div>
                                    <span className='totalPay'>
                                        총 결제금액
                                    </span>
                                    <span className='totalPay'>
                                        {comma(totalPay)}원
                                    </span>
                                </div>

                                {
                                    // 이니시스 결제
                                    PAY_TYPE === "이니시스" &&
                                    <button className='submit' onClick={payment}>결제하기</button>
                                }
                            </Style.payForm>
                        </Style.Payment>
                    </Style.Info>

                    {
                        // 토스 결제
                        PAY_TYPE === "토스" &&
                        <Style.Info style={{ padding: "0px" }}>
                            <Toss
                                orderName={orderData[0].product_name}
                                customerName={buyerName}
                                customerEmail={null}
                                successUrl={`${process.env.REACT_APP_URL}/tossSuccess?orderCode=${createCode()}`}
                                failUrl={`${process.env.REACT_APP_URL}`}
                                totalPay={Number(totalPay)}
                            />
                        </Style.Info>
                    }

                    <Inicis payData={payData} isPurchase={isPurchase} />
                </div>
            </Style.Order >
    );
};
export default OrderInfo;