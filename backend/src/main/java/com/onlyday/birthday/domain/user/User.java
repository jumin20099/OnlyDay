package com.onlyday.birthday.domain.user;

import com.onlyday.birthday.domain.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_email", columnList = "email", unique = true)
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    private UUID id;

    @Column(name = "display_name", nullable = false, length = 80)
    private String displayName;

    @Column(name = "email", nullable = false, unique = true, length = 120)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 200)
    private String passwordHash;

    @Builder
    public User(UUID id, String displayName, String email, String passwordHash) {
        this.id = id;
        this.displayName = displayName;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public void updateProfile(String displayName, String passwordHash) {
        this.displayName = displayName;
        this.passwordHash = passwordHash;
    }
}
