package com.example.demo.controller;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.DTO.ReplyDTO;
import com.example.demo.JWT.JWTUtils;
import com.example.demo.service.BoardService;

import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Controller
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class BoardController {

    @Autowired
    BoardService boardService;

    JWTUtils jwtUtils = new JWTUtils();

    @GetMapping("/get")
    public ResponseEntity<BoardWrapperDTO> getPosts(
            @RequestParam Integer offset,
            @RequestParam Integer limit) {
        log.info("getPosts(): " + offset + ", " + limit);
        return new ResponseEntity<BoardWrapperDTO>(
                boardService.getPosts(offset, limit), HttpStatus.OK);
    }

    @GetMapping("/{subject}/{keyword}/get")
    public ResponseEntity<BoardWrapperDTO> getPostsByKeyword(
            @PathVariable String subject,
            @PathVariable String keyword,
            @RequestParam Integer offset,
            @RequestParam Integer limit) {
            log.info("subject: " + subject + ", keyword: " + keyword);
            log.info("getPosts(): " + offset + ", " + limit);
        return ResponseEntity.ok()
                .body(boardService.getPostsByKeyword(
                        subject, keyword, offset, limit));
    }

    @GetMapping("/get_detail/{postNo}")
    public ResponseEntity<BoardDTO> getPost(
            @PathVariable int postNo,
            HttpServletRequest req) {
        log.info("getPost(): " + postNo);
        String requestPurpose = req.getHeader("request");

        if(requestPurpose != null && requestPurpose.equals("modify")) {
            HttpHeaders headers = new HttpHeaders();
            String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
            try {
                Claims claims = jwtUtils.filterInternal(authorizationHeader);
                String id = (String) claims.get("id");
                BoardDTO boardDTO = boardService.getPost(postNo);
                if(id.equals(boardDTO.getWriter())) {
                    return ResponseEntity.ok()
                            .body(boardService.getPost(postNo));
                } else throw new Exception();
            } catch (Exception e) {
                log.info("This token is invalid!");
                headers.set("isValidToken", "false");
                return ResponseEntity.status(401)
                        .headers(headers)
                        .body(null);
            }
        } else {
            return ResponseEntity.ok()
                    .body(boardService.getPost(postNo));
        }
    }

    @PostMapping("/add_post")
    public ResponseEntity<Void> addPost(
            @Validated @RequestBody BoardDTO boardDTO,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        try {
            Claims claims = jwtUtils.filterInternal(authorizationHeader);
            if(!claims.get("id").equals(boardDTO.getWriter())) {
                headers.set("isIdAndTokenMatch", "false");
            } else {
                boardService.savePost(boardDTO);
                log.info("Post has saved.");
            }
        } catch (Exception e) {
            log.info("This token is invalid!");
            headers.set("isValidToken", "false");
        } finally {
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(null);
        }
    }

    @DeleteMapping("/delete_post/{postNo}")
    public ResponseEntity<Boolean> deletePost(
            @PathVariable("postNo") int postNo,
            HttpServletRequest req) {
        log.info("" + postNo);
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        boolean isDeleted = false;
        try {
            Claims claims = jwtUtils.filterInternal(authorizationHeader);
            String id = (String) claims.get("id");
            isDeleted = boardService.deletePost(postNo, id);
        } catch (Exception e) {
            log.info("This token is invalid!");
            headers.set("isValidToken", "false");
            return ResponseEntity.status(401)
                    .headers(headers)
                    .body(isDeleted);
        } finally {
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(isDeleted);
        }
    }

    @PutMapping("/modify_post")
    ResponseEntity<Void> modifyPost(
            @Validated @RequestBody BoardDTO boardDTO,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        try {
            Claims claims = jwtUtils.filterInternal(authorizationHeader);
            if(!claims.get("id").equals(boardDTO.getWriter())) {
                headers.set("isIdAndTokenMatch", "false");
            } else {
                boardService.modifyPost(boardDTO);
                log.info("Post has modified.");
            }
        } catch (Exception e) {
            log.info("This token is invalid!");
            headers.set("isValidToken", "false");
        } finally {
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(null);
        }
    }

    @PostMapping("add_reply")
    public ResponseEntity<Void> addReply(
            @Validated @RequestBody ReplyDTO replyDTO,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        try {
            Claims claims = jwtUtils.filterInternal(authorizationHeader);
            if(claims.get("id").equals(replyDTO.getReplier())) {
                boardService.saveReply(replyDTO);
            } else {
                throw new Exception();
            }
        } catch (Exception e) {
            log.info("This token is invalid!");
            headers.set("isValidToken", "false");
        } finally {
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(null);
        }
    }

    @DeleteMapping("delete_reply/{postNo}/{replyNo}")
    public ResponseEntity<Void> deleteReply(
            @PathVariable("postNo") String postNo,
            @PathVariable("replyNo") String replyNo,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        try {
            Claims claims = jwtUtils.filterInternal(authorizationHeader);
            String id = (String) claims.get("id");
            boardService.deleteReply(
                    Integer.parseInt(postNo), Integer.parseInt(replyNo), id);
        } catch (Exception e) {
            log.info("This token is invalid!");
            headers.set("isValidToken", "false");
        } finally {
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(null);
        }
    }
}