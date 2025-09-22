package lk.ijse.gdse72.staygobackend.service;

import lk.ijse.gdse72.staygobackend.dto.UserDTO;
import lk.ijse.gdse72.staygobackend.util.EmailUtil;
import lk.ijse.gdse72.staygobackend.util.JwtUtil;
import lk.ijse.gdse72.staygobackend.dto.AuthDTO;
import lk.ijse.gdse72.staygobackend.dto.AuthResponseDTO;
import lk.ijse.gdse72.staygobackend.dto.RegisterDTO;
import lk.ijse.gdse72.staygobackend.entity.Role;
import lk.ijse.gdse72.staygobackend.entity.User;
import lk.ijse.gdse72.staygobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ModelMapper modelMapper;
    private final EmailUtil emailUtil;
    private final OtpService otpService;

    public String register(RegisterDTO registerDTO) {
        if (userRepository.findByUsername(registerDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists...");
        }
        String status = (registerDTO.getStatus() != null) ? registerDTO.getStatus() : "Active";

        User user = User.builder()
                .fullName(registerDTO.getFullName())
                .email(registerDTO.getEmail())
                .username(registerDTO.getUsername())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(Role.valueOf(registerDTO.getRole()))
                .createdAt(registerDTO.getCreatedAt())
                .updatedAt(registerDTO.getUpdatedAt())
                .status(status)
                .build();

        userRepository.save(user);
        return "User Registration Success...";
    }

    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        System.out.println("Authenticating user...");
        System.out.println("authDTO = " + authDTO);

        User user = userRepository.findByUsernameIgnoreCase(authDTO.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));


        System.out.println("User found: " + user.getUsername());

        if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
            System.out.println("Incorrect password for user: " + authDTO.getUsername());
            throw new BadCredentialsException("Incorrect password");
        }

        String token = jwtUtil.generateToken(authDTO.getUsername());
        String role = user.getRole().name();

        System.out.println("Generated Token: " + token);
        System.out.println("User Role: " + role);
        System.out.println("Authentication successful for user: " + authDTO.getUsername());

        // 🔥 If ADMIN logs in, send an email alert
        if (user.getRole() == Role.ADMIN) {
            String subject = "Admin Login Alert - StayGo Online Booking System";
            String body = "🏨 StayGo Admin Login Notification\n\n" +
                    "Hello " + user.getFullName() + ",\n\n" +
                    "This is a security notification from StayGo.\n\n" +
                    "Your ADMIN account was successfully logged in at: " + new java.util.Date() + ".\n\n" +
                    "✅ If this was you, you can safely ignore this message.\n" +
                    "⚠️ If you did NOT perform this login, please take immediate action:\n" +
                    "   1. Change your password.\n" +
                    "   2. Review recent booking and account activity.\n\n" +
                    "Thank you for helping us keep StayGo secure!\n\n" +
                    "— StayGo Security Team";


            try {
                emailUtil.sendEmail(user.getEmail(), subject, body);
                System.out.println("✅ Admin login email sent to: " + user.getEmail());
            } catch (Exception e) {
                System.err.println("❌ Failed to send admin login email: " + e.getMessage());
            }
        }

        return new AuthResponseDTO(token, role, user.getId());
    }

    public UserDTO getLoggedUserDetails(String token) {
        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO dto = new UserDTO();
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        return dto;
    }

    public UserDTO updateLoggedUserDetails(String token, UserDTO userDTO) {
        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userDTO.getFullName() != null) user.setFullName(userDTO.getFullName());
        if (userDTO.getEmail() != null) user.setEmail(userDTO.getEmail());
        if (userDTO.getUsername() != null) user.setUsername(userDTO.getUsername());

        user = userRepository.save(user);

        return modelMapper.map(user, UserDTO.class);
    }

    // Send OTP
    public void sendOtpToEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String otp = otpService.generateOtp();
        user.setResetOtp(otp);
        user.setOtpExpiration(new java.sql.Timestamp(System.currentTimeMillis() + 5 * 60 * 1000)); // 5 mins
        userRepository.save(user);

        String subject = "YummyGo Password Reset OTP";
        String body = "Hello " + user.getFullName() + ",\n\nYour OTP: " + otp +
                "\nIt expires in 5 minutes.\n\nYummyGo Team";

        emailUtil.sendEmail(user.getEmail(), subject, body);
    }

    // Reset password using OTP
    public void resetPasswordWithOtp(String email, String otp, String newUsername, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiration().before(new java.util.Date())) {
            throw new RuntimeException("OTP expired");
        }

        if (newUsername != null && !newUsername.isBlank()) {
            user.setUsername(newUsername);
        }

        if (newPassword != null && !newPassword.isBlank()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        user.setResetOtp(null);
        user.setOtpExpiration(null);
        userRepository.save(user);
    }
}
