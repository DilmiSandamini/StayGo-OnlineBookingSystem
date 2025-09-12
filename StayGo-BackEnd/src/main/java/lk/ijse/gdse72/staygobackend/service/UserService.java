package lk.ijse.gdse72.staygobackend.service;

import lk.ijse.gdse72.staygobackend.dto.UserDTO;
import org.hibernate.query.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();

}
