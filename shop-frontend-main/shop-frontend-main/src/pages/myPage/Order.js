import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { getOrder } from 'api/order.js';

import { comma } from 'utils/commaReplace';

import Loading from 'components/loding/Loading';
import Pageing from 'components/board/Pageing';
import SubTitle from 'components/myPage/SubTitle';

import * as Common from "assets/styleComponent/myPage/myPage"
import * as Style from "assets/styleComponent/myPage/order"

const Order = () => {
    const { boardPage } = useParams();
    const [board, setBoard] = useState(null);

    // 유저 주문 리스트 가져오기
    useEffect(() => {
        const data = {
            boardPage: boardPage,
            boardType: "order",
            admin: false,
            user_id: sessionStorage.getItem("userId"),
        };

        getOrder(data, setBoard);
    }, [])

    return (
        board === null
            ? <Loading />
            : <Common.InDiv>
                <SubTitle h2={"주문 내역"} h3={"최대 지난 3년간의 주문 내역까지 확인할 수 있어요"} clickEvent={null} clickText={null} />
                {
                    board.list.length > 0 ?
                        board.list.map((a, i) => {
                            return (
                                <div className='contents' key={i}>
                                    <Style.Div>
                                        <div>
                                            {a.order_date.substr(0, 10)} ({a.order_date.substr(11, 5)})
                                        </div>
                                        <div>
                                            <Link to={`/myPage/orderDetail/${a.orderCode}`} state={{ orderCode: a.orderCode }}> 상세보기 {'>'}</Link>
                                        </div>
                                    </Style.Div>
                                    <Common.Line></Common.Line>

                                    <img src={a.goods_img} alt="" />
                                    <Style.Div>
                                        <ul>
                                            <li><Style.SubTitle>상품명</Style.SubTitle> {a.goods_name}</li>
                                            <li><Style.SubTitle>주문번호</Style.SubTitle> {a.orderCode}</li>
                                            <li><Style.SubTitle>총 상품개수</Style.SubTitle> {a.total_count}개</li>
                                            <li><Style.SubTitle>총 주문금액</Style.SubTitle> {comma(a.total_price)}원</li>
                                        </ul>
                                    </Style.Div>
                                </div >
                            )
                        })
                        : <p style={{ textAlign: "center", lineHeight: "200px", fontSize: "18px" }}>주문 내역이 없습니다.</p>
                }

                {
                    board.list > 0 &&
                    <Pageing boardPage={boardPage} boardLength={board.count.page_count} url={"/myPage/order"} />
                }
            </Common.InDiv >
    );
};
export default Order;