<?php
namespace application\models;
use PDO;
use PDOException;

class NotificationModel extends Model {
    //유저 알림 리스트
    public function NotifyToUser($param){
        $sql = "SELECT *
                from notification 
                WHERE user_id = :user_id
                ORDER BY NID desc";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param['user_id']);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_OBJ);
            return $result;
        } catch(PDOException $e){
            getPDOException($e);
        }
    }
    //유저 알림 확인시 확인 여부 변경
    public function checkNotification($param){
        $sql = "UPDATE notification
                SET check_yn = 'Y'
                WHERE user_id = :user_id";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param['user_id']);
            $stmt->execute();
            return $stmt->rowcount();
        } catch(PDOException $e){
            return getPDOException($e);
        }
    }

}