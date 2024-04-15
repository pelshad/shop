<?php
namespace application\models;
use PDO;
use PDOException;

class DataModel extends Model {

    public function sel_user_count(){
        $sql = "SELECT data_date as x, total_user as y FROM data_list";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    public function upd_user_count(){
        $sql = "UPDATE data_list 
                SET total_user = 
                (SELECT SUM(count) FROM user_count WHERE access_date = CURRENT_DATE())        
                WHERE data_date = CURRENT_DATE()";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->rowcount();
    }

    public function user_count($param){
        $sql = "INSERT INTO user_count
                (access_ip)
                VALUES
                (:ip)
                ON DUPLICATE KEY
                UPDATE count = count+1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":ip", $param["access_ip"]);
        $stmt->execute();
        return $stmt->rowcount();
    }

    public function sell_data_list(){
        $sql = "SELECT 
                total_pay as '일 판매 금액',
                replace(substring(data_date, 6, 5), '-', '/') as date
                FROM data_list";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    public function cumulative_sales(){
        $sql = "SELECT goods_name as id,
                goods_name as label,
                count(goods_name) as 'value'
                FROM orders
                WHERE status = '구매확정'
                GROUP BY goods_name
                limit 5";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

}