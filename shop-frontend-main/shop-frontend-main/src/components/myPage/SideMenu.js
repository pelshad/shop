import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SideMenu = () => {
    const nav = useNavigate();
    const location = useLocation();
    const [url, setUrl] = useState(0);
    useEffect(() => {
        const regexArr = [/.*order.*/, /.*address.*/, /.*review.*/, /.*personalModify.*/, /.*contact.*/, /.*deleteUser.*/]
        for (let i = 0; i < regexArr.length; i++) {
            if (regexArr[i].test(location.pathname)) {
                setUrl(i);
            }
        }
    }, [nav])
    return (
        <Ul>
            <li><Link to="/myPage/order/1">마이페이지</Link></li>
            <li className={url === 0 ? "on" : ""}><Link to="/myPage/order/1"><i className='fa-solid fa-file-invoice-dollar'></i><p>주문 내역</p></Link></li>
            <li className={url === 1 ? "on" : ""}><Link to="/myPage/address"><i className='fa-solid fa-truck'></i><p>배송지 관리</p></Link></li>
            <li className={url === 2 ? "on" : ""}><Link to="/myPage/review"><i className='fa-solid fa-star'></i><p>상품 후기</p></Link></li>
            <li className={url === 3 ? "on" : ""}><Link to="/myPage/personalModify"><i className='fa-solid fa-house'></i><p>정보 수정</p></Link></li>
            <li className={url === 4 ? "on" : ""}><Link to="/myPage/contact"><i className='fa-solid fa-comment-dots'></i><p>1 : 1 문의</p></Link></li>
            <li className={url === 5 ? "on" : ""}><Link to="/myPage/deleteUser"><i className='fa-solid fa-comment-dots'></i><p>회원탈퇴</p></Link></li>
        </Ul>
    );
};

const Ul = styled.ul`
    
    display: flex;
    flex-direction: column;
    gap: 5px;
    height: 100%;
    p{
        display: inline-block;
    }
    > li{
        cursor: pointer;        
        padding: 5px;
    }
    li.on{
        background-color: #333;
    }
    li.on a{
        color: #fff;
    }
    li.on i{
        color: #fff;
    }
    > li:not(:first-child){
        border: 1px solid #DDDFE170;
    }
    > li:nth-child(1) > a{
        line-height: 40px;
        padding: 15px;
        font-size: 24px;
    }
    > li:not(:nth-child(1)) > a{
        padding: 15px;
        width: 100%;
    }
    > li span{
        padding: 15px 15px;
        display: inline-block;
    }
    > li span > i,
    > li a > i{
        margin-right: 10px;
        color: #999;
    }
    i {
        width: 20px;
    }

    @media screen and (max-width: 800px){
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0 10px;
        li:first-child{
            display: none;
        }
        li:not(:nth-child(1)) > a{
        padding: 10px 10px;
        width: 100%;
        }
        p{
            font-size: 14px;
        }
    }
`

export default SideMenu;