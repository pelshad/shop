<?php
namespace application\models;
use PDO;
use PDOException;

class EditorModel extends Model {
    // 수동 상품 정렬 저장
    public function goods_rank_upd($param){
        $rank = $param["goods_rank"];
        $goods_code = $param["goods_code"];
        $cate_code = $param["cate_code"];
        $sql = "INSERT INTO sort_rank
                (cate_code , goods_rank, goods_code)
                VALUES
                ('$cate_code', '$rank', '$goods_code')
                ON DUPLICATE KEY
                UPDATE goods_rank = '$rank'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->rowcount();
    }

    // 상품 정렬 불러오기
    public function sort_goods($param){
        $sql = "SELECT * FROM sort
                WHERE cate_code = :cate_code";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":cate_code", $param["cate_code"]);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_OBJ);
        } catch(PDOException $e){
            return getPDOException($e);
        }
    }

    ////등록////
    public function ins_data($type, $param){
        switch($type){
            case "notice":
                if($param["title"] === ""){
                    return "fail";
                }
                $sql = "INSERT INTO $type
                ( user_id, title, content, type_num, create_date )
                VALUES
                ( :user_id, :title, :content, :type_num, :create_date )";
                try {
                    $stmt = $this->pdo->prepare($sql);
                    $stmt->bindValue(":user_id", $param["user_id"]);
                    $stmt->bindValue(":title", $param["title"] );
                    $stmt->bindValue(":content", $param["content"] );
                    $stmt->bindValue(":type_num", $param["type_num"] );
                    $stmt->bindValue(":create_date", $param["create_date"] );
                    $stmt->execute();
                    break;
                } catch(PDOException $e) {
                    return getPDOException($e);
                }
            case "review":
                $sql = "INSERT INTO $type
                ( user_id, title, content, create_date,goods_code, order_code, firstImg, secondImg, grade )
                VALUES
                ( :user_id, :title, :content, :create_date, :goods_code, :order_code, :firstImg, :secondImg, :grade )";
                try{
                    $stmt = $this->pdo->prepare($sql);
                    $stmt->bindValue(":user_id", $param["user_id"]);
                    $stmt->bindValue(":title", $param["title"] );
                    $stmt->bindValue(":content", $param["content"] );
                    $stmt->bindValue(":create_date", $param["create_date"] );
                    $stmt->bindValue(":goods_code", $param["goods_code"]);
                    $stmt->bindValue(":order_code", $param["order_code"]);
                    $stmt->bindValue(":firstImg", $param["firstImg"]);
                    $stmt->bindValue(":secondImg", $param["secondImg"]);
                    $stmt->bindValue(":grade", $param["grade"]);
                    $stmt->execute();
                    $boardModel = new BoardModel();
                    $boardModel->ins_review($param["order_code"], $param["goods_code"]);
                    break;
                } catch(PDOException $e){
                    return getPDOException($e);
                }
            case "product":
                $sql = "INSERT INTO goods
                ( goods_code, cate_code, goods_nm, goods_price, goods_img, goods_detail,
                 goods_stock, goods_sell, goods_sale )
                 VALUES
                ( :goods_code, :cate_code, :goods_nm, :goods_price, :goods_img, :goods_detail,
                :goods_stock, :goods_sell, :goods_sale )";
                try{
                    $stmt = $this->pdo->prepare($sql);
                    $stmt->bindValue("goods_code", $param["goods_code"] );
                    $stmt->bindValue("cate_code", $param["cate_code"] );
                    $stmt->bindValue("goods_nm", $param["goods_nm"] );
                    $stmt->bindValue("goods_price", $param["goods_price"] );
                    $stmt->bindValue("goods_img", $param["goods_img"] );
                    $stmt->bindValue("goods_detail", $param["goods_detail"] );
                    $stmt->bindValue("goods_stock", $param["goods_stock"] );
                    $stmt->bindValue("goods_sell", $param["goods_sell"] );
                    $stmt->bindValue("goods_sale", $param["goods_sale"] );
                    $stmt->execute();
                    break;
                } catch(PDOException $e){
                    return getPDOException($e);
                }
        };
        return $stmt->rowcount();
    }
    public function insert_img_code($code, $type_num){
        $sql = "UPDATE notice 
                SET image_code = '$code'
                WHERE type_num = '$type_num'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->rowCount();
    }
    ////에디터 이미지 관련////
    // 실시간 이미지 삽입
    public function ins_imgs($param){
        $sql = "INSERT INTO ck_img
        ( img_code, img_path, board_type )
        VALUES
        ( :img_code, :img_path, :board_type )";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":img_code", $param["img_code"] );
        $stmt->bindValue(":img_path", $param["img_path"] );
        $stmt->bindValue(":board_type", $param["board_type"] );
        $stmt->execute();
        return $stmt->rowcount();
    }
    // 이미지 불러 오기
    public function sel_imgs($param){
        $sql = "SELECT img_path FROM ck_img
                WHERE img_path = :img_path";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":img_path", $param);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_OBJ);
    }
    // 이미지 검증(에디터에서 남아 있는 이미지만 값 변경)
    public function upd_imgs(&$img_code,$type_num){
        $sql = "UPDATE ck_img
                SET up_check = 1,
                    type_num = '$type_num'
                WHERE img_code = :img_code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":img_code", $img_code);
        $stmt->execute();
        return 'Update success : ' . $stmt->rowcount();
    }
    // 검증 통과 안된 이미지 선택
    public function sel_imgs_null(){
        $sql = "SELECT img_code
                FROM ck_img
                WHERE up_check = 0";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
    // 검증 통과 안된 이미지 삭제
    public function del_imgs_null(){
        $sql = "DELETE FROM ck_img 
                WHERE up_check = 0";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return 'Delete success : ' . $stmt->rowcount();
        }catch(PDOException $e){
            return getPDOException($e);
        }
        
    }

    ////상품////
    // 옵션 등록
    public function ins_goods_option($param){
        $param = $param;
        $sql = "INSERT INTO goods_option
                ( goods_code, option_name, option_price )
                VALUES
                ( :goods_code, :option_name, :option_price )
                ";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":goods_code", $param['goods_code']);
            $stmt->bindValue(":option_name", $param['option_name']);
            $stmt->bindValue(":option_price", $param['option_price']);        
            $stmt->execute();
            return $stmt->rowcount();
        }catch(PDOException $e){
            return getPDOException($e);
        }
    }
    //상품명 불러오기
    public function sel_goods(){
        $sql = "SELECT * FROM goods ORDER BY i_goods desc";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        }catch(PDOException $e){
            return getPDOException($e);
        }
    }
}