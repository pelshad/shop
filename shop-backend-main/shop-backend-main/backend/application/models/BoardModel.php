<?php
namespace application\models;
use PDO;
use PDOException;

class BoardModel extends Model {
    ############
    ####공용####
    ############
    //게시판 리스트
    public function sel_board($param){
        $type = $param["boardType"];
        isset($param["search"] )
            ? $search = $param["search"]
            : $search = "";
        $count = $this->getBoardPage($param, $search, $type);
        $list = $this->getBoardList($param, $search, $type);
        $param = [
            "count" => $count,
            "list" => $list
        ];
        return $param;
    }
    //게시판 페이징
    private function getBoardPage($param, $search, $type){
        $sql = "SELECT ceil(COUNT(i_board)/10) as page_count
                FROM $type
                WHERE del='N'";
                    isset($param["search"]) 
                    ? $sql .= "AND title LIKE '%$search%'" 
                    : "";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $count = $stmt->fetch(PDO::FETCH_ASSOC);
            return $count;
        } catch (PDOException $e){
            return getPDOException($e);
        }
        
    }
    //게시판 리스트
    private function getBoardList($param, $search, $type){
        $n = $param["boardPage"];
        $type === "review"
        ? $sql = "SELECT review.*, goods.goods_nm FROM review
                INNER JOIN goods
                ON review.goods_code = goods.goods_code
                WHERE del='N'"
        : $sql = "SELECT *
                FROM $type
                WHERE del='N'";
                    isset($param["search"]) 
                    ? $sql .= "AND title LIKE '%$search%'
                    ORDER BY i_board DESC
                    LIMIT $n, 10"
                    : $sql .= "ORDER BY i_board DESC
                    LIMIT $n, 10";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $list;
        } catch (PDOException $e) {
            return getPDOException($e);
        }
    }
    //조회수 up
    public function view_up($param){
        $type = $param['boardType'];
        $sql = "UPDATE $type 
                SET view_up = view_up + 1 
                WHERE i_board = :i_board";
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindValue(":i_board", $param["i_board"]);
            $stmt->execute();
            $row = $stmt->rowCount();
            return $row;
        } catch (PDOException $e) {
            return getPDOException($e);
        }
    }

    //상세페이지
    public function detail_board($param){
        $type = $param["boardType"];
        //디테일 정보
        $sql = "SELECT * FROM $type
                WHERE i_board = :i_board";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":i_board", $param["i_board"]);
        $stmt->execute();
        $detail = $stmt->fetch(PDO::FETCH_ASSOC);
        //이전 페이지 정보
        $pre = $this->selNextPrePage("prev", $param);
        //다음페이지 정보
        $next = $this->selNextPrePage("next", $param);
        $param = [
            "pre" => $pre,
            "next" => $next,
            "detail" => $detail
        ];
        return $param;
    }
    //이전 다음 페이지 정보
    private function selNextPrePage($type, $param){
        $boardType = $param["boardType"];
        $i_board = $param["i_board"];
        switch($type){
            case "next":
                $sql = " SELECT MAX(i_board) as i_board, title FROM $boardType WHERE i_board < $i_board and del='n'";
                break;
            case "prev":
                $sql = " SELECT MIN(i_board) as i_board, title FROM $boardType WHERE i_board > $i_board and del='n'";
                break;
        }
        try{
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            return getPDOException($e);
        }
    }

    //게시글 삭제
    public function del_board($param){
        $type = $param['type'];
        $sql = "UPDATE $type
                SET del = 'Y'
                WHERE i_board = :i_board";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":i_board", $param["i_board"]);
        $stmt->execute();
        $row = $stmt->rowCount();
        return $row;
    }

    ############
    ####리뷰####
    ############
    //메인 리뷰 리스트
    public function sel_main_review(){
        $sql = "SELECT left(A.title, 16) AS title, 
                left(A.content,40) AS content, A.firstImg, A.grade, B.goods_img, B.goods_nm
                FROM review AS A
                LEFT JOIN goods AS B 
                ON A.goods_code = B.goods_code 
                ORDER BY create_date DESC, grade DESC LIMIT 4";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    //상품별 리뷰
    public function sel_goods_review($param){
        $sql = "SELECT * FROM review
                WHERE del='N'
                AND goods_code=:goods_code
                ORDER BY i_board DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":goods_code", $param["goodsCode"]);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    //리뷰 작성
    public function ins_review($order_code, $goods_code){
        $sql = "UPDATE orders SET review = 'Y' 
                WHERE orderCode= :order_code 
                AND goods_code = :goods_code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(":order_code", $order_code);
        $stmt->bindValue(":goods_code", $goods_code);
        $stmt->execute();
        return $stmt->rowcount();
    }
}
