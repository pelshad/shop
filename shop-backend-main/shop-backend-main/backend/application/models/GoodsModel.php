<?php
namespace application\models;
use PDO;
use PDOException;

class GoodsModel extends Model {

    // 수동 상품 정렬 저장
    public function goods_rank_upd($param){
        $rank = $param["goods_rank"];
        $goods_code = $param["goods_code"];
        $cate_code = $param["cate_code"];
        $sql = "INSERT INTO sort_rank
                (cate_code , goods_rank, goods_code)
                VALUES
                (:cate_code, :rank, :goods_code)
                ON DUPLICATE KEY
                UPDATE goods_rank = :dRank";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":cate_code", $param['cate_code']);
            $stmt->bindValue(":rank", $param['goods_rank']);
            $stmt->bindValue(":goods_code", $param['goods_code']);
            $stmt->bindValue(":dRank", $param['goods_rank']);
            $stmt->execute();
            return $stmt->rowcount();
        } catch(PDOException $e){
            getPDOException($e);
        }        
    }

    // 상품 정렬 등록&수정
    public function sort_goods_upd($param){
        $sort_type =$param["sort_type"];
        $direction =$param["direction"];
        $cate_code =$param["cate_code"];
        $sql = "INSERT INTO sort
                (sort_type , direction, cate_code)
                VALUES
                (:sort_type, :direction, :cate_code)
                ON DUPLICATE KEY
                UPDATE sort_type = :dSort, direction = :dDirection";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":sort_type", $param['sort_type']);
            $stmt->bindValue(":direction", $param['direction']);
            $stmt->bindValue(":cate_code", $param['cate_code']);
            $stmt->bindValue(":dSort", $param['sort_type']);
            $stmt->bindValue(":dDirection", $param['direction']);
            $stmt->execute();
        } catch(PDOException $e) {
            return getPDOException($e);
        }
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
        } catch(PDOException $e){
            return getPDOException($e);
        }
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    // 옵션 삭제
    public function del_goods_option($param){
        $sql = "DELETE FROM goods_option 
                WHERE "._GOODS_CODE." = :"._GOODS_CODE."";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":" . _GOODS_CODE, $param);
            $stmt->execute();
        }catch(PDOException $e){
            return getPDOException($e);
        }
        return $stmt->rowcount();
    }

    // 옵션 선택
    public function sel_goods_option($param){
        $sql = "SELECT * FROM goods_option 
                WHERE "._GOODS_CODE." = :"._GOODS_CODE."";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":" . _GOODS_CODE, $param[_GOODS_CODE]);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }  

    // 옵션 등록
    public function ins_goods_option($param){
        $sql = "INSERT INTO goods_option
                ("._GOODS_CODE.", "._OPTION_NAME.", "._OPTION_PRICE.")
                VALUES
                (:" . _GOODS_CODE . ", :"._OPTION_NAME.", :"._OPTION_PRICE.")
                ON DUPLICATE KEY
                UPDATE "._OPTION_PRICE." = VALUES("._OPTION_PRICE.")";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":" . _GOODS_CODE, $param[_GOODS_CODE]);
            $stmt->bindValue(":" . _OPTION_NAME, $param[_OPTION_NAME]);
            $stmt->bindValue(":" . _OPTION_PRICE, $param[_OPTION_PRICE]);        
            $stmt->execute();
            return $stmt->rowcount();
        } catch(PDOException $e){
            return getPDOException($e);
        }
        
    }
    // 카테고리 등록
    public function ins_category($param){
        $array = serialize($param);
        $sql = "INSERT INTO category
                ( num, "._CATE_NAME.")
                VALUES
                (1, :"._CATE_NAME.")
                ON DUPLICATE KEY
                UPDATE "._CATE_NAME." = VALUES("._CATE_NAME.")";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":"._CATE_NAME, $array);
            $stmt->execute();
            return $stmt->rowcount();
        } catch(PDOException $e) {
            return getPDOException($e);
        }
        
    }  

    //카테고리 선택
    public function sel_category(){
        $sql = "SELECT cate FROM category";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch(PDOException $e) {
            return getPDOException($e);
        }
        
    }  
    // 상품 전체 불러오기
    public function sel_goods(){
        $sql = "SELECT * FROM goods order by i_goods desc";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch(PDOException $e) {
            return getPDOException($e);
        }
    }
    // 상품 카테고리 점검용 불러오기
    public function sel_goods_cate($param){
        $cate_code = $param['cate_code'];
        if(strlen($cate_code) === 2){
            $sql = "SELECT * FROM goods 
                    WHERE LEFT(cate_code,2) = $cate_code";
        }else{
            $sql = "SELECT * FROM goods 
                    WHERE cate_code = $cate_code";
        }      
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch(PDOException $e) {
            return getPDOException($e);
        }
    }

    // 상품 수동 정렬 있는지 확인
    public function sel_goods_sort_rank($param){
        $sql = "SELECT * FROM sort_rank 
                WHERE cate_code = :cate_code";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":cate_code", $param['cate_code']);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch(PDOException $e) {
            return getPDOException($e);
        }
    }

    // 관리자 - 상품정렬 설정대로 상품 불러오기
    public function sel_goods_sort($param){
        $cate_code = $param->cate_code;
        $direction = $param->direction;
        $sort_type = $param->sort_type;
        if($sort_type === "goods_rank"){
            $sql = "SELECT A.*, B.goods_rank, B.cate_code AS sort_cate_code 
                    FROM goods AS A 
                    LEFT JOIN sort_rank AS B
                    ON A.goods_code = B.goods_code
                    WHERE B.cate_code = $cate_code
                    ORDER BY $sort_type $direction";
        }else{
            if(strlen($cate_code) === 2){
                $sql = "SELECT * FROM goods 
                        WHERE LEFT(cate_code,2) = $cate_code
                        ORDER BY CONVERT($sort_type,SIGNED) $direction";
            }else{
                $sql = "SELECT * FROM goods 
                        WHERE cate_code = $cate_code
                        ORDER BY CONVERT($sort_type,SIGNED) $direction";
            }
        }
        try{
            $stmt = $this->pdo->prepare($sql);  
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch(PDOException $e) {
            return getPDOException($e);
        }
    }

    public function avg_goods(){
        $sql = "SELECT goods_code, 
                AVG(grade) AS avg_grade, 
                count(grade) AS grade_count 
                FROM review 
                GROUP BY goods_code";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_OBJ);
        } catch(PDOException $e) {
            return getPDOException($e);
        }
    }

    public function ins_goods($param){
        $sql = "INSERT INTO goods
                (
                    "._GOODS_CODE.", "._CATE_CODE.", "._GOODS_NAME.", "._GOODS_PRICE.", "._GOODS_IMG.", "._GOODS_DETAIL.", "._GOODS_STOCK.", "._GOODS_SELL.", "._GOODS_SALE."
                )
                VALUES
                (
                    :" . _GOODS_CODE . ", :" . _CATE_CODE . ", :". _GOODS_NAME .", :"._GOODS_PRICE.", :"._GOODS_IMG.", :"._GOODS_DETAIL.", :"._GOODS_STOCK.", :"._GOODS_SELL.", :"._GOODS_SALE."
                )";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":" . _GOODS_CODE, $param[_GOODS_CODE]);
            $stmt->bindValue(":" . _CATE_CODE, $param[_CATE_CODE]);
            $stmt->bindValue(":" . _GOODS_NAME, $param[_GOODS_NAME]);
            $stmt->bindValue(":" . _GOODS_PRICE, $param[_GOODS_PRICE]);
            $stmt->bindValue(":" . _GOODS_IMG, $param[_GOODS_IMG]);
            $stmt->bindValue(":" . _GOODS_DETAIL, $param[_GOODS_DETAIL]);
            $stmt->bindValue(":" . _GOODS_STOCK, $param[_GOODS_STOCK]);
            $stmt->bindValue(":" . _GOODS_SELL, $param[_GOODS_SELL]);
            $stmt->bindValue(":" . _GOODS_SALE, $param[_GOODS_SALE]);
            $stmt->execute();
            return $stmt->rowcount();
        } catch(PDOException $e) {
            return getPDOException($e);
        }
    }  

    // 실시간 이미지 삽입
    public function ins_imgs($param){
        
        $sql = "INSERT INTO detail_imgs
        (
            "._GOODS_IMG.", get_value
        )
        VALUES
        (
            :"._GOODS_IMG.", :get_value
        )";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":"._GOODS_IMG, $param["img"]);
            $stmt->bindValue(":get_value", $param["get_value"]);
            $stmt->execute();
            return $stmt->rowcount();
        } catch(PDOException $e){
            getPDOException($e);
        }
    }  

    public function sel_imgs($param){
        $sql = "SELECT "._GOODS_IMG." FROM detail_imgs 
                WHERE "._GOODS_IMG." = :"._GOODS_IMG."";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":"._GOODS_IMG, $param);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_OBJ);
        } catch(PDOException $e) {
            getPDOException($e);
        }
        
    }  

    public function sel_imgs_null(){
        $sql = "SELECT get_value FROM detail_imgs 
                WHERE "._GOODS_CODE." is NULL";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }  

    public function sel_detail_img_path($param){
        $sql = "SELECT img_code from ck_img 
                WHERE type_num = :type_num ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":type_num", $param);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);

    }
    public function sel_imgs_code($param){
        $sql = "SELECT goods_img FROM detail_imgs 
                WHERE "._GOODS_CODE." = :"._GOODS_CODE."";
        $stmt = $this->pdo->prepare($sql);        
        $stmt->bindValue(":"._GOODS_CODE, $param);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }  

    public function del_imgs_null(){
        $sql = "DELETE FROM detail_imgs 
                WHERE "._GOODS_CODE." IS NULL";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return 'Delete success : ' . $stmt->rowcount();
    }

    public function del_imgs_code($param){
        $sql = "DELETE FROM detail_imgs 
                WHERE "._GOODS_CODE." = :"._GOODS_CODE."";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":"._GOODS_CODE, $param);
        $stmt->execute();
        return 'Delete success : ' . $stmt->rowcount();
    }

    public function upd_imgs(&$get_value, &$goods_code){
        $sql = "UPDATE detail_imgs SET "._GOODS_CODE." = :"._GOODS_CODE." 
                WHERE get_value = :get_value";
        $stmt = $this->pdo->prepare($sql);        
        $stmt->bindValue(":"._GOODS_CODE, $goods_code);
        $stmt->bindValue(":get_value", $get_value);
        $stmt->execute();
        return 'Update success : ' . $stmt->rowcount();
    }

    public function del_goods($param){
        $sql = "DELETE FROM goods WHERE goods_code = :goods_code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":goods_code", $param["goods_code"]);        
        $stmt->execute();
        $sql = "DELETE FROM ck_img WHERE type_num = :type_num";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":type_num", $param["goods_code"]);
        $stmt->execute();
        $sql = "DELETE FROM goods_option WHERE goods_code = :goods_code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":goods_code", $param["goods_code"]);        
        $stmt->execute();
        return $stmt->rowcount();
    }
    
    public function detail_goods($param){
        $sql = "SELECT * FROM goods
                WHERE goods_code = :goods_code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":goods_code", $param["goods_code"]);        
        $stmt->execute();
        $goods_data = $stmt->fetch(PDO::FETCH_OBJ);
        $sql = "SELECT * FROM goods_option
                WHERE goods_code = :goods_code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":goods_code", $param["goods_code"]);
        $stmt->execute();
        $option_data = $stmt->fetchAll(PDO::FETCH_OBJ);
        $sql = "SELECT goods_code, 
                AVG(grade) AS avg_grade, 
                count(grade) AS grade_count 
                FROM review 
                WHERE goods_code = :goods_code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":goods_code", $param["goods_code"]);
        $stmt->execute();
        $review_data = $stmt->fetch();
        $data = [
            'goods_data' => $goods_data,
            'option_data' => $option_data,
            'review_avg' => $review_data
        ];
        return $data;
    }


    public function upd_goods($param, $old_code_list, $new_code_list){
        foreach($old_code_list as $code){
            $sql = "DELETE FROM ck_img 
                    WHERE img_code = '$code'";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
        }
        foreach($new_code_list as $code){
            $sql = "UPDATE ck_img 
                    SET type_num = :type_num, up_check = 1 
                    WHERE img_code = '$code'";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":type_num", $param["goods_code"]);
            $stmt->execute();
        }
        $this->updOptionByGoodsCode($param["goods_code"],$param['goods_option'], );
        $sql = "UPDATE goods SET 
                cate_code = :cate_code,
                goods_nm = :goods_nm,
                goods_price = :goods_price,
                goods_img = :goods_img,
                goods_detail = :goods_detail,
                goods_stock = :goods_stock,
                goods_sell = :goods_sell,
                goods_sale = :goods_sale
                WHERE goods_code = :goods_code";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":cate_code", $param["cate_code"]);
            $stmt->bindValue(":goods_nm", $param["goods_nm"]);
            $stmt->bindValue(":goods_price", $param["goods_price"]);
            $stmt->bindValue(":goods_img", $param["goods_img"]);
            $stmt->bindValue(":goods_detail", $param["goods_detail"]);
            $stmt->bindValue(":goods_stock", $param["goods_stock"]);
            $stmt->bindValue(":goods_sell", $param["goods_sell"]);
            $stmt->bindValue(":goods_sale", $param["goods_sale"]);
            $stmt->bindValue(":goods_code", $param["goods_code"]);
            $stmt->execute();
            
            return $stmt->rowcount();
        } catch(PDOException $e){
            getPDOException($e);
        }
    }

    private function updOptionByGoodsCode($goodsCode, $optionList){
        if($goodsCode !== null || $goodsCode !== ""){
            $sql = "delete from goods_option where goods_code = :goods_code ";
            try{
                $stmt = $this->pdo->prepare($sql);
                $stmt->bindValue(":goods_code", $goodsCode);
                $stmt->execute();
            } catch(PDOException $e){
                getPDOException($e);
            }
        }
        foreach($optionList as $option){
            $sql = "insert into goods_option
                    (goods_code, option_name, option_price)
                    values
                    (:goods_code, :option_name, :option_price)";
            try{
                $stmt = $this->pdo->prepare($sql);
                $stmt->bindValue(":goods_code", $goodsCode);
                $stmt->bindValue(":option_name", $option['option_name']);
                $stmt->bindValue(":option_price", $option['option_price']);
                $stmt->execute();
            } catch(PDOException $e){
                getPDOException($e);
            }
        }
    }

    public function sel_img_code($param){
        $sql = "SELECT goods_detail,goods_nm,goods_img FROM goods WHERE goods_code = :goods_code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":goods_code", $param);
        $stmt->execute();
        return $stmt->fetch();
    }
    

}
