package lk.ijse.gdse72.staygobackend.controller;

import lk.ijse.gdse72.staygobackend.dto.ApiResponse;
import lk.ijse.gdse72.staygobackend.dto.RegisterDTO;
import lk.ijse.gdse72.staygobackend.dto.UserDTO;
import lk.ijse.gdse72.staygobackend.service.AuthService;
import lk.ijse.gdse72.staygobackend.service.UserService;
import lk.ijse.gdse72.staygobackend.util.APIResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/adminDashboardUserManage")
@RequiredArgsConstructor
@CrossOrigin

public class AdminDashboardUserManageController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/getAllUsers")
    public ResponseEntity<APIResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> allUsers = userService.getAllUsers();
        // Filter non-admin users only
        List<UserDTO> nonAdminUsers = allUsers.stream()
                .filter(u -> !"ADMIN".equalsIgnoreCase(u.getRole()))
                .toList();
        return ResponseEntity.ok(new APIResponse<>(200, "All Users Retrieved Successfully", nonAdminUsers));
    }

    @PostMapping("/admin/saveuser")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterDTO registerDTO) {
        System.out.println("registerDTO = " + registerDTO);
        return ResponseEntity.ok(new ApiResponse(
                200,
                "ok",
                authService.register(registerDTO)
        ));
    }




}
