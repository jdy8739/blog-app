package com.example.demo.controller;

import com.example.demo.DTO.MemberDTO;
import com.example.demo.service.MemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/member")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class MemberController {

    @Autowired
    MemberService memberService;

    @PostMapping("/signin")
    public ResponseEntity<Void> signin(
            @RequestHeader Map<String, Object> requestHeader,
            @Validated @RequestBody MemberDTO memberDTO) {
        log.info((String) requestHeader.get("token"));
        log.info("signin: " + memberDTO.toString());
        return new ResponseEntity<Void>(HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@Validated @RequestBody MemberDTO memberDTO) {
        log.info("signup: " + memberDTO.toString());
        memberService.saveMember(memberDTO);
        return new ResponseEntity<Void>(HttpStatus.OK);
    }
}
