import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import loginCheck from 'utils/loginCheck';

import Address from 'pages/myPage/Address';
import Info from 'pages/myPage/Info';
import Order from 'pages/myPage/Order';
import OrderDetail from 'pages/myPage/OrderDetail';
import Review from 'pages/myPage/Review';
import ReviewWrite from 'pages/myPage/ReviewWrite';
import PersonalModify from 'pages/myPage/PersonalModify';
import Contact from 'pages/myPage/Contact';
import DeleteUser from 'pages/myPage/DeleteUser';


import Banner from 'components/myPage/Banner';
import SideMenu from 'components/myPage/SideMenu';

import * as Style from "assets/styleComponent/myPage/myPage"
const MyPage = () => {
    const nav = useNavigate();
    const [infoData, setInfoData] = useState(null);

    // 로그인 체크
    useEffect(() => {
        if (loginCheck(true) === true) {
            nav("/");
        }
    }, [nav])

    return (
        <main>
            <Banner></Banner>
            <Style.Div className="wrap">
                <SideMenu></SideMenu>
                <Routes>
                    <Route path="/info" element={<Info infoData={infoData} />} />
                    <Route path="/order/:boardPage" element={<Order />} />
                    <Route path="/orderDetail/:orderCode" element={<OrderDetail />} />
                    <Route path="/address" element={<Address />} />
                    <Route path="/review" element={<Review />} />
                    <Route path="/reviewWrite/:productCode/:orderCode" element={<ReviewWrite />} />
                    <Route path="/personalModify" element={<PersonalModify setInfoData={setInfoData} infoData={infoData} />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/deleteUser" element={<DeleteUser />} />
                </Routes>
            </Style.Div>
        </main>

    );
};


export default MyPage;