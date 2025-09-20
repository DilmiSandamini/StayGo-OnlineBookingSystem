package lk.ijse.gdse72.staygobackend.controller;

import lk.ijse.gdse72.staygobackend.dto.BusinessDTO;
import lk.ijse.gdse72.staygobackend.dto.BusinessDetailsDTO;
import lk.ijse.gdse72.staygobackend.entity.BusinessDetails;
import lk.ijse.gdse72.staygobackend.service.BusinessDetailsService;
import lk.ijse.gdse72.staygobackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/adminDashboardBusinessDetailManage")
@RequiredArgsConstructor
@CrossOrigin

public class AdminDashboardBusinessDetailManageController {

    private final BusinessDetailsService businessDetailsService;

    @GetMapping("/getAllBusinessDetails")
    public ResponseEntity<APIResponse<Page<BusinessDetailsDTO>>> getAllBusinessesDetailsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<BusinessDetails> entityPage = businessDetailsService.getAllBusinessDetailsPaginated(page, size);

        // manually map each entity → DTO to avoid ModelMapper confusion
        Page<BusinessDetailsDTO> dtoPage = entityPage.map(details -> {
            BusinessDetailsDTO dto = new BusinessDetailsDTO();
            dto.setBusinessDetailId(details.getBusinessDetailId());
            dto.setBusinessId(details.getBusiness().getBusinessId());
            dto.setRoomsCount(details.getRoomsCount());
            dto.setBedsCount(details.getBedsCount());
            dto.setGuestCount(details.getGuestCount());
            dto.setPricePerDay(details.getPricePerDay());
            dto.setPricePerNight(details.getPricePerNight());
            dto.setLuxuryLevel(details.getLuxuryLevel());
            dto.setStatus(details.getStatus());
            dto.setFacilities(details.getFacilities());
            dto.setRoomImage(details.getRoomImage());
            dto.setCreatedAt(details.getCreatedAt());
            dto.setUpdatedAt(details.getUpdatedAt());
            return dto;
        });

        return ResponseEntity.ok(new APIResponse<>(200, "All BusinessDetails Retrieved Successfully", dtoPage));
    }

    @GetMapping("/countActiveRooms")
    public ResponseEntity<APIResponse<Long>> getActiveRoomCount() {
        long activeCount = businessDetailsService.countByStatus("Active");
        return ResponseEntity.ok(new APIResponse<>(200, "Active Rooms Count Retrieved Successfully", activeCount));
    }

    @GetMapping("/countInactiveRooms")
    public ResponseEntity<APIResponse<Long>> getInactiveRoomCount() {
        long inactiveCount = businessDetailsService.countByStatus("Inactive");
        return ResponseEntity.ok(new APIResponse<>(200, "Inactive Rooms Count Retrieved Successfully", inactiveCount));
    }

}
