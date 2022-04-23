package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberDTO {
    private String id;
    private String password;
    private String email;

    @Override
    public String toString() {
        return "id: " +
            this.id + ", password: " +
            this.password + ", email: " +
            this.email;
    }
};
