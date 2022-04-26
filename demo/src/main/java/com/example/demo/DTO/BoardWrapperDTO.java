package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Setter
@AllArgsConstructor
public class BoardWrapperDTO {
    private Integer total;
    private Integer limit;
    private Integer offset;
    private Map boards;
}
