package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Setter
@Getter
@AllArgsConstructor
public class BoardWrapperDTO {
    private Integer total;
    private Integer limit;
    private Integer offset;
    private List<BoardDTO> boards;
}
