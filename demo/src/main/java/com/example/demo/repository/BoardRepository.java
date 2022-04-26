package com.example.demo.repository;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.sun.jdi.LongValue;

import java.util.LinkedHashMap;
import java.util.Map;

public class BoardRepository {
    private int limit = 10;
    private int offset = 0;
    private int total;
    private Map boardMap;
    private String[] defaultTitles =
            { "test1", "test2", "test3", "test4", "test5" };
    private String[] defaultContents =
            { "content1", "content2", "content3", "content4", "content5" };

    public BoardRepository() {
        boardMap = new LinkedHashMap<Integer, BoardDTO>();

        for(int i=0; i<defaultContents.length; i++) {
            BoardDTO boardDTO =
                    new BoardDTO(Long.valueOf(i), defaultTitles[i], defaultContents[i], null, 0);
            boardMap.put(i, boardDTO);
        }
        total = boardMap.size();
    }

    public BoardWrapperDTO getAll() {
        BoardWrapperDTO boardWrapperDTO =
                new BoardWrapperDTO(total, limit, offset, boardMap);
        return boardWrapperDTO;
    }
}
