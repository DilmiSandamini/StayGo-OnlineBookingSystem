# StayGo – Online Room Booking System 🏨✨

StayGo is a modern and user-friendly **online room booking system** where clients can explore and book hotels, apartments, villas, and resorts.  
Business owners can manage their properties and booking requests, while admins oversee the entire platform with advanced user and booking management tools.  

---

## 🚀 Features

### 👤 Client
- Register & Login with role-based access.
- Search & view available hotels, apartments, villas, and resorts.
- Make room bookings with details like check-in, check-out, and room count.
- Cancel or reject their own bookings.
- Receive booking status updates via email.

### 🏢 Business Owner
- Register business properties (hotel, villa, apartment, resort).
- Add and manage rooms with details & facilities.
- View incoming booking requests.
- Accept or reject bookings.
- Manage availability and pricing.

### 🛡️ Admin
- Login with secure authentication.
- Manage all users (Clients & Business Owners).
- Categorized user statistics: total, active, inactive.
- View and manage bookings across the platform.
- Monitor system activity via analytics dashboard.
- Automatic email notifications for new logins and bookings.

---

## 🛠️ Tech Stack

- **Backend:** Spring Boot (Java)
- **Frontend:** Bootstrap 5, jQuery, AJAX
- **Database:** MySQL
- **ORM & JPA:** Hibernate / Spring Data JPA
- **Connection Pooling:** Apache Commons DBCP2
- **Build Tool:** Maven
- **Authentication & Security:** Spring Security (optional, if implemented)
- **Email Notifications:** JavaMailSender
- **Payment Integration:** PayHere (if enabled)

---

## ⚙️ Setup Instructions

### 🔹 Backend (Spring Boot)
1. Clone the repository:
   ```bash
   git clone https://github.com/DilmiSandamini/StayGo-OnlineBookingSystem.git
   cd StayGo-OnlineBookingSystem/backend

2. Configure MySQL Database:
   Create a database named staygo.
   Update application.properties:
      # Database settings
      spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
      spring.datasource.username=root
      spring.datasource.password=mysql
      spring.datasource.url=jdbc:mysql://localhost:3306/Staygo?createDatabaseIfNotExist=true
      spring.datasource.hikari.maximum-pool-size=10

   
3. Configure Email (JavaMailSender):
      # Email configurations
      spring.mail.host=smtp.gmail.com
      spring.mail.port=587
      spring.mail.username=${MAIL_USERNAME}
      spring.mail.password=${MAIL_PASSWORD}
      spring.mail.properties.mail.smtp.auth=true
      spring.mail.properties.mail.smtp.starttls.enable=true  

4. Run the backend:
      mvn clean install
      mvn spring-boot:run
---

## 🖼️ Screenshots  

---

### 🏠 Home / Landing Page  
<p align="center">
  <img src="https://i.ibb.co/hFHdDz76/Screenshot-2025-09-22-191124.png" alt="Home Page" width="80%">
</p>  

---

### 📊 Business & Client Dashboards  
<p align="center">
  <img src="https://i.ibb.co/RGzxTMqq/Screenshot-2025-09-23-092901.png" alt="Dashboard 1" width="45%">
  <img src="https://i.ibb.co/qYdmZqWN/Screenshot-2025-09-23-093341.png" alt="Dashboard 2" width="45%">
</p>  

<p align="center">
  <img src="https://i.ibb.co/sS183yq/Screenshot-2025-09-23-093420.png" alt="Dashboard 3" width="45%">
  <img src="https://i.ibb.co/9mPM47Hs/Screenshot-2025-09-23-093536.png" alt="Dashboard 4" width="45%">
</p>  

<p align="center">
  <img src="https://i.ibb.co/NgTNH8Vg/Screenshot-2025-09-23-093241.png" alt="Dashboard 5" width="60%">
</p>  

---

### 📝 Add Details Form  
<p align="center">
  <img src="https://i.ibb.co/mrJ2wQp4/Screenshot-2025-09-23-092926.png" alt="Form 1" width="45%">
  <img src="https://i.ibb.co/m5DZntds/Screenshot-2025-09-23-093143.png" alt="Form 2" width="45%">
</p>  

---

### 📅 Booking Details  
<p align="center">
  <img src="https://i.ibb.co/LdvKr321/Screenshot-2025-09-23-093603.png" alt="Booking 1" width="45%">
  <img src="https://i.ibb.co/Nndmd2HR/Screenshot-2025-09-23-093023.png" alt="Booking 2" width="45%">
</p>  

---

### 🛡️ Admin Dashboard  
<p align="center">
  <img src="https://i.ibb.co/DPnL5cmx/Screenshot-2025-09-23-092613.png" alt="Admin Dashboard" width="80%">
</p> 

---

## 🎥 Demo Video  

<div align="center">
  <a href="https://youtu.be/qOAoN3GJxeE" target="_blank">
    <img src="https://img.youtube.com/vi/qOAoN3GJxeE/0.jpg" alt="StayGo Demo Video" width="720">
  </a>
  <br>
  ▶️ <a href="https://youtu.be/qOAoN3GJxeE" target="_blank">Watch on YouTube</a>
</div>


