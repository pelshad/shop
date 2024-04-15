import styled from "styled-components";

export const Contaienr = styled.div`
    padding: 50px 0px;
    
    h2{
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 50px;
    }

    .write{
        padding: 5px 20px;
        border-radius: 5px;
        background-color: #444;
        color: #fff;
        font-size: 16px;
    }

    @media (max-width:500px) {
        input{
            width: 200px;
        }
    }
`

export const Board = styled.div`
    margin-top: 10px;

    ul{
        display: grid;
        grid-template-columns: 1fr 70% 1fr 1fr 1fr;
    }

    .title{
        border-top: 2px solid #aaa;
        border-bottom: 2px solid #aaa;
    }

    .title li{
        line-height: 40px;
        text-align: center;
    }

    .list:not(:nth-child(1)){
        border-bottom: 1px solid #aaa;
    }

    .list li:not(:nth-child(2)){
        text-align: center;
    }

    .list li,.list a{
        line-height: 40px;
    }

    p{
        text-align: center;
        line-height: 200px;
        border-bottom: 1px solid #aaa;
    }

    @media (max-width:700px) {
        ul{
            grid-template-columns: 50px 1fr 100px;
        }
        .title li:nth-child(4),
        .title li:nth-child(5),
        .list li:nth-child(4),
        .list li:nth-child(5){
            display: none;
        }
    }
`