package lk.ijse.gdse72.staygobackend.controller;

import lk.ijse.gdse72.staygobackend.service.OtpService;
import lk.ijse.gdse72.staygobackend.util.EmailUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth/otp")
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
        emailUtil.sendEmail(email, "StayGo OTP Code", "Your OTP is: " + otp);
        return "OTP sent to " + email;
    }

    @PostMapping("/reset")
    public String resetPassword(@RequestBody ResetPasswordRequest dto) {
        // call your AuthService.resetPasswordWithOtp
        // inject AuthService in this controller
        return "Password reset success";
    }

    public static class ResetPasswordRequest {
        private String email;
        private String otp;
        private String newUsername;
        private String newPassword;

        // getters & setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
        public String getNewUsername() { return newUsername; }
        public void setNewUsername(String newUsername) { this.newUsername = newUsername; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
