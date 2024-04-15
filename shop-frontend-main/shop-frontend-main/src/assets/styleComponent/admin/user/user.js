import styled from "styled-components";

export const Div = styled.div`
    display: flex;
    flex: 1;
    gap: 10px;
    text-align: left;
    ul{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 5px;
        flex: 1;
        li{
            background-color: #f5f5f5;
            padding: 5px;
            border-radius: 5px;
        }
    }
`

export const DeleteButton = styled.button`
    margin-top: 10px;
    line-height: 30px;
    background-color: #1a6dff;
    color: #fff;
    padding: 0px 50px;
    border-radius: 5px;
    cursor: pointer;
`
