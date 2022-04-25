package com.example.demo.service;

import com.example.demo.DTO.MemberDTO;
import com.example.demo.repository.MemberRepository;
import org.springframework.stereotype.Service;

@Service
public class MemberService implements MemberServiceImpl{

    MemberRepository memberRepository = new MemberRepository();

    @Override
    public boolean saveMember(MemberDTO memberDTO) {
        return memberRepository.saveMember(memberDTO);
    }

    @Override
    public boolean login(MemberDTO memberDTO) {
        boolean doesMemberExist = memberRepository.login(memberDTO);
        return doesMemberExist;
    }
}