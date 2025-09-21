package lk.ijse.gdse72.staygobackend.controller;

import lk.ijse.gdse72.staygobackend.service.OtpService;
import lk.ijse.gdse72.staygobackend.util.EmailUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    private final EmailUtil emailUtil;
    private final OtpService otpService;

    public OtpController(EmailUtil emailUtil, OtpService otpService) {
        this.emailUtil = emailUtil;
        this.otpService = otpService;
    }

    @PostMapping("/send")
    public String sendOtp(@RequestParam String email) {
        String otp = otpService.generateOtp();
        emailUtil.sendEmail(email, "Your OTP Code", "Your OTP is: " + otp);
        return "OTP sent to " + email;
    }
}