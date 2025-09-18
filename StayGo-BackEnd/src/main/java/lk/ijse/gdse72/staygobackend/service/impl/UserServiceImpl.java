package lk.ijse.gdse72.staygobackend.service.impl;

import lk.ijse.gdse72.staygobackend.dto.UserDTO;
import lk.ijse.gdse72.staygobackend.entity.Role;
import lk.ijse.gdse72.staygobackend.entity.User;
import lk.ijse.gdse72.staygobackend.repository.UserRepository;
import lk.ijse.gdse72.staygobackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper; // model mapper ekk inject karanawa

    @Override
    public Page<UserDTO> getAllNonAdminUsers(Pageable pageable) {
        Page<User> usersPage = userRepository.findAllByRoleNot(Role.ADMIN, pageable);
        return usersPage.map(user -> modelMapper.map(user, UserDTO.class));
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        return modelMapper.map(allUsers, new TypeToken<List<UserDTO>>() {}.getType());
    }

    @Override
    public Page<UserDTO> getAllClientUsers(Pageable pageable) {
        Page<User> users = userRepository.findAllByRole(Role.CLIENT, pageable);
        return users.map(user -> modelMapper.map(user, UserDTO.class));
    }

    @Override
    public Page<UserDTO> getAllBusinessUsers(Pageable pageable) {
        Page<User> users = userRepository.findAllByRole(Role.BUSINESS, pageable);
        return users.map(user -> modelMapper.map(user, UserDTO.class));
    }

    @Override
    public Page<UserDTO> getAllActiveUsers(Pageable pageable) {
        Page<User> users = userRepository.findAllByStatusIgnoreCase("active", pageable);
        return users.map(user -> modelMapper.map(user, UserDTO.class));
    }

    @Override
    public Page<UserDTO> getAllInactiveUsers(Pageable pageable) {
        Page<User> users = userRepository.findAllByStatusIgnoreCase("inactive", pageable);
        return users.map(user -> modelMapper.map(user, UserDTO.class));
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        // Update fields
        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setUsername(userDTO.getUsername());
        user.setStatus(userDTO.getStatus());

        User updated = userRepository.save(user);
        return modelMapper.map(updated, UserDTO.class);
    }

    @Override
    public void updateUserStatus(Long id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        user.setStatus(status);
        userRepository.save(user);
    }

}
