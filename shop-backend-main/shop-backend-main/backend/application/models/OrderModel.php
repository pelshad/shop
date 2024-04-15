<?php
namespace application\models;
use PDO;
use PDOException;

class OrderModel extends Model {
    ###############
    #### 공통부####
    ###############
    //주문 불러오기
    public function sel_orders($param){
        isset($param["search"])
            ? $search = $param["search"]
            : $search = "";
        $param["admin"] === false
            ? $user = $param["user_id"]
            : $user = "";
        $count = $this->getOrderPage($param, $search, $user);
        $list = $this->getOrderList($param, $search, $user);
        $param = [
            "count" => $count,
            "list"=> $list
        ];
        return $param;
    }
    //페이징 처리
    private function getOrderPage($param, $search, $user){
        $param["admin"] === false
            ? $user = $param["user_id"]
            : "";
        $sql = "SELECT ceil(COUNT(*)/10) as page_count
                FROM    (SELECT * 
                        FROM orders 
                        WHERE order_complete = 'Y'";
                        $param["admin"] === false
                            ? $sql .= " AND user_id = '$user'"
                            : "";
                        $search !== "" 
                            ? $sql .= " AND orderCode LIKE '%search%'"
                            : "";
        $sql .= " GROUP BY orderCode) as page_count";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $count = $stmt->fetch(PDO::FETCH_ASSOC);
            return $count;
        } catch(PDOException $e){
            return getPDOException($e);
        }
    }
    //주문리스트
    private function getOrderList($param, $search, $user){
        $n = ($param["boardPage"] - 1)*10;
        $sql = "SELECT orderCode, goods_name , SUM(order_pay) AS total_price, 
        SUM(order_count) AS total_count , user_id, buyer_name, order_date, buyer_tel, receiver, delivery, carrier, status, complete
        FROM orders 
        WHERE order_complete = 'Y'";
            $param["admin"] === false
                ? $sql .= " AND user_id = '$user'"
                : "";
            $search !== "" 
                ? $sql .= " AND orderCode LIKE '%$search%'"
                : "";
        $sql .= " GROUP BY orderCode
                ORDER BY order_date DESC
                LIMIT $n, 10";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $list = $stmt->fetchAll(PDO::FETCH_OBJ);
        return $list;
    }

    ##################
    ##### 관리자 #####
    ##################
    //----검색----//
    //관리자용 주문 검색 *사용중인거 맞음?
    public function sel_code_orders($param){
        $sql = "SELECT *
                FROM orders 
                WHERE order_complete = 'Y' AND orderCode = :orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param["orderCode"]);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    //----대시보드----//
    //대시보드 정보 불러오기
    public function sel_dash(){
        $sql = "SELECT 
		(SELECT COUNT(A.orderCode) FROM (SELECT orderCode FROM orders WHERE delivery = '' AND order_complete = 'Y' AND status = '취소완료' GROUP BY orderCode) AS A) AS delivery_not, 
		(SELECT COUNT(B.orderCode) FROM (SELECT orderCode FROM orders WHERE delivery != '' AND order_complete = 'Y' AND complete = 'N' GROUP BY orderCode) AS B) AS delivering,
		(SELECT COUNT(C.orderCode) FROM (SELECT orderCode FROM orders WHERE delivery != '' AND order_complete = 'Y' AND complete = 'Y' GROUP BY orderCode) AS C) AS complete,
		(SELECT COUNT(D.orderCode) FROM (SELECT orderCode FROM orders WHERE order_complete = 'Y' GROUP BY orderCode) AS D) AS input,
        (SELECT COUNT(goods_code) FROM goods WHERE goods_stock = '0') AS shortage,
        (SELECT COUNT(goods_code) FROM goods WHERE (goods_sell - goods_stock) > 10 AND goods_stock != 0) AS warning";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_OBJ);
    }
    //취소/환불된 주문만 불러오기
    public function get_refund_data(){
        $sql = "SELECT * FROM orders 
                WHERE status = '환불요청' OR status = '취소요청'
                ORDER BY status DESC
                ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    //----주문/배송---//
    //주문관리 송장번호 수정
    public function update_invoice($param){
        $sql = "UPDATE orders SET delivery = :invoiceCode
                WHERE orderCode = :orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":invoiceCode", $param["invoiceCode"]);
        $stmt->bindValue(":orderCode", $param["orderCode"]);
        $stmt->execute();
        return $stmt->rowcount();
    }
    // 상품 재고 불러오기
    public function sel_goods_stock($param){
        $sql = "SELECT goods_stock 
                FROM goods 
                WHERE goods_code = :goods_code";
        $stmt = $this->pdo->prepare($sql);  
        $stmt->bindValue(":goods_code", $param["goods_code"]);                
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    // 상품 재고 수정
    public function upd_stock_counting($param){
        $sql = "UPDATE goods 
                SET goods_stock = :goods_stock 
                WHERE goods_code = :goods_code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":i_board", $param["boardNum"]); 
        $stmt->bindValue(":id", $param["userId"]);    
        $stmt->bindValue(":title", $param["title"]);    
        $stmt->bindValue(":ctnt", $param["ctnt"]);                
        $stmt->execute();
        return $stmt->rowcount();
    }
    //엑셀 저장용 데이터 불러오기
    public function admin_orders(){        
        $sql = "SELECT 
                orderCode AS 주문번호, 
                order_complete AS 주문완료, 
                user_id AS 유저ID, 
                gopaymethod AS 결제방식, 
                goods_code AS 상품번호, 
                goods_name AS 상품명, 
                goods_sale AS 할인율, 
                order_pay AS 금액, 
                order_date AS 주문일자, 
                buyer_name AS 구매자, 
                buyer_addr AS 주소, 
                buyer_tel AS 연락처, 
                order_count AS 개수, 
                carrier AS 택배사, 
                delivery AS 송장번호, 
                status AS 취소및환불, 
                receiver AS 받는사람, 
                refund_date AS 취소및환불일자, 
                complete AS 구매확정, 
                review AS 리뷰 
                FROM orders
                WHERE order_complete = 'Y'
                ORDER BY order_date desc";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    ############
    ####유저####
    ############
    //----검색----//
    //유저용 주문 검색
    public function sel_user_code_orders(&$param){
        $sql = "SELECT *, (order_pay-order_pay/(100-goods_sale)*100) AS goods_sale  
                FROM orders 
                WHERE orderCode = :orderCode 
                AND user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param['orderCode']);
        $stmt->bindValue(":user_id", $param['user_id']);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    //유저가 코드로 주문시 그룹화
    public function sel_user_orders_group($param){
        $sql = "SELECT *, 
                SUM(order_pay-order_pay/(100-goods_sale)*100) AS total_sale , 
                SUM(order_pay/(100-goods_sale)*100) AS total_price, 
                SUM(order_count) AS total_count 
                FROM orders 
                WHERE user_id = :user_id 
                AND orderCode = :orderCode 
                AND order_complete = 'Y' 
                GROUP BY orderCode 
                order by order_date desc";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param['orderCode']);
        $stmt->bindValue(":user_id", $param['user_id']);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    // 코드로 이니시스 주문검색
    public function sel_ini_orders($param){
        $sql = "SELECT orderCode, resultCode 
                FROM ini_order 
                WHERE orderCode = :orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param['orderCode']);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    ###############
    ####장바구니####
    ###############
    //장바구니 불러오기
    public function findBasketByUserId($param){
        $sql = "SELECT 
                  b.basket_code as basket_count
                , a.goods_nm as product_name
                , a.goods_price as price
                , a.goods_sale as sale
                , a.goods_code as product_code
                , a.goods_img as product_img
                , b.goods_count as product_count
                , b.option_name as option_name
                , c.option_price as option_price
                FROM basket AS b
                INNER JOIN goods AS a
                ON a.goods_code = b.goods_code
                LEFT JOIN goods_option AS c
                ON b.option_name = c.option_name
                WHERE b.user_id = :user_id";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param['user_id']);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch(PDOException $e){
            return getPDOException($e);
        }
    }
    //장바구니 정보 입력
    public function saveBasket($param){
        $sql = "INSERT INTO basket
                (user_id, goods_code, goods_count, option_name, basket_code)
                VALUES
                (:user_id, :goods_code, :goods_count, :option_name, :basket_code)";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param['user_id']);
            $stmt->bindValue(":goods_code", $param['product_code']);
            $stmt->bindValue(":goods_count", $param['product_count']);
            $stmt->bindValue(":option_name", $param['option']);
            $stmt->bindValue(":basket_code", $param['basket_count']);
            $stmt->execute();
            return "success";
        } catch(PDOException $e){
            return getPDOException($e);
        }
    }

    //장바구니 정보 삭제
    public function deleteBasket($param){
        if(
               $param['basket_count'] === null 
            || $param['basket_count'] === []
            || $param['basket_count'] === ""
            ){
            return getParameterError("E13");
        }
        foreach($param['basket_count'] as $code){
            $sql = "DELETE FROM basket
                    WHERE basket_code = :basket_code";
            try{
                $stmt = $this->pdo->prepare($sql);
                $stmt->bindValue(":basket_code", $code);
                $stmt->execute();
            } catch(PDOException $e) {
                return getPDOException($e);
            }
        }
        return "success";
    }

    ###################
    ####주문상태처리####
    ###################
    //--주문--//

    //적립금 조작한지 체크
    public function complete_orders($param){
        $sql = "UPDATE orders 
                SET complete = 'Y'             
                WHERE orderCode = :order_code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":order_code", $param['order_code']);
        $stmt->execute();
        return $stmt->rowcount();;
    }
    //토스 리턴데이터 저장
    public function ins_tos($param){
        $sql = "INSERT INTO tos_order
                (
                    orderCode, version, mId, paymentKey, lastTransactionKey, orderId, orderName, status, requestedAt, approvedAt, useEscrow, cultureExpense, issuerCode,acquirerCode, number, installmentPlanMonths, isInterestFree, interestPayer, approveNo, useCardPoint, cardType, ownerType, acquireStatus, amount, virtualAccount, transfer, giftCertificate, cashReceipt, cashReceipts, discount, cancels, secret, easyPay_provider, easyPay_amount, easyPay_discountAmount, failure,isPartialCancelable,receipt_url,checkout_url,currency,totalAmount,balanceAmount,suppliedAmount,vat,taxFreeAmount,taxExemptionAmount,method
                )
                VALUES
                (
                    :orderCode, :version, :mId, :paymentKey, :lastTransactionKey, :orderId, :orderName, :status, :requestedAt, :approvedAt, :useEscrow, :cultureExpense, :issuerCode, :acquirerCode, :number, :installmentPlanMonths, :isInterestFree, :interestPayer, :approveNo, :useCardPoint, :cardType, :ownerType, :acquireStatus, :amount, :virtualAccount, :transfer, :giftCertificate, :cashReceipt, :cashReceipts, :discount, :cancels, :secret, :easyPay_provider, :easyPay_amount, :easyPay_discountAmount, :failure, :isPartialCancelable,:receipt_url, :checkout_url, :currency, :totalAmount,:balanceAmount,:suppliedAmount,:vat,:taxFreeAmount,:taxExemptionAmount,:method
                )";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param["orderCode"]);
        $stmt->bindValue(":version", $param["version"]);
        $stmt->bindValue(":mId", $param["mId"]);
        $stmt->bindValue(":paymentKey", $param["paymentKey"]);
        $stmt->bindValue(":lastTransactionKey", $param["lastTransactionKey"]);
        $stmt->bindValue(":orderId", $param["orderId"]);
        $stmt->bindValue(":orderName", $param["orderName"]);
        $stmt->bindValue(":status", $param["status"]);
        $stmt->bindValue(":requestedAt", $param["requestedAt"]);
        $stmt->bindValue(":approvedAt", $param["approvedAt"]);
        $stmt->bindValue(":useEscrow", $param["useEscrow"]);
        $stmt->bindValue(":cultureExpense", $param["cultureExpense"]);
        $stmt->bindValue(":issuerCode", $param["card"]["issuerCode"]);
        $stmt->bindValue(":acquirerCode", $param["card"]["acquirerCode"]);
        $stmt->bindValue(":number", $param["card"]["number"]);
        $stmt->bindValue(":installmentPlanMonths", $param["card"]["installmentPlanMonths"]);
        $stmt->bindValue(":isInterestFree", $param["card"]["isInterestFree"]);
        $stmt->bindValue(":interestPayer", $param["card"]["interestPayer"]);
        $stmt->bindValue(":approveNo", $param["card"]["approveNo"]);
        $stmt->bindValue(":useCardPoint", $param["card"]["useCardPoint"]);
        $stmt->bindValue(":cardType", $param["card"]["cardType"]);
        $stmt->bindValue(":ownerType", $param["card"]["ownerType"]);
        $stmt->bindValue(":acquireStatus", $param["card"]["acquireStatus"]);
        $stmt->bindValue(":amount", $param["card"]["amount"]);
        $stmt->bindValue(":virtualAccount", $param["virtualAccount"]);
        $stmt->bindValue(":transfer", $param["transfer"]);
        $stmt->bindValue(":giftCertificate", $param["giftCertificate"]);
        $stmt->bindValue(":cashReceipt", $param["cashReceipt"]);
        $stmt->bindValue(":cashReceipts", $param["cashReceipts"]);
        $stmt->bindValue(":discount", $param["discount"]);
        $stmt->bindValue(":cancels", $param["cancels"]);
        $stmt->bindValue(":secret", $param["secret"]);
        $stmt->bindValue(":easyPay_provider", $param["easyPay"]["provider"]);
        $stmt->bindValue(":easyPay_amount", $param["easyPay"]["amount"]);
        $stmt->bindValue(":easyPay_discountAmount", $param["easyPay"]["discountAmount"]);
        $stmt->bindValue(":failure", $param["failure"]);
        $stmt->bindValue(":isPartialCancelable", $param["isPartialCancelable"]);
        $stmt->bindValue(":receipt_url", $param["receipt"]["url"]);
        $stmt->bindValue(":checkout_url", $param['checkout']["url"]);
        $stmt->bindValue(":currency", $param['currency']);
        $stmt->bindValue(":totalAmount", $param['totalAmount']);
        $stmt->bindValue(":balanceAmount", $param['balanceAmount']);
        $stmt->bindValue(":suppliedAmount", $param['suppliedAmount']);
        $stmt->bindValue(":vat", $param['vat']);
        $stmt->bindValue(":taxFreeAmount", $param['taxFreeAmount']);
        $stmt->bindValue(":taxExemptionAmount", $param['taxExemptionAmount']);
        $stmt->bindValue(":method", $param['method']);
        $stmt->execute();
        $result = $stmt->rowcount();
        return $result;
    }
    //클라언트단/서버단 가격 체크(장바구니 가격 불일치여부)
    public function checkProductPrice($param){
        foreach($param as $product){
            $cliPrice = intval($product['order_pay']);
            $sql = "SELECT 
                    CAST(goods_price AS INT) - 
                    (CAST(goods_price AS INT) * ((CAST(goods_sale AS INT)) * 0.01)) AS price
                    FROM goods
                    WHERE goods_code = :goods_code";
            try{
                $stmt = $this->pdo->prepare($sql);
                $stmt->bindValue(":goods_code", $product['goods_code']);
                $stmt->execute();
                $serPrice = $stmt->fetch();
                $serPrice = intval(ceil($serPrice['price']/10) * 10);
            } catch(PDOException $e) {
                getPDOException($e);
            }
            if($cliPrice !== $serPrice){
                return "fail";
            }
        }
        return "pass";
    }

    //주문시 데이터 선행 저장
    public function ins_orders($param){
        $sql = "INSERT INTO orders
                (
                    mid, mKey, gopaymethod, orderCode, user_id, goods_code, goods_name, goods_sale, order_pay, buyer_name, buyer_addr, buyer_tel, delivery, order_count, refund, receiver, pay_point, save_point, options
                )
                VALUES
                (
                    :mid, :mKey, :gopaymethod, :orderCode, :user_id, :goods_code, :goods_name, :goods_sale, :order_pay, :buyer_name, :buyer_addr, :buyer_tel, :delivery, :order_count, :refund, :receiver, :pay_point, :save_point, :options
                )";
                try{
                    $stmt = $this->pdo->prepare($sql);
                    $stmt->bindValue(":mid", $param["mid"]);
                    $stmt->bindValue(":mKey", $param["mKey"]);
                    $stmt->bindValue(":gopaymethod", $param["gopaymethod"]);
                    $stmt->bindValue(":orderCode", $param["order_code"]);
                    $stmt->bindValue(":user_id", $param["user_id"]);
                    $stmt->bindValue(":goods_code", $param["goods_code"]);
                    $stmt->bindValue(":goods_name", $param["goods_name"]);
                    $stmt->bindValue(":goods_sale", $param["goods_sale"]);
                    $stmt->bindValue(":order_pay", $param["order_pay"]);
                    $stmt->bindValue(":buyer_name", $param["buyer_name"]);
                    $stmt->bindValue(":buyer_addr", $param["buyer_addr"]);
                    $stmt->bindValue(":buyer_tel", $param["buyer_tel"]);
                    $stmt->bindValue(":delivery", $param["delivery"]);
                    $stmt->bindValue(":order_count", $param["order_count"]);
                    $stmt->bindValue(":refund", $param["refund"]);
                    $stmt->bindValue(":receiver", $param["receiver"]);
                    $stmt->bindValue(":pay_point", $param["pay_point"]);
                    $stmt->bindValue(":save_point", $param["save_point"]);
                    $stmt->bindValue(":options", $param['order_data'][0]['goods_name']);
                    $stmt->execute();
                    $result = $stmt->rowcount();
                    return $result;
                }catch(PDOException $e){
                    $e->getMessage();
                }
        
        // 트랜잭션 테스트
        // $sql = "START TRANSACTION";
        // $stmt = $this->pdo->prepare($sql);
        // $stmt->execute();      
        // $sql = "UPDATE goods 
        //         SET goods_stock = goods_stock - :order_count                
        //         WHERE goods_code = :goods_code";
        // $stmt = $this->pdo->prepare($sql);
        // $stmt->bindValue(":goods_code", $param["goods_code"]);
        // $stmt->bindValue(":order_count", $param["order_count"]);
        // $stmt->execute();
        // $sql = "COMMIT";
        // // $sql = "ROLLBACK";
        // $stmt = $this->pdo->prepare($sql);
        // $stmt->execute();  
    }
    //적립금 조작한지 체크
    public function checkUserPoint($param){
        $sql = "SELECT IF(
                (SELECT user_point FROM user WHERE user_id = :user_id) < :use_point, 'error', 'pass') AS result";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":user_id", $param['user_id']);
        $stmt->bindValue(":use_point", $param['use_point']);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result;
    }
    // 이니시스 결제 리턴값 저장
    public function ins_inisis($param, &$orderCode){
        $sql = "INSERT INTO ini_order
                (
                    orderCode, resultCode, resultMsg, tid, mid, MOID,TotPrice, goodName, payMethod,applDate, applTime, EventCode, buyerName, buyerTel, buyerEmail,custEmail, applNum, CARD_Num, CARD_Interest, CARD_Quota, CARD_Code,CARD_CorpFlag, CARD_CheckFlag, CARD_PRTC_CODE, CARD_BankCode,CARD_SrcCode, CARD_Point, CARD_UsePoint, CARD_CouponPrice,CARD_CouponDiscount, NAVERPOINT_UseFreePoint,NAVERPOINT_CSHRApplYN,NAVERPOINT_CSHRApplAmt,PCO_OrderNo,currency,OrgPrice,ACCT_BankCode,CSHR_ResultCode,CSHR_Type,ACCT_Name,VACT_Num,VACT_BankCode,vactBankName,VACT_Name,VACT_InputName,VACT_Date,VACT_Time,HPP_Num,payDevice,PayOption,OCB_Num,OCB_PayPrice,OCB_SaveApplNum,OCB_PayApplNum,OCB_ApplDate,UPoint_Num,UPoint_usablePoint,UPoint_ApplPrice,UPNT_PayOption,UPNT_SavePrice,UPNT_PayPrice,GSPT_ApplPrice,GSPT_SavePrice,GSPT_PayPrice,CULT_UserID,GAMG_Cnt,GAMG_ApplPrice,GAMG_Num1,GAMG_Price1,TEEN_ApplPrice,TEEN_UserID,TEEN_ApplNum,BCSH_ApplPrice,BCSH_UserID,BCSH_ApplNum,PHNB_Num
                )
                VALUES
                (
                    :orderCode, :resultCode, :resultMsg,:tid,:mid,:MOID,:TotPrice,:goodName,:payMethod,:applDate,:applTime,:EventCode,:buyerName,:buyerTel,:buyerEmail,:custEmail,:applNum,:CARD_Num,:CARD_Interest,:CARD_Quota,:CARD_Code,:CARD_CorpFlag,:CARD_CheckFlag,:CARD_PRTC_CODE,:CARD_BankCode,:CARD_SrcCode,:CARD_Point,:CARD_UsePoint,:CARD_CouponPrice,:CARD_CouponDiscount,:NAVERPOINT_UseFreePoint,:NAVERPOINT_CSHRApplYN,:NAVERPOINT_CSHRApplAmt,:PCO_OrderNo,:currency,:OrgPrice,:ACCT_BankCode,:CSHR_ResultCode,:CSHR_Type,:ACCT_Name,:VACT_Num,:VACT_BankCode,:vactBankName,:VACT_Name,:VACT_InputName,:VACT_Date,:VACT_Time,:HPP_Num,:payDevice,:PayOption,:OCB_Num,:OCB_PayPrice,:OCB_SaveApplNum,:OCB_PayApplNum,:OCB_ApplDate,:UPoint_Num,:UPoint_usablePoint,:UPoint_ApplPrice,:UPNT_PayOption,:UPNT_SavePrice,:UPNT_PayPrice,:GSPT_ApplPrice,:GSPT_SavePrice,:GSPT_PayPrice,:CULT_UserID,:GAMG_Cnt,:GAMG_ApplPrice,:GAMG_Num1,:GAMG_Price1,:TEEN_ApplPrice,:TEEN_UserID,:TEEN_ApplNum,:BCSH_ApplPrice,:BCSH_UserID,:BCSH_ApplNum,:PHNB_Num
                )";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $orderCode);
        $stmt->bindValue(":resultCode", $param["resultCode"]);
        $stmt->bindValue(":resultMsg", $param["resultMsg"]);
        $stmt->bindValue(":tid", $param["tid"]);
        $stmt->bindValue(":mid", $param["mid"]);
        $stmt->bindValue(":MOID", $param["MOID"]);
        $stmt->bindValue(":TotPrice", $param["TotPrice"]);
        $stmt->bindValue(":goodName", $param["goodName"]);
        $stmt->bindValue(":payMethod", $param["payMethod"]);
        $stmt->bindValue(":applDate", $param["applDate"]);
        $stmt->bindValue(":applTime", $param["applTime"]);
        $stmt->bindValue(":EventCode", $param["EventCode"]);
        $stmt->bindValue(":buyerName", $param["buyerName"]);
        $stmt->bindValue(":buyerTel", $param["buyerTel"]);
        $stmt->bindValue(":buyerEmail", $param["buyerEmail"]);
        $stmt->bindValue(":custEmail", $param["custEmail"]);
        $stmt->bindValue(":applNum", $param["applNum"]);
        $stmt->bindValue(":CARD_Num", $param["CARD_Num"]);
        $stmt->bindValue(":CARD_Interest", $param["CARD_Interest"]);
        $stmt->bindValue(":CARD_Quota", $param["CARD_Quota"]);
        $stmt->bindValue(":CARD_Code", $param["CARD_Code"]);
        $stmt->bindValue(":CARD_CorpFlag", $param["CARD_CorpFlag"]);
        $stmt->bindValue(":CARD_CheckFlag", $param["CARD_CheckFlag"]);
        $stmt->bindValue(":CARD_PRTC_CODE", $param["CARD_PRTC_CODE"]);
        $stmt->bindValue(":CARD_BankCode", $param["CARD_BankCode"]);
        $stmt->bindValue(":CARD_SrcCode", $param["CARD_SrcCode"]);
        $stmt->bindValue(":CARD_Point", $param["CARD_Point"]);
        $stmt->bindValue(":CARD_UsePoint", $param["CARD_UsePoint"]);
        $stmt->bindValue(":CARD_CouponPrice", $param["CARD_CouponPrice"]);
        $stmt->bindValue(":CARD_CouponDiscount", $param["CARD_CouponDiscount"]);
        $stmt->bindValue(":NAVERPOINT_UseFreePoint", $param["NAVERPOINT_UseFreePoint"]);
        $stmt->bindValue(":NAVERPOINT_CSHRApplYN", $param["NAVERPOINT_CSHRApplYN"]);
        $stmt->bindValue(":NAVERPOINT_CSHRApplAmt", $param["NAVERPOINT_CSHRApplAmt"]);
        $stmt->bindValue(":PCO_OrderNo", $param["PCO_OrderNo"]);
        $stmt->bindValue(":currency", $param["currency"]);
        $stmt->bindValue(":OrgPrice", $param["OrgPrice"]);
        $stmt->bindValue(":ACCT_BankCode", $param["ACCT_BankCode"]);
        $stmt->bindValue(":CSHR_ResultCode", $param["CSHR_ResultCode"]);
        $stmt->bindValue(":CSHR_Type", $param["CSHR_Type"]);
        $stmt->bindValue(":ACCT_Name", $param["ACCT_Name"]);
        $stmt->bindValue(":VACT_Num", $param["VACT_Num"]);
        $stmt->bindValue(":VACT_BankCode", $param["VACT_BankCode"]);
        $stmt->bindValue(":vactBankName", $param["vactBankName"]);
        $stmt->bindValue(":VACT_Name", $param["VACT_Name"]);
        $stmt->bindValue(":VACT_InputName", $param["VACT_InputName"]);
        $stmt->bindValue(":VACT_Date", $param["VACT_Date"]);
        $stmt->bindValue(":VACT_Time", $param["VACT_Time"]);
        $stmt->bindValue(":HPP_Num", $param["HPP_Num"]);
        $stmt->bindValue(":payDevice", $param["payDevice"]);
        $stmt->bindValue(":PayOption", $param["PayOption"]);
        $stmt->bindValue(":OCB_Num", $param["OCB_Num"]);
        $stmt->bindValue(":OCB_PayPrice", $param["OCB_PayPrice"]);
        $stmt->bindValue(":OCB_SaveApplNum", $param["OCB_SaveApplNum"]);
        $stmt->bindValue(":OCB_PayApplNum", $param["OCB_PayApplNum"]);
        $stmt->bindValue(":OCB_ApplDate", $param["OCB_ApplDate"]);
        $stmt->bindValue(":UPoint_Num", $param["UPoint_Num"]);
        $stmt->bindValue(":UPoint_usablePoint", $param["UPoint_usablePoint"]);
        $stmt->bindValue(":UPoint_ApplPrice", $param["UPoint_ApplPrice"]);
        $stmt->bindValue(":UPNT_PayOption", $param["UPNT_PayOption"]);
        $stmt->bindValue(":UPNT_SavePrice", $param["UPNT_SavePrice"]);
        $stmt->bindValue(":UPNT_PayPrice", $param["UPNT_PayPrice"]);
        $stmt->bindValue(":GSPT_ApplPrice", $param["GSPT_ApplPrice"]);
        $stmt->bindValue(":GSPT_SavePrice", $param["GSPT_SavePrice"]);
        $stmt->bindValue(":GSPT_PayPrice", $param["GSPT_PayPrice"]);
        $stmt->bindValue(":CULT_UserID", $param["CULT_UserID"]);
        $stmt->bindValue(":GAMG_Cnt", $param["GAMG_Cnt"]);
        $stmt->bindValue(":GAMG_ApplPrice", $param["GAMG_ApplPrice"]);
        $stmt->bindValue(":GAMG_Num1", $param["GAMG_Num1"]);
        $stmt->bindValue(":GAMG_Price1", $param["GAMG_Price1"]);
        $stmt->bindValue(":TEEN_ApplPrice", $param["TEEN_ApplPrice"]);
        $stmt->bindValue(":TEEN_UserID", $param["TEEN_UserID"]);
        $stmt->bindValue(":TEEN_ApplNum", $param["TEEN_ApplNum"]);
        $stmt->bindValue(":BCSH_ApplPrice", $param["BCSH_ApplPrice"]);
        $stmt->bindValue(":BCSH_UserID", $param["BCSH_UserID"]);
        $stmt->bindValue(":BCSH_ApplNum", $param["BCSH_ApplNum"]);
        $stmt->bindValue(":PHNB_Num", $param["PHNB_Num"]);

        $stmt->execute();
        return $stmt->rowcount();
    }
    //결제 성공시
    //결제완료 확인 및 업데이트
    public function upd_order_complete($param){
        //결제 완료 처리
        $this->completeOrder($param);
        //구매한 상품 재고 빼기
        $this->calcStock($param);
        //적립금 체크 및 업데이트
        $pointCheck = $this->checkPoint($param);
        $this->deductionPoint($pointCheck['user_id'],$pointCheck['pay_point']);
        //일일 구매 금액 합산
        $this->calcDailyPay($param);
        return "ok";
    }
    //결제 완료 처리
    private function completeOrder($param){
        $sql = "UPDATE orders
                SET order_complete = 'Y', status = '결제완료'
                WHERE orderCode = :orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param);
        $stmt->execute();
    }
    //결제 상품 재고 계산
    private function calcStock($param){
        $sql = "UPDATE goods AS b
                INNER JOIN (
                SELECT goods_code, order_count 
                FROM orders 
                WHERE orderCode = :orderCode) AS a
                ON a.goods_code = b.goods_code
                SET b.goods_stock = b.goods_stock - a.order_count";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param);
        $stmt->execute();
    }
    //일일 구매에 합산
    private function calcDailyPay($param){
        $sql = "UPDATE data_list 
                SET total_pay = total_pay + 
                    (SELECT order_pay
                    FROM orders
                    WHERE orderCode = :orderCode)
                    WHERE data_date = CURRENT_DATE()";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param);
        $stmt->execute();
    }

    //결제 실패시
    public function upd_order_fail($param){
        $sql = "UPDATE orders
                SET order_complete = 'N', status = '결제실패'
                WHERE orderCode = :orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param);
        $stmt->execute();
        return $stmt->rowcount();
    }

    //--구매 확정--//
    //구매 확정
    public function recognize_order($param){
        $sql = "UPDATE orders 
                SET status = '구매확정'
                WHERE orderCode = :orderCode";
        $stmt=$this->pdo->prepare($sql);
        $stmt->bindValue("orderCode", $param["orderCode"]);
        $stmt->execute();
        $pointCheck = $this->checkPoint($param['orderCode']);
        $this->savePoint($pointCheck['user_id'],$pointCheck['save_point']);
        return $stmt->rowcount();
    }
    
    //--취소--//
    //주문취소(배송 시작 X) or 관리자 취소 승인
    public function cancel_order($param){
        $sql = "SELECT tid 
                from ini_order 
                WHERE orderCode = :orderCode";
        $stmt= $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param["orderCode"]);
        $stmt->execute();
        $tid = $stmt->fetch();
        $tid = $tid[0];
        $RefundResult = Refund($tid);
        if($RefundResult['resultCode'] === "00"){
            $param = [
                "orderCode" => $param["orderCode"],
                "time" => $RefundResult["cancelDate"] . $RefundResult["cancelTime"],
            ];
            $result = $this->update_cancel_data($param);
        } else {
            $result = getPaymentError("E21");
            $result['msg'] .= $RefundResult["resultCode"];
            return $result;
        }
        return $result;
    }
    //주문취소 요청(배송 준비중 or 배송시작 O)
    public function req_cancel_order($param){
        $sql = "UPDATE orders 
                SET status = '취소요청'
                WHERE orderCode = :orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param['orderCode']);
        $stmt->execute();
        return  $stmt->rowcount();
    }
    //취소 처리시 상태 업데이트
    private function update_cancel_data($param){
        $sql = "UPDATE orders 
                SET status = '취소완료', refund_date = :refund_date
                WHERE orderCode = :orderCode";
        $stmt= $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param['orderCode']);
        $stmt->bindValue(":refund_date", $param['time']);
        $stmt->execute();
        //적립금 돌려줌
        $pointCheck = $this->checkPoint($param['orderCode']);
        $this->savePoint($pointCheck['user_id'],$pointCheck['pay_point']);
        $orderData = $this->findOrdersByOrderCode($param["orderCode"]);
        $this->saveNotification($orderData, "주문번호 ".  $param["orderCode"]." 대한 취소요청이 승인되었습니다.", "user");
        return $stmt->rowcount();
    }
    //취소 거절 시 상태 업데이트
    public function refues_cancel_order($param){
        $sql = "UPDATE orders
                SET status = '취소거절'
                WHERE orderCode = :orderCode";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":orderCode", $param["orderCode"]);
            $stmt->execute();
            if($stmt->rowcount()){
                $orderData = $this->findOrdersByOrderCode($param["orderCode"]);
                $this->saveNotification($orderData, "주문번호 ".  $param["orderCode"]." 대한 취소요청이 거절되었습니다.", "user");
                return $stmt->rowcount();
            }
            return getDBError("E12");
        } catch (PDOException $e) {
            return getPDOException($e);
        }
    }

    //--환불--//
    //고객 환불 요청
    public function refund_order($param){
        $sql = "UPDATE orders
                SET status = '환불요청'
                WHERE orderCode = :orderCode";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":orderCode", $param['orderCode']);
            $stmt->execute();
            if($stmt->rowcount()){
                
                return $stmt->rowcount();
            }
            return getDBError("E12");
        } catch (PDOException $e) {
            return getPDOException($e);
        }
    }
    //관리자 환불 요청 승인
    public function refund_complete($param){
        $sql = "UPDATE orders
                SET status = '환불완료'
                WHERE orderCode = :orderCode";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":orderCode", $param['orderCode']);
            $stmt->execute();

            //구매 적립금 회수 및 사용 적립금 리턴 
            $pointCheck = $this->checkPoint($param['orderCode']);
            $this->savePoint($pointCheck['user_id'],$pointCheck['pay_point']);
            $this->deductionPoint($pointCheck['user_id'],$pointCheck['save_point']);


            $orderData = $this->findOrdersByOrderCode($param["orderCode"]);
            $this->saveNotification($orderData, "주문번호 ".  $param["orderCode"]." 대한 환불요청이 승인되었습니다.", "user");
            return $stmt->rowcount();
        } catch(PDOException $e){
            return getPDOException($e);
        }
    }
    //관리자 환불 거절
    public function refund_refuse($param){
        $sql = "UPDATE orders
                SET status = '환불거절'
                WHERE orderCode = :orderCode";
        try{
            $stmt=$this->pdo->prepare($sql);
            $stmt->bindValue(':orderCode', $param['orderCode']);
            $stmt->execute();
            if($stmt->rowcount()){
                $orderData = $this->findOrdersByOrderCode($param["orderCode"]);
                $this->saveNotification($orderData, "주문번호 ".  $param["orderCode"]." 대한 환불요청이 거절되었습니다.", "user");
                return $stmt->rowcount();
            }
            return getDBError("E12");
        } catch(PDOException $e) {
            return getPDOException($e);
        }
    }

    //--반품--//
    //고객 반품 요청
    public function return_order($param){
        $sql = "UPDATE orders
                SET status = '반품요청'
                WHERE orderCode = :orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param['orderCode']);
        $stmt->execute();
        return $stmt->rowcount();
    }
    //관리자 반품 요청 승인
    public function return_complete($param){
        $sql = "UPDATE orders
                SET status = '반품완료'
                WHERE orderCode = :orderCode";
        $stmt=$this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $param['orderCode']);
        $stmt->execute();
        return $stmt->rowcount();
    }

    
    //--**취소, 환불 처리시 유저한테 알림 저장--//
    private function saveNotification($param, String $content, String $sendTo){
        $sql = "INSERT into notification
                (user_id, content, send_to, status, orderCode, goods_code)
                VALUES
                (:user_id, :content, :send_to, :status, :orderCode, :goods_code)";
        try{
            $stmt=$this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param['user_id']);
            $stmt->bindValue(":content", $content);
            $stmt->bindValue("send_to", $sendTo);
            $stmt->bindValue("status", $param['status']);
            $stmt->bindValue("orderCode", $param['orderCode']);
            $stmt->bindValue("goods_code", $param['goods_code']);
            $stmt->execute();
            if($stmt->rowcount()){
                return $stmt->rowcount();
            }
            return getDBError("E12");
        } catch(PDOException $e){
            return getPDOException($e);
        }
    }
    private function findOrdersByOrderCode(String $orderCode){
        $sql = "SELECT * 
                from orders 
                where orderCode = :orderCode";
        try{
            $stmt=$this->pdo->prepare($sql);
            $stmt->bindValue("orderCode", $orderCode);
            $stmt->execute();
            return $stmt->fetch();
        } catch(PDOException $e){
            return getPDOException($e);
        }
    }

    //--적립금--//
    //적립금 확인
    private function checkPoint($orderCode){
        $sql = "SELECT user_id, pay_point, save_point
                FROM orders 
                WHERE orderCode = :orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":orderCode", $orderCode);
        $stmt->execute();
        return $stmt->fetch();
    }
    //**적립금 추가
    private function savePoint($user_id, $pointType){
        $sql = "UPDATE user
                SET user_point = user_point + :pointType
                WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":pointType", $pointType);
        $stmt->bindValue(":user_id", $user_id);
        $stmt->execute();
    }
    //**적립금 차감
    private function deductionPoint($user_id, $pointType){
        $sql = "UPDATE user
                SET user_point = user_point - :pointType
                WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":pointType", $pointType);
        $stmt->bindValue(":user_id", $user_id);
        $stmt->execute();
    }

}