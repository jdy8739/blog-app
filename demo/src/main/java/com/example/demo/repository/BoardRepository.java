package com.example.demo.repository;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

public class BoardRepository {
    private int limit = 5;
    private int offset = 0;
    private int total;
    private Map boardMap;
    private String[] defaultTitles =  {
            "test0", "test1", "test2", "test3", "test4", "test5",
            "test6", "test7", "test8", "test9", "test10",
            "test11", "test12", "test13", "test14", "test15",
            "test16", "test17", "test18", "test19", "test20" };
    private String[] defaultContents = {
            "content0", "content1", "content2", "content3", "content4", "content5",
            "content11", "content7", "content8", "content9", "content10",
            "content11", "content12", "content13", "content14", "content15",
            "content16", "content17", "content18", "content19", "content20" };
    private String[] defautlHashTags = { "tag1", "tag2", "tag3" };

    public BoardRepository() {
        boardMap = new LinkedHashMap<Integer, BoardDTO>();

        for(int i=0; i<defaultContents.length; i++) {
            BoardDTO boardDTO =
                new BoardDTO(
                    Long.valueOf(i),
                    "jdy8739",
                    defaultTitles[i],
                    defaultContents[i],
                    defautlHashTags,
                    0,
                    "2022-04-22 05:11");

            boardMap.put(i, boardDTO);
        }
        total = boardMap.size();
    }

    public BoardWrapperDTO getPosts(Integer offset, Integer limit) {

        HashMap<Integer, BoardDTO> boardMapForClient = new LinkedHashMap<>();

        int from = offset * limit;
        int to = offset * limit + limit;

        AtomicInteger i = new AtomicInteger();
        boardMap.forEach((key, value) -> {
            if(i.intValue() < to && i.intValue() >= from) {
                boardMapForClient.put((Integer) key, (BoardDTO) value);
            }
            i.getAndIncrement();
        });

        return new BoardWrapperDTO(total, limit, offset, boardMapForClient);
    }

    public BoardDTO getPost(Integer postNo) {
        return (BoardDTO) boardMap.get(postNo);
    }
}
