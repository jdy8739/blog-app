package com.example.demo.controller;

import com.example.demo.DTO.MemberDTO;
import com.example.demo.security.JWT;
import com.example.demo.service.MemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Controller
@RequestMapping("/member")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class MemberController {

    @Autowired
    MemberService memberService;

    JWT jwt = new JWT();

    @PostMapping("/signin")
    public ResponseEntity<String> signin(@Validated @RequestBody MemberDTO memberDTO) {
        log.info("signin: " + memberDTO.toString());
        String token = "";
        if(memberService.login(memberDTO)) {
            try {
                token = jwt.makeJwtToken(memberDTO.getId());
            } catch (ClassNotFoundException classNotFoundException) {
                token = "???";
            }
        }
        return new ResponseEntity<String>(token, HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@Validated @RequestBody MemberDTO memberDTO) {
        log.info("signup: " + memberDTO.toString());
        memberService.saveMember(memberDTO);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }
}
