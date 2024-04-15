import styled from "styled-components";

export const ReviewList = styled.ul`
    display: grid;
    grid-template-columns: 1fr;
    margin-top: 20px;
    li{
        width: 100%;
        border-bottom: 1px solid #ccc;
    }
    li > div{
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 10px 0px;
    }
    li > div  img{
        border: 1px solid #ddd;
        border-radius: 7px;
        width: 125px;
        height: 100px;
    }
    li > div .content{
        flex: 1;
    }
    li > div .content h4{
        font-weight: bold;
        font-size: 20px;
        line-height: 1.2;
    }
    li > div .content h5{
        font-size: 16px;
        line-height: 1.2;
    }
    li > div a{
        font-size: 16px;
        line-height: 1.2;
        background-color: #333;
        color: #fff;
        padding: 7px 15px;
        border-radius: 7px;
    }
    @media screen and (max-width:500px){
        grid-template-columns: 1fr 1fr;
        li > div{
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px 0px;
        }
        li > div .content h4{
            font-size: 17px;
        }
        li > div a{
            font-size: 14px;
            text-align: center;
            width: 125px;
        }
    }
`