package com.example.demo.repository;

import com.example.demo.DTO.MemberDTO;

import java.util.HashMap;
import java.util.Map;

public class MemberRepository {
    public Map<String, MemberDTO> memberMap;
    private String[] defaultIdArr = { "jdy8739", "hoon1234", "slack9999" };

    public MemberRepository() {
        memberMap = new HashMap<String, MemberDTO>();

        //테스트용 디폴트 멤버 객체
        for(String id : defaultIdArr) {
            MemberDTO defaultMember = new MemberDTO(id, "qwer1234!", null);
            memberMap.put(id, defaultMember);
        }
    }

    public void saveMember(MemberDTO memberDTO) {
        memberMap.put(memberDTO.getId(), memberDTO);
    }

    public boolean login(MemberDTO memberDTO) {
        MemberDTO loggedinMember = memberMap.get(memberDTO.getId());
        if(loggedinMember == null) return false;
        else {
            if(loggedinMember.getPassword().equals(memberDTO.getPassword())) {
                return true;
            } else return false;
        }
    }
}
