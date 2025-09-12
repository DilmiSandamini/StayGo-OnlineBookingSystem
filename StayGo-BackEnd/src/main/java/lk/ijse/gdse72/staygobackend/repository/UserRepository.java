package lk.ijse.gdse72.staygobackend.repository;

import lk.ijse.gdse72.staygobackend.entity.Role;
import lk.ijse.gdse72.staygobackend.entity.User;
import org.hibernate.query.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
