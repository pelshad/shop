import styled from "styled-components";

export const Order = styled.div`
    padding: 50px 0px;
`

export const Title = styled.h2`
    font-weight: 700;
    font-size: 26px;
`

export const SubTitle = styled.h3`
    font-weight: 700;
    font-size: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
`

export const Purchase = styled.div`
    border: 1px solid #ddd;
    margin: 15px 0px;
    ul{
        display: grid;
        grid-template-columns: 50% 1fr 1fr 1fr ;
    }

    ul:not(:last-child){
        border-bottom: 1px solid #ddd;
    }

    ul.title{
        border-bottom: 1px solid #ddd;
        align-items: center;
        padding: 5px 15px;
    }

    ul.title li{
        text-align: center;
    }

    ul.productInfo{
        padding: 15px;
    }

    ul.productInfo li{
        display: flex;
        align-items: center;
        gap: 20px;
    }

    ul.productInfo li:not(:first-child){
        justify-content: center;
    }

    ul.productInfo li img{
        width: 150px;
        height: 110px;
        border-radius: 15px;
    }
    ul.productInfo li .content{}
`
export const Payment = styled.div`
    padding: 10px;
    display: flex;
    justify-content:space-around;
    gap: 50px;
    @media(max-width:800px) {
        flex-direction: column;
        gap: 50px;
    }
`

export const Info = styled.div`
    border: 1px solid #ddd;
    margin: 15px 0px;
    padding: 15px;

    .submit{
        background-color: #ddd;
        padding: 10px 0px;
        cursor: pointer;
    }
`

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    
    div{
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    div .address{
        background-color: #ddd;
        width: 80px;
        text-align: center;
        cursor: pointer;
        padding: 7px 0px;
    }

    div input:not([type="radio"]){
        width: 400px;
        border: 1px solid #ddd;
        padding: 5px;
    }

    div input[type="radio"]{
        width: 50px;
    }

    @media (max-width: 500px) {
        div input:not([type="radio"]){
            width: 100%;
        }
    }
`

export const payForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex:1;

    >div{
        display: flex;
        gap: 5px;
        justify-content: space-between;
        padding-bottom: 10px;
    }
    div.point{
        text-align:end;
    }
    div.point input[type="text"]{
        text-align:end;
    }
    div.point button{
        background-color: #ddd;
        padding: 7px 10px;
        cursor: pointer;
        margin-left:10px;
    }
    div span{
        font-size:16px;
    }
    div span .light{
        font-size:14px;
        line-height:bottom;
    }
    div input[type="text"]{
        border: 1px solid #ddd;
        padding: 5px;
    }
    div .totalPay{
        font-size:24px;
        font-weight:bold;
        padding-top:20px;
    }
    @media (max-width: 500px) {
        div.point input[type="text"]{
            width: 100px;
        }   
    }
`