import styled from "styled-components";

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 100px 0px;
    min-height: 70vh;
    text-align: center;
    gap:15px;
    i{
        font-size: 70px;
        color: red;
    }

    h2{
        font-size: 26px;
    }

    p{
        font-size: 20px;
        line-height: 1.2;
    }
    
    p span{
        color: red;
        font-size: 20px;
        line-height: 1.4;
    }
`