import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Loading from 'components/loding/Loading';

import styled from 'styled-components';

import logo from "assets/images/logo.png"
import { getCategory } from 'api/category';
import { logout } from 'api/logout';
import { getNotification, updateNotification } from 'api/notification';

const Header = ({ user }) => {
    const nav = useNavigate();
    const [categorys, setCategorys] = useState(null);
    const [isMobileMenu, setIsMobileMenu] = useState(false);
    const [mobileMenuNum, setMobileMenuNum] = useState(0);
    const [isMenuBox, setIsMenuBox] = useState(false);
    const [isNotification, setIsNotification] = useState(false);
    const [notification, setNotification] = useState(null);
    const [checkNotification, setCheckNotification] = useState(0);

    // 카테고리 가져옴
    useEffect(() => {
        getCategory(setCategorys);
    }, [])

    // 알림 가져옴
    useEffect(() => {
        getNotification({ user_id: sessionStorage.getItem("userId") }, setNotification, setCheckNotification);
    }, [nav, isNotification])

    // 알림 읽음 감지
    useEffect(() => {
        isNotification === true && updateNotification({ user_id: sessionStorage.getItem("userId") });
    }, [nav])

    useEffect(() => {
        setIsMobileMenu(false);
        setIsMenuBox(false);
        setIsNotification(false);
    }, [nav])

    return (
        categorys === null || notification === null
            ? <Loading />
            : < header style={{ boxShadow: "0px 0px 5px #00000033" }
            }>
                <Login>
                    <div className="wrap">
                        {
                            user?.result === "ok"
                                ? <ul className='userNav'>
                                    <li><h2>{sessionStorage.getItem("userId")}님 로그인중</h2></li>
                                    <li style={{ cursor: "pointer" }} onClick={logout}>로그아웃</li>
                                    <li><Link to={"product/basket"}>장바구니</Link></li>
                                    <li><Link to={"myPage/order/1"}>마이페이지</Link></li>
                                    {
                                        sessionStorage.getItem("userId") === "admin" ||
                                            sessionStorage.getItem("userId") === "pkd" ||
                                            sessionStorage.getItem("userId") === "asd"
                                            ? <li><Link to={"admin"}>관리자</Link></li>
                                            : null
                                    }
                                    <li>
                                        <div className='notification'
                                            onClick={() => {
                                                setIsNotification(!isNotification);
                                                isNotification === true &&
                                                    updateNotification({ user_id: sessionStorage.getItem("userId") });
                                            }}>
                                            <i className="fa-sharp fa-solid fa-bell" ></i>
                                            <div className={checkNotification > 0 ? "on" : ""}>{checkNotification}</div>
                                        </div>
                                        <div className="notificationContainer">
                                            <ul className={isNotification === true ? "on" : ""}>
                                                {
                                                    notification.map((a, i) => {
                                                        return (
                                                            <li key={i} className={a.check_yn === "N" ? "" : "reading"}>
                                                                <Link to={a.content === "message" ? `/myPage/contact` : `/myPage/orderDetail/${a.orderCode}`}>
                                                                    <p>{a.content === "message" ? "새로운 메시지 도착" : a.content}</p>
                                                                    <div>{a.send_date}</div>
                                                                </Link>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                                : <ul className='userNav'>
                                    <li><Link to={"login"}>로그인</Link></li>
                                    <li><Link to={"loginRegister"}>회원가입</Link></li>
                                </ul>
                        }
                    </div>
                </Login>

                <Head>
                    <div className="wrap">
                        <div className="flexBox">
                            <a href="/"><h1><img src={logo} alt="" /></h1></a>
                            <nav className='pc'>
                                <ul>
                                    {
                                        categorys?.map((a, i) => {
                                            return (
                                                <li key={i}>
                                                    <Link to={`/product/products/${(a.cate_code)}/1`}>{a.cate}</Link>
                                                    <ol>
                                                        {
                                                            a.lowCategory?.map((b, j) => {
                                                                return (
                                                                    <li key={j}><Link to={`/product/products/${b.cate_code}/1`}>{b.cate}</Link></li>
                                                                )
                                                            })
                                                        }
                                                    </ol>
                                                </li>
                                            )
                                        })
                                    }
                                    <li><Link to={"community/review/all/1"}>리뷰보기</Link></li>
                                    <li><Link to={"community/notice/1"}>공지사항</Link></li>
                                </ul>
                            </nav>

                            <div className="mobile">
                                <button onClick={() => { setIsMenuBox(!isMenuBox) }}>
                                    <i className="fa-solid fa-bars"></i>
                                </button>

                                <div className={
                                    isMenuBox === true
                                        ? "menuBox on"
                                        : "menuBox"
                                }>
                                    {
                                        user?.result === "ok"
                                            ? <ul className='user flexBox'>
                                                <li>{sessionStorage.getItem("userId")}님 로그인중</li>
                                                <li onClick={logout}>로그아웃</li>
                                            </ul>
                                            : <ul className='user flexBox'>
                                                <li><Link to={"login"}>로그인</Link></li>
                                                <li><Link to={"loginRegister"}>회원가입</Link></li>
                                            </ul>
                                    }

                                    <ul className='nav'>
                                        <li>
                                            <Link to={"product/basket"}>
                                                <i className="fa-solid fa-basket-shopping"></i>
                                                장바구니
                                            </Link>
                                        </li>
                                        {
                                            user?.result === "ok" &&
                                            <li>
                                                <Link to={"myPage/order/1"}>
                                                    <i className="fa-solid fa-user"></i>
                                                    마이페이지
                                                </Link>
                                            </li>
                                        }
                                    </ul>

                                    <ul className='menu'>
                                        {
                                            categorys?.map((a, i) => {
                                                return (
                                                    <li key={i}>
                                                        {
                                                            a.lowCategory.length <= 0
                                                                ? <Link to={`/product/products/${(a.cate_code)}/1`}>{a.cate}</Link>
                                                                : <span
                                                                    onClick={() => {
                                                                        setIsMobileMenu(!isMobileMenu);
                                                                        setMobileMenuNum(i);
                                                                    }}
                                                                >{a.cate}</span>
                                                        }
                                                        <ol style={
                                                            isMobileMenu === true
                                                                ? mobileMenuNum === i
                                                                    ? { maxHeight: `${a.lowCategory.length * 40}px` }
                                                                    : { maxHeight: `0px` }
                                                                : { maxHeight: `0px` }
                                                        }>
                                                            {
                                                                a.lowCategory?.map((b, j) => {
                                                                    return (
                                                                        <li key={j}><Link to={`/product/products/${b.cate_code}/1`}>{b.cate}</Link></li>
                                                                    )
                                                                })
                                                            }
                                                        </ol>
                                                    </li>
                                                )
                                            })
                                        }
                                        <li><Link to={"community/review/all/1"}>리뷰보기</Link></li>
                                        <li><Link to={"community/notice/1"}>공지사항</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </Head>
            </header >
    );
};

const Login = styled.div`
    border-bottom: 1px solid #ccc;
    .userNav{
        display: flex;
        justify-content: end ;
        gap: 15px;
        >li{
            padding: 10px 0px; 
            position: relative;
            .notification{
                position: relative;
                cursor: pointer;
                i{
                    color: #555;
                }
                > div{
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background-color: red;
                    font-size: 10px;
                    border-radius: 50%;
                    width: 12px;
                    height: 12px;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    display: none;
                }
                >div.on{
                    display: flex;
                }
            }
            ul{
                position: absolute;
                width: 200px;
                height: 300px;
                max-width: 0px;
                max-height: 0px;
                transition: all .3s;
                top: 90%;
                right: 0;
                background-color: #fff;
                box-shadow: 2px 2px 5px #00000077;
                z-index: 5;
                display: flex;
                flex-direction: column;
                overflow-y: scroll;
                opacity: 0;
                ::-webkit-scrollbar {
                    width: 5px; 
                }
                ::-webkit-scrollbar-thumb {
                    background: #555; 
                    border-radius: 10px;
                }::-webkit-scrollbar-track {
                    background: #eee;  
                }
                li{
                    padding: 5px 0px;
                    border-bottom: 1px solid #ccc;
                    color: #000;
                    a{
                        width: 100%;
                    }
                    p{
                        font-size: 12px;
                    }
                    div{
                        text-align: right;
                        margin-top: 10px;
                        font-size: 10px;
                    }
                }
                li.reading{
                    p,div{
                        color: #888;
                    }
                }
            }
            ul.on{
                max-width: 200px;
                max-height: 300px;
                padding: 0px 5px;
                opacity: 1;
            }
        }
    }
    @media (max-width: 1200px) {
        display: none;
    }
`
const Head = styled.div`
    background-color: #fff;
    a > h1 > img{
        width: 100px;
    }
    nav ul li{
        position: relative;
    }

    nav ul > li > a{
        font-size: 18px;
        padding: 0px 15px;
        line-height: 50px;
    }

    nav ul li ol{
        position: absolute;
        top: 90%;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 1px 1px 2px #00000077;
        background-color: #fff;
        max-height: 0px;
        overflow-y: hidden;
        transition: max-height .5s;
        z-index: 5;
    }

    nav ul li:hover ol{
        max-height: 300px;
    }

    nav ul  li ol li{
        width: 100%;
    }

    nav ul li ol li:hover{
        background-color: #eee;
    }

    nav ul li ol li a{
        width: 100%;
        font-size: 16px;
        white-space:nowrap;
        line-height: 40px;
        padding: 0px 10px;
        text-align: center;
    }

    .mobile button i{
        font-size: 24px;
        cursor: pointer;
        line-height: 50px;
    }

    .mobile .menuBox{
        position: fixed;
        top: 0;
        left: 0;
        background-color: #fff;
        width: 250px;
        max-width : 0px;
        overflow: hidden;
        transition: max-width .3s, opacity .2s;
        height: 100vh;
        z-index: 10;
        opacity: 0;
        box-shadow: -2px -2px 8px #00000077;
    }

    .mobile .menuBox.on{
        opacity: 1;
        max-width: 250px;
    }

    .mobile .menuBox ul.user{
        padding: 10px 5px;
        border-bottom: 1px solid #ccc;
    }

    .mobile .menuBox ul.user li{
        white-space: nowrap;
    }

    .mobile .menuBox ul.nav{
        display: flex;
    }

    .mobile .menuBox ul.nav li{
        flex: 1;
        text-align: center;
        padding: 10px 0px;
        border-bottom: 1px solid #ccc;
    }

    .mobile .menuBox ul.nav li a{
        display: flex;
        flex-direction: column;
        gap: 5px;
        white-space: nowrap;
    }

    .mobile .menuBox ul.nav li i{
        font-size: 20px;
    }

    .mobile .menuBox ul.nav li:nth-child(1){
        border-right: 1px solid #ccc;
    }

    .mobile .menuBox ul.menu{
        display: flex;
        flex-direction: column;
    }

    .mobile .menuBox ul.menu li{
        width: 100%;
    }

    .mobile .menuBox ul.menu > li > span,
    .mobile .menuBox ul.menu > li > a{
        display: inline-block;
        width: 100%;
        border-bottom: 1px solid #ccc;
        text-align: center;
        line-height: 40px;
        white-space: nowrap;
        cursor: pointer;
    }

    .mobile .menuBox ul.menu > li > ol{
        background-color: #eee;
        max-height: 0px;
        overflow: hidden;
        transition: max-height .5s;
    }

    .mobile .menuBox ul.menu > li > ol > li{
        width: 100%;
    }

    .mobile .menuBox ul.menu > li > ol > li > a{
        text-align: center;
        line-height:40px;
        width: 100%;
        white-space: nowrap;
    }

    .mobile .menuBox ul.menu > li > ol > li:not(:last-child) > a{
        border-bottom: 1px solid #ccc;
    }

`


export default Header;