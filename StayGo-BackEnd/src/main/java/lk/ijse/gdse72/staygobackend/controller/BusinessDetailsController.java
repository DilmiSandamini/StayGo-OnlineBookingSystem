package lk.ijse.gdse72.staygobackend.controller;


import lk.ijse.gdse72.staygobackend.dto.BusinessDetailsDTO;
import lk.ijse.gdse72.staygobackend.entity.BusinessDetails;
import lk.ijse.gdse72.staygobackend.service.BusinessBookingService;
import lk.ijse.gdse72.staygobackend.service.BusinessDetailsService;
import lk.ijse.gdse72.staygobackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/businessDetails")
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
public class BusinessDetailsController {
    private final BusinessDetailsService businessDetailsService;
    private final BusinessBookingService businessBookingService;
    private final ModelMapper modelMapper;


    // ===== Save Business Details =====
    @PostMapping(value = "/create")
    public ResponseEntity<APIResponse<String>> createBusinessDetails(
            @RequestParam Integer roomsCount,
            @RequestParam Integer bedsCount,
            @RequestParam Integer guestCount,
            @RequestParam BigDecimal pricePerDay,
            @RequestParam BigDecimal pricePerNight,
            @RequestParam String luxuryLevel,
            @RequestParam String status,
            @RequestParam String facilities,
            @RequestParam Long businessId,
            @RequestPart("roomImage") MultipartFile roomImage
    ) {
        try {
            // Save logo
            String uploadDir = "uploads/roomImage-logos/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            String fileName = System.currentTimeMillis() + "_" + roomImage.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(roomImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);


            // === Build DTO ===
            BusinessDetailsDTO businessDetailsDTO = new BusinessDetailsDTO();
            businessDetailsDTO.setBusinessId(businessId);
            businessDetailsDTO.setRoomsCount(roomsCount);
            businessDetailsDTO.setBedsCount(bedsCount);
            businessDetailsDTO.setGuestCount(guestCount);
            businessDetailsDTO.setPricePerDay(pricePerDay);
            businessDetailsDTO.setPricePerNight(pricePerNight);
            businessDetailsDTO.setLuxuryLevel(luxuryLevel);
            businessDetailsDTO.setStatus(status);
            businessDetailsDTO.setFacilities(facilities);
            businessDetailsDTO.setRoomImage("uploads/roomImage-logos/" + fileName);

            businessDetailsService.saveBusinessDetails(businessDetailsDTO);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new APIResponse<>(201, "Business details saved successfully", null));
        } catch (Exception e) {
            log.error("Error saving business details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse<>(500, "Error saving file", null));
        }
    }

    @GetMapping("/getAllDetails")
    public ResponseEntity<APIResponse<List<BusinessDetailsDTO>>> getAllBusinessDetails() {
        try {
            List<BusinessDetails> detailsList = businessDetailsService.getAllBusinessDetails();
            List<BusinessDetailsDTO> detailsDTOs = detailsList.stream()
                    .map(d -> modelMapper.map(d, BusinessDetailsDTO.class))
                    .toList();

            return ResponseEntity.ok(new APIResponse<>(200, "All business details fetched successfully", detailsDTOs));
        } catch (Exception e) {
            log.error("Error fetching all business details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse<>(500, "Error fetching all business details", null));
        }
    }

    @GetMapping("/getByBusinessId")
    public ResponseEntity<APIResponse<List<BusinessDetailsDTO>>> getDetailsByBusinessId(@RequestParam Long businessId) {
        try {
            List<BusinessDetails> detailsList = businessDetailsService.getDetailsByBusinessId(businessId);

            List<BusinessDetailsDTO> detailsDTOs = new ArrayList<>();
            for(BusinessDetails d : detailsList){
                BusinessDetailsDTO dto = new BusinessDetailsDTO();
                dto.setBusinessDetailId(d.getBusinessDetailId());
                dto.setBusinessId(d.getBusiness().getBusinessId()); // explicitly set businessId
                dto.setRoomsCount(d.getRoomsCount());
                dto.setBedsCount(d.getBedsCount());
                dto.setGuestCount(d.getGuestCount());
                dto.setPricePerDay(d.getPricePerDay());
                dto.setPricePerNight(d.getPricePerNight());
                dto.setLuxuryLevel(d.getLuxuryLevel());
                dto.setStatus(d.getStatus());
                dto.setFacilities(d.getFacilities());
                dto.setRoomImage(d.getRoomImage());
                detailsDTOs.add(dto);
            }

            return ResponseEntity.ok(new APIResponse<>(200, "Business details fetched successfully", detailsDTOs));
        } catch (Exception e) {
            log.error("Error fetching business details by businessId", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse<>(500, "Error fetching business details", null));
        }
    }


    @GetMapping("/getById")
    public ResponseEntity<APIResponse<BusinessDetailsDTO>> getDetailsById(@RequestParam Long businessDetailId) {
        try {
            BusinessDetails details = businessDetailsService.getDetailsById(businessDetailId);
            if (details == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new APIResponse<>(404, "Business detail not found", null));
            }

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

            return ResponseEntity.ok(new APIResponse<>(200, "Business detail fetched successfully", dto));
        } catch (Exception e) {
            log.error("Error fetching business detail by id", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse<>(500, "Error fetching business detail by id", null));
        }
    }

    @PutMapping(value = "/update/{businessDetailId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse<String>> updateBusinessDetails(
            @PathVariable Long businessDetailId,
            @RequestParam Integer roomsCount,
            @RequestParam Integer bedsCount,
            @RequestParam Integer guestCount,
            @RequestParam BigDecimal pricePerDay,
            @RequestParam BigDecimal pricePerNight,
            @RequestParam String luxuryLevel,
            @RequestParam String status,
            @RequestParam String facilities,
            @RequestParam Long businessId,
            @RequestPart(value = "roomImage", required = false) MultipartFile roomImage
    ) throws IOException {
        // Build DTO manually
        BusinessDetailsDTO dto = new BusinessDetailsDTO();
        dto.setBusinessDetailId(businessDetailId);
        dto.setRoomsCount(roomsCount);
        dto.setBedsCount(bedsCount);
        dto.setGuestCount(guestCount);
        dto.setPricePerDay(pricePerDay);
        dto.setPricePerNight(pricePerNight);
        dto.setLuxuryLevel(luxuryLevel);
        dto.setStatus(status);
        dto.setFacilities(facilities);
        dto.setBusinessId(businessId);

        // Handle image
        if (roomImage != null && !roomImage.isEmpty()) {
            String uploadDir = "uploads/roomImage-logos/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            String fileName = System.currentTimeMillis() + "_" + roomImage.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(roomImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            dto.setRoomImage("uploads/roomImage-logos/" + fileName);
        }

        businessDetailsService.updateBusinessDetails(dto);

        return ResponseEntity.ok(new APIResponse<>(200, "Business details updated successfully", null));
    }


    // ===== Delete Business Details =====
    @DeleteMapping("/delete/{businessDetailId}")
    public ResponseEntity<APIResponse<String>> deleteBusinessDetails(@PathVariable Long businessDetailId) {
        try {
            businessDetailsService.deleteBusinessDetails(businessDetailId);
            return ResponseEntity.ok(new APIResponse<>(200, "Business details deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting business details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse<>(500, "Error deleting business details", null));
        }
    }

    // ===== Get Available Rooms =====
    @GetMapping("/available")
    public ResponseEntity<APIResponse<Integer>> getAvailableRoomsForDates(
            @RequestParam Long businessDetailId,
            @RequestParam String checkIn,
            @RequestParam String checkOut
    ) {
        try {
            LocalDate ci = LocalDate.parse(checkIn);
            LocalDate co = LocalDate.parse(checkOut);

            LocalDateTime checkInDateTime = ci.atStartOfDay();
            LocalDateTime checkOutDateTime = co.atStartOfDay();

            Integer available = businessDetailsService.getAvailableRooms(businessDetailId, checkInDateTime, checkOutDateTime);
            return ResponseEntity.ok(new APIResponse<>(200, "Available rooms fetched", available));
        } catch (DateTimeParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new APIResponse<>(400, "Invalid date format. Use yyyy-MM-dd", null));
        } catch (Exception e) {
            log.error("Error fetching available rooms", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse<>(500, "Error fetching available rooms", null));
        }
    }

}
