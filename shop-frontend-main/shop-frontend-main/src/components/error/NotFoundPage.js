import React from 'react';
import styled from "styled-components";
import error from 'assets/images/404.jpg'

const NotFoundPage = () => {
    return (
        <Bg>
            <Image src={error} alt="" />
            <a href="/">메인으로 이동</a>
        </Bg>
    );
};

const Bg = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    a{
        border: 1px solid #007dfe;
        color: #007dfe;
        padding: 10px 20px;
    }
`

const Image = styled.img`
    max-width: 450px;
    width: 80%;
`

export default NotFoundPage;