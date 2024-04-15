import React from 'react';
import styled from "styled-components";
import error from 'assets/images/error.png'

const Error = () => {
    return (
        <Image src={error} alt="" />
    );
};

const Image = styled.img`
    position: fixed;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    max-width: 370px;
    width: 80%;
`

export default Error;