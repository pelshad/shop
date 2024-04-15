import styled from "styled-components";


export const Div = styled.div`
    
    background-color: white;
    width: 100%;
    height: 100%;
    border: 5px solid #F7F7F7;
    padding: 30px;
    .subTitle{
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }
    .subTitle > div{
        display: flex;
        align-items: center;
    }
    h2{        
        font-size: 24px;
    }
    .grayTitle{
        color: gray;
        padding-left: 30px;

    }
    .new{
        font-size: 20px;
        text-align: right;
    }
    .contents{
        display: flex;
    }
    .column{
        border-top: 2px solid black;
        height: 20px;
        width: 100%;
        margin-top: 35px;
    }
`

export const List = styled.div`
    :not(:nth-child(1)){
            border-top: 1px solid rgba(0,0,0,0.1);
            padding-top: 20px;
        }
    padding: 0px 20px 30px 20px;
    display: flex;
    .goodsImg{
        flex: 1;
    }
    .goodsImg img{
        width: 100px;
        height: 100px;
        border-radius: 10px;
    }
    .goodsImg span{
        display: inline-block;
        width: 100px;
        height: 100px;
    }
    .goodsInfo{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 3;
    }
    .goodsInfo .nm a{
        font-size: 20px;
        font-weight: bold;
        padding-bottom: 10px;
    }
    .goodsBtn{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
    }
    .goodsBtn button{
        padding: 5px;
        background-color: black;
        border-radius: 10px;
        color: white;
        width: 60%;
        cursor: pointer;
    }
    .goodsBtn .basket{
        margin-bottom: 20px;
    }
`