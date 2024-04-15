// 날짜 00/00/00으로 포멧
const dateFormat = () => {
    const date = new Date();
    const yy = date.getFullYear().toString().substring(2);
    const mm = (("00" + (date.getMonth() + 1)).slice(-2));
    const dd = (("00" + date.getDate()).slice(-2));

    return `${yy}/${mm}/${dd}`;
}

export default dateFormat;