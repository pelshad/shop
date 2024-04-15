import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrderComplete from 'pages/order/OrderComplete';
import OrderInfo from 'pages/order/OrderInfo';

const Order = ({ orderData }) => {
    return (
        <>
            <Routes>
                <Route path="/info" element={<OrderInfo orderData={orderData} />} />
                <Route path="/complete" element={<OrderComplete />} />
            </Routes>
        </>
    );
};

export default Order;