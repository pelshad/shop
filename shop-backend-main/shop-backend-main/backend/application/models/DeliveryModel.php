<?php
namespace application\models;
use PDO;
use PDOException;

class DeliveryModel extends Model {
    //주문중 송장번호 없는거 선택
    public function sel_delivery_null(){
        $sql = "SELECT * FROM orders 
                WHERE delivery = '' 
                AND order_complete = 'Y'
                AND status != '취소완료'
                GROUP BY orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    //기본 택배사 확인
    public function sel_default_carrier(){
        $sql = "SELECT * FROM carrier 
                WHERE num = 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    //기본 택배사 수정
    public function default_carrier($param){
        $sql = "UPDATE carrier 
                SET default_carrier = :default_carrier , carrier_name = :carrier_name 
                WHERE num = 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":default_carrier", $param["default_carrier"]);
        $stmt->bindValue(":carrier_name", $param["name"]);
        $stmt->execute();
        return $stmt->rowcount();
    }
    //배송지 불러오기
    public function address_list($param){
        $sql = "SELECT * FROM user_address AS ad
                JOIN user AS us
                ON ad.user_id = us.user_id
                WHERE ad.user_id = :user_id
                AND default_address = 1";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param["user_id"]);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if($result === false){
                $result = "fail";
            }
            return $result;
        } catch(PDOException $e){
            getPDOException($e);
        }
    }

    // 송장번호 업데이트
    public function upd_order_delivery($param){
        $sql = "UPDATE orders 
                SET delivery = :delivery, 
                    carrier = :carrier,
                    status = '배송중'
                WHERE orderCode = :orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":delivery", $param['deliveryNumber']);
        $stmt->bindValue(":carrier", $param['carrier']);
        $stmt->bindValue(":orderCode", $param['orderCode']);
        $stmt->execute();
        return $stmt->rowcount();
    }
    // 송장번호 개별 업데이트
    public function upd_order_each_delivery($param){
        $param = $param;
        $sql = "UPDATE orders 
                SET delivery = :delivery,
                    status = '배송중'
                WHERE orderCode = :orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":delivery", $param['delivery']);
        $stmt->bindValue(":orderCode", $param['orderCode']);
        $stmt->execute();
        return $stmt->rowcount();
    }
    // 배송사 업데이트
    public function upd_order_carrier($param){
        $sql = "UPDATE orders 
                SET carrier = :carrier,
                    status = '배송중'
                WHERE orderCode = :orderCode";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":carrier", $param['carrier']);
        $stmt->bindValue(":orderCode", $param['orderCode']);
        $stmt->execute();
        return $stmt->rowcount();
    }
}