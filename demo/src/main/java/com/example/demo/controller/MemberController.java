package com.example.demo.controller;

import com.example.demo.DTO.MemberDTO;
import com.example.demo.service.MemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/member")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class MemberController {

    @Autowired
    MemberService memberService;

    private HttpSession session;

    @PostMapping("/signin")
    public ResponseEntity<Void> signin(
            @Validated @RequestBody MemberDTO memberDTO,
            HttpServletRequest req) {
        String auth = req.getHeader("authorization");
        log.info(auth);
        log.info("signin: " + memberDTO.toString());

        if (!memberService.login(memberDTO))
            return new ResponseEntity<Void>(HttpStatus.resolve(401));

        session = req.getSession();
        session.setAttribute("user", memberDTO);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", auth);
        headers.set("Access-Control-Expose-Headers", "*, Authorization, Set-Cookie");

        return ResponseEntity.ok()
                .headers(headers)
                .body(null);
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Validated @RequestBody MemberDTO memberDTO) {
        log.info("signup: " + memberDTO.toString());

        boolean isMemberSaved = memberService.saveMember(memberDTO);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Access-Control-Expose-Headers", "*");
        headers.set("isMemberSaved", String.valueOf(isMemberSaved));

        return new ResponseEntity<String>(null, headers, HttpStatus.OK);
    }

    @GetMapping("/needSession")
    public ResponseEntity<Boolean> needSession() {
        MemberDTO obj = (MemberDTO) session.getAttribute("user");
        Boolean isLogin = false;

        if(obj != null) {
            log.info("Session Info: " + obj.toString());
            log.info("id: " + session.getId());
            isLogin = true;
        }
        return new ResponseEntity<Boolean>(isLogin, HttpStatus.OK);
    }
}