package com.example.demo.repository;

import com.example.demo.DTO.MemberDTO;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class MemberRepository {
    public Map<String, MemberDTO> memberMap;
    private String[] defaultIdArr = { "jdy8739", "hoon1234", "slack9999" };
    private String[] defaultAuthArr = { "manager", "normal", "normal" };

    public MemberRepository() {
        memberMap = new HashMap<String, MemberDTO>();

        //테스트용 디폴트 멤버 객체
        int i = 0;
        for(String id : defaultIdArr) {
            MemberDTO memberDTO = new MemberDTO(
                    id,
                    "qwer1234!@",
                    null,
                    defaultAuthArr[i],
                    new ArrayList<Integer>());
            memberMap.put(id, memberDTO);
            i ++;
        }
    }

    public boolean saveMember(MemberDTO memberDTO) {
        MemberDTO loggedinMember = memberMap.get(memberDTO.getId());
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
            if(loggedinMember.getPassword().equals(memberDTO.getPassword())) {
                return loggedinMember;
            } else return null;
        }
    }

    public void addLike(String id, Integer postNo) throws Exception {
        MemberDTO memberDTO = memberMap.get(id);
        if(memberDTO == null) {
            throw new Exception("IdNotFoundException");
        } else {
            memberDTO.getLikedPostList().add(postNo);
            log.info("" + memberDTO.getLikedPostList().toString());
        }
    }

    public List<Integer> getLikedList(String id) {
        MemberDTO memberDTO = memberMap.get(id);
        List<Integer> targetList = memberDTO.getLikedPostList();
        log.info("" + targetList.toString());
        return targetList;
    }
}
