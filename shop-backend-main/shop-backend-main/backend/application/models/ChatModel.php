<?php
namespace application\models;
use PDO;
use PDOException;

class ChatModel extends Model {
    //chat room 존재여부 확인
    public function sel_admin_room(){
        $sql = "SELECT * FROM chat_room";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch(PDOException $e){
            getPDOException($e);
        }
    }
    //chat room 존재여부 확인
    public function sel_admin_content($param){
        $sql = "SELECT * FROM chat_content
                WHERE CID = :CID";
        try{
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":CID", $param["CID"]);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->updateAdminChatRoom($param, 'Y');
            return $result;
        } catch(PDOException $e){
            getPDOException($e);
        }
    }
    //알림 해제

    //chat room 존재여부 확인
    public function check_room(&$param){
        $sql = "SELECT * FROM chat_room
                WHERE user_id = :user_id";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param["user_id"]);
            $stmt->execute();
            // $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return true;
        } catch(PDOException $e){
            getPDOException($e);
        }
    }
    //chat content 선택
    public function sel_content(&$param){
        $sql = "SELECT * FROM chat_content
                WHERE user_id = :user_id";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param["user_id"]);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch(PDOException $e){
            getPDOException($e);
        }
    }
    //chat room 존재여부 확인
    public function add_room(&$param){
        $sql = "INSERT INTO chat_room
                (
                    user_id, CID
                )
                VALUES
                (
                    :user_id, :CID
                )";
                
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param["user_id"]);
            $stmt->bindValue(":CID", $param["CID"]);
            $stmt->execute();
            $result = $stmt->rowcount();
            return $result;
        } catch(PDOException $e){
            getPDOException($e);
        }
    }
    //room에 chat message 전송
    public function send_message(&$param){
        $sql = "INSERT INTO chat_content
                (
                    user_id, CID, stat, content
                )
                VALUES
                (
                    :user_id, :CID, :stat, :content
                )";
                
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param["user_id"]);
            $stmt->bindValue(":CID", $param["CID"]);
            $stmt->bindValue(":stat", $param["stat"]);
            $stmt->bindValue(":content", $param["content"]);
            $stmt->execute();
            $result = $stmt->rowcount();
            return $result;
        } catch(PDOException $e){
            getPDOException($e);
        }
    }

    //**알림 저장
    public function saveNotification($param){
        $sql = "INSERT INTO notification
                (user_id, content, send_to)
                VALUES
                (:user_id, :content, :send_to)";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":user_id", $param["user_id"]);
            $stmt->bindValue(":content", "message");
            $stmt->bindValue(":send_to", "user");
            $stmt->execute();
            return $stmt->rowcount();
        } catch(PDOException $e){
            getPDOException($e);
        }
    }

    //** 관리자 화면처리
    public function updateAdminChatRoom($param, $check){
        $sql = "UPDATE chat_room 
                SET check_yn = :check_yn
                WHERE CID = :CID";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":CID", $param['CID']);
            $stmt->bindValue(":check_yn", $check);

            $stmt->execute();
        } catch(PDOException $e){
            getPDOException($e);
        }
    }
}