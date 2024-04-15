import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { getOrder, orderComplete } from 'api/order.js';

import { deliveryStatus } from 'utils/delivery';
import { comma } from 'utils/commaReplace';

import Top from 'components/admin/Top';
import Loading from 'components/loding/Loading';
import Pageing from 'components/board/Pageing';
import Searching from 'components/board/Searching';
import Download from 'components/admin/download/OrderDown';

import * as Style from 'assets/styleComponent/admin/order/order';
import * as Common from 'assets/styleComponent/admin/common';

const Order = () => {
    const nav = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { boardPage } = useParams();
    const [board, setBoard] = useState(null);
    const [state, setState] = useState([]);

    // 배송 현황 상태
    const getDeliveryStatus = async (req) => {
        const data = await deliveryStatus(req);
        setState(data);
    }

    // 주문관리 리스트 가져옴
    useEffect(() => {
        const data = {
            boardPage: boardPage,
            boardType: "order",
            admin: true
        };

        if (searchParams.get("search") !== null) {
            data.search = searchParams.get("search");
        }

        getOrder(data, setBoard);
    }, [nav, searchParams.get("search")])

    useEffect(() => {
        board !== null && getDeliveryStatus(board.list);
    }, [board])

    return (
        board === null
            ? <Loading />
            : <>
                <Top title={"주문 관리"} isButton={false} />
                <Common.Padding>
                    <Common.TopContainer>
                        <Searching board={board.list} setBoardList={setBoard} searchType={"order"} />
                        <Download></Download>
                    </Common.TopContainer>
                    {
                        board.list?.map((a, i) => {
                            return (
                                <Common.Container key={i} style={{ textAlign: "center" }}>
                                    <Style.Div>
                                        <ul>
                                            <li>주문번호 : {a.orderCode}</li>
                                            <li>회원 ID : {a.user_id}</li>
                                            <li>상품명 : {a.goods_name}</li>
                                            <li>주문자 이름 : {a.buyer_name}</li>
                                            <li>주문 상태 : {a.status}</li>
                                            <li>총 상품 금액 : {comma(a.total_price)}</li>
                                            {
                                                state[i] !== "송장 에러"
                                                    ? <li>배송 현황 : {state[i]}</li>
                                                    : <li>배송 현황 : <span className='warning'>{state[i]}</span></li>
                                            }
                                            <li>주문일자 : {a.order_date}</li>
                                        </ul>
                                    </Style.Div>
                                    {
                                        a.status !== "취소완료" &&
                                        a.status !== "취소요청" &&
                                        a.status !== "환불완료" &&
                                        a.status !== "환불요청" &&
                                        a.complete === "N" &&
                                        <Style.DetailButton onClick={() => { orderComplete({ order_code: a.orderCode }) }}>구매 확정</Style.DetailButton>
                                    }
                                    <Style.DetailButton to={`/admin/orderDetail/${a?.orderCode}`}>자세히 보기</Style.DetailButton>
                                </Common.Container>
                            )
                        })
                    }
                </Common.Padding>
                {
                    board.list.length > 0 &&
                    <Pageing boardPage={boardPage} boardLength={board.count.page_count} url={"/admin/order"} />
                }
            </>
    );
};

export default Order;