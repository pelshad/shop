<?php
namespace application\controllers;
use Exception;

class GoodsController extends Controller {
    
    //상품 수동 정렬 데이터 저장
    public function goods_rank_upd(){
        $json = getJson();
        try {
            $sort_data = [
                "sort_type" => "goods_rank",
                "direction" => "asc",
                "cate_code" => $json["cate_code"]
            ];
            $this->model->sort_goods_upd($sort_data);
            foreach ($json["sorting_data"] as $key => $value) {
                $value['cate_code']= $json["cate_code"];
                $this->model->goods_rank_upd($value);
            }
            return [_RESULT => 'Success'];
        } catch (Exception $e) {
            return [_RESULT => 'Fail'];
        }
    }

    //상품 정렬 설정 저장
    public function sort_goods_upd(){
        $json = getJson();
        $result = $this->model->sort_goods_upd($json);
        if ($result >= 1) {
            return [_RESULT => 'Success'];
        }else if($result === 0){
            return [_RESULT => 'Same'];;
        }
        return [_RESULT => 'Fail'];
    }
    
    //옵션 선택
    public function sel_goods_option(){
        $json = getJson();
        return $this->model->sel_goods_option($json);
    }

    //카테고리 등록
    public function ins_category(){
        $json = getJson();
        if($this->model->ins_category($json)){
            return $this->model->sel_category();
        }
    }

    //카테고리 선택
    public function sel_category(){
        $data = $this->model->sel_category();
        $value = $data[0]->cate;            
        $result = unserialize($value);
        return $result;
    }
    //상품 불러오기
    public function sel_goods(){
        // 프론트에서 값 보내주면 아래걸로 바꿔줘야함
        $json = getJson();
        $data = [];
        $avg_grade = [];
        try {
            if(is_null($json)){
            return "error";
            }
            
            if($json["sort_type"] === "all"){
                $list = $this->model->sel_goods();
            }else{
                // 상품리스트에서 해당 cate_code에 속한 상품있는지 확인
                $is_cate = $this->model->sel_goods_cate($json);
                // 수동정렬에 cate_code 정렬정보 있는지 확인
                $is_sort = $this->model->sel_goods_sort_rank($json);
                if(empty($is_cate)){
                    return "not product";
                }
                // 해당 카테고리 정렬설정 확인
                $sort = $this->model->sort_goods($json);
                if(empty($sort) || empty($is_sort)){
                    $sort = (object) array(
                        'cate_code' => $json['cate_code'],
                        'sort_type' => 'i_goods',
                        'direction' => 'asc'
                    );
                }
                if($json["sort_type"] === "goods_rank" && !empty($is_sort)){
                    $sort->sort_type = "goods_rank";
                    $sort->direction = "asc";
                    $list = $this->model->sel_goods_sort($sort);
                }else{
                    $list = $this->model->sel_goods_sort($sort);
                }
            }
            isFile($list);
            $avg_data = $this->model->avg_goods();
            foreach ($avg_data as $key => $value) {
                $avg_grade[$value->goods_code]['avg_grade'] = $value->avg_grade;
                $avg_grade[$value->goods_code]['grade_count'] = $value->grade_count;
            }
            array_push($data, $list,$avg_grade);
        } catch (Exception $e) {
            return [_RESULT => 'Fail'];
        }
        return $data;
    }
    //상품 등록
    public function ins_goods() {
        $json = getJson();
        //에디터로 이미지 삽입시
        if($_FILES){
            $code = $_GET['imageCode'];
            // 임시 이미지 불러오기
            $b64_data = file_get_contents($_FILES['uploadImg']['tmp_name']);
            $b64 = "data:image/jpeg;base64," . base64_encode($b64_data);
            // 임이 이미지 저장
            $file = create_b64_detail_img($code, $b64 , "goodsImg", "goods_detail");
            // $file = create_img_live(_GOODS_DETAIL, "goodsImg", $code);
            $param = [        
                'img' => _GOODS_DETAIL_PATH . "/$code/$file",
                'get_value' => $code
            ];
            
            if($this->model->ins_imgs($param) === 1 ){
                $data = $this->model->sel_imgs($param['img']);
            }
            return [_RESULT => $data];
        }
        //상품등록할 때
        if($json){
            
            $param = [
                _GOODS_CODE => $json[_GOODS_CODE],
                _CATE_CODE => $json[_CATE_CODE],
                _GOODS_NAME => $json[_GOODS_NAME],
                _GOODS_PRICE => $json[_GOODS_PRICE],
                _GOODS_IMG=> '',
                _GOODS_DETAIL => $json[_GOODS_DETAIL],
                _GOODS_STOCK => $json[_GOODS_STOCK],
                _GOODS_SELL => $json[_GOODS_SELL],
                _GOODS_SALE => $json[_GOODS_SALE]
            ];
            //옵션 값이 있다면 옵션 등록 수행
            $option = $json['goods_option'];
            if($option){
                foreach ($option as $key => $value) {
                    $param2 = [
                        _GOODS_CODE => $json[_GOODS_CODE],
                        _OPTION_NAME => $value[_OPTION_NAME],
                        _OPTION_PRICE => $value[_OPTION_PRICE]
                    ];
                    $this->model->ins_goods_option($param2);
                }                          
            }

            // 썸네일 이미지가 있으면 파일 생성 후 경로와 파일이름 입력
            if($json['goods_img']){
                $path = IMG_PATH . "/goodsImg/thumbnail/" . $json['goods_nm'];
                $result = rmdirAll($path);
                $file = create_b64_img($json['goods_nm'], $json['goods_img'] , "goodsImg");
                $param[_GOODS_IMG]= REQ_IMG_PATH . "/goodsImg/thumbnail/" . $json['goods_nm'] . "/" . $file;
            }

            // 상품명 중복 체크 후 상품 등록 실행
            $goods_data = $this->model->sel_goods();
            if($goods_data){
                $check = check($param, $goods_data,'goods_nm');
                if($check){
                    $ins_result = $this->model->ins_goods($param);
                }else{
                    return "fail";
                }
            }else{
                $ins_result = $this->model->ins_goods($param);
            }
            

            // 이미지 코드는 배열값으로 들어옴
            $code = $json["goods_imageCode"];

            // 상품등록 성공시 detail_imgs 테이블에 코드값 업데이트
            if($ins_result){
                if($code){
                    foreach ($code as $key => $value) {
                        $this->model->upd_imgs($value, $param[_GOODS_CODE]);
                    }                    
                }
            }
            // 코드값이 없는 이미지 파일들 삭제
            $delete_file_code = $this->model->sel_imgs_null();
                foreach ($delete_file_code as $key => $value) {
                    $dir = IMG_PATH . "/goodsImg/goods_detail/" . $value->get_value;
                    rmdirAll($dir);
                }
            // 삭제된 이미지 값 테이블에서 삭제
            $result = $this->model->del_imgs_null();
            return [_RESULT => $ins_result ? "success" : "fail"];
        }
    }
    // 옵션 등록 현재는 무쓸모
    public function ins_goods_option() {
        $json = getJson();
        return [_RESULT => $this->model->ins_goods_option($json)];
    }
    //상품 삭제
    public function del_goods(){
        $json = getJson();
        $del_img_code = $this->model->sel_detail_img_path($json['goods_code']);
        img_del($json['goods_code'], $del_img_code,"delete");
        return [_RESULT => $this->model->del_goods($json)];
    }
    
    //상품 상세 확인
    public function detail_goods(){
        $json = getJson();
        return [_RESULT => $this->model->detail_goods($json)];
    }

    //상품 수정
    public function upd_goods(){
        //PN:goods_name, IC:img_code
        $json = getJson();

        //CK에디터 이미지 대조
        $goodsCode = $json['goods_code'];
        $selOrigin = $this->model->sel_img_code($goodsCode);
        $originIC = $selOrigin['goods_detail'];
        $oldPN = $selOrigin['goods_nm'];
        $newIC = $json['goods_detail'];
        $old_code_list = verifyImgCode($originIC, $newIC);
        $new_code_list = verifyImgCode($newIC, $originIC);
        img_del("", $old_code_list,"edit");

        //썸네일 대조
        //썸네일 이미지 바꼈을때
        if($json['goods_img'] !== $selOrigin['goods_img']){
            $path = IMG_PATH . "/goodsImg/thumbnail/" . $goodsCode;
            rmdirAll($path);
            $file = create_b64_img($goodsCode, $json['goods_img'] , "goodsImg");
            $result= REQ_IMG_PATH . "/goodsImg/thumbnail/" . $goodsCode . "/" . $file;
            $json['goods_img']=$result;}
        
        return [_RESULT => $this->model->upd_goods($json, $old_code_list, $new_code_list)];
    }
}
