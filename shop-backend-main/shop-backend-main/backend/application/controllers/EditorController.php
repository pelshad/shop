<?php
namespace application\controllers;

class EditorController extends Controller {
    public function ins_editor_data(){
        
        //// 에디터로 등록한 이미지 임시 저장 ////
        if($_FILES){
            $type = $_GET['type'];
            $code = $_GET['imageCode'];
            $b64_data = file_get_contents($_FILES['uploadImg']['tmp_name']);
            $b64 = "data:image/jpeg;base64," . base64_encode($b64_data);
            $file = create_b64_detail_img($code, $b64 , $type);
            $param = [
                'img_path' => REQ_IMG_PATH . "/$type/$code/$file",
                'img_code' => $code,
                'board_type' => $type
            ];
            if($this->model->ins_imgs($param) === 1 ){
                $data = $this->model->sel_imgs($param['img_path']);
            }
            return [_RESULT => $data];
        }
        
        $json = getEncryptedData();
        //// 등록 버튼을 눌렀을때 ////
        // $json = getJson();
        $param = $json;
        if($json){
            $type = $json['type'];
            switch($type){
                //공지사항
                case "notice":
                    $param = [
                        "title" => $json['title'],
                        "content" => $json['content'],
                        "type_num" => $json['code'],
                        "create_date" => $json['date'],
                        "user_id" => $json['user_id']
                    ];
                $ins_result = $this->model->ins_data($type, $param);
                $type_num = $json['code'];
                break;
                //리뷰
                case "review":
                    if ($json['firstImage'] || $json['secondImage']) {
                        $path = IMG_PATH . "/review/{$json['user_id']}/{$json['order_code']}/{$json['goods_code']}";
                        rmdirAll($path);
                        foreach (['firstImage', 'secondImage'] as $imageKey) {
                            if (!empty($json[$imageKey])) {
                                $folderPath = "/review/{$json['user_id']}/{$json['order_code']}/";
                                $file = create_b64_img($json['goods_code'], $json[$imageKey], $folderPath);
                                $json[$imageKey] = REQ_IMG_PATH . "/review/{$json['user_id']}/{$json['order_code']}/{$json['goods_code']}/{$file}";
                            }
                        }
                    }

                    $param = [
                        "title" => $json['title'],
                        "content" => $json['content'],
                        "type_num" => $json['code'],
                        "create_date" => $json['date'],
                        "user_id" => $json['user_id'],
                        "order_code" => $json['order_code'],
                        "goods_code" => $json['goods_code'],
                        "firstImg" => $json['firstImage'],
                        "secondImg" => $json['secondImage'],
                        "grade" => $json['grade'],
                    ];
                $ins_result = $this->model->ins_data($type, $param);
                $type_num = $json['code'];
                return [_RESULT => "success"];
                break;
                
                //상품등록
                case "product":
                    $param = [
                        "goods_code" => $json['goods_code'],
                        "cate_code" => $json['cate_code'],
                        "goods_nm" => $json['goods_nm'],
                        "goods_price" => $json['goods_price'],
                        "goods_img"=> '',
                        "goods_detail" => $json['goods_detail'],
                        "goods_stock" => $json['goods_stock'],
                        "goods_sell" => $json['goods_sell'],
                        "goods_sale" => $json['goods_sale']
                    ];

                    //옵션 값이 있다면 옵션 등록 수행
                    $option = $json['goods_option'];
                    if($option){
                        foreach ($option as $key => $value) {
                        $param2 = [
                            "goods_code" => $json['goods_code'],
                            "option_name" => $value['option_name'],
                            "option_price" => $value['option_price']
                        ];
                        $this->model->ins_goods_option($param2);
                        }                         
                    }
                    // 썸네일 이미지가 있으면 파일 생성 후 경로와 파일이름 입력
                    if($json['goods_img']){
                        $path = IMG_PATH . "/goodsImg/thumbnail/" . $json['goods_code'];
                        $result = rmdirAll($path);
                        $file = create_b64_img($json['goods_code'], $json['goods_img'], "goodsImg");
                        $param['goods_img']= REQ_IMG_PATH . "/goodsImg/thumbnail/" . $json['goods_code'] . "/" . $file;
                    }

                    // 수동정렬 값 존재여부 확인 후 삽입
                    $is_sort = $this->model->sort_goods($param);
                    if(empty($is_sort)){
                        $param['goods_rank'] = 'N';
                        $this->model->goods_rank_upd($param);
                    }

                    // 상품명 중복 체크 후 상품 등록 실행
                    $goods_data = $this->model->sel_goods();
                    if($goods_data){
                        $check = check($param, $goods_data,'goods_nm');
                        if($check){
                            $ins_result = $this->model->ins_data($type, $param);
                        }else{
                            return getDBError("E14");
                        }
                    }else{
                        $ins_result = $this->model->ins_data($type, $param);
                    }
                    $type_num = $json['goods_code'];
                    break;
            }
            
            // 게시물 등록시 있는 이미지 코드
            $code = $json["image_code"];
            if($type === "notice"){
                $this->model->insert_img_code(serialize($code), $type_num);
            }

            // 게시물 등록시 있는 이미지 코드는 check 값 1로 변경
            if($ins_result){
                if($code){
                    foreach ($code as $key => $value) {
                        $this->model->upd_imgs($value, $type_num);
                    }
                }
            }

            // check 0인 이미지 코드 파일 삭제
            $delete_file_code = $this->model->sel_imgs_null();
            foreach ($delete_file_code as $key => $value) {
                $dir = IMG_PATH . "/" . $type . "/". $value->img_code;
                rmdirAll($dir);
            }

            // check 0인 이미지 코드 레코드 삭제
            $result = $this->model->del_imgs_null();
            $ins_result ? "success" : "fail";
            return [_RESULT => $ins_result ? "success" : "fail"];
        }
    }
}