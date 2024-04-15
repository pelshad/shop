import styled from "styled-components";

export const Write = styled.div`
    width: 100%;
    max-width: 800px;
    padding: 50px 0px;
    margin: 0 auto;

    h2{
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 50px;
    }

    form{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    form input,form textarea{
        width: 100%;
    }
`
export const Button = styled.div`
    text-align: center;

    button{
        background-color: #444;
        color: #fff;
        padding: 10px 30px;
        margin: 0 5px;
        border-radius: 5px;
        cursor: pointer;
    }
`