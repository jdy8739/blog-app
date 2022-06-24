package com.example.demo.repository;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.DTO.ReplyDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;

import javax.swing.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Repository
public class BoardRepository {

    @Autowired
    MemberRepository memberRepository;

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
                    new ArrayList<ReplyDTO>(),
                    false);

            boardMap.put(i, boardDTO);
        }
    }

    private BoardWrapperDTO filterByOffsetAndLimit(
            Integer offset,
            Integer limit,
            LinkedHashMap map) {
        List<BoardDTO> boardList = changeMapToList(map);
        List<BoardDTO> listForClient = new ArrayList<>();

        int from = offset * limit;
        int to = offset * limit + limit;

        int count = 0;
        for(BoardDTO boardDTO : boardList) {
            if(count < to && count >= from) {
                boardDTO.setLiked(false);
                listForClient.add(boardDTO);
                if(count >= to) break;
            }
            count ++;
        }
        int total = boardList.size();
        return new BoardWrapperDTO(total, limit, offset, listForClient);
    }

    private List<BoardDTO> changeMapToList(LinkedHashMap<Integer, BoardDTO> map) {
        List<BoardDTO> listValues
                = new ArrayList<>(map.values());
        Collections.reverse(listValues);
        return listValues;
    }

    public BoardWrapperDTO getPosts(Integer offset, Integer limit) {
        return filterByOffsetAndLimit(offset, limit, (LinkedHashMap) boardMap);
    }

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
            case "favlist" :
                tmpMapResults = getPostsInFavList(keyword);
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

    private LinkedHashMap<Integer, BoardDTO> getPostsInFavList(String id) {
        LinkedHashMap<Integer, BoardDTO> tmpMap = new LinkedHashMap<>();
        List<Integer> favList = memberRepository.getLikedList(id);
        if(favList != null && favList.size() != 0) {
            for(Iterator<BoardDTO> map = boardMap.values().iterator(); map.hasNext();) {
                BoardDTO boardDTO = map.next();
                for(int num : favList) {
                    if(num == boardDTO.getBoardNo().intValue()) {
                        tmpMap.put(num, boardDTO);
                    }
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
        boardDTO.setReplyList(new ArrayList<ReplyDTO>());

        boardMap.put(newPostNo, boardDTO);
    }

    public void deletePost(Integer postNo) {
        boardMap.remove(postNo);
    }

    public void modifyPost(BoardDTO boardDTO) {
        log.info("" + boardDTO.getContent());
        BoardDTO oldBoard = (BoardDTO) boardMap.get(boardDTO.getBoardNo().intValue());
        boardDTO.setReplyList(oldBoard.getReplyList());
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

    public List<ReplyDTO> manipulateReply(ReplyDTO replyDTO, String id) {
        BoardDTO targetBoard = (BoardDTO) boardMap.get(replyDTO.getBoardNo().intValue());
        List<ReplyDTO> targetReplyList = targetBoard.getReplyList();
        Integer replyNo = replyDTO.getReplyNo().intValue();
        int targetCnt = 0;
        for (ReplyDTO reply : targetReplyList) {
            if (reply.getReplyNo().intValue() == replyNo) {
                break;
            }
            targetCnt ++;
        }
        if (targetReplyList.get(targetCnt).getReplier().equals(id)) {
            if (replyDTO.getReply() == null) targetReplyList.remove(targetCnt);
            else targetReplyList.get(targetCnt).setReply(replyDTO.getReply());
        } else throw new HttpClientErrorException(HttpStatus.FORBIDDEN);
        return targetReplyList;
    }

    public void manipulateLikesCount(Integer postNo, boolean isPlus) {
        BoardDTO boardDTO = (BoardDTO) boardMap.get(postNo);
        boardDTO.setNumberOfLikes(
                isPlus ? boardDTO.getNumberOfLikes() + 1 : boardDTO.getNumberOfLikes() - 1);
    }
}

