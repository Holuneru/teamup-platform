package com.teamup;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
        classes = TeamupPlatformApplication.class,
        properties = {
                "spring.datasource.url=jdbc:h2:mem:teamup-test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
                "spring.datasource.driver-class-name=org.h2.Driver",
                "spring.datasource.username=sa",
                "spring.datasource.password=",
                "spring.jpa.hibernate.ddl-auto=create-drop",
                "spring.sql.init.mode=never"
        }
)
class TeamupPlatformApplicationTests {

    @Test
    void contextLoads() {
    }
}
