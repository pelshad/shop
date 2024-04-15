import { Link } from "react-router-dom";
import styled from "styled-components";

export const Padding = styled.div`
    padding: 50px 0px;
`

export const Info = styled.div`
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    grid-gap: 50px;
    border-bottom: 1px solid rgb(230,230,230);
    padding-bottom: 20px;

    @media(max-width:800px) {
        grid-template-columns: 1fr;
    }
`

export const ImageInfo = styled.div`
    width: 100%;
    
    img {
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px 50px;
        width: 100%;
        height: 450px;
    }

    ul {
        display: flex;
        margin-top: 10px;
        gap: 10px;
    }

    ul li {
        max-width: 80px;
        border: 1px solid #ccc;
        padding: 10px;
        cursor: pointer;
    }

    ul li img {
        width: 100%;
    }

    button {
        width: 100%;
        border: 1px solid #ccc;
        background-color: #f5f5f5;
        padding: 15px 0px;
        cursor: pointer;
        color: #aaa;
        font-weight: bold;
        font-family: 'Pretendard-Bold';
        margin-top: 10px;
    }

    button i {
        margin-right: 5px;
    }

    @media(max-width:800px) {
        img {
            max-width: 100%;
            max-height: 100%;
            height: unset;
            width: unset;
            padding: 15px;
            margin: 0 auto;
        }
        ul {
            justify-content: center;
        }
    }
`

export const Content = styled.div`
    h2 {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    h3 {
        font-size: 16px;
        color: #ccc;
        line-height: 1.2;
        margin-bottom: 20px;
    }

    .info p {
        color: #ccc;
        font-size: 18px;
        margin: 20px 0px 20px;
        font-weight: bold;
    }

    @media(max-width:500px) {
        .info .button {
            flex-direction: column;
        }

         .info ul li {
            grid-template-columns: 100px 1fr;
        }

        .info ul li b {
            font-size: 16px;
        }

        .info ul li span {
            font-size: 16px;
        }

        .info .total span {
            font-size: 18px;
        }

        .info .total span b {
            font-size: 18px;
        }

        .info .total>b {
            font-size: 20px;
        }
    }
`


export const DetailInfo = styled.ul`
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 20px 0px;

     li {
        display: grid;
        grid-template-columns: 150px 1fr;
        align-items: center;
    }

     li:not(:last-child) {
        margin-bottom: 20px;
    }

     li b {
        font-size: 20px;
        color: #ccc;
    }

     li span {
        font-size: 20px;
        font-weight: bold;
    }

     li span.pay {
        color: #d1b064;
    }
    @media screen and (max-width:600px){
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        padding: 20px 0px;

        li {
            display: grid;
            grid-template-columns: 150px 1fr;
            align-items: center;
        }

        li:not(:last-child) {
            margin-bottom: 20px;
        }

        li b {
            font-size: 18px;
            color: #ccc;
        }

        li span {
            font-size: 16px;
            font-weight: bold;
        }

        li span.pay {
            color: #d1b064;
        }
    }
`

export const OptionSelect = styled.div`
    position: relative;
    margin-bottom: 20px;

    select{
        width: 100%;
        line-height: 40px;
        border: 1px solid #ddd;
        padding: 0px 10px;
        font-family: 'Pretendard-Regular';
    }

    i{
        position: absolute;
        top: 40%;
        right: 10px;
        transform: translateY(-50%);
        font-size: 20px;
    }
`

export const Quantity = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f5f5;
    padding: 30px 20px;
    font-weight: bold;

     .name {
        font-size: 16px;
    }

    .num{
        background-color: #fff;
        display: flex;
        align-items: center;
        border: 1px solid #aaa;
    }

    .num *{
        text-align: center;
        padding: 5px;
    }

    .num span{
        width: 50px;
        border-right: 1px solid #aaa;
        border-left: 1px solid #aaa;
    }

    .num i{
        width: 30px;
        background-color: #eee;
        cursor: pointer;
    }

    .money {
        font-size: 16px;
    }
`

export const Total = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin: 30px 0px;

    span {
        font-size: 22px;
    }

    span b {
        font-size: 22px;
    }

    >b {
        font-size: 28px;
        margin: 0px 10px;
    }
`

export const ButtonBox = styled.div`
    display: flex;
    gap: 5px;
`

export const Button = styled.div`
    flex: 1;
    text-align: center;
    border: 1px solid #ccc;
    font-weight: bold;
    font-size: 20px;
    padding: 20px 0px;
    color: ${props => props.color !== "black" ? "#333" : "#fff"};
    background-color: ${props => props.color !== "black" ? "#fff" : "#333"};
    cursor: ${props => props.cursor === "default" ? "default" : "pointer"};
`

export const fav = styled.div`
    border: 1px solid #ccc;
    flex: 0.2;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`

export const Description = styled.div`
    
`
export const DescriptionMenu = styled.div`
    cursor: pointer;
    ul{
        text-align: center;
    }

    ul li{
        display: inline-block;
        text-align: center;
        padding: 30px;
        font-size: 18px;
    }

    ul li:not(:nth-child(1)) {
        color: rgb(180,180,180);
    }

    ul li span{
        font-size:18px;
        letter-spacing: 3px;
    }

    ul .lightOn{
        background-color: rgb(50,50,50);
    }

    ul .lightOn span{
        color: white;
    }
`

export const DescriptionShow = styled.div`
    padding: 40px 0;
    border-bottom: 1px solid rgb(230,230,230);
    

    @media screen and (max-width: 600px) {
        img{
            width: 100%;
        }
        div{
            max-width: 100%;
        }
    }
`

export const Review = styled.div`
    padding: 20px 0;
    border-bottom: 1px solid rgb(230,230,230);

    h2{
        font-size: 24px;
        padding-bottom: 20px;
    }
    .nav{
    cursor: pointer;
    ul{
        text-align: center;
    }
    ul li{
        display: inline-block;
        text-align: center;
        padding: 30px;
        font-size: 18px;
    }
    ul li:not(:nth-child(2)) {
        color: rgb(180,180,180);
    }
}

    .grid{
        display: grid;
        grid-template-columns: 1fr 4fr;
        padding: 20px;
    }

    .grid .reviewDetail .optionList{
        color: rgb(140,140,140);
        padding-bottom: 20px;
    }

    .grid .reviewDetail p:nth-child(2){
        padding-bottom: 20px;
    }

    .grid .reviewDetail p:nth-child(3){
        color: rgb(140,140,140);
        font-size: 12px;
    }   
    
    `

export const Return = styled.div`
margin: 40px 0;
h4{
    padding: 10px 10px 20px 10px;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 1px;
}
.nav{
    cursor: pointer;
    ul{
        text-align: center;
    }
    ul li{
        display: inline-block;
        text-align: center;
        padding: 30px;
        font-size: 18px;
    }
    ul li:not(:nth-child(3)) {
        color: rgb(180,180,180);
    }
}

.info, .period{
    padding-bottom: 20px;
    ul{
        padding-left: 35px;
    }
    ul li{
        list-style: disc;
        display: list-item;
        padding-bottom: 10px;
        font-size: 16px;
        color: rgb(105,105,105);
        letter-spacing: 1px;
    }
}
.refuse, .condition{
    padding-bottom: 20px;
    ul{
        padding-left: 35px;
    }
    ul li{
        list-style: decimal;
        display: list-item;
        padding-bottom: 10px;
        font-size: 16px;
        color: rgb(105,105,105);
        letter-spacing: 1px;
    }
}
`