import styled from "styled-components";

export const Save = styled.div`
    position: fixed;
    bottom: 15px;
    right: 15px;
    font-size: 18px;
    background-color: #1a6dff;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
`

export const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-content: center;
    gap: 10px;
`

export const CateInfo = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    li{
        width: 100%;
        background-color: #f5f5f5;
        padding: 10px;
        font-size: 18px;
        border-radius: 5px;
    }
`

export const Buttons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    *{
        line-height: 24px;
        background-color: #1a6dff;
        color: #fff;
        padding: 0px 15px;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
        white-space: nowrap;
    }
`