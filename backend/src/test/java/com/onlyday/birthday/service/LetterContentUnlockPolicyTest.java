package com.onlyday.birthday.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class LetterContentUnlockPolicyTest {

    @Test
    void defaultStep_usesOneTwoThree() {
        var policy = new LetterContentUnlockPolicy(1);
        assertThat(policy.isContentUnlocked(0, 0)).isFalse();
        assertThat(policy.isContentUnlocked(0, 1)).isTrue();
        assertThat(policy.isContentUnlocked(1, 1)).isFalse();
        assertThat(policy.isContentUnlocked(1, 2)).isTrue();
    }

    @Test
    void stepTwo_doublesRequired() {
        var policy = new LetterContentUnlockPolicy(2);
        assertThat(policy.isContentUnlocked(0, 1)).isFalse();
        assertThat(policy.isContentUnlocked(0, 2)).isTrue();
    }
}
