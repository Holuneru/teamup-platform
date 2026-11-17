package com.teamup;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = TeamupPlatformApplication.class)
@ActiveProfiles("test")
class TeamupPlatformApplicationTests {

    @Test
    void contextLoads() {
    }
}
