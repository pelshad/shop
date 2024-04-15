import React from 'react';
import styled from 'styled-components';

const SubTitle = ({ h2, h3, clickEvent, clickText }) => {
    return (
        <Title className='subTitle'>
            <div>
                <h2>{h2}</h2>
                <h3>{h3}</h3>
            </div>
            {
                clickText !== null
                    ? <div className='new' onClick={clickEvent}>{clickText}</div>
                    : null
            }
        </Title>
    );
};

const Title = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid black;
    padding-bottom: 30px;
    font-weight: bold;
    > div:not(.new){
        display: flex;
        align-items: start;
        flex-direction: column;
    }
    h2{        
        font-size: 24px;
    }
    h3{
        margin-top: 5px;
        font-size: 14px;
        color: gray;
    }
    .new{
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 20px;
        text-align: right;
        cursor: pointer;
        i{
            font-size: 20px;
        }
    }
    @media screen and (max-width: 500px) {
        padding-bottom: 20px;
        .new{
            font-size: 14px;
        }
        h3{
            display: none;
        }
    }
`

export default SubTitle;