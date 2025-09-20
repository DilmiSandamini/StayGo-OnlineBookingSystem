package lk.ijse.gdse72.staygobackend.controller;

import lk.ijse.gdse72.staygobackend.dto.BusinessDTO;
import lk.ijse.gdse72.staygobackend.service.BusinessService;
import lk.ijse.gdse72.staygobackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/adminDashboardBusinessManage")
@RequiredArgsConstructor
@CrossOrigin

public class AdminDashboardBusinessManageController {

    private final BusinessService businessService;

    @GetMapping("/getAllBusinesses")
    public ResponseEntity<APIResponse<Page<BusinessDTO>>> getAllBusinessesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<BusinessDTO> businesses = businessService.getAllBusinessesPaginated(page, size);
        return ResponseEntity.ok(new APIResponse<>(200, "All Businesses Retrieved Successfully", businesses));
    }

    @GetMapping("/getAllActiveBusinesses")
    public ResponseEntity<APIResponse<Page<BusinessDTO>>> getAllActiveBusinessesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<BusinessDTO> businesses = businessService.getAllActiveBusinessesPaginated(page, size);
        return ResponseEntity.ok(new APIResponse<>(200, "All Active Businesses Retrieved Successfully", businesses));
    }

    @GetMapping("/getAllInactiveBusinesses")
    public ResponseEntity<APIResponse<Page<BusinessDTO>>> getAllInactiveBusinessesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<BusinessDTO> businesses = businessService.getAllInactiveBusinessesPaginated(page, size);
        return ResponseEntity.ok(new APIResponse<>(200, "All Inactive Businesses Retrieved Successfully", businesses));

    }

}

