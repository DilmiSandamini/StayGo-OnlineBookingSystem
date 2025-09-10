package lk.ijse.gdse72.staygobackend.service.impl;

import lk.ijse.gdse72.staygobackend.dto.UserDTO;
import lk.ijse.gdse72.staygobackend.entity.User;
import lk.ijse.gdse72.staygobackend.repository.UserRepository;
import lk.ijse.gdse72.staygobackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper; // model mapper ekk inject karanawa

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        return modelMapper.map(allUsers, new org.modelmapper.TypeToken<List<UserDTO>>() {}.getType());
    }
}
