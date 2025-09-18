package lk.ijse.gdse72.staygobackend.service;

import lk.ijse.gdse72.staygobackend.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    Page<UserDTO> getAllNonAdminUsers(Pageable pageable);
    Page<UserDTO> getAllClientUsers(Pageable pageable);
    Page<UserDTO> getAllBusinessUsers(Pageable pageable);
    Page<UserDTO> getAllActiveUsers(Pageable pageable);
    Page<UserDTO> getAllInactiveUsers(Pageable pageable);

    UserDTO updateUser(Long id, UserDTO userDTO);

    void updateUserStatus(Long id, String inactive);
}
