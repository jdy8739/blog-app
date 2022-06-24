package com.example.demo.service;

import com.example.demo.DTO.MemberDTO;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberServiceImpl implements MemberService {

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    BoardRepository boardRepository;

    @Override
    public boolean saveMember(MemberDTO memberDTO) {
        return memberRepository.saveMember(memberDTO);
    }

    @Override
    public MemberDTO login(MemberDTO memberDTO) {
        return memberRepository.login(memberDTO);
    }

    @Override
    public void addLike(String id, Integer postNo) throws NullPointerException {
        memberRepository.addLike(id, postNo);
        boardRepository.manipulateLikesCount(postNo, true);
    }

    @Override
    public void cancelLike(String id, Integer postNo) throws NullPointerException {
        memberRepository.cancelLike(id, postNo);
        boardRepository.manipulateLikesCount(postNo, false);
    }
}
