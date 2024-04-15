import styled from "styled-components";

export const SettingAddress = styled.div`
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 15px 0px;
    padding: 15px;
    h2{
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    ul{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    ul li label{
        display: flex;
        align-items: center;
    }

    ul li label span{
        font-size: 16px;
        width:100px;
        line-height: 32px;
    }

    ul li label input{
        flex:1;
        border: 1px solid #ccc;
        line-height: 30px;
        padding: 0px 5px;
        border-radius: 5px;
    }

    ul li:nth-child(2) label{
        align-items: flex-start;
    }

    ul li:nth-child(2) label span{
        display: flex;
        align-items: center;
    }

    ul li:nth-child(2) span i{
        padding: 0px 5px;
        cursor: pointer;
    }

    ul li:nth-child(2) label div{
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
    }

    ul li:nth-child(2) label div input{
        flex: 1;
    }

    ul li:last-child{
        text-align: center;
    }

    ul li button{
        padding: 8px 15px;
        border-radius: 5px;
        background-color: #1a6dff;
        color: #fff;
        cursor: pointer;
    }

    @media (max-width:500px) {
        ul li label{
            flex-direction: column;
            align-items: flex-start;
        }

        ul li label input{
            width: 100% !important;
        }

        ul li:nth-child(2) label div{
            width: 100%;
        }
    }
`
export const Container = styled.div`
    ul li{
        width: 100%;
        padding: 15px 0px;
        border-bottom: 1px solid #ccc;
    }

    ul li h2{
        font-size: 22px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 10px;
    }

    ul li h2 span{
        color: #1a6dff;
    }

    ul li p{
        font-size: 16px;
        line-height: 1.5;
    }
    
    ul li .buttons{
        display: flex;
        gap: 5px;
    }

    ul li .buttons button{
        margin-top: 5px;
        padding: 10px 15px;
        border-radius: 5px;
        color: #fff;
        background-color: #333;
        cursor: pointer;
    }
    
    ul li .buttons button.setting{
        background-color: #1a6dff;
    }
`