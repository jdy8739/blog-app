package com.example.demo.DTO;

import lombok.Getter;

@Getter
public class MemberDTO {
    private String id;
    private String password;
    @Override
    public String toString() {
        return "id: " + this.id + ", password: " + this.password;
    }
};
