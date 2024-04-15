import styled from "styled-components";

export const ProductList = styled.li`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items:flex-start;
    gap: 10px;
    img{
        width: 82px;
        height: 82px;
        border-radius: 5px;
    }
`

export const Div = styled.div`
    display: flex;
    flex: 1;
    gap: 10px;
    ul{
        display: flex;
        flex-direction: column;
        gap: 5px;
        flex: 1;
        li{
            background-color: #f5f5f5;
            padding: 5px;
            border-radius: 5px;
        }
        .warning{
            color: black;
            animation: CC 3s infinite;
        }
    }
    @keyframes CC{
        50%{ 
            color: tomato;
            }
    }
`

export const Ul = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 5px;

    li a,
    button{
        line-height: 24px;
        background-color: #1a6dff;
        color: #fff;
        padding: 0px 15px;
        border-radius: 5px;
        cursor: pointer;
    }
`