import styled from "styled-components";

export const Content = styled.ul`
    display: flex;
    flex-direction: column;
    
    li{
        display: flex;
        align-items: center;
        gap: 5px;
        line-height: 25px;
        padding: 10px 5px;
        border-bottom: 1px solid #eee;
    }

    input{
        width: 200px;
        padding: 0px 5px;
        line-height: 25px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    button{
        line-height: 25px;
        background-color: #1a6dff;
        color: #fff;
        padding: 0px 15px;
        border-radius: 5px;
        cursor: pointer;
    }
    .select{
        position: relative;
    }
    .select select{
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 5px;
    }
    .select i{
        position: absolute;
        top: 40%;
        right: 7px;
        transform: translateY(-50%);
    }
`