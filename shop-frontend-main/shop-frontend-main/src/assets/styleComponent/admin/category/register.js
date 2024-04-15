import styled from "styled-components";

export const Box = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 5;
    width: 350px;
    padding: 50px;
    background-color: #fff;
    border-radius: 5px;
    
    h3{
        text-align: center;
        margin-bottom: 3px;
        font-size: 16px;
    }

    input{
        width: 100%;
        border: 1px solid #555;
        padding: 5px;
        border-radius: 5px;
        margin: 3px 0px;
    }

    button,a{
        width: 100%;
        background-color: #1a6dff;
        color: #fff;
        border-radius: 5px;
        line-height: 30px;
        margin: 3px 0px; 
        text-align: center;
    }
`

export const Bg = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: #00000066;
`
