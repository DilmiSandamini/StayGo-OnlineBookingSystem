package lk.ijse.gdse72.staygobackend.config;

import lk.ijse.gdse72.staygobackend.entity.Role;
import lk.ijse.gdse72.staygobackend.entity.User;
import lk.ijse.gdse72.staygobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void run(String... args) throws Exception {
        // Check if an ADMIN user already exists
        boolean adminExists = userRepository.findByUsername("admin").isPresent();

        if (!adminExists) {
            User admin = User.builder()
                    .fullName("System Administrator")
                    .email("admin@stygobookingsystem.com")
                    .username("admin")
                    .password(passwordEncoder.encode("admin123")) // default password
                    .status("Active")
                    .role(Role.ADMIN)
                    .createdAt(Timestamp.from(Instant.now()))
                    .updatedAt(Timestamp.from(Instant.now()))
                    .build();

            userRepository.save(admin);
            System.out.println("✅ Default ADMIN user created: username=admin, password=admin123");
        } else {
            System.out.println("ℹ Default ADMIN user already exists. Skipping creation.");
        }
    }
}

