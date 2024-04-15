import React, { useState } from 'react';
import { useEffect } from 'react';

import { completeOrder } from 'api/order.js';

import Loading from 'components/loding/Loading';

import * as Style from 'assets/styleComponent/order/orderComplete'

const OrderComplete = () => {
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const location = window.location;
        const params = new URLSearchParams(location.search);
        completeOrder({ orderCode: params.get("orderCode") }, setSuccess);
    }, [])

    return (
        success === null
            ? <Loading />
            : <>
                <Style.Content>
                    <i className="fa-solid fa-gift"></i>
                    <h2>고객님, 주문이 완료되었습니다.</h2>
                    <p>
                        고객님이 주문하신 주문번호는 <br />
                        <span>{success.orderCode}</span> 입니다.
                    </p>
                    <p>
                        주문내역 확인은  <br />
                        "주문/배송조회" 에서 하실 수 있습니다.
                    </p>
                </Style.Content>
            </>
    );
};

export default OrderComplete;