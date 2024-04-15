import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getOrderCode, cancelOrder, recognizeOrder, returnOrder } from 'api/order.js';

import { track } from 'utils/delivery';

import SubTitle from 'components/myPage/SubTitle';
import Loading from 'components/loding/Loading';

import * as Common from "assets/styleComponent/myPage/myPage"
import * as Style from "assets/styleComponent/myPage/order"

const OrderDetail = () => {
    const DELIVERY_PRICE = 2500;
    const nav = useNavigate();
    const { orderCode } = useParams();
    const [list, setList] = useState(null);
    const [state, setState] = useState();
    const [status, setStatus] = useState("");

    let trackResult = [];

    // 주문 상세 정보 가져오기
    const getOrderDetailData = async () => {
        const data = {
            user_id: sessionStorage.getItem('userId'),
            orderCode: orderCode,
        };

        await getOrderCode(data, setList);
    }

    //주문취소
    const revokeOrder = async (type) => {
        if (window.confirm("주문을 취소하시겠습니까?")) {
            const data = {
                orderCode: orderCode,
                cancelType: type
            };
            cancelOrder(data);
        }
    }

    //구매확정
    const confirmOrder = async () => {
        if (window.confirm("구매확정 하시겠습니까?")) {
            const data = {
                orderCode: orderCode,
            };
            recognizeOrder(data);
        }
    }

    //반품/환불 요청
    const refundOrder = async () => {
        if (window.confirm("환불 신청을 하시겠습니까?")) {
            const data = {
                orderCode: orderCode
            };
            returnOrder(data);
        }
    }

    useEffect(() => {
        getOrderDetailData();
    }, [nav])

    useEffect(() => {
        if (list !== null) {
            track(list[0].carrier, list[0].delivery, trackResult);
            setState(...trackResult);
            setStatus(list[0].status);
        }
    }, [list])

    return (
        list === null
            ? <Loading />
            : <Common.InDiv>
                <SubTitle h2={"주문 내역상세"} h3={null} clickEvent={null} clickText={"1:1문의하기"} />
                <Style.CodeTitle> 주문번호 {list ? list[0].orderCode : ''}</Style.CodeTitle>
                {
                    list !== null &&
                    list?.map((a, i) => {
                        return (
                            <div className='contents' key={i}>
                                <Style.Div>
                                    <Style.MainTitle>상품명 : {a.goods_name}</Style.MainTitle>

                                </Style.Div>
                                <Common.Line></Common.Line>

                                <Style.Div>
                                    <ul>
                                        {/* <li><Style.SubTitle>상품명</Style.SubTitle> {a.goods_name}</li> */}
                                        <li><Style.SubTitle>상품개수</Style.SubTitle> {a.order_count}개</li>
                                        <li><Style.SubTitle>주문금액</Style.SubTitle> {a.order_pay}원</li>
                                        <li><Style.SubTitle>할인금액</Style.SubTitle> {a.goods_sale}원</li>
                                    </ul>
                                </Style.Div>
                            </div >
                        )
                    })
                }
                <Style.Div>
                    <h2 className='botTitle'>배송조회</h2>
                </Style.Div>

                <Common.BoldLine></Common.BoldLine>

                <Style.ListDiv>
                    <ul>
                        <li>
                            <div>배송현황</div>
                            <div>
                                {
                                    list
                                        ? list[0].delivery === '' || list[0].carrier === ''
                                            ? <span>주문접수</span>
                                            : state
                                                ? <span>{state}</span>
                                                : <span style={{ color: "red" }}> 송장입력오류</span>
                                        : <span>확인중</span>
                                }
                                <div>
                                    <a href={list ?
                                        list[0].delivery === '' || list[0].carrier === ''
                                            ? '#'
                                            : `https://tracker.delivery/#/${list[0].carrier}/${list[0].delivery}`
                                        : '확인중'} target="_blank">배송조회</a>
                                </div>

                            </div>

                        </li>
                    </ul>
                </Style.ListDiv>

                <Common.Line></Common.Line>

                <Style.Space></Style.Space>

                <Style.Div>
                    <h2 className='botTitle'>결제정보</h2>
                </Style.Div>

                <Common.BoldLine></Common.BoldLine>

                <Style.ListDiv>
                    <ul>
                        <li>
                            <div>총 상품금액</div>
                            <div>{list ? list[0].total_price : '0'} 원</div>
                        </li>
                        <li>
                            <div>총 상품할인금액</div>
                            <div>{list ? list[0].total_sale : '0'} 원</div>
                        </li>
                        <li>
                            <div>사용 적립금</div>
                            <div>{list ? list[0].pay_point : '0'} 원</div>
                        </li>
                        <li>
                            <div>배송비</div>
                            <div>{DELIVERY_PRICE} 원</div>
                        </li>
                        <li>
                            <div>결제금액</div>
                            <div>{list ? list[0].total_price + list[0].total_sale + DELIVERY_PRICE : '0'} 원</div>
                        </li>
                        <li>
                            <div>결제일시</div>
                            <div>{list ? list[0].order_date : '확인중'}</div>
                        </li>
                        <li>
                            <div>적립 예정금</div>
                            <div>{list ? list[0].save_point : '0'} 원</div>
                        </li>
                    </ul>
                </Style.ListDiv>

                <Common.Line></Common.Line>

                <Style.Space></Style.Space>

                <Style.Div>
                    <h2 className='botTitle'>배송정보</h2>
                </Style.Div>

                <Common.BoldLine></Common.BoldLine>

                <Style.ListDiv>
                    <ul>
                        <li>
                            <div>받는분</div>
                            <div>{list ? list[0].receiver : '확인중'}</div>
                        </li>
                        <li>
                            <div>핸드폰</div>
                            <div>{list ? list[0].buyer_tel : '확인중'}</div>
                        </li>
                        <li>
                            <div>주소</div>
                            <div>{list ? list[0].buyer_addr : '확인중'}</div>
                        </li>
                    </ul>
                </Style.ListDiv>

                <Common.Line></Common.Line>

                <Common.Button>
                    {
                        {
                            결제완료: <>
                                <button onClick={() => { revokeOrder("requestPg"); }}>주문 취소</button>
                                <button onClick={() => { confirmOrder(); }}>구매 확정</button>
                            </>,
                            구매확정: <button onClick={() => { refundOrder(); }}>환불</button>,
                            배송중: <button onClick={() => { revokeOrder("requestAdmin"); }}> 취소 요청</button>,
                            환불요청: <button>환불 처리중</button>,
                            환불완료: <button>환불 처리 완료</button>,
                            환불거절: <button>환불 거절됨</button>,
                            취소요청: <button>취소 처리중</button>,
                            취소완료: <button>취소 처리 완료</button>,
                            취소거절: <button>취소 거절됨</button>,
                        }[status]
                    }
                </Common.Button>
            </Common.InDiv >
    );
};
export default OrderDetail;