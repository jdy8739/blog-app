package com.example.demo.repository;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.DTO.ReplyDTO;
import lombok.extern.slf4j.Slf4j;

import javax.swing.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
public class BoardRepository {

    static private Map boardMap;

    static private String[] defaultTitles =  {
            "4월. 봄. 일상", "동네 삼겹살 맛집 후기!", "퇴근하고 한 잔", "동창회..ㅋㅋ",
            "출근하는 길에 문뜩", "오늘 주말 하루는",
            "살려줘", "4월 17일 춘천 당일치기 여행!", "ㅇㅔㅎㅠ ㅠㅠ", "빅뱅 신곡 후기는?", "아 배고파",
            "자기전에", "그 때 난 왜 그랬을까???", "피자는 맛있어.", "어제 운동했더니..", "카레만들 때 꿀팁",
            "흠", "그 생각각", "내 취미는", "부산 여행 계획", "오른 주식 종목 공유" };

    static private String[] defaultContents = {
            "content0", "content1", "content2", "content3", "content4", "content5",
            "content11", "content7", "content8", "content9", "content10",
            "content11", "content12", "content13", "content14", "content15",
            "content16", "content17", "content18", "content19", "content20" };

    static private String[] defaultIdArr = { "jdy8739", "hoon1234", "slack9999" };

    static private String[][] defautlHashTags = {
            { "봄날", "일상로그", "데이트" }, { "삼겹살", "맛집", "저녁" }, { "피곤", "맥주" },
            { "친구들", "가락고", "10년만", "또언제보냐" }, {"벌써덥s"}, { "벚꽃", "산책", "석촌호수", "파스타" },
            { "퇴사각" }, { "춘천", "데이트", "벚꽃" }, { "비", "주륵주륵" }, { "빅뱅", "드디어", "추억" },
            { "매운탕", "세꼬치횟집", "포장가능", "소주한잔" }, { "씁쓸", "현타", "내일도파이팅" },
            {  }, { "피자", "휫자", "페퍼로니" }, { "근육통", "여름까지몸만든다" }, { "자취생요리", "카레", "존맛" },
            { "후회" }, { "그리운사람", "보고싶어" }, {"동네아조씨들이랑축구", "끝나고해장국회식ㅋㅋ"},
            { "붓산", "부산", "여행계획", "잠실스벅", "스타벅스" }, { "애플", "ENF", "미국주식", "테슬라" }
    };

    public BoardRepository() {
        boardMap = new LinkedHashMap<Integer, BoardDTO>();

        for(int i=0; i<defaultContents.length; i++) {

            List<String> tmpHashtagList = new ArrayList<>();

            for(String tag : BoardRepository.defautlHashTags[i])
                tmpHashtagList.add(tag);

            BoardDTO boardDTO =
                new BoardDTO(
                    Long.valueOf(i),
                    defaultIdArr[(int)Math.floor(Math.random() * defaultIdArr.length)],
                    defaultTitles[i],
                    defaultContents[i],
                    tmpHashtagList,
                    0,
                    "2022-04-22 05:11",
                    new ArrayList<ReplyDTO>());

            boardMap.put(i, boardDTO);
        }
    }

    private BoardWrapperDTO filterByOffsetAndLimit(Integer offset, Integer limit, LinkedHashMap map) {
        HashMap<Integer, BoardDTO> boardMapForClient = new LinkedHashMap<>();

        int from = offset * limit;
        int to = offset * limit + limit;

        AtomicInteger i = new AtomicInteger();

        map.forEach((key, value) -> {
            if(i.intValue() < to && i.intValue() >= from) {
                boardMapForClient.put((Integer) key, (BoardDTO) value);
            }
            i.getAndIncrement();
        });
        int total = map.size();
        return new BoardWrapperDTO(total, limit, offset, boardMapForClient);
    }

    public BoardWrapperDTO getPosts(Integer offset, Integer limit) {
        return filterByOffsetAndLimit(offset, limit, (LinkedHashMap) boardMap);
    };

    public BoardDTO getPost(Integer postNo) {
        return (BoardDTO) boardMap.get(postNo);
    }

