import styled from "styled-components";

export const Detail = styled.div`
    margin: 100px 0px;

    h2 {
        font-size: 40px;
        margin-bottom: 20px;
        text-align: center;
    }

    h3 {
        font-size: 16px;
        color: #909090;
        text-align: center;
    }

    .productTitle {
        width: 100%;
        padding: 20px;
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        gap: 20px;
        margin-top: 40px;
    }

    .productTitle>div:first-child {
        width: 150px;
        border: 1px solid #ccc;
        padding: 20px;
    }

    .productTitle>div:first-child img {
        width: 100%;
    }

    .productTitle>.info {}

    .productTitle>.info h4 {
        font-size: 18px;
        font-weight: bold;
    }

    .productTitle>.info .pay {
        font-size: 16px;
        margin: 5px 0px 15px;
    }

    .productTitle>.info a {
        background-color: #909090;
        color: #fff;
        padding: 7px 10px;
    }

    .title {
        margin: 30px 0px;
        border: 1px solid #e0e0e0;
    }

    .title ul {}

    .title ul li {
        display: grid;
        grid-template-columns: 150px 1fr;
    }

    .title ul li:not(:first-child) {
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
    }

    .title ul li div {
        line-height: 50px;
    }

    .title ul li div:nth-child(1) {
        text-align: center;
        background-color: #f8f8f8;
        font-weight: bold;
        font-size: 16px;
        color: #909090;
    }

    .title ul li div:nth-child(2) {
        font-weight: bold;
        font-size: 16px;
        padding: 0px 20px;
    }

    .title>div {
        display: flex;
        padding: 15px 20px;
        gap: 20px;
    }

    .title>div p {
        display: inline-flex;
        align-items: flex-end;
        gap: 10px;
        color: #919191;
    }

    .title>div p b {
        font-size: 18px;
        color: #000;
    }

    .content {
        padding-bottom: 50px;
        border-bottom: 1px solid #ccc;
        min-height: 500px;
    }
    .content .text-huge{        
        font-size: 30px;
    }
    .content .text-big{        
        font-size: 20px;
    }
    .content .text-small{        
        font-size: 12px;
    }
    .content .text-tiny{        
        font-size: 10px;
    }

    .content>img {
        max-width: 100%;
        margin-bottom: 20px;
        display: block;
    }

    .content p {
        font-size: 18px;
        line-height: 1.2;
    }

    .more,button {
        margin-top: 20px;
        border: 1px solid #ccc;
        font-weight: bold;
        font-size: 14px;
        width: 150px;
        line-height: 40px;
        text-align: center;
        border-radius: 5px;
        margin-bottom: 30px;
        margin-right: 5px;
        cursor: pointer;
    }

    .comments {
        background-color: #f8f8f8;
        padding: 50px 30px;
        margin-bottom: 30px;
    }

    .comments p {
        font-weight: bold;
    }

    .title {
        margin: 30px 0px;
        border: 1px solid #e0e0e0;
    }

    .differentBoard ul {}

    .differentBoard ul li {
        display: grid;
        grid-template-columns: 150px 1fr;
        border-top: 1px solid #e0e0e0;
    }

    .differentBoard ul li:not(:first-child) {
        border-bottom: 1px solid #e0e0e0;
    }

    .differentBoard ul li div,
    .differentBoard ul li a {
        line-height: 50px;
    }

    .differentBoard ul li div:nth-child(1) {
        text-align: center;
        background-color: #f8f8f8;
        font-weight: bold;
        font-size: 16px;
        color: #909090;
    }
    @media(max-width:400px) {
        .productTitle {
            flex-direction: column;
            text-align: center;
        }

        .productTitle>div:first-child {
            width: 100%;
            border: none;
        }

        .title ul li {
            grid-template-columns: 100px 1fr;
        }

        .comments {
            padding: 50px 0px;
            text-align: center;
        }

        .differentBoard ul li {
            grid-template-columns: 100px 1fr;
        }
        
    .more,button {
        width: 120px;
    }
}
`