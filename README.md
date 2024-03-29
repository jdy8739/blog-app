# blog-app

어떤 프로젝트를 구현하는 것이 좋을까 고민 하던 중 밑의 사진을 보고 사진에서 서술한 기능이 답긴 웹 프로젝트를 구현하고자했습니다.

<img width="962" alt="스크린샷 2022-04-22 오후 2 08 42" src="https://user-images.githubusercontent.com/83811826/177076157-d8740b4f-505a-48d8-9e01-d8c1898e3b3a.png">

기본적인 CRUD 기능 및 회원가입, 로그인, 좋아요, 페이지네이션, 해시태그, 라이트 or 다크모드 토글 기능을 구현하였으며 사용자 id, 제목, 해시태그로 게시물 찾기 기능을 추가하였고 로그인 시 자신의 게시물과 자신이 '좋아요'를 누른 게시물들을 한 번에 검색 가능하도록 기능을 구현하였습니다.

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


axios는 http 통신기능사용과 interceptor를 사용하여 쿠키의 인가정보를 전송하며 인증 및 인가 작업이 제대로 수행되지않았을 시 api서버에서 반환하는 http 상태를 캐치해 그에 맞는 정보를 출력하기위해 사용하였습니다.

상태관리 라이브러리로써는 가장 범용적인 redux-toolkit을 사용하였으며, 회원 가입 시 form 태그에서 쉽게 각 input 태그들을 조작하고 입력오류들을 핸들링할 수 있는 react-hook-form 라이브러리를 사용하였습니다.

또한, html 문서의 제목을 동적으로 제어하기위해 react-helmet을 사용하였으며 사용자의 권한에따라 수행할 수 없는 기능수행 알림 및 인증, 인가에대한 오류 알림은 브라우저의 기본 기능인 alert를 사용하기보다 외부 라이브러리인 react-toast를 사용하였습니다.

react-toast는 미관뿐만아니라 Bom의 alert 등의 메소드들이 유발하는 컨텍스트 스택의 정지로인한 비동기요청의 성능저하를 방지하기위해 사용해보았습니다.

그리고 포스트들을 보여주는 메인페이지 mount, update 시에 framer-motion을 사용하여 새로 로드된 포스트들에 약간의 트랜지션을 부여하였으며 사용자의 선택을 입력받기위해 브라우저의 window confirm 메소드를 사용하기보다 직접 모달 컴포넌트를 만들어 기능을 구현했습니다.

마지막으로 반응형을 고려하여 타블렛 이하의 크기에는 게시물 목록의 요소들로인한 화면의 가독성 저하를 방지하기위해 미디어 쿼리를 활용하였습니다. 




백엔드에서는 기본적인 Controller, Service, Repository를 구현하였으며 회원가입 시 비밀번호는 Spring security를 사용해 encode하여 저장하였습니다.

또한, 로그인 시 jwt를 사용하여 브라우저의 쿠키에 사용자 id와 토큰을 저장하고,

선별적 접근이 필요한 기능에는 토큰을 서버에 보내어 해당 접근에 발생하는 이슈들을 핸들링하기위해 Controller Advice 클래스를 제작하였습니다.

비즈니스 로직들은 CRUD 및 포스트들이 현재 로그인한 사용자에게 '좋아요'된 요소들인지 판별되어 사용자들에게 보여지도록 구현하였으며,

회원정보와 포스트 저장을 위해서는 데이터베이스를 사용하는것보다 직접 데이터베이스 로직을 만들어보는 것이 좋은 경험이 될 것 같아서

Java에서 제공하는 LikedHashMap, Map, List들의 자료구조를 활용해 저장된 포스트들이 데이터베이스가 아닌 컴퓨터의 메모리에 저장되도록 기능을 만들었습니다.


완성물은 aws의 각 S3, EC2에 배포하였으며 아래의 주소에서 기능을 시험해보실 수 있습니다.

http://my-blog-app-dev-bucket.s3-website.ap-northeast-2.amazonaws.com

감사합니다.