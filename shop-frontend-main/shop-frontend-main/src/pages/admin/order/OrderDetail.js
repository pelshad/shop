import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getDetailOrder, recognizeRefund, cancelOrder } from 'api/order.js';
import { updateCarrier, updateInvoice } from 'api/delivery.js';

import { getDeliveryList } from 'utils/delivery';

import Top from 'components/admin/Top';
import Loading from 'components/loding/Loading';

import * as Style from 'assets/styleComponent/admin/order/orderDetail'
import * as Common from 'assets/styleComponent/admin/common'
import { data } from 'components/admin/chart/LineData';

const OrderDetail = () => {
    const { orderCode } = useParams();
    const [detail, setDetail] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [carrier, setCarrier] = useState("");
    const [carrierList, setCarrierList] = useState();
    const [orderStatus, setOrderStatus] = useState();

    // 배송사 설정
    const setCarrierCode = async () => {
        const arr = await getDeliveryList();
        const data = {};
        arr.data.forEach(el => {
            if (el.id === carrier) {
                data.orderCode = orderCode;
                data.carrier = carrier;
            }
        });
        updateCarrier(data);
    }

    // 송장번호 수정
    const setInvoice = async () => {
        const data = {
            orderCode: orderCode,
            delivery: invoiceNumber,
        }
        updateInvoice(data);
    }

    // 주문 정보 가져오기
    const getDetail = async () => {
        let price = 0;

        // 배송사 리스트 가져오기
        const arr = await getDeliveryList();
        setCarrierList(arr.data);

        // 송장 번호 가져와서 저장
        setInvoiceNumber(detail[0]?.delivery);
        for (let i = 0; i < detail[0].length; i++) {
            price = price + Number(detail[0][i].order_pay);
            setTotalPrice(price);
        }

        // 설정되있는 배송사 저장
        if (arr.data) {
            arr.data.forEach(el => {
                if (el.id === detail[0].carrier) {
                    setCarrier(el.name);
                }
            })
        };
    }

    // 환불
    const confirmRefund = (type) => {
        const data = {
            orderCode: detail[0].orderCode,
            type: type
        }
        if (type === "refusal") {
            if (!window.confirm("환불 거절 하시겠습니까?")) {
                return;
            }
        } else if (type === "refund") {
            if (!window.confirm("환불 처리 하시겠습니까?")) {
                return;
            }
        } else {
            alert("알 수 없는 이유로 에러가 발생했습니다.");
            return;
        }
        recognizeRefund(data);
    }

    // 주문취소
    const revokeOrder = (type) => {
        const data = {
            orderCode: detail[0].orderCode,
            cancelType: type
        };
        if (type === "refusal") {
            if (!window.confirm("승인 거절하시겠습니까?")) {
                return;
            }
        } else if (type === "requestPg") {
            if (!window.confirm("취소 처리 하시겠습니까?")) {
                return;
            }
        } else {
            alert("알 수 없는 이유로 에러가 발생했습니다.");
            return;
        }
        cancelOrder(data);
    }

    // 카드 정보
    const cardType = () => {
        switch (detail[0].gopaymethod) {
            case "0":
                return "카드"
            case "1":
                return "무통장"
            case "2":
                return "핸드폰"
            case "3":
                return "계좌이체"
            default:
                return "에러 개발자에게 문의해주세요"
        }
    }

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        switch (name) {
            case "orderCarrier":
                setCarrier(value);
                break;
            case "invoiceNumber":
                setInvoiceNumber(value);
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        getDetailOrder({ orderCode: orderCode }, setDetail)
    }, [])

    useEffect(() => {
        detail !== null && getDetail();
    }, [detail])

    return (
        detail === null
            ? <Loading />
            : <>
                <Top title={"주문 상세보기"} isButton={false} />
                <Common.Padding>
                    {
                        detail.map((a, i) => {
                            return (
                                <Common.Container key={i}>
                                    <Style.Content>
                                        <li>상품이름 : {a.goods_name}</li>
                                        <li>상품 코드 : {a.goods_code}</li>
                                        <li>상품 금액 : {a.order_pay}</li>
                                        <li>상품 갯수 : {a.order_count}</li>
                                    </Style.Content>
                                </Common.Container>
                            )
                        })
                    }

                    {
                        <Common.Container>
                            <Style.Content>
                                <li>주문자 아이디 : {detail[0].user_id}</li>
                                <li>주문자 이름 : {detail[0].buyer_name}</li>
                                <li>주문자 연락처 : {detail[0].buyer_tel}</li>
                                <li>받는사람 : {detail[0].receiver}</li>
                                <li>배송 주소 : {detail[0].buyer_addr}</li>
                                <li>주문 번호 : {detail[0].orderCode}</li>
                                <li>주문 날짜 : {detail[0].order_date}</li>
                                <li>상품 총 금액 : {totalPrice}</li>
                                <li>결제 유형 : {cardType()}</li>
                                <li>결제 완료 여부 : {detail[0].order_complete}</li>
                                <li>주문상태 : {
                                    detail[0].status === "환불요청"
                                        ? <>
                                            환불 요청중
                                            <button onClick={() => { confirmRefund("refund"); }}>승인</button>
                                            <button onClick={() => { confirmRefund("refusal"); }}>거절</button>
                                        </>
                                        : detail[0].status === "취소요청"
                                            ? <>
                                                취소 요청중
                                                <button onClick={() => { revokeOrder("requestPg"); }}>승인</button>
                                                <button onClick={() => { revokeOrder("refusal"); }}>거절</button>
                                            </>
                                            : detail[0].status
                                }
                                </li>
                                <li>배송사 :
                                    <div className="select">
                                        <select name="orderCarrier" onChange={onChange}>
                                            <option value="">{carrier}</option>
                                            {
                                                carrierList?.map((a, i) => {
                                                    return (
                                                        <option key={i} value={a.id}>{a.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <i className="fa-solid fa-sort-down"></i>
                                    </div>

                                    <button onClick={setCarrierCode}>수정</button>
                                </li>
                                <li>
                                    송장번호 : <input type="text" placeholder='송장번호를 입력해주세요' name='invoiceNumber' value={invoiceNumber} onChange={onChange} />
                                    <button onClick={setInvoice}>수정</button>
                                </li>

                            </Style.Content>
                        </Common.Container>
                    }
                </Common.Padding>
            </>
    );
};

export default OrderDetail;