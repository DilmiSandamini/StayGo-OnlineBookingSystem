package lk.ijse.gdse72.staygobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String accessToken;
    private String role;
    private Long userId;
}