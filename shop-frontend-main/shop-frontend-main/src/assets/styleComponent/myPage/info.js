import styled from "styled-components";


export const Div = styled.div`
display: flex;
justify-content: center;
padding-top: 20px;
`
export const Form = styled.form`
display: flex;
justify-content: center;
align-items: center;
padding: 30px;
flex-direction: column;
border: 1px solid #ddd;
border-radius: 5px;    

>div{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 10px 0px;
    width: 100%;
}

h1{
    font-size: 20px;
    margin-bottom: 20px;
}

input{
    width: 320px;
    line-height: 24px;
}

input[type="button"]{
    border: 1px solid #ddd;
    background-color: #333;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 18px;
    padding: 5px;
    width: 100%;
    height: 40px;
    cursor: pointer;
    font-family: var(--main-font) !important;
    margin-top: 10px;
}

input[type="submit"]{
    border: 1px solid #ddd;
    background-color: #333;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 18px;
    padding: 5px;
    width: 100%;
    height: 40px;
    cursor: pointer;
    font-family: var(--main-font) !important;
    margin-top: 10px;
}

.inputTitle{
    width: 100px;
    font-size: 14px;
}

@media screen and (max-width: 800px) {
    width: 100%;
    padding: 15px 15px;
    > div div:nth-child(2){
        flex: 1;
    }
    input{
        width: 100%;
        line-height: 24px;
    }
    input[type="submit"]{
        font-size: 14px;
        width: 60%;
        height: 40px;
    }
}
`