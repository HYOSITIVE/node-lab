const message = {
  NULL_VALUE: "필요한 값이 없습니다.",
  NOT_FOUND: "존재하지 않는 자원",
  BAD_REQUEST: "잘못된 요청",
  INTERNAL_SERVER_ERROR: "서버 내부 오류",
  NULL_VALUE_TOKEN: "토큰이 없습니다",
  INVALID_TOKEN: "유효한 토큰이 아닙니다",
  INVALID_PASSWORD: "비밀번호 오류",
  DUPLICATED: "중복된 데이터",

  // 유저
  READ_USER_SUCCESS: "유저 조회 성공",
  CREATED_USER_SUCCESS: "유저 생성 성공",
  DELETE_USER_SUCCESS: "유저 삭제 성공",
  UPDATE_USER_SUCCESS: "유저 업데이트 성공",
  SIGNIN_USER_SUCCESS: "유저 로그인 성공",

  // 리뷰
  CREATE_REVIEW_SUCCESS: "리뷰 작성 성공",
  READ_REVIEW_SUCCESS: "리뷰 조회 성공",

  // 영화
  CREATE_MOVIE_SUCCESS: "영화 생성 성공",
  CREATE_MOVIE_COMMENT_SUCCESS: "영화 코멘트 생성 성공",
  READ_MOVIE_SUCCESS: "영화 조회 성공",
  SEARCH_MOVIE_SUCCESS: "영화 검색 성공",

  // 파일
  CREATE_FILE_SUCCESS: "파일 생성 성공",
  GET_STREAM_SUCCESS: "스트림 읽기 성공",
};

export default message;
