import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import moment from 'moment/moment';

import { tokenCheck } from 'api/token';
import { updateUserAccessCount } from 'api/user';

import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import Error from 'components/error/Error';
import NotFoundPage from 'components/error/NotFoundPage';
import Close from 'components/inicis/Close';
import TossSuccess from 'components/toss/TossSuccess';

import Main from 'pages/main/Main';
import Login from 'pages/login/Login';
import Register from 'pages/login/Register';
import Admin from 'routers/Admin';
import MyPage from 'routers/MyPage';
import Product from './Product';
import Order from './Order';
import Community from './community/Community';

import 'assets/css/common/common.css';

function App() {
    const nav = useNavigate();
    const location = useLocation();
    const [header, setHeader] = useState(false);
    const [user, setUser] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [cookies, setCookies] = useCookies();
    // 방문자 체크
    const accessCheck = async () => {
        const expires = moment().add('10', 'm').toDate();
        if (cookies.userCount !== 'true') {
            setCookies('userCount', true, { expires });
            updateUserAccessCount('나 등장~!');
        }
    };

    // 어드민페이지, 에러페이지 들어오면 헤더 삭제
    const pageCheck = () => {
        if (/.*admin.*/.test(location.pathname)) {
            setHeader(false);
        } else if (/.*error.*/.test(location.pathname)) {
            setHeader(false);
        } else {
            setHeader(true);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        pageCheck();
        if (!/.*error.*/.test(location.pathname)) {
            accessCheck();
            tokenCheck(setUser);
        }
    }, [nav]);

    return (
        <>
            {header && <Header user={user}></Header>}
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/myPage/*" element={<MyPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/loginRegister" element={<Register />} />
                <Route path="/product/*" element={<Product setOrderData={setOrderData} />} />
                <Route path="/order/*" element={<Order orderData={orderData} />} />
                <Route path="/close" element={<Close />} />
                <Route path="/community/*" element={<Community />} />

                {/* 에러 날때 밑에 파일로 보내줌 */}
                <Route path="/error" element={<Error />} />
                <Route path="/*" element={<NotFoundPage />} />

                {/* 토스 데이터 전달용 */}
                <Route path="/tossSuccess" element={<TossSuccess />} />
            </Routes>
            {header && <Footer></Footer>}
        </>
    );
}

export default App;
