-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: jobdb
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curriculum_vitae` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied_date` datetime NOT NULL,
  `message` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('approved','pending','refused') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `candidate_id` int NOT NULL,
  `job_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `application_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate` (`id`) ON DELETE CASCADE,
  CONSTRAINT `application_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES (1,'cv1.pdf','2025-04-26 12:00:00','Tôi rất quan tâm đến vị trí này.','pending',1,1),(2,'cv2.pdf','2025-04-26 12:30:00','Tôi có kinh nghiệm phù hợp với công việc này.','pending',2,2),(3,'cv3.pdf','2025-04-26 13:00:00','Tôi muốn thử sức với công việc này.','pending',3,3),(4,'cv4.pdf','2025-04-26 13:30:00','Tôi đáp ứng đầy đủ yêu cầu công việc.','pending',4,4),(5,'cv5.pdf','2025-04-26 14:00:00','Tôi rất hứng thú với vị trí này.','pending',5,5),(6,'cv6.pdf','2025-04-26 14:30:00','Tôi có kỹ năng phù hợp.','pending',6,6),(7,'cv7.pdf','2025-04-26 15:00:00','Tôi muốn gia nhập đội ngũ của bạn.','pending',7,7),(8,'cv8.pdf','2025-04-26 15:30:00','Tôi có kinh nghiệm trong lĩnh vực này.','pending',8,8),(9,'cv9.pdf','2025-04-26 16:00:00','Tôi đáp ứng yêu cầu công việc.','pending',9,9),(10,'cv10.pdf','2025-04-26 16:30:00','Tôi rất quan tâm đến vị trí bác sĩ.','pending',10,10),(11,'cv11.pdf','2025-04-26 17:00:00','Tôi muốn thử sức với công việc này.','pending',11,11),(12,'cv12.pdf','2025-04-26 17:30:00','Tôi có kinh nghiệm thiết kế thời trang.','pending',12,12),(13,'cv13.pdf','2025-04-26 18:00:00','Tôi đáp ứng yêu cầu công việc.','pending',13,13),(14,'cv14.pdf','2025-04-26 18:30:00','Tôi có kỹ năng lập trình tốt.','pending',14,14),(15,'cv15.pdf','2025-04-26 19:00:00','Tôi muốn làm việc trong ngành tài chính.','pending',15,15),(16,'cv16.pdf','2025-04-26 19:30:00','Tôi có kinh nghiệm trong ngành kiến trúc.','pending',16,16),(17,'cv17.pdf','2025-04-26 20:00:00','Tôi đáp ứng yêu cầu công việc y tá.','pending',17,17),(18,'cv18.pdf','2025-04-26 20:30:00','Tôi muốn làm việc trong ngành du lịch.','pending',18,18),(19,'cv19.pdf','2025-04-26 21:00:00','Tôi có kinh nghiệm thiết kế đồ họa.','pending',19,19),(20,'cv20.pdf','2025-04-26 21:30:00','Tôi muốn làm việc trong ngành nông nghiệp.','pending',20,20);
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate`
--

DROP TABLE IF EXISTS `candidate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `date_of_birth` date NOT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `self_description` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `curriculum_vitae` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `candidate_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate`
--

LOCK TABLES `candidate` WRITE;
/*!40000 ALTER TABLE `candidate` DISABLE KEYS */;
INSERT INTO `candidate` VALUES (1,'Nguyễn Văn An','candidate1@example.com','1995-05-15','Hà Nội','avatar1.jpg','Tôi là người chăm chỉ và có động lực làm việc.','0123456781','cv1.pdf',4),(2,'Trần Thị Bình','candidate2@example.com','1998-03-22','Hồ Chí Minh','avatar2.jpg','Tôi có kinh nghiệm trong lĩnh vực dịch vụ khách hàng.','0123456782','cv2.pdf',5),(3,'Lê Minh Châu','candidate3@example.com','1996-07-10','Đà Nẵng','avatar3.jpg','Tôi đam mê công nghệ và lập trình.','0123456783','cv3.pdf',6),(4,'Phạm Quốc Dũng','candidate4@example.com','1997-09-12','Hà Nội','avatar4.jpg','Tôi có kỹ năng giao tiếp tốt.','0123456784','cv4.pdf',7),(5,'Hoàng Thị E','candidate5@example.com','1999-01-25','Hải Phòng','avatar5.jpg','Tôi yêu thích công việc sáng tạo.','0123456785','cv5.pdf',8),(6,'Ngô Văn F','candidate6@example.com','1994-11-30','Cần Thơ','avatar6.jpg','Tôi có kinh nghiệm trong ngành giáo dục.','0123456786','cv6.pdf',9),(7,'Đỗ Thị G','candidate7@example.com','1993-04-18','Hà Nội','avatar7.jpg','Tôi là người năng động và nhiệt huyết.','0123456787','cv7.pdf',10),(8,'Vũ Minh H','candidate8@example.com','1992-06-20','Hồ Chí Minh','avatar8.jpg','Tôi có kinh nghiệm quản lý sự kiện.','0123456788','cv8.pdf',11),(9,'Bùi Thị I','candidate9@example.com','1991-08-15','Đà Nẵng','avatar9.jpg','Tôi yêu thích công việc liên quan đến marketing.','0123456789','cv9.pdf',12),(10,'Lý Văn K','candidate10@example.com','1990-10-05','Hà Nội','avatar10.jpg','Tôi có kỹ năng phân tích dữ liệu tốt.','0123456790','cv10.pdf',13),(11,'Nguyễn Thị L','candidate11@example.com','1995-02-14','Hồ Chí Minh','avatar11.jpg','Tôi có kinh nghiệm trong ngành tài chính.','0123456791','cv11.pdf',14),(12,'Trần Văn M','candidate12@example.com','1996-03-16','Đà Nẵng','avatar12.jpg','Tôi yêu thích công việc liên quan đến thiết kế.','0123456792','cv12.pdf',15),(13,'Lê Thị N','candidate13@example.com','1997-05-20','Hà Nội','avatar13.jpg','Tôi có kỹ năng tổ chức tốt.','0123456793','cv13.pdf',16),(14,'Phạm Văn O','candidate14@example.com','1998-07-22','Hải Phòng','avatar14.jpg','Tôi đam mê công việc trong ngành y tế.','0123456794','cv14.pdf',17),(15,'Hoàng Thị P','candidate15@example.com','1999-09-25','Cần Thơ','avatar15.jpg','Tôi có kinh nghiệm trong ngành du lịch.','0123456795','cv15.pdf',18),(16,'Ngô Văn Q','candidate16@example.com','1994-11-28','Hà Nội','avatar16.jpg','Tôi có kỹ năng quản lý dự án.','0123456796','cv16.pdf',19),(17,'Đỗ Thị R','candidate17@example.com','1993-01-30','Hồ Chí Minh','avatar17.jpg','Tôi yêu thích công việc liên quan đến nhân sự.','0123456797','cv17.pdf',20),(18,'Vũ Văn S','candidate18@example.com','1992-03-10','Đà Nẵng','avatar18.jpg','Tôi có kinh nghiệm trong ngành xây dựng.','0123456798','cv18.pdf',21),(19,'Bùi Thị T','candidate19@example.com','1991-05-12','Hà Nội','avatar19.jpg','Tôi có kỹ năng viết lách tốt.','0123456799','cv19.pdf',22),(20,'Lý Văn U','candidate20@example.com','1990-07-15','Hồ Chí Minh','avatar20.jpg','Tôi yêu thích công việc liên quan đến môi trường.','0123456800','cv20.pdf',23);
/*!40000 ALTER TABLE `candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_review`
--

DROP TABLE IF EXISTS `candidate_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `review` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `review_date` datetime NOT NULL,
  `rating` int DEFAULT NULL,
  `job_id` int NOT NULL,
  `company_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `candidate_review_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE,
  CONSTRAINT `candidate_review_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_review`
--

LOCK TABLES `candidate_review` WRITE;
/*!40000 ALTER TABLE `candidate_review` DISABLE KEYS */;
INSERT INTO `candidate_review` VALUES (1,'Rất chuyên nghiệp và có kỹ năng tốt.','2025-04-26 14:30:00',5,1,1),(2,'Thái độ tốt nhưng cần thêm kinh nghiệm.','2025-04-26 14:45:00',3,2,2),(3,'Ứng viên có kỹ năng giảng dạy tốt.','2025-04-26 15:00:00',4,3,3),(4,'Ứng viên chăm chỉ, phù hợp với công việc.','2025-04-26 15:15:00',4,4,4),(5,'Có kỹ năng tổ chức sự kiện tốt.','2025-04-26 15:30:00',5,5,5),(6,'Ứng viên cần cải thiện kỹ năng giao tiếp.','2025-04-26 15:45:00',3,6,6),(7,'Rất sáng tạo trong công việc marketing.','2025-04-26 16:00:00',5,7,7),(8,'Kỹ năng tuyển dụng tốt, thái độ chuyên nghiệp.','2025-04-26 16:15:00',4,8,8),(9,'Có kinh nghiệm xây dựng nhưng cần thêm sáng tạo.','2025-04-26 16:30:00',3,9,9),(10,'Ứng viên rất phù hợp với vị trí bác sĩ.','2025-04-26 16:45:00',5,10,10),(11,'Kỹ năng giao tiếp tốt, phù hợp với du lịch.','2025-04-26 17:00:00',4,11,11),(12,'Có mắt thẩm mỹ tốt trong thiết kế thời trang.','2025-04-26 17:15:00',5,12,12),(13,'Ứng viên có kiến thức sâu về nông nghiệp.','2025-04-26 17:30:00',4,13,13),(14,'Kỹ năng lập trình ấn tượng.','2025-04-26 17:45:00',5,14,14),(15,'Có kinh nghiệm kế toán tốt.','2025-04-26 18:00:00',4,15,15),(16,'Ứng viên có kỹ năng kiến trúc tốt.','2025-04-26 18:15:00',5,16,16),(17,'Ứng viên rất tận tâm với công việc y tá.','2025-04-26 18:30:00',5,17,17),(18,'Kỹ năng bán hàng tốt, phù hợp với du lịch.','2025-04-26 18:45:00',4,18,18),(19,'Có kỹ năng thiết kế đồ họa xuất sắc.','2025-04-26 19:00:00',5,19,19),(20,'Ứng viên có kinh nghiệm quản lý trang trại.','2025-04-26 19:15:00',4,20,20);
/*!40000 ALTER TABLE `candidate_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `avatar` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `self_description` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tax_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `full_address` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('approved','pending','refused') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `tax_code` (`tax_code`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `company_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'Công ty TechCorp','company1@example.com','logo1.jpg','Công ty công nghệ hàng đầu tại Việt Nam.','TAX001','123 Đường Công Nghệ','Hà Nội','Cầu Giấy','approved',24),(2,'Công ty Foodie','company2@example.com','logo2.jpg','Chuyên cung cấp dịch vụ ăn uống và giải khát.','TAX002','456 Đại lộ Ẩm Thực','Hồ Chí Minh','Quận 1','approved',25),(3,'Công ty EduSmart','company3@example.com','logo3.jpg','Đơn vị cung cấp giải pháp giáo dục hiện đại.','TAX003','789 Đường Giáo Dục','Đà Nẵng','Hải Châu','approved',26),(4,'Công ty LogiFast','company4@example.com','logo4.jpg','Chuyên về vận chuyển và hậu cần.','TAX004','101 Đường Hậu Cần','Hà Nội','Ba Đình','pending',27),(5,'Công ty EventPro','company5@example.com','logo5.jpg','Tổ chức sự kiện chuyên nghiệp.','TAX005','202 Đường Sự Kiện','Hồ Chí Minh','Quận 7','approved',28),(6,'Công ty CleanHome','company6@example.com','logo6.jpg','Dịch vụ dọn dẹp và nội trợ.','TAX006','303 Đường Sạch Sẽ','Đà Nẵng','Thanh Khê','pending',29),(7,'Công ty MarketPlus','company7@example.com','logo7.jpg','Chuyên về marketing và truyền thông.','TAX007','404 Đường Truyền Thông','Hà Nội','Đống Đa','approved',30),(8,'Công ty HR Solutions','company8@example.com','logo8.jpg','Giải pháp nhân sự và tuyển dụng.','TAX008','505 Đường Nhân Sự','Hồ Chí Minh','Bình Thạnh','approved',31),(9,'Công ty TechBuild','company9@example.com','logo9.jpg','Công ty xây dựng và kỹ thuật.','TAX009','606 Đường Kỹ Thuật','Đà Nẵng','Liên Chiểu','pending',32),(10,'Công ty HealthCare','company10@example.com','logo10.jpg','Dịch vụ y tế và sức khỏe.','TAX010','707 Đường Sức Khỏe','Hà Nội','Hoàn Kiếm','approved',33),(11,'Công ty TravelJoy','company11@example.com','logo11.jpg','Chuyên về du lịch và nhà hàng.','TAX011','808 Đường Du Lịch','Hồ Chí Minh','Quận 3','approved',34),(12,'Công ty FashionTrend','company12@example.com','logo12.jpg','Thời trang và thiết kế.','TAX012','909 Đường Thời Trang','Đà Nẵng','Sơn Trà','pending',35),(13,'Công ty AgriGreen','company13@example.com','logo13.jpg','Nông nghiệp và môi trường.','TAX013','111 Đường Môi Trường','Hà Nội','Thanh Xuân','approved',36),(14,'Công ty SoftDev','company14@example.com','logo14.jpg','Phát triển phần mềm.','TAX014','222 Đường Phần Mềm','Hồ Chí Minh','Tân Bình','approved',37),(15,'Công ty FinancePro','company15@example.com','logo15.jpg','Dịch vụ tài chính và kế toán.','TAX015','333 Đường Tài Chính','Đà Nẵng','Ngũ Hành Sơn','pending',38),(16,'Công ty BuildHigh','company16@example.com','logo16.jpg','Xây dựng và kiến trúc.','TAX016','444 Đường Xây Dựng','Hà Nội','Hai Bà Trưng','approved',39),(17,'Công ty MedCare','company17@example.com','logo17.jpg','Chăm sóc y tế.','TAX017','555 Đường Y Tế','Hồ Chí Minh','Gò Vấp','approved',40),(18,'Công ty TourEasy','company18@example.com','logo18.jpg','Dịch vụ du lịch.','TAX018','666 Đường Du Lịch 2','Đà Nẵng','Hải Châu','approved',41),(19,'Công ty DesignPro','company19@example.com','logo19.jpg','Thiết kế sáng tạo.','TAX019','777 Đường Thiết Kế','Hà Nội','Cầu Giấy','approved',42),(20,'Công ty EcoFarm','company20@example.com','logo20.jpg','Nông nghiệp bền vững.','TAX020','888 Đường Nông Nghiệp','Hồ Chí Minh','Quận 1','approved',43);
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_review`
--

DROP TABLE IF EXISTS `company_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `review` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `review_date` datetime NOT NULL,
  `rating` int DEFAULT NULL,
  `job_id` int NOT NULL,
  `candidate_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  KEY `candidate_id` (`candidate_id`),
  CONSTRAINT `company_review_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE,
  CONSTRAINT `company_review_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `candidate` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_review`
--

LOCK TABLES `company_review` WRITE;
/*!40000 ALTER TABLE `company_review` DISABLE KEYS */;
INSERT INTO `company_review` VALUES (1,'Môi trường làm việc rất tốt!','2025-04-26 14:00:00',5,1,1),(2,'Lương cao nhưng áp lực lớn.','2025-04-26 14:15:00',4,2,2),(3,'Công ty hỗ trợ giáo viên rất tốt.','2025-04-26 14:30:00',5,3,3),(4,'Công ty cần cải thiện chế độ đãi ngộ.','2025-04-26 14:45:00',3,4,4),(5,'Môi trường sáng tạo, phù hợp với tổ chức sự kiện.','2025-04-26 15:00:00',5,5,5),(6,'Công ty cần cải thiện quản lý nhân sự.','2025-04-26 15:15:00',3,6,6),(7,'Công ty có nhiều cơ hội phát triển trong marketing.','2025-04-26 15:30:00',5,7,7),(8,'Môi trường làm việc chuyên nghiệp.','2025-04-26 15:45:00',4,8,8),(9,'Công ty cần cải thiện phúc lợi cho nhân viên.','2025-04-26 16:00:00',3,9,9),(10,'Môi trường y tế rất tốt, đồng nghiệp thân thiện.','2025-04-26 16:15:00',5,10,10),(11,'Công ty du lịch có nhiều cơ hội học hỏi.','2025-04-26 16:30:00',4,11,11),(12,'Môi trường sáng tạo, phù hợp với thiết kế thời trang.','2025-04-26 16:45:00',5,12,12),(13,'Công ty nông nghiệp hỗ trợ nhân viên tốt.','2025-04-26 17:00:00',4,13,13),(14,'Môi trường công nghệ rất năng động.','2025-04-26 17:15:00',5,14,14),(15,'Công ty tài chính cần cải thiện lương thưởng.','2025-04-26 17:30:00',3,15,15),(16,'Môi trường làm việc chuyên nghiệp trong ngành kiến trúc.','2025-04-26 17:45:00',5,16,16),(17,'Công ty y tế có môi trường làm việc tốt.','2025-04-26 18:00:00',5,17,17),(18,'Công ty du lịch cần cải thiện quản lý.','2025-04-26 18:15:00',3,18,18),(19,'Môi trường thiết kế rất sáng tạo.','2025-04-26 18:30:00',5,19,19),(20,'Công ty nông nghiệp có nhiều cơ hội phát triển.','2025-04-26 18:45:00',4,20,20);
/*!40000 ALTER TABLE `company_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `day`
--

DROP TABLE IF EXISTS `day`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `day` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `day`
--

LOCK TABLES `day` WRITE;
/*!40000 ALTER TABLE `day` DISABLE KEYS */;
INSERT INTO `day` VALUES (9,'Bất kỳ thời gian nào'),(7,'Chủ Nhật'),(2,'Thứ Ba'),(6,'Thứ Bảy'),(1,'Thứ Hai'),(4,'Thứ Năm'),(5,'Thứ Sáu'),(3,'Thứ Tư'),(8,'Toàn thời gian');
/*!40000 ALTER TABLE `day` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `day_job`
--

DROP TABLE IF EXISTS `day_job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `day_job` (
  `id` int NOT NULL AUTO_INCREMENT,
  `day_id` int DEFAULT NULL,
  `job_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_id` (`job_id`,`day_id`),
  KEY `day_id` (`day_id`),
  CONSTRAINT `day_job_ibfk_1` FOREIGN KEY (`day_id`) REFERENCES `day` (`id`) ON DELETE SET NULL,
  CONSTRAINT `day_job_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `day_job`
--

LOCK TABLES `day_job` WRITE;
/*!40000 ALTER TABLE `day_job` DISABLE KEYS */;
INSERT INTO `day_job` VALUES (1,8,1),(2,1,2),(3,2,2),(4,9,3),(5,9,4),(6,8,5),(7,9,6),(8,8,7),(9,8,8),(10,8,9),(11,8,10),(12,9,11),(13,8,12),(14,8,13),(15,8,14),(16,8,15),(17,8,16),(18,8,17),(19,9,18),(20,8,19),(21,8,20);
/*!40000 ALTER TABLE `day_job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow`
--

DROP TABLE IF EXISTS `follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `follow_date` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_candidate_followed` tinyint(1) NOT NULL DEFAULT '1',
  `candidate_id` int NOT NULL,
  `company_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate` (`id`) ON DELETE CASCADE,
  CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow`
--

LOCK TABLES `follow` WRITE;
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
INSERT INTO `follow` VALUES (1,'2025-04-26 13:00:00',1,1,1,1),(2,'2025-04-26 13:15:00',1,1,2,2),(3,'2025-04-26 13:30:00',1,1,3,3),(4,'2025-04-26 13:45:00',1,1,4,4),(5,'2025-04-26 14:00:00',1,1,5,5),(6,'2025-04-26 14:15:00',1,1,6,6),(7,'2025-04-26 14:30:00',1,1,7,7),(8,'2025-04-26 14:45:00',1,1,8,8),(9,'2025-04-26 15:00:00',1,1,9,9),(10,'2025-04-26 15:15:00',1,1,10,10),(11,'2025-04-26 15:30:00',1,1,11,11),(12,'2025-04-26 15:45:00',1,1,12,12),(13,'2025-04-26 16:00:00',1,1,13,13),(14,'2025-04-26 16:15:00',1,1,14,14),(15,'2025-04-26 16:30:00',1,1,15,15),(16,'2025-04-26 16:45:00',1,1,16,16),(17,'2025-04-26 17:00:00',1,1,17,17),(18,'2025-04-26 17:15:00',1,1,18,18),(19,'2025-04-26 17:30:00',1,1,19,19),(20,'2025-04-26 17:45:00',1,1,20,20);
/*!40000 ALTER TABLE `follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image_workplace`
--

DROP TABLE IF EXISTS `image_workplace`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image_workplace` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `image_workplace_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image_workplace`
--

LOCK TABLES `image_workplace` WRITE;
/*!40000 ALTER TABLE `image_workplace` DISABLE KEYS */;
INSERT INTO `image_workplace` VALUES (1,'anh_techcorp_1.jpg',1),(2,'anh_techcorp_2.jpg',1),(3,'anh_foodie_1.jpg',2),(4,'anh_foodie_2.jpg',2),(5,'anh_edusmart_1.jpg',3),(6,'anh_edusmart_2.jpg',3),(7,'anh_logifast_1.jpg',4),(8,'anh_logifast_2.jpg',4),(9,'anh_eventpro_1.jpg',5),(10,'anh_eventpro_2.jpg',5),(11,'anh_cleanhome_1.jpg',6),(12,'anh_cleanhome_2.jpg',6),(13,'anh_marketplus_1.jpg',7),(14,'anh_marketplus_2.jpg',7),(15,'anh_hrsolutions_1.jpg',8),(16,'anh_hrsolutions_2.jpg',8),(17,'anh_techbuild_1.jpg',9),(18,'anh_techbuild_2.jpg',9),(19,'anh_healthcare_1.jpg',10),(20,'anh_healthcare_2.jpg',10),(21,'anh_traveljoy_1.jpg',11),(22,'anh_traveljoy_2.jpg',11),(23,'anh_fashiontrend_1.jpg',12),(24,'anh_fashiontrend_2.jpg',12),(25,'anh_agrigreen_1.jpg',13),(26,'anh_agrigreen_2.jpg',13),(27,'anh_softdev_1.jpg',14),(28,'anh_softdev_2.jpg',14),(29,'anh_financepro_1.jpg',15),(30,'anh_financepro_2.jpg',15),(31,'anh_buildhigh_1.jpg',16),(32,'anh_buildhigh_2.jpg',16),(33,'anh_medcare_1.jpg',17),(34,'anh_medcare_2.jpg',17),(35,'anh_toureasy_1.jpg',18),(36,'anh_toureasy_2.jpg',18),(37,'anh_designpro_1.jpg',19),(38,'anh_designpro_2.jpg',19),(39,'anh_ecofarm_1.jpg',20),(40,'anh_ecofarm_2.jpg',20);
/*!40000 ALTER TABLE `image_workplace` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job`
--

DROP TABLE IF EXISTS `job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_required` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `salary_min` bigint DEFAULT NULL,
  `salary_max` bigint DEFAULT NULL,
  `age_from` int DEFAULT NULL,
  `age_to` int DEFAULT NULL,
  `experience_required` int DEFAULT NULL,
  `full_address` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('approved','pending','refused') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `posted_date` datetime DEFAULT NULL,
  `company_id` int NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `job_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job`
--

LOCK TABLES `job` WRITE;
/*!40000 ALTER TABLE `job` DISABLE KEYS */;
INSERT INTO `job` VALUES (1,'Kỹ sư phần mềm','Phát triển và bảo trì các ứng dụng web.','Tốt nghiệp đại học ngành CNTT, 2+ năm kinh nghiệm.',15000000,25000000,22,35,2,'123 Đường Công Nghệ','Hà Nội','Cầu Giấy','pending',1,'2025-04-26 09:00:00',1,21.0285,105.8481),(2,'Nhân viên dịch vụ khách hàng','Xử lý các yêu cầu và khiếu nại của khách hàng.','Kỹ năng giao tiếp tốt, 1+ năm kinh nghiệm.',8000000,12000000,20,30,1,'456 Đại lộ Ẩm Thực','Hồ Chí Minh','Quận 1','approved',1,'2025-04-26 10:00:00',2,10.7769,106.7009),(3,'Giáo viên tiếng Anh','Dạy tiếng Anh cho học sinh tiểu học.','Tốt nghiệp đại học, chứng chỉ TESOL.',10000000,15000000,22,40,1,'789 Đường Giáo Dục','Đà Nẵng','Hải Châu','approved',1,'2025-04-26 11:00:00',3,16.0471,108.2068),(4,'Tài xế giao hàng','Giao các đơn hàng đến khách hàng.','Có xe máy, kỹ năng định vị tốt.',7000000,10000000,18,40,0,'101 Đường Hậu Cần','Hà Nội','Ba Đình','approved',1,'2025-04-26 12:00:00',4,21.0367,105.8342),(5,'Nhân viên tổ chức sự kiện','Lên kế hoạch và tổ chức sự kiện.','Kỹ năng tổ chức, 1+ năm kinh nghiệm.',9000000,13000000,20,35,1,'202 Đường Sự Kiện','Hồ Chí Minh','Quận 7','pending',1,'2025-04-26 13:00:00',5,10.7299,106.7234),(6,'Nhân viên dọn dẹp','Dọn dẹp văn phòng và nhà ở.','Chăm chỉ, không yêu cầu kinh nghiệm.',6000000,8000000,18,50,0,'303 Đường Sạch Sẽ','Đà Nẵng','Thanh Khê','approved',1,'2025-04-26 14:00:00',6,16.0667,108.2099),(7,'Nhân viên marketing','Thực hiện các chiến dịch quảng cáo.','Tốt nghiệp đại học ngành marketing, 2+ năm kinh nghiệm.',12000000,18000000,22,35,2,'404 Đường Truyền Thông','Hà Nội','Đống Đa','approved',1,'2025-04-26 15:00:00',7,21.0162,105.8299),(8,'Chuyên viên tuyển dụng','Tuyển dụng và quản lý nhân sự.','Kỹ năng giao tiếp, 1+ năm kinh nghiệm.',10000000,15000000,22,40,1,'505 Đường Nhân Sự','Hồ Chí Minh','Bình Thạnh','pending',1,'2025-04-26 16:00:00',8,10.8039,106.7219),(9,'Kỹ sư xây dựng','Thiết kế và giám sát công trình.','Tốt nghiệp đại học ngành xây dựng, 3+ năm kinh nghiệm.',15000000,20000000,25,45,3,'606 Đường Kỹ Thuật','Đà Nẵng','Liên Chiểu','approved',1,'2025-04-26 17:00:00',9,16.0741,108.1498),(10,'Bác sĩ','Khám và điều trị bệnh nhân.','Tốt nghiệp đại học y, 2+ năm kinh nghiệm.',20000000,30000000,25,50,2,'707 Đường Sức Khỏe','Hà Nội','Hoàn Kiếm','approved',1,'2025-04-26 18:00:00',10,21.0313,105.8516),(11,'Hướng dẫn viên du lịch','Hướng dẫn khách du lịch tham quan.','Kỹ năng giao tiếp, biết tiếng Anh.',8000000,12000000,20,35,1,'808 Đường Du Lịch','Hồ Chí Minh','Quận 3','approved',1,'2025-04-26 19:00:00',11,10.7872,106.6937),(12,'Nhà thiết kế thời trang','Thiết kế quần áo và phụ kiện.','Tốt nghiệp ngành thiết kế, 2+ năm kinh nghiệm.',12000000,18000000,22,35,2,'909 Đường Thời Trang','Đà Nẵng','Sơn Trà','pending',1,'2025-04-26 20:00:00',12,16.0815,108.2235),(13,'Kỹ sư nông nghiệp','Nghiên cứu và phát triển nông nghiệp bền vững.','Tốt nghiệp đại học ngành nông nghiệp, 1+ năm kinh nghiệm.',10000000,15000000,22,40,1,'111 Đường Môi Trường','Hà Nội','Thanh Xuân','approved',1,'2025-04-26 21:00:00',13,21.0076,105.8118),(14,'Lập trình viên','Phát triển ứng dụng di động.','Tốt nghiệp đại học ngành CNTT, 2+ năm kinh nghiệm.',15000000,25000000,22,35,2,'222 Đường Phần Mềm','Hồ Chí Minh','Tân Bình','approved',1,'2025-04-26 22:00:00',14,10.8019,106.6601),(15,'Kế toán viên','Quản lý tài chính và sổ sách kế toán.','Tốt nghiệp đại học ngành kế toán, 1+ năm kinh nghiệm.',10000000,15000000,22,40,1,'333 Đường Tài Chính','Đà Nẵng','Ngũ Hành Sơn','approved',1,'2025-04-26 23:00:00',15,16.0345,108.2456),(16,'Kỹ sư kiến trúc','Thiết kế và lập kế hoạch công trình.','Tốt nghiệp đại học ngành kiến trúc, 3+ năm kinh nghiệm.',15000000,20000000,25,45,3,'444 Đường Xây Dựng','Hà Nội','Hai Bà Trưng','approved',1,'2025-04-27 09:00:00',16,21.0158,105.8509),(17,'Y tá','Hỗ trợ bác sĩ và chăm sóc bệnh nhân.','Tốt nghiệp cao đẳng y, 1+ năm kinh nghiệm.',8000000,12000000,20,40,1,'555 Đường Y Tế','Hồ Chí Minh','Gò Vấp','approved',1,'2025-04-27 10:00:00',17,10.8389,106.6667),(18,'Nhân viên du lịch','Tư vấn và bán tour du lịch.','Kỹ năng bán hàng, biết tiếng Anh.',7000000,11000000,20,35,1,'666 Đường Du Lịch 2','Đà Nẵng','Hải Châu','pending',1,'2025-04-27 11:00:00',18,16.0471,108.2068),(19,'Nhà thiết kế đồ họa','Thiết kế logo và ấn phẩm truyền thông.','Tốt nghiệp ngành thiết kế, 2+ năm kinh nghiệm.',12000000,18000000,22,35,2,'777 Đường Thiết Kế','Hà Nội','Cầu Giấy','approved',1,'2025-04-27 12:00:00',19,21.0285,105.8481),(20,'Nhân viên nông nghiệp','Quản lý và vận hành trang trại.','Tốt nghiệp ngành nông nghiệp, 1+ năm kinh nghiệm.',8000000,12000000,20,40,1,'888 Đường Nông Nghiệp','Hồ Chí Minh','Quận 1','pending',1,'2025-04-27 13:00:00',20,10.7769,106.7009);
/*!40000 ALTER TABLE `job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `major`
--

DROP TABLE IF EXISTS `major`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `major` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `major`
--

LOCK TABLES `major` WRITE;
/*!40000 ALTER TABLE `major` DISABLE KEYS */;
INSERT INTO `major` VALUES (1,'Bán lẻ & Kinh doanh'),(2,'Ẩm thực & Đồ uống'),(3,'Dịch vụ khách hàng'),(4,'Giao hàng & Hậu cần'),(5,'Gia sư & Giáo dục'),(6,'Hành chính & Văn phòng'),(7,'Làm việc tự do & Trực tuyến'),(8,'Sự kiện & Quảng bá'),(9,'Dọn dẹp & Nội trợ'),(10,'Dịch vụ công cộng'),(11,'Công nghệ thông tin'),(12,'Kế toán & Tài chính'),(13,'Marketing & Truyền thông'),(14,'Nhân sự & Tuyển dụng'),(15,'Kỹ thuật & Sản xuất'),(16,'Xây dựng & Kiến trúc'),(17,'Y tế & Sức khỏe'),(18,'Du lịch & Nhà hàng'),(19,'Thời trang & Thiết kế'),(20,'Nông nghiệp & Môi trường');
/*!40000 ALTER TABLE `major` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `major_job`
--

DROP TABLE IF EXISTS `major_job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `major_job` (
  `id` int NOT NULL AUTO_INCREMENT,
  `major_id` int DEFAULT NULL,
  `job_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_id` (`job_id`,`major_id`),
  KEY `major_id` (`major_id`),
  CONSTRAINT `major_job_ibfk_1` FOREIGN KEY (`major_id`) REFERENCES `major` (`id`) ON DELETE SET NULL,
  CONSTRAINT `major_job_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `major_job`
--

LOCK TABLES `major_job` WRITE;
/*!40000 ALTER TABLE `major_job` DISABLE KEYS */;
INSERT INTO `major_job` VALUES (1,11,1),(2,3,2),(3,5,3),(4,4,4),(5,8,5),(6,9,6),(7,13,7),(8,14,8),(9,15,9),(10,17,10),(11,18,11),(12,19,12),(13,20,13),(14,11,14),(15,12,15),(16,16,16),(17,17,17),(18,18,18),(19,19,19),(20,20,20);
/*!40000 ALTER TABLE `major_job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `register_date` datetime NOT NULL,
  `role` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin1','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:37:00','ROLE_ADMIN',1),(2,'admin2','$2a$10$RS7JRY1u3rkhEcN/hDJziOG/b4/7aKtYW/Q5LLpxU2LMdiZAVB/fa','2025-04-25 16:38:00','ROLE_ADMIN',1),(3,'admin3','$2a$10$RS7JRY1u3rkhEcN/hDJziOG/b4/7aKtYW/Q5LLpxU2LMdiZAVB/fa','2025-04-25 16:39:00','ROLE_ADMIN',1),(4,'ungvien1','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:40:00','ROLE_CANDIDATE',1),(5,'ungvien2','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:41:00','ROLE_CANDIDATE',1),(6,'ungvien3','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:42:00','ROLE_CANDIDATE',1),(7,'ungvien4','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:43:00','ROLE_CANDIDATE',1),(8,'ungvien5','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:44:00','ROLE_CANDIDATE',1),(9,'ungvien6','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:45:00','ROLE_CANDIDATE',1),(10,'ungvien7','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:46:00','ROLE_CANDIDATE',1),(11,'ungvien8','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:47:00','ROLE_CANDIDATE',1),(12,'ungvien9','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:48:00','ROLE_CANDIDATE',1),(13,'ungvien10','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:49:00','ROLE_CANDIDATE',1),(14,'ungvien11','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:50:00','ROLE_CANDIDATE',1),(15,'ungvien12','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:51:00','ROLE_CANDIDATE',1),(16,'ungvien13','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:52:00','ROLE_CANDIDATE',1),(17,'ungvien14','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:53:00','ROLE_CANDIDATE',1),(18,'ungvien15','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:54:00','ROLE_CANDIDATE',1),(19,'ungvien16','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:55:00','ROLE_CANDIDATE',1),(20,'ungvien17','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:56:00','ROLE_CANDIDATE',1),(21,'ungvien18','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:57:00','ROLE_CANDIDATE',1),(22,'ungvien19','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:58:00','ROLE_CANDIDATE',1),(23,'ungvien20','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:59:00','ROLE_CANDIDATE',1),(24,'congty1','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:00:00','ROLE_COMPANY',1),(25,'congty2','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:01:00','ROLE_COMPANY',1),(26,'congty3','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:02:00','ROLE_COMPANY',1),(27,'congty4','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:03:00','ROLE_COMPANY',1),(28,'congty5','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:04:00','ROLE_COMPANY',1),(29,'congty6','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:05:00','ROLE_COMPANY',1),(30,'congty7','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:06:00','ROLE_COMPANY',1),(31,'congty8','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:07:00','ROLE_COMPANY',1),(32,'congty9','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:08:00','ROLE_COMPANY',1),(33,'congty10','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:09:00','ROLE_COMPANY',1),(34,'congty11','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:10:00','ROLE_COMPANY',1),(35,'congty12','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:11:00','ROLE_COMPANY',1),(36,'congty13','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:12:00','ROLE_COMPANY',1),(37,'congty14','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:13:00','ROLE_COMPANY',1),(38,'congty15','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:14:00','ROLE_COMPANY',1),(39,'congty16','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:15:00','ROLE_COMPANY',1),(40,'congty17','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:16:00','ROLE_COMPANY',1),(41,'congty18','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:17:00','ROLE_COMPANY',1),(42,'congty19','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:18:00','ROLE_COMPANY',1),(43,'congty20','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 17:19:00','ROLE_COMPANY',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'jobdb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-30 19:32:41
