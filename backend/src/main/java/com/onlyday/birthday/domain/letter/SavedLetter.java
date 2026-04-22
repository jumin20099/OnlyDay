package com.onlyday.birthday.domain.letter;

import com.onlyday.birthday.domain.common.BaseTimeEntity;
import com.onlyday.birthday.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "saved_letters",
        uniqueConstraints = @UniqueConstraint(name = "uk_saved_letter_owner_letter", columnNames = {"owner_id", "source_letter_id"}),
        indexes = @Index(name = "idx_saved_letter_owner_created", columnList = "owner_id,created_at"))
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SavedLetter extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "source_letter_id", nullable = false)
    private UUID sourceLetterId;

    @Column(name = "nickname", nullable = false, length = 40)
    private String nickname;

    @Column(name = "content", nullable = false, length = 1000)
    private String content;

    @Builder
    public SavedLetter(User owner, UUID sourceLetterId, String nickname, String content) {
        this.owner = owner;
        this.sourceLetterId = sourceLetterId;
        this.nickname = nickname;
        this.content = content;
    }
}
