package lk.ijse.gdse72.staygobackend.controller;

import jakarta.validation.Valid;
import lk.ijse.gdse72.staygobackend.dto.PaymentDTO;
import lk.ijse.gdse72.staygobackend.service.PaymentService;
import lk.ijse.gdse72.staygobackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@CrossOrigin
public class PaymentController {

private final PaymentService paymentService;

    @PostMapping("/savePayment")
    public ResponseEntity<APIResponse<String>> savePayment(@RequestBody @Valid PaymentDTO paymentDTO) {
        paymentService.savePayment(paymentDTO);
        return ResponseEntity.ok(new APIResponse<>(200, "Payment saved successfully", null));
    }
}
