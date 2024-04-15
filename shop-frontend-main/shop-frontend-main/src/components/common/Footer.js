import React from 'react';
import styled from 'styled-components';
import logo from "assets/images/ft_logo.svg"

const Footer = () => {
    return (
        <Foot>
            <div className="wrap">
                {/* <ul>
                    <li><a href="/">홈</a></li>
                    <li><a href="/pages/brandIntro.php">회사소개</a></li>
                    <li><a href="#">이용약관</a></li>
                    <li><a href="#">개인정보처리방침</a></li>
                </ul> */}

                <div className="content">
                    <div>
                        <img src={logo} alt="" />
                        <span>COSTOMER CENTER</span><br />
                        070-7335-5470 l 평일 9:00 ~ 18:00 / 점심 12:00 ~ 13:00 <br />(토, 일, 공휴일 휴무)
                    </div>
                    <p>
                        상호명 / <b className="b">소소국밥</b > 대표자 / <b>전기철</b>
                        <br className="br" /> 사업자등록번호 / <b>296-06-02692</b>
                        <br className="br" /> 통신판매업신고번호 / <b>제2023-대구수성구-0975호</b>
                        <br /> 고객센터 / <b>070-7335-5470</b> <br className="br" />주소 / <b>대구광역시 수성구 동대구로6길66, 1층</b>
                    </p>
                </div>

                <p>Copyrght ⓒ 2022 Lifehim. All right resevered.</p>
            </div>
        </Foot>
    )
};
const Foot = styled.footer`
    padding: 50px 0px;
    background-color: #f4f4f6;
    ul{
        display: inline-flex;
        align-items: center;
        gap: 30px;
    }
    ul li{}
    ul li a{ 
        font-size: 16px;
    }
    .content{
        padding-bottom: 50px;
        border-bottom: 1px solid #ccc;
    }
    .content > div{
        display: flex;
        align-items: center;
        font-size: 16px;
        margin: 30px 0px;
        color: #797979;
    }
    .content > div br{
        display: none
    }
    .content > div img:nth-child(1){
        width: 150px;
        margin-right: 30px;
    }
    .content > div span{
        background-color: #e2e2e2;
        color: #797979;
        padding: 3px 5px;
        border-radius: 5px;
        margin-right: 10px;
    }
    .content > div img:nth-child(3){
        margin-right: 5px;
    }
    .content > p{
        font-size: 18px;
        line-height: 1.4;
        color: #797979;
    }
    .content > p .br{
        display: none;
    }
    .content > p b{
        margin-right: 20px;
        font-size: 18px;
        line-height: 1.4;
        color: #000;
    }
    .wrap > p{
        color: #797979;
        margin-top: 50px;
    }

    @media(max-width:1000px){
        text-align: center;
        .content > div img:nth-child(1){
            display: block;
            margin: 0 auto;
        }
        .content > div span{
            display: inline-block;
            margin-bottom: 10px;
        }
        .content > div{
            display: inline-block;
            line-height: 1.2;
        }
        .content > p b{
            margin-right: 0px;
        }
        .content > p .b{
            margin-right: 10px;
        }
        .content > p .br{
            display: block;
        }
    }

    @media(max-width:700px){
        ul{
            gap: 15px;
        }
        .content > div br{
            display: block;
        }
    }
`

export default Footer;