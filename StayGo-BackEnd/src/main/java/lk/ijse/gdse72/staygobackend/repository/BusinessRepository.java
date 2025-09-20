package lk.ijse.gdse72.staygobackend.repository;

import lk.ijse.gdse72.staygobackend.dto.BusinessDTO;
import lk.ijse.gdse72.staygobackend.entity.Business;
import lk.ijse.gdse72.staygobackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {
    List<Business> findByUser(User user);

    List<Business> findByBusinessCategory(String category);
    Page<Business> findByBusinessStatus(String active, Pageable pageable);
}
