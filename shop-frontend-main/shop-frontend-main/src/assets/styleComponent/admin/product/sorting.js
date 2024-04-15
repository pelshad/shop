import styled from "styled-components";

export const H2 = styled.div`
    margin-bottom: 30px;
    font-size: 20px;
    font-weight: bold;
`

export const ProductRegister = styled.button`
    display: block;
    line-height: 40px;
    background-color: #333;
    color: #fff;
    padding: 0px 30px;
    margin: 15px auto 0px;
    border-radius: 5px;
    cursor: pointer;
`;

export const Box = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 0px;
    border-bottom: 1px solid #ddd;
    span{
        display: inline-block;
        width: 150px;
    }
    > div{
        display: flex;
        align-items: center;
        gap: 5px;
    }
    > div > div{
        position: relative;
    }
    select{
        border: 1px solid #ccc;
        border-radius: 5px;
        line-height: 30px;
        padding: 0px 10px;
        width: 300px;
        color: #757575;
    }
    i{
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-70%);
        color: #757575;
    }
    .buttons{
        display: flex;
        align-items: center;
        gap: 5px;
    }
    button{
        line-height: 30px;
        background-color: #1a6dff;
        color: #fff;
        padding: 0px 16px;
        border-radius: 5px;
        cursor: pointer;
    }
`;

export const Title = styled.ul` 
    display: grid;
    grid-template-columns: 1fr 70px;
    text-align: center;
    border-bottom:1px solid #eee;
    padding-bottom: 15px;
    li{
        font-size: 16px;
        font-weight: bold;
    }
`

export const List = styled.ul`
    display: grid;
    grid-template-columns: 1fr 70px;
    align-items: center;
    border-bottom:1px solid #eee;
    padding: 10px 0px;
    li:nth-child(2){
        text-align: center;
    }
    input{
        border: 1px solid #ccc;
        width: 100%;
        text-align: center;
        padding: 5px 0px;
    }
`