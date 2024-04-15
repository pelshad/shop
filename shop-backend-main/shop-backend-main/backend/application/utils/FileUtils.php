<?php
function getRandomFileNm($fileName) {
    return gen_uuid_v4() . "." . getExt($fileName);
}

function getExt($fileName) {
    return pathinfo($fileName, PATHINFO_EXTENSION);
}

function gen_uuid_v4() { 
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x'
        , mt_rand(0, 0xffff)
        , mt_rand(0, 0xffff)
        , mt_rand(0, 0xffff)
        , mt_rand(0, 0x0fff) | 0x4000
        , mt_rand(0, 0x3fff) | 0x8000
        , mt_rand(0, 0xffff)
        , mt_rand(0, 0xffff)
        , mt_rand(0, 0xffff) 
    ); 
}

//이미지 파일 생성
function create_img($userId, $folderPath){
    $img_name = $_FILES["img"]["name"]; // $_FILES["포스트된 이미지의 이름"]["name=파일이름?"]
    $last_index = mb_strrpos($img_name, ".");
    $ext = mb_substr($img_name, $last_index);
    $target_filenm = gen_uuid_v4() . $ext;
    $target_full_path = IMG_PATH . "/" . $folderPath . "/" . $userId;
    rmdirAll($target_full_path);
    $oldumask = umask(0);
    if(!is_dir($target_full_path)) {
        mkdir($target_full_path, 0777, true);
    }
    umask($oldumask);
    $imgPath = REQ_IMG_PATH . "/" . $folderPath . "/" . $userId;

    $tmp_img = $_FILES['img']['tmp_name'];
    //파일이동 성공시 true, 실패시 false
    $imageUpload = move_uploaded_file($tmp_img, $target_full_path . "/" .$target_filenm);
    if($imageUpload){
        echo $tmp_img . "---------" . $target_full_path . "----------" .$target_filenm;
        return $target_filenm;
    }else{
        return 'fail';
    }
    
}

//base64기반 이미지 추가
//상품 섬네일
function create_b64_img($id, $b64img, $folderPath){
    $img = $b64img;
    
    $image_parts = explode(";base64,", $img);
    $image_type_aux = explode("image/", $image_parts[0]);
    $image_type = $image_type_aux[1];
    $image_base64 = base64_decode($image_parts[1]);
    $folderPath === "goodsImg"
        ? $imgPath = IMG_PATH. "/" . $folderPath . "/thumbnail/" . $id
        : $imgPath = IMG_PATH. "/" . $folderPath . $id;

    //rmdirAll($imgPath);
    if(!is_dir($imgPath)) {
        mkdir($imgPath, 0777, true);
    }
    $fileNm = uniqid() . "." . $image_type;
    $filePath = $imgPath . "/" . $fileNm;
    $success = file_put_contents($filePath, $image_base64);
    return $fileNm;
}

//에이터 실시간 이미지 등록
function create_b64_detail_img($code, $b64img, $folderPath){
    $img = $b64img;

    $image_parts = explode(";base64,", $img);
    $image_type_aux = explode("image/", $image_parts[0]);
    $image_type = $image_type_aux[1];
    $image_base64 = base64_decode($image_parts[1]);

    $imgPath = IMG_PATH. "/" . $folderPath . "/" .  $code;
    //rmdirAll($imgPath);
    if(!is_dir($imgPath)) {
        mkdir($imgPath, 0777, true);
    }
    $fileNm = uniqid() . ".". $image_type;
    $filePath = $imgPath . "/" . $fileNm;
    $success = file_put_contents($filePath, $image_base64);
    return $fileNm;
}

//기존 이미지 삭제
function rmdirAll($dir) {    
    if(!is_dir($dir)) { return; }
    $dirs = dir($dir);
    while(false !== ($entry = $dirs->read())) {
        if(($entry != '.') && ($entry != '..')) {
            if(is_dir($dir.'/'.$entry)) {
            rmdirAll($dir.'/'.$entry);
            } else {
            @unlink($dir.'/'.$entry);
            }
            }
        }
    $dirs->close();
    @rmdir($dir);
    return TRUE;
}




########## 더미 ##########

// 에러 문구 예시

// $fileName = $_FILES['fileName']['name'];
// $error = $_FILES['fileName']['error'];

// if( $error != UPLOAD_ERR_OK ) {
//   switch( $error ) {
//     case UPLOAD_ERR_INI_SIZE:
//     case UPLOAD_ERR_FORM_SIZE:
//     echo "파일이 너무 큽니다. ($error)";
//     break;
//   case UPLOAD_ERR_NO_FILE:
//   	echo "파일이 첨부되지 않았습니다. ($error)";
//   	break;
//   default:
//   	echo "파일이 제대로 업로드되지 않았습니다. ($error)";
//   }
//   exit;
// }


//실시간 이미지 파일 생성
// function create_img_live($userId, $folderPath, $code){
//     $test = $_FILES;
//     $img_name = $_FILES["uploadImg"]["name"]; // $_FILES["포스트된 이미지의 이름"]["name=파일이름?"]
//     $last_index = mb_strrpos($img_name, ".");
//     $ext = mb_substr($img_name, $last_index);
//     $target_filenm = gen_uuid_v4() . $ext;
//     $target_full_path = IMG_PATH . "/$folderPath/$userId/$code";
    
//     if(!is_dir($target_full_path)) {
//         mkdir($target_full_path, 0777, true);
//     }
//     // $imgPath = REQ_IMG_PATH . "/" . $folderPath . "/" . $userId;

//     $tmp_img = $_FILES['uploadImg']['tmp_name'];
//     $test2 = file_get_contents($tmp_img);
//     $imageUpload = move_uploaded_file($tmp_img, $target_full_path . "/" .$target_filenm); //파일이동 성공시 true, 실패시 false
//     $img_full_path = $target_full_path . "/". $target_filenm;

//     chmod($img_full_path, 0777);
//     $data = base64_encode($test2);
 
//     return $target_filenm;
// }