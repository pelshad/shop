// 장바구니 추가
const addBasket = (product, count) => {
    let arr = product;
    if (localStorage.getItem("basket") !== null) {
        arr.product_count = count;
        let getBasket = JSON.parse(localStorage.getItem("basket"));
        getBasket.push(product);
        localStorage.setItem("basket", JSON.stringify(getBasket));
        alert("장바구니에 등록되었습니다.");
    } else {
        arr.product_count = count;
        localStorage.setItem("basket", JSON.stringify([product]));
        alert("장바구니에 등록되었습니다.");
    }
}

export default addBasket;