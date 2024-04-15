# 라이프힘 쇼핑몰 프로젝트
말굽 버섯을 파는 쇼핑몰 팀프로젝트입니다

## 폴더 구조

```
src
│
├── api 통신 api
├── assets 이미지, 스타일 컴포넌트
├── components 각종 컴포넌트
├── pages 뷰 페이지
├── routers 라우터
└── utils 유틸 함수
```

## 설치
```
npm install axios@1.2.0
```
```
npm install styled-components@5.3.6
```
```
npm install react-router-dom@6.4.3
```
```
npm install nivo/bar@0.80.0
```
```
npm install nivo/line@0.80.0
```
```
npm install nivo/pie@0.80.0
```
```
npm install ckeditor/ckeditor5-build-classic
```
```
npm install react-daum-postcode@3.1.1
```

## 주요기능

### 로그인

<p>
  <img src="https://github.com/koreaCoren/shop-frontend/assets/92096968/7373debe-4831-4bd1-900c-c02f44b7885b" alt="CPT2401012339-1455x960" width="500" height="300">
</p>

<p>
  <img src="https://github.com/koreaCoren/shop-frontend/assets/92096968/916cb751-cbb3-4354-8593-655a30a8ecb1" alt="image" width="500" height="100">
</p>

### 장바구니

<p>
  <img src="https://github.com/koreaCoren/shop-frontend/assets/92096968/a62ea289-c147-411e-b681-9086ada91307" alt="CPT2401012339-1455x960" width="500" height="300">
</p>

장바구니를 세션스토리지로만 관리했으나 장바구니가 등록된상태일때 관리자가 금액을 변경하면 금액이 변동 되지않는게 확인되어

장바구니 담은 상품에 고유번호를 발급하여 장바구니 백엔드에서 관리하는걸로 수정

### 마에페이지 채팅문의

<p>
  <img src="https://github.com/koreaCoren/shop-frontend/assets/92096968/514e5b6c-db2d-4e69-b98e-f39a6c1c8956" alt="CPT2401012339-1455x960" width="500" height="300">
</p>

```
useEffect(() => {
    const interval = setInterval(() => {
        setResIndex(i => i + 1);

        // 채팅중인지 아닌지 체크
        if (chatContentRef.current) {
            if (chatContentRef.current.scrollTop !== chatContentRef.current.scrollHeight - chatContentRef.current.clientHeight) {
                setIsReading(false);
            } else {
                setIsReading(true);
            }
        }

        getMessage({ user_id: sessionStorage.getItem("userId") }, setMessage);
    }, 1000 * 10);

    return () => {
        clearInterval(interval);
    };
}, [])
```

현재 useEffect로 몇초마다 채팅내역을 가져와서 나중에 웹페이지가 느려지는 현상 확인
