package lk.ijse.gdse72.staygobackend.service;

import lk.ijse.gdse72.staygobackend.util.JwtUtil;
import lk.ijse.gdse72.staygobackend.dto.AuthDTO;
import lk.ijse.gdse72.staygobackend.dto.AuthResponseDTO;
import lk.ijse.gdse72.staygobackend.dto.RegisterDTO;
import lk.ijse.gdse72.staygobackend.entity.Role;
import lk.ijse.gdse72.staygobackend.entity.User;
import lk.ijse.gdse72.staygobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    public String register (RegisterDTO registerDTO) {
        if(userRepository.findByUsername(
                registerDTO.getUsername()).isPresent()){
            throw new RuntimeException("Username already exists...");
        }
        String status = (registerDTO.getStatus() != null) ? registerDTO.getStatus() : "Active";

        User user = User.builder()
                .fullName(registerDTO.getFullName())
                .email(registerDTO.getEmail())
                .username(registerDTO.getUsername())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(Role.valueOf(registerDTO.getRole()))
                .status(status)
                .build();
        userRepository.save(user);
        return "User Registration Success...";
    }

    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        System.out.println("Authenticating user...");
        System.out.println("authDTO = " + authDTO);
        User user=
                userRepository.findByUsername(authDTO.getUsername())
                        .orElseThrow(
                                ()->new UsernameNotFoundException
                                        ("Username not found"));
        System.out.println("User found: " + user.getUsername());
        if (!passwordEncoder.matches(
                authDTO.getPassword(),
                user.getPassword())) {
            System.out.println("Incorrect password for user: " + authDTO.getUsername());
            throw new BadCredentialsException("Incorrect password");
        }
        String token=jwtUtil.generateToken(authDTO.getUsername());
        String role = user.getRole().name();
        System.out.println("Generated Token: " + token);
        System.out.println("User Role: " + role);
        System.out.println("Authentication successful for user: " + authDTO.getUsername());
        return  new AuthResponseDTO(token, role, user.getId());
    }
}
