package com.onlyday.birthday.service;

import com.onlyday.birthday.domain.user.User;
import com.onlyday.birthday.repository.UserRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User getOrCreate(UUID userId) {
        return userRepository.findById(userId)
                .orElseGet(() -> userRepository.save(User.builder()
                        .id(userId)
                        .displayName("user-" + userId.toString().substring(0, 8))
                        .build()));
    }
}
