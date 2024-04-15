//상품코드 랜덤5자리/일/연도뒷자리2개/월/시간/분
const createCode = () => {
    const date = new Date();
    const yy = date.getFullYear().toString().substring(2);
    const mm = (("00" + (date.getMonth() + 1)).slice(-2));
    const dd = (("00" + date.getDate()).slice(-2));
    const time = (("00" + date.getHours().toString()).slice(-2)) + (("00" + date.getMinutes().toString()).slice(-2));
    const serialNumber = Math.floor((Math.random() * (99999 - 10000) + 10000));
    return serialNumber + dd + yy + mm + time;
}

export default createCode;