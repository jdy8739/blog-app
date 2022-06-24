package com.example.demo.repository;

import com.example.demo.DTO.MemberDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Repository
public class MemberRepository {

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, MemberDTO> memberMap;
    private String[] defaultIdArr = { "jdy8739", "hoon1234", "slack9999" };
    private String[] defaultAuthArr = { "manager", "normal", "normal" };

    public MemberRepository() {
        memberMap = new HashMap<String, MemberDTO>();
        String defaultEncodedPwForTest =
                "$2a$10$MB/8fl/oWe.ZltCqDS89ReENRbLR7B.RN2sVv3ziuf9/GZjoSX.WO";
        //테스트용 디폴트 멤버 객체
        int i = 0;
        for(String id : defaultIdArr) {
            MemberDTO memberDTO = new MemberDTO(
                    id,
                    defaultEncodedPwForTest,
                    null,
                    defaultAuthArr[i],
                    new ArrayList<Integer>());
            memberMap.put(id, memberDTO);
            i ++;
        }
    }

    public boolean saveMember(MemberDTO memberDTO) {
        MemberDTO loggedinMember = memberMap.get(memberDTO.getId());
        String encodedPw = passwordEncoder.encode(memberDTO.getPassword());
        memberDTO.setPassword(encodedPw);
        memberDTO.setAuth("normal");
        memberDTO.setLikedPostList(new ArrayList<Integer>());
        if(loggedinMember == null) {
            memberMap.put(memberDTO.getId(), memberDTO);
            return true;
        } else {
            log.info("This id is duplicate!");
            return false;
        }
    }

    public MemberDTO login(MemberDTO memberDTO) {
        MemberDTO loggedinMember = memberMap.get(memberDTO.getId());
        if(loggedinMember == null) return null;
        else {
            if(passwordEncoder.matches(memberDTO.getPassword(), loggedinMember.getPassword())) {
                return loggedinMember;
            } else return null;
        }
    }

    public List<Integer> getLikedList(String id) {
        MemberDTO memberDTO = memberMap.get(id);
        return memberDTO.getLikedPostList();
    }

    public void addLike(String id, Integer postNo) {
        MemberDTO memberDTO = memberMap.get(id);
        if(memberDTO == null) {
            throw new NullPointerException();
        } else {
            memberDTO.getLikedPostList().add(postNo);
        }
    }

    public void cancelLike(String id, Integer postNo) {
        MemberDTO memberDTO = memberMap.get(id);
        if(memberDTO == null) {
            throw new NullPointerException();
        } else {
            memberDTO.getLikedPostList().remove(postNo);
        }
    }
}
