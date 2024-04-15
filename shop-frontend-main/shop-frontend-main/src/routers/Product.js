import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { getProduct } from 'api/product.js';

import Detail from 'pages/product/Detail';
import Products from 'pages/product/Products';
import Basket from 'pages/product/Basket';

const Product = ({ setOrderData }) => {
    return (
        <>
            <Routes>
                <Route path='detail/:productCode' element={<Detail setOrderData={setOrderData} />}></Route>
                <Route path='products/:categoryCode/:boardPage' element={<Products setOrderData={setOrderData} />}></Route>
                <Route path='basket' element={<Basket setOrderData={setOrderData} />}></Route>
            </Routes>
        </>
    );
};
export default Product;