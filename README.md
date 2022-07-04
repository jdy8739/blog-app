# blog-app

어떤 프로젝트를 구현하는 것이 좋을까 고민 하던 중 밑의 사진을 보고 사진에서 서술한 기능이 답긴 웹 프로젝트를 구현하고자했습니다.

<img width="962" alt="스크린샷 2022-04-22 오후 2 08 42" src="https://user-images.githubusercontent.com/83811826/177076157-d8740b4f-505a-48d8-9e01-d8c1898e3b3a.png">

기본적인 crud 기능 및 회원가입, 로그인, 좋아요, 페이지네이션, 해시태그, 라이트 or 다크모드 토글 기능을 구현하였으며 사용자 id, 제목, 해시태그로 게시물 찾기 기능을 추가하였고 로그인 시 자신의 게시물과 자신이 '좋아요'를 누른 게시물들을 한 번에 검색 가능하도록 기능을 구현하였습니다.

해당 프로젝트를 구현하기위한 프레임워크로 프론트는 cra typescript를 사용하였으며 백은 Java Springboot를 활용하였습니다.

프론트작업을 수행하기위해 사용한 주요 라이브러리로는 

* axios

* redux-toolkit

* react-hook-form

* react-helmet

* react-cookie

* react-toastify

* framer-motion

* styled-components

등을 사용하였습니다.


axios는 http 통신기능사용과 interceptor를 사용하여 쿠키의 인가정보를 전송하며 인증 및 인가 작업이 제대로 수행되지않았을 시 api서버에서 반환하는

http 상태를 캐치해 그에 맞는 정보를 출력하기위해 사용하였습니다.

상태관리 라이브러리로써는 가장 범용적인 redux-toolkit을 사용하였으며,

회원 가입 시 form 태그에서 쉽게 각 input 태그들을 조작하고 입력오류들을 핸들링할 수 있는 react-hook-form 라이브러리를 사용하였습니다.

또한, html 문서의 제목을 동적으로 제어하기위해 react-helmet을 사용하였으며

사용자의 권한에따라 수행할 수 없는 기능수행 알림 및 인증, 인가에대한 오류 알림은 브라우저의 기본 기능인 alert를 사용하기보다 외부 라이브러리인 react-toast를 사용하였습니다.

react-toast는 미관뿐만아니라 alert의 브라우저 정지로인한 비동기요청의 성능저하를 방지하기위해 사용해보았습니다.

그리고 포스트들을 보여주는 메인페이지 mount, update 시에 framer-motion을 사용하여 새로 로드된 포스트들에 약간의 트랜지션을 부여하였으며

사용자의 선택을 입력받기위해 브라우저의 window confirm 메소드를 사용하기보다 직접 모달 컴포넌트를 만들어 기능을 구현했습니다.


아래는















