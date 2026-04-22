package com.onlyday.birthday.domain.user;

import com.onlyday.birthday.domain.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    private UUID id;

    @Column(name = "display_name", nullable = false, length = 80)
    private String displayName;

    @Builder
    public User(UUID id, String displayName) {
        this.id = id;
        this.displayName = displayName;
    }
}
