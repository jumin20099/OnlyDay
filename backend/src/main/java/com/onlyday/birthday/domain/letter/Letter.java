package com.onlyday.birthday.domain.letter;

import com.onlyday.birthday.domain.candle.Candle;
import com.onlyday.birthday.domain.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "letters", indexes = {
        @Index(name = "idx_letter_visibility", columnList = "is_visible,created_at")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Letter extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candle_id", nullable = false, unique = true)
    private Candle candle;

    @Column(name = "content", nullable = false, length = 2000)
    private String content;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_visible", nullable = false)
    private boolean visible;

    @Builder
    public Letter(Candle candle, String content, String imageUrl, boolean visible) {
        this.candle = candle;
        this.content = content;
        this.imageUrl = imageUrl;
        this.visible = visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}
