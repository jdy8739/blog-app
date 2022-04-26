package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MemberDTO {
    private String id;
    private String password;
    private String email;
    private String auth;

    @Override
    public String toString() {
        return "id: " +
            this.id + ", password: " +
            this.password + ", email: " +
            this.email + ", auth: " +
            this.auth;
    }
};