    public BoardWrapperDTO getPostsByKeyword(
            String subject,
            String keyword,
            Integer offset,
            Integer limit) {

        Map<Integer, BoardDTO> tmpMapResults = new LinkedHashMap<>();

        switch (subject) {
            case "title":
                tmpMapResults = getPostsByKeywordTitle(keyword);
                break;
            case "writer":
                tmpMapResults = getPostsByKeywordWriter(keyword);
                break;
            case "hashtag":
                tmpMapResults = getPostsByKeywordHashtag(keyword);
                break;
        }
        return filterByOffsetAndLimit(offset, limit, (LinkedHashMap) tmpMapResults);
    }

    private LinkedHashMap<Integer, BoardDTO> getPostsByKeywordTitle(String keyword) {
        LinkedHashMap<Integer, BoardDTO> tmpMap = new LinkedHashMap<>();
        for(Iterator<BoardDTO> map = boardMap.values().iterator(); map.hasNext();) {
            BoardDTO boardDTO = map.next();
            if(boardDTO.getTitle().contains(keyword)) {
                tmpMap.put(boardDTO.getBoardNo().intValue(), boardDTO);
            }
        }
        return tmpMap;
    }

    private LinkedHashMap<Integer, BoardDTO> getPostsByKeywordWriter(String keyword) {
        LinkedHashMap<Integer, BoardDTO> tmpMap = new LinkedHashMap<>();
        for(Iterator<BoardDTO> map = boardMap.values().iterator(); map.hasNext();) {
            BoardDTO boardDTO = map.next();
            if(boardDTO.getWriter().equals(keyword)) {
                tmpMap.put(boardDTO.getBoardNo().intValue(), boardDTO);
            }
        }
        return tmpMap;
    }

    private LinkedHashMap<Integer, BoardDTO> getPostsByKeywordHashtag(String keyword) {
        LinkedHashMap<Integer, BoardDTO> tmpMap = new LinkedHashMap<>();
        for(Iterator<BoardDTO> map = boardMap.values().iterator(); map.hasNext();) {
            BoardDTO boardDTO = map.next();
            List<String> hashTagList = boardDTO.getHashtags();
            for(int i=0; i<hashTagList.size(); i++) {
                if(hashTagList.get(i).equals(keyword)) {
                    tmpMap.put(boardDTO.getBoardNo().intValue(), boardDTO);
                }
            }
        }
        return tmpMap;
    }

    public void save(BoardDTO boardDTO) {
        Iterator<BoardDTO> iterator = boardMap.values().iterator();
        BoardDTO board = null;
        while(iterator.hasNext()) {
            board = iterator.next();
        }
        Integer newPostNo = board.getBoardNo().intValue() + 1;
        boardDTO.setBoardNo(newPostNo.longValue());

        LocalDateTime now = LocalDateTime.now();
        String formatedNow =
                now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        boardDTO.setRegDate(formatedNow);

        boardMap.put(newPostNo, boardDTO);
    }

    public void deletePost(Integer postNo) {
        boardMap.remove(postNo);
    }

    public void modifyPost(BoardDTO boardDTO) {
        boardMap.put(boardDTO.getBoardNo().intValue(), boardDTO);
    }

    public List<ReplyDTO> saveReply(ReplyDTO replyDTO) {
        BoardDTO targetBoard = (BoardDTO) boardMap.get(replyDTO.getBoardNo().intValue());
        List<ReplyDTO> replyList = targetBoard.getReplyList();
        if(replyList.size() == 0) {
            Integer zero = 0;
            replyDTO.setReplyNo(zero.longValue());
        } else {
            Long lastReplyNo = replyList.get(replyList.size() - 1).getReplyNo();
            replyDTO.setReplyNo(lastReplyNo + 1);
        }
        replyList.add(replyDTO);
        return replyList;
    }

    public List<ReplyDTO> deleteReply(
            Integer postNo, Integer replyNo, String id) throws Exception {
        //log.info(postNo + ", " + replyNo + ", " + id);
        BoardDTO targetBoard = (BoardDTO) boardMap.get(postNo);
        List<ReplyDTO> targetReplyList = targetBoard.getReplyList();
        Integer targetNum = null;
        int cnt = 0;
        for (ReplyDTO replyDTO : targetReplyList) {
            if (replyDTO.getReplyNo().intValue() == replyNo) {
                targetNum = cnt;
                break;
            }
            cnt ++;
        }
        //log.info("cnt: " + cnt);
        if (targetReplyList.get(cnt).getReplier().equals(id)) {
            targetReplyList.remove(cnt);
        } else throw new Exception("AccessDeniedException");
        return targetReplyList;
    }
}

