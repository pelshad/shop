import styled from "styled-components";

export const ReviewBoard = styled.div`
    padding: 50px 0px;
    .wrap > h3{
        font-size: 40px;
        text-align: center;
    }
    .wrap > p{
        font-size: 16px;
        color: #b6b6b6;
        text-align: center;
        margin: 30px 0px 40px;
    }
    nav{
        text-align: center;
    }
    nav a{
        width: 200px;
        line-height: 45px;
        font-size: 16px;
        margin: 0px 3px;
    }
    nav a{
        border: 1px solid #333333;
    }
    nav a.on{
        background-color: #333333;
        border: 1px solid #333333;
        color: #fff;
    }

    .wrap > ul.all{
        display: flex;
        flex-direction: column;
        margin-top: 50px;
    }
    .wrap > ul.all > li{
        width: 100%;
    }
    .wrap > ul.all > li:first-child{
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
    }
    .wrap > ul.all > li:not(:first-child){
        border-bottom: 1px solid #ccc;
    }
    .wrap > ul.all > li{
        display: flex;
        padding: 15px 0px;
        align-items: center;
        gap: 30px;
        width: 100%;
    }
    .wrap > ul.all > li >.content{
        flex: 1;
        border-right: 1px solid #ccc;
    }
    .wrap > ul.all > li > .content .star{
        color: #ffba00;
        font-size: 24px;
    }
    .wrap > ul.all > li > .content h3{
        font-weight: bold;
        font-size: 24px;
        margin: 10px 0px;
    }
    .wrap > ul.all > li > .content p{
        font-size: 16px;
        line-height: 1.2;
        overflow: hidden;
    }
    .wrap > ul.all > li > .content.on p{
        max-height: unset;
    }
    .wrap > ul.all > li > .content button{
        background: none;
        border: none;
        color: #b6b6b6;
        font-size: 16px;
        cursor: pointer;
        font-weight: bold;
        margin-top: 10px;
    }
    .wrap > ul.all > li > .content .comments{
        font-size: 16px;
        color: #b6b6b6;
        margin-top: 20px;
    }
    .wrap > ul.all > li > .content .imageView{
        display: flex;
        gap: 10px;
    }
    .wrap > ul.all > li > .content .imageView img{
        width: 80px;
        height: 80px;
        border-radius: 15px;
        margin-top: 20px;
        cursor: pointer;
    }
    .wrap > ul.all > li > .reviewInfo{
        width: 25%;
    }
    .wrap > ul.all > li > .reviewInfo > ul{
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 16px;
    }
    .wrap > ul.all > li > .reviewInfo > ul > li{}
    .wrap > ul.all > li > .reviewInfo > ul > li span{
        color: #b6b6b6;
        margin-right: 10px;
        font-size: 16px;
    }
    .wrap > ul.all > li > .reviewInfo .pagention{}
    .wrap > .pagention{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin-top: 50px;
        }
    .wrap > .pagention a i{
        width: 30px;
        line-height: 28px;
        border: 1px solid #ccc;
        text-align: center;
    }
    .wrap > .pagention span{
        padding: 0px 15px;
    }

    .wrap  > h4{
        margin: 30px 0px 20px;
        font-size: 22px;
        border-left: 2px solid #ccc;
        padding-left: 15px;
        font-weight: bold;
    }
    .wrap > ul.photo{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-row-gap: 50px;
    }
    .wrap > ul.photo li{}
    .wrap > ul.photo li a{
        width: 100%;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
    }
    .wrap > ul.photo li:nth-child(1) a,
    .wrap > ul.photo li:nth-child(5) a,
    .wrap > ul.photo li:nth-child(9) a{
        border-left: 1px solid #ccc;
    }
    .wrap > ul.photo li a > img{
        width: 100%;
        border-bottom: 1px solid #ccc;
        position: relative;
    }
    .wrap > ul.photo li a .content{
        padding: 20px;
        min-height: 223px;
        max-height: 223px;
    }
    .wrap > ul.photo li a .content .star{
        color: #ffba00;
        font-size: 20px;
    }
    .wrap > ul.photo li a .content h4 {
        margin: 10px 0px;
        font-size: 16px;
        line-height: 1.2;
        font-weight: bold;
    }
    .wrap > ul.photo li a .content p{
        color: #797979;
        line-height: 1.2;
        height: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .wrap > ul.photo li a .bar{
        width: 100%;
        height: 1px;
        background-color: #ccc;
        margin-top: 20px;
    }
    .wrap > ul.photo li a .productName{
        padding: 20px 20px 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        border-top: 1px solid #ccc;
    }
    .wrap > ul.photo li a .productName div{
        width: 50px;
        height: 50px;
        border: 1px solid #ccc;
        border-radius: 50%;
        padding: 10px;
    }
    .wrap > ul.photo li a .productName div img{
        width: 100%;
    }

    .wrap > .bar{
        width: 100%;
        height: 2px;
        background-color: #ccc;
        margin: 100px 0px;
    }

    .photoReviewDetail{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        z-index: 11;
        display: none;
    }
    .photoReviewDetail .close{
        position: absolute;
        top: 0;
        right: 0;
    }
    .photoReviewDetail .close i{
        font-size: 20px;
        width: 40px;
        line-height: 40px;
        text-align: center;
        background-color: #333333;
        color: #fff;
        cursor: pointer;
    }
    .photoReviewDetail ul{
        display: grid;
        grid-template-columns: 550px 300px;
        height: 550px;
    }
    .photoReviewDetail ul li{}
    .photoReviewDetail ul li:nth-child(2){
        padding: 30px 15px;
    }
    .photoReviewDetail ul li > img{
        width: 100%;
        height: 100%;
    }
    .photoReviewDetail ul li h3{
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
        width: 100%;
    }
    .photoReviewDetail ul li h3 > div{
        width: 50px;
        height: 50px;
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 50%;
    }
    .photoReviewDetail ul li h3 > div img{
        width: 100%;
    }
    .photoReviewDetail ul li .content{
        padding: 20px 0px;
        border-bottom: 1px solid #ccc;
    }
    .photoReviewDetail ul li .content .star{
        color: #ffba00;
        font-size: 18px;
    }
    .photoReviewDetail ul li .content h4{
        font-size: 16px;
        font-weight: bold;
        line-height: 1.2;
        margin: 5px 0px;
    }
    .photoReviewDetail ul li .content p{
        line-height: 1.2;
        height: 100px;
        overflow-y: scroll;
        margin-bottom: 5px;
        color: #797979;
    }
    .photoReviewDetail ul li .content .user{
        margin-top: 10px;
    }
    .photoReviewDetail ul li .content .user span{
        color: #797979;
    }
    .photoReviewDetail ul li .comments{}
    .photoReviewDetail ul li .comments > div{
        font-size: 16px;
        color: #797979;
        padding: 10px 0px;
    }
    .photoReviewDetail ul li .comments ol{
        height: 170px;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .photoReviewDetail ul li .comments ol li{
        background-color: #f3f3f3;
        padding: 10px;
        border-radius: 10px;
    }
    .photoReviewDetail ul li .comments ol li .name{}
    .photoReviewDetail ul li .comments ol li p{
        margin: 5px 0px;
    }
    .photoReviewDetail ul li .comments ol li .days{}
    .bg{
        background-color: #00000077;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        display: none;
    }

    @media(max-width:800px){
        .wrap > ul.photo{
            grid-template-columns: 1fr 1fr;
        }
        .wrap > ul.photo li:nth-child(3) a,
        .wrap > ul.photo li:nth-child(5) a,
        .wrap > ul.photo li:nth-child(7) a,
        .wrap > ul.photo li:nth-child(9) a,
        .wrap > ul.photo li:nth-child(11) a{
            border-left: 1px solid #ccc;
        }
        .photoReviewDetail{
            width: 500px;
        }
        .photoReviewDetail ul{
            grid-template-columns: 1fr;
            overflow-y: scroll;
        }
    }
    @media(max-width:700px){
        .wrap > ul.all > li{
            flex-direction: column;
            align-items: start;
            gap: 15px;
        }
        .wrap > ul.all > li > .reviewInfo{
            order: -1;
            width: 100%;
        }
        .wrap > ul.all > li > .content{
            border-right: none;
        } 
    }
    @media(max-width:500px){
        nav{
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        nav a{
            width: 100%;
        }
        .wrap > ul.photo{
            grid-template-columns: 1fr;
        }
        .wrap > ul.photo li a{
            border-left: 1px solid #ccc;
        }
        .wrap > ul.photo li a .productName{
            display: none;
        }
        .photoReviewDetail{
            width: 400px;
        }
    }
    @media(max-width:500px){
        .wrap > ul.all > li >.content h3{
            font-size: 20px;
        }

        .photoReviewDetail{
            width: 98%;
        }
    }
`

export const Popup = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    .popupBg{
        width: 100%;
        height: 100%;
        background-color: #00000077;
    }
    img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 10;
        max-width:90%;
        max-height: 90%;
    }
    i{
        position: absolute;
        top: 15px;
        right: 15px;
        color: #fff;
        font-size: 40px;
        z-index: 10;
        cursor: pointer;
    }
`