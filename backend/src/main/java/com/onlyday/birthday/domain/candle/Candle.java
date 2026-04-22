package com.onlyday.birthday.domain.candle;

import com.onlyday.birthday.domain.cake.Cake;
import com.onlyday.birthday.domain.common.BaseTimeEntity;
import com.onlyday.birthday.domain.letter.Letter;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "candles", indexes = {
        @Index(name = "idx_candle_cake_created", columnList = "cake_id,created_at")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Candle extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cake_id", nullable = false)
    private Cake cake;

    @Column(name = "nickname", nullable = false, length = 40)
    private String nickname;

    @Column(name = "position_x", nullable = false)
    private double positionX;

    @Column(name = "position_y", nullable = false)
    private double positionY;

    @Column(name = "candle_color", nullable = false, length = 30)
    private String candleColor;

    @Column(name = "candle_style", nullable = false, length = 30)
    private String candleStyle;

    @OneToOne(mappedBy = "candle", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Letter letter;

    @Builder
    public Candle(Cake cake, String nickname, double positionX, double positionY, String candleColor, String candleStyle) {
        this.cake = cake;
        this.nickname = nickname;
        this.positionX = positionX;
        this.positionY = positionY;
        this.candleColor = candleColor;
        this.candleStyle = candleStyle;
    }
}
