package lk.ijse.gdse72.staygobackend.controller;

import lk.ijse.gdse72.staygobackend.dto.ApiResponse;
import lk.ijse.gdse72.staygobackend.dto.RegisterDTO;
import lk.ijse.gdse72.staygobackend.dto.UserDTO;
import lk.ijse.gdse72.staygobackend.service.AuthService;
import lk.ijse.gdse72.staygobackend.service.UserService;
import lk.ijse.gdse72.staygobackend.util.APIResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/adminDashboardUserManage")
@RequiredArgsConstructor
@CrossOrigin

public class AdminDashboardUserManageController {

    private final UserService userService;
    private final AuthService authService;

    // Get All Users with Pagination (Non-Admins only)
    @GetMapping("/getAllUsers")
    public ResponseEntity<APIResponse<Page<UserDTO>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserDTO> pagedUsers = userService.getAllNonAdminUsers(PageRequest.of(page, size));
        return ResponseEntity.ok(new APIResponse<>(200, "All Users Retrieved Successfully", pagedUsers));
    }

    @GetMapping("/getAllClientUsers")
    public ResponseEntity<APIResponse<Page<UserDTO>>> getAllClientUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserDTO> pagedUsers = userService.getAllClientUsers(PageRequest.of(page, size));
        return ResponseEntity.ok(new APIResponse<>(200, "All Client Users Retrieved Successfully", pagedUsers));
    }

    @GetMapping("/getAllBusinessUsers")
    public ResponseEntity<APIResponse<Page<UserDTO>>> getAllBusinessUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size

    ) {
        Page<UserDTO> pagedUsers = userService.getAllBusinessUsers(PageRequest.of(page, size));
        return ResponseEntity.ok(new APIResponse<>(200, "All Business Users Retrieved Successfully", pagedUsers));
    }

    @GetMapping("/getAllActiveUsers")
    public ResponseEntity<APIResponse<Page<UserDTO>>> getAllActiveUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserDTO> pagedUsers = userService.getAllActiveUsers(PageRequest.of(page, size));
        return ResponseEntity.ok(new APIResponse<>(200, "All Active Users Retrieved Successfully", pagedUsers));
    }

    @GetMapping("/getAllInactiveUsers")
    public ResponseEntity<APIResponse<Page<UserDTO>>> getAllInactiveUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserDTO> pagedUsers = userService.getAllInactiveUsers(PageRequest.of(page, size));
        return ResponseEntity.ok(new APIResponse<>(200, "All Inactive Users Retrieved Successfully", pagedUsers));
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

    // Update existing user
    @PutMapping("/updateUser/{id}")
    public ResponseEntity<APIResponse<UserDTO>> updateUser(
            @PathVariable Long id,
            @RequestBody UserDTO userDTO
    ) {
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(new APIResponse<>(200, "User updated successfully", updatedUser));
    }

    // Deactivate user
    @PutMapping("/deactivateUser/{id}")
    public ResponseEntity<APIResponse<String>> deactivateUser(@PathVariable Long id) {
        userService.updateUserStatus(id, "Inactive");
        return ResponseEntity.ok(new APIResponse<>(200, "User deactivated successfully", "deactivated"));
    }

    // Activate user
    @PutMapping("/activateUser/{id}")
    public ResponseEntity<APIResponse<String>> activateUser(@PathVariable Long id) {
        userService.updateUserStatus(id, "Active");
        return ResponseEntity.ok(new APIResponse<>(200, "User activated successfully", "active"));
    }



}
