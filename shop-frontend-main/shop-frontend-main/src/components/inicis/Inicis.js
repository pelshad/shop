import { ReactInicis } from "components/inicis/dist";

const Inicis = ({ isPurchase, payData }) => {

    //모듈 온오프
    // const [isPurchase, setIsPurchase] = useState(0);

    // 이니시스에 보내줘야하는 데이터
    // setPayData({
    //     productName: orderData.product_name,
    //     buyerName: buyerName,
    //     buyerTel: Number(buyerTel),
    //     buyerEmail: "",
    //     productPrice: Number(orderData.total_price),
    //     payStatus: 0,
    //     returnUrl: "http://localhost:3000/shop-backend/backend/order/ini_orders",
    //     closeUrl: "http://localhost:3000/close",
    // })

    return (
        <ReactInicis payData={payData} isPurchase={isPurchase} isTest />
    )
};

export default Inicis;