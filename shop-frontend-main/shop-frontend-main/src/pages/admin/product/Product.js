import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import List from 'pages/admin/product/List';
import Register from 'pages/admin/product/Register';
import Modfiy from 'pages/admin/product/Modfiy';
import SetSorting from './SetSorting';
import Top from "components/admin/Top";

import * as Common from "assets/styleComponent/admin/common"

const Product = () => {
    const nav = useLocation();
    return (
        <>
            <Top title={"상품등록"} isButton={true} buttonTitle={"상품등록"} buttonLink={"/admin/product/register"} />
            <Common.Padding>
                <Routes>
                    <Route path='/:boardPage' element={<List />} />
                    <Route path='/setSorting' element={<SetSorting />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/modfiy/:productCode' element={<Modfiy />}></Route>
                </Routes>
            </Common.Padding>
        </>
    );
};

export default Product;