package lk.ijse.gdse72.staygobackend.service.impl;

import lk.ijse.gdse72.staygobackend.dto.PaymentDTO;
import lk.ijse.gdse72.staygobackend.entity.BusinessBooking;
import lk.ijse.gdse72.staygobackend.entity.Payment;
import lk.ijse.gdse72.staygobackend.repository.BusinessBookingRepository;
import lk.ijse.gdse72.staygobackend.repository.PaymentRepository;
import lk.ijse.gdse72.staygobackend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ModelMapper modelMapper;
    private final BusinessBookingRepository businessBookingRepository;

    @Override
    public void savePayment(PaymentDTO paymentDTO) {
        if (paymentDTO.getPaymentStatus() == null) {
            paymentDTO.setPaymentStatus("Pending");
        }
        Payment payment = modelMapper.map(paymentDTO, Payment.class);
        payment.setCreatedAt(new java.sql.Timestamp(System.currentTimeMillis()));

        if (paymentDTO.getBookingId() != null) {
            BusinessBooking businessBooking = businessBookingRepository.findById(Long.valueOf(paymentDTO.getBookingId()))
                    .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + paymentDTO.getBookingId()));
            payment.setBusinessBooking(businessBooking);
        } else {
            throw new RuntimeException("Booking ID is required to create a payment");
        }
        paymentRepository.save(payment);
    }
}
