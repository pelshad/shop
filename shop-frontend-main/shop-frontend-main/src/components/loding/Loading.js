import React, { useEffect } from 'react';
import LoadingImage from "assets/images/loading.gif";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Loading = () => {
    const nav = useNavigate();
    useEffect(() => {
        const timer = setInterval(() => {
            alert("서버에서 데이터를 가져올 수 없습니다.");
            nav("/error");
        }, 30000);
        return () => clearInterval(timer);
    }, [])

    return (
        <Div>
            <Img src={LoadingImage} />
        </Div>
    );
};

const Div = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: #fff;
    z-index: 100;
`

const Img = styled.img`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 300px;
    z-index: 10;
`;

export default Loading;