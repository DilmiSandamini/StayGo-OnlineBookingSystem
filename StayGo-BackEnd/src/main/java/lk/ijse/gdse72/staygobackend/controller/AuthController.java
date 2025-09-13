package lk.ijse.gdse72.staygobackend.controller;

import jakarta.servlet.http.HttpServletRequest;
import lk.ijse.gdse72.staygobackend.dto.ApiResponse;
import lk.ijse.gdse72.staygobackend.dto.AuthDTO;
import lk.ijse.gdse72.staygobackend.dto.RegisterDTO;
import lk.ijse.gdse72.staygobackend.dto.UserDTO;
import lk.ijse.gdse72.staygobackend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin

public class AuthController {
    private final AuthService authService;

    @GetMapping("/roleSelector")
    public ResponseEntity<ApiResponse> getRoleSelector() {
        System.out.println("getRoleSelector called");
        return ResponseEntity.ok(new ApiResponse(
                200,
                "ok",
                "Role Selected Successfully"
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterDTO registerDTO) {
        System.out.println("registerDTO = " + registerDTO);
        return ResponseEntity.ok(new ApiResponse(
                200,
                "ok",
                authService.register(registerDTO)
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody AuthDTO authDTO) {
        System.out.println("authDTO = " + authDTO);
        return ResponseEntity.ok(new ApiResponse(
                200,
                "OK",
                authService.authenticate(authDTO)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getMyAccount(HttpServletRequest request) {
        // Extract logged-in user info from the token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new ApiResponse(401, "Unauthorized", null));
        }

        String token = authHeader.substring(7);
        // Ask AuthService to decode the token and get user details
        return ResponseEntity.ok(new ApiResponse(
                200,
                "OK",
                authService.getLoggedUserDetails(token)  // return DTO with fullName, email, username
        ));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse> updateMyAccount(
            @RequestBody UserDTO userDTO,
            HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new ApiResponse(401, "Unauthorized", null));
        }

        String token = authHeader.substring(7);

        // Call AuthService to update user details
        UserDTO updatedUser = authService.updateLoggedUserDetails(token, userDTO);

        return ResponseEntity.ok(new ApiResponse(200, "User updated successfully", updatedUser));
    }


}
