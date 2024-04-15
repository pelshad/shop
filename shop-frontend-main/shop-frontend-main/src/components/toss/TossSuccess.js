import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { payMentRequest } from 'api/payment';

import Loading from 'components/loding/Loading';

const TossSuccess = () => {
    const [params, setParams] = useSearchParams();
    useEffect(() => {
        const data = {
            orderCode: params.get("orderCode"),
            amount: params.get("amount"),
            orderId: params.get("orderId"),
            paymentKey: params.get("paymentKey"),
        }
        payMentRequest(data);
    }, [])

    return (
        <Loading />
    );
};

export default TossSuccess;