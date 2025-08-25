package lk.ijse.gdse72.staygobackend.repository;

import lk.ijse.gdse72.staygobackend.entity.Business;
import lk.ijse.gdse72.staygobackend.entity.BusinessDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessDetailsRepository extends JpaRepository<BusinessDetails, Long> {
    List<BusinessDetails> findByBusiness(Business business);
}