-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: jobdb
-- ------------------------------------------------------
-- Server version	8.4.5

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
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('approved','pending','refused') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `candidate_id` int NOT NULL,
  `job_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `application_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate` (`id`) ON DELETE CASCADE,
  CONSTRAINT `application_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES (13,'https://res.cloudinary.com/dmbvjjg5a/image/upload/a-customised-curve-cv_qctrqp.pdf','2025-04-29 01:51:56','Dear [Hiring Manager\'s Name / HR Department],\n\nMy name is [Full Name], and I am writing to express my sincere interest in the position of [Job Title] at [Company Name]. I hold a degree in [Your Major] from [University Name], and I am eager to apply my knowledge and passion in the field of [Industry/Field] to contribute to your esteemed organization.\n\nWith the relevant skills, a strong work ethic, and a desire to grow professionally, I believe I would be a valuable addition to your team.','approved',3,1),(19,'https://res.cloudinary.com/dmbvjjg5a/image/upload/a-customised-curve-cv_qctrqp.pdf','2025-04-29 01:51:56',NULL,'refused',7,2),(24,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746260640/jh7gkumzfzhb8fpnqg2r.pdf','2025-05-03 00:00:00','huhu\r\n','refused',28,8),(26,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1747130630/fzewj1cu5y5klr122bmq.pdf','2025-05-13 17:03:44',NULL,'refused',27,1),(27,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1747134793/kcx71mi1o6qpzytjooss.pdf','2025-05-13 18:13:07',NULL,'refused',27,1),(28,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1747135054/iiqxr241hs0fujo1ikux.pdf','2025-05-13 18:17:29',NULL,'refused',27,1),(29,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1747135142/nmldjdnzixpzwgkosrmv.pdf','2025-05-13 18:18:57',NULL,'approved',27,1),(31,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748237243/fmemzikgypnhgtwyowrc.pdf','2025-05-26 00:00:00','','refused',27,3),(32,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748237273/fsui0ngshnukb6rc1iei.pdf','2025-05-26 00:00:00','','approved',27,1),(36,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748346236/evesvsfx4xnltckofpje.pdf','2025-05-27 18:43:57','','approved',37,3),(37,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748352158/n1bw6ifob0j2ii140l4w.pdf','2025-05-27 20:22:39',NULL,'approved',37,2),(38,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748537326/n4cuqebckjbcum5q7nxl.pdf','2025-05-29 23:49:07',NULL,'approved',40,2),(39,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748537434/rjrr8ex8ljzqvbretfor.pdf','2025-05-29 23:50:35',NULL,'pending',40,6),(40,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748537997/bpazvroeijnw1rbtrdkr.pdf','2025-05-30 00:33:28',NULL,'pending',41,3),(41,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748537997/bpazvroeijnw1rbtrdkr.pdf','2025-05-30 00:36:30',NULL,'approved',41,28),(42,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748537997/bpazvroeijnw1rbtrdkr.pdf','2025-05-31 01:13:52',NULL,'approved',41,28),(43,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748697830/c9s97oomedgyxsikplf7.pdf','2025-05-31 00:00:00','','approved',3,6),(44,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748697930/x7ggzqbjz8ykhtuev2g8.pdf','2025-05-31 00:00:00','','approved',7,27),(45,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748707473/kt0cdgelrcenyx0hwcm9.pdf','2025-05-31 23:04:29',NULL,'pending',27,1),(46,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748745445/ijcclmggmeh86mfxcvgz.pdf','2025-06-01 09:37:24',NULL,'pending',37,25);
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
  `full_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `self_description` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `curriculum_vitae` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `phone` (`phone`),
  CONSTRAINT `candidate_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate`
--

LOCK TABLES `candidate` WRITE;
/*!40000 ALTER TABLE `candidate` DISABLE KEYS */;
INSERT INTO `candidate` VALUES (3,'Le Van C','1985-03-15','Tỉnh Điện Biên','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748239832/s4orjuxfeco7xtgcpk5g.jpg','Marketer','0938765432','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748239844/mpflopfydsex5dmojslp.pdf',21),(5,'Vo Van E','1991-05-18','Hai Phong','avatar5.jpg','Sales Manager','0983123456','cv5.pdf',23),(6,'Hoang Thi F','1993-06-30','Nha Trang','avatar6.jpg','Finance Analyst','0129876543','cv6.pdf',24),(7,'Nguyen Van G','1987-07-21','Hue','avatar7.jpg','Teacher','0908765432','cv7.pdf',25),(15,'Truong Van O','1983-03-23','Ca Mau','avatar15.jpg','Chef','0978765432','cv15.pdf',33),(24,'Nguyễn Văn A','1995-08-20','Hồ Chí Minh','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746810809/epuo5q1b4feaacjh7wrj.png','Tôi là một lập trình viên..','0123456789','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746810810/sgnbap5oirbropcajfnh.pdf',54),(25,'Hứa Quang Đạt','2025-05-13','Huyện Lai Vung','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746812500/ra8rhrqpxbj9iiwn3fdr.jpg','io','0833443033','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746810810/sgnbap5oirbropcajfnh.pdf',56),(26,'Hứa Quang Đạt','2025-05-19','Huyện Lai Vung','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746812693/eeopyul94okqzejw3itd.jpg',NULL,'0833439002','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746810810/sgnbap5oirbropcajfnh.pdf',57),(27,'Hứa Quang Đạt','2025-05-22','Huyện Lai Vung','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746815138/rqmnad49uktcwalv9lym.jpg',NULL,'0233443002','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746810810/sgnbap5oirbropcajfnh.pdf',58),(28,'Hứa Quang Đạt 2245','2025-06-20','Tỉnh Đồng Nai','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1747473282/jdmkgetf9sjnxm8rnxcc.jpg','ko','09130923445','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1747473283/lauxmhpo8qpx1xfit45n.pdf',61),(32,'Nguyễn Văn A','1995-08-20','Hồ Chí Minh','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748283999/lbbgvml8k9dshmwmdtxd.png','Tôi là một lập trình viên..','01234562789','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748284001/lupgwjduchkumkbwz3l2.pdf',81),(37,'Lê Quang Khôi','2025-05-13','Tỉnh Hoà Bình','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748345549/wwdxworxdtwsz9vgfmja.jpg','','093959949',NULL,88),(38,'Lê Quang Khôi','2025-05-13','Tỉnh Lai Châu','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748346187/ilnqkpn6tchhoh2rcpi9.jpg','','0939599499',NULL,89),(39,'Võ Toàn Thắng','2025-05-08',NULL,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748354246/haubbyjnvjf7ld2asat7.jpg',NULL,NULL,NULL,90),(40,'Đạt Hứa Quang','2025-05-08','Tỉnh Bắc Giang','https://lh3.googleusercontent.com/a/ACg8ocKB-3MWjDzlEwBQUg6aFtxJL81JOlnmQ9u5nWNERr6Ed-y7qw=s96-c','',NULL,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748537326/n4cuqebckjbcum5q7nxl.pdf',93),(41,'Hứa Quang Đạt 123','2025-04-23','Tỉnh Sơn La','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748537995/wofnqtns3prgagyhnzqj.jpg','ok','0913092445','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748537997/bpazvroeijnw1rbtrdkr.pdf',94),(42,'Đinh Lợi','2025-05-20','Tỉnh Lai Châu','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748682640/i8wol8blhawdm4kjoddu.jpg','','',NULL,96);
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
  `candidate_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  KEY `company_id` (`company_id`),
  KEY `fk_candidate_review_candidate` (`candidate_id`),
  CONSTRAINT `candidate_review_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE,
  CONSTRAINT `candidate_review_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_candidate_review_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_review`
--

LOCK TABLES `candidate_review` WRITE;
/*!40000 ALTER TABLE `candidate_review` DISABLE KEYS */;
INSERT INTO `candidate_review` VALUES (2,'gfd','2025-05-31 20:56:06',1,1,42,27),(3,'s','2025-05-31 21:14:08',1,1,42,3),(4,'s','2025-05-31 21:15:25',1,2,42,37),(5,'dở','2025-06-01 09:52:15',1,2,42,40),(6,'gxc','2025-05-31 22:25:10',1,27,57,7);
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
  `avatar` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `self_description` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tax_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `full_address` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('approved','pending','refused') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tax_code` (`tax_code`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `company_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'CongtyAA','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1738810431/oc9q0gpagonth8udacqx.jpg','No','1010101044','123 Lê Lợi, Phường Bến Nghé','Hồ Chí Minh','Quận 1','approved',1),(4,'CongtyB','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1738801801/noiu9llvbjrd8cr9leut.jpg','No','90909090','456 Nguyễn Huệ, Phường Bến Nghé','Hồ Chí Minh','Quận 1','approved',2),(20,'Công ty A','avatarA.png','Mô tả A','MST001','789 Võ Văn Tần, Phường 5','Hồ Chí Minh','Quận 3','approved',3),(35,'Hứa Quang Đạt','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746046503/e5aeyyjbavlrovrgmc1a.jpg','9mmm','030303','101 Nguyễn Văn Cừ, Phường Cầu Kho','Hồ Chí Minh','Quận 1','approved',40),(41,'Công ty TNHH ABC','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1747468330/ujwioblgsd9ygkktgzus.png','Chuyên phát triển phần mềm doanh nghiệp.','1234567890','234 Lý Tự Trọng, Phường Bến Thành','Hồ Chí Minh','Quận 1','approved',55),(42,'OKCom','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746865549/lzdqmsopoqcvqbqeijph.jpg','ok','03030','567 Nguyễn Đình Chiểu, Phường 2','Hồ Chí Minh','Quận 3','approved',59),(43,'Hứa Quang Đạt','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748228196/ks7d2hgxcvdgkxcvpmf0.jpg','kok3k3','3232332323','890 Phạm Văn Đồng, Phường Linh Đông','Hồ Chí Minh','Thủ Đức','approved',68),(44,'Hứa Quang Đạt233333','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748230251/kylgblt0nlwpfmkt7iis.jpg','okokoko','43344333','111 Trường Chinh, Phường 12','Hồ Chí Minh','Tân Bình','approved',69),(48,'Cong ty 777','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748240430/myck44oq7aggytlesjob.png','okok','03030322332','222 Xô Viết Nghệ Tĩnh, Phường 21','Hồ Chí Minh','Bình Thạnh','approved',75),(54,'jugug','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748334695/vtccvpqhvymk1qwjguuv.jpg','','1234567890123','333 Điện Biên Phủ, Phường 15','Hồ Chí Minh','Bình Thạnh','approved',86),(55,'gà mờ','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748340505/xfmxjcwyaf93zwqvf33p.png','ok','1233567890','444 Lê Văn Sỹ, Phường 14','Hồ Chí Minh','Quận 3','approved',87),(56,'Gigachad Company','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748354916/wpfmlmbdxgnyk5n5jzao.png','','1212121212','555 Nguyễn Trãi, Phường 7','Hồ Chí Minh','Quận 5','approved',91),(57,'Nguyễn Trung Hậu','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748445847/swdd3dzfuhhl9up7dgeu.jpg','d','9876543210','483/11 Đào Sư Tích','Tỉnh Quảng Ninh','Thành phố Đông Triều','approved',92),(58,'Công ty dầu hỏa','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748538267/dqni3upet1asxadcvgry.png','ok','0987654321','15 Đ. Trần Bạch Đằng, Thủ Thiêm, Thủ Đức, Hồ Chí Minh','Thành phố Hồ Chí Minh','Quận 6','approved',95);
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_authentication`
--

DROP TABLE IF EXISTS `company_authentication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_authentication` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paper` varchar(100) NOT NULL,
  `id_card_front` varchar(100) NOT NULL,
  `id_card_back` varchar(100) NOT NULL,
  `company_id` int NOT NULL,
  `status` enum('approved','pending','refused') NOT NULL DEFAULT 'pending',
  `feedback` text,
  `last_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_id_UNIQUE` (`company_id`),
  CONSTRAINT `ca_to_company_id` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_authentication`
--

LOCK TABLES `company_authentication` WRITE;
/*!40000 ALTER TABLE `company_authentication` DISABLE KEYS */;
INSERT INTO `company_authentication` VALUES (10,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748687081/xumwdpt6i29ucaidfskm.pdf','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748687085/lfjdhqrbac6dwlht0f9k.jpg','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748687088/qwzbai1uhbg92noybwer.png',42,'pending',NULL,'2025-05-31 17:24:38'),(12,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748688975/focyzmvjs4h6tikcosow.pdf','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748688979/msp6oyhrq1yjtje98iac.png','https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748688983/zqx2tawm1gcgx23fjw4a.png',58,'pending',NULL,'2025-05-31 17:56:12');
/*!40000 ALTER TABLE `company_authentication` ENABLE KEYS */;
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
  `application_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  KEY `candidate_id` (`candidate_id`),
  KEY `fk_company_review_application` (`application_id`),
  CONSTRAINT `company_review_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE,
  CONSTRAINT `company_review_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `candidate` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_company_review_application` FOREIGN KEY (`application_id`) REFERENCES `application` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_review`
--

LOCK TABLES `company_review` WRITE;
/*!40000 ALTER TABLE `company_review` DISABLE KEYS */;
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
INSERT INTO `day` VALUES (9,'Anytime'),(5,'Friday'),(8,'Full'),(1,'Monday'),(6,'Saturday'),(7,'Sunday'),(4,'Thursday'),(2,'Tuesday'),(3,'Wednesday');
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
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `day_job`
--

LOCK TABLES `day_job` WRITE;
/*!40000 ALTER TABLE `day_job` DISABLE KEYS */;
INSERT INTO `day_job` VALUES (1,1,1),(2,2,2),(3,3,3),(6,6,6),(7,7,7),(8,8,8),(9,9,9),(34,1,10),(35,8,11),(12,2,12),(13,3,12),(18,2,13),(17,4,13),(14,5,13),(16,6,13),(15,8,13),(19,4,14),(20,4,15),(21,4,16),(22,4,17),(23,4,18),(24,4,19),(25,4,20),(26,4,21),(27,3,22),(28,7,22),(29,4,23),(30,4,24),(31,4,25),(32,5,26),(33,8,26),(38,7,27),(47,3,28),(46,4,28),(45,6,28),(49,7,30);
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
  `is_active` bit(1) NOT NULL DEFAULT b'0',
  `is_candidate_followed` bit(1) NOT NULL DEFAULT b'1',
  `candidate_id` int NOT NULL,
  `company_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidate` (`id`) ON DELETE CASCADE,
  CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow`
--

LOCK TABLES `follow` WRITE;
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
INSERT INTO `follow` VALUES (1,'2025-05-30 12:16:05',_binary '\0',_binary '',40,58),(2,'2025-05-30 13:18:42',_binary '\0',_binary '',40,58),(3,'2025-05-30 17:10:09',_binary '\0',_binary '',41,58),(4,'2025-05-30 17:10:32',_binary '\0',_binary '',41,58),(5,'2025-05-30 17:16:11',_binary '\0',_binary '',41,58),(6,'2025-05-30 17:20:10',_binary '\0',_binary '',40,58),(7,'2025-05-31 13:18:16',_binary '\0',_binary '',41,57),(8,'2025-05-31 13:19:29',_binary '\0',_binary '',41,57),(9,'2025-05-31 14:43:12',_binary '\0',_binary '',41,58),(10,'2025-05-31 15:00:46',_binary '',_binary '',41,57),(11,'2025-05-31 15:10:43',_binary '',_binary '',41,58),(12,'2025-05-31 20:11:03',_binary '\0',_binary '',27,1),(13,'2025-05-31 23:42:08',_binary '\0',_binary '',27,1),(14,'2025-06-01 09:39:10',_binary '',_binary '',37,57);
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
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image_workplace`
--

LOCK TABLES `image_workplace` WRITE;
/*!40000 ALTER TABLE `image_workplace` DISABLE KEYS */;
INSERT INTO `image_workplace` VALUES (1,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1738810611/kx4cau85uf4it8b13kwf.jpg',1),(2,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1738810611/fljcdtkwmw3iw4bxesga.jpg',1),(3,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1738810434/g825b3zj04hvmwzsfk5v.jpg',1),(10,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746811684/kaxjgakcg193hnnxjtod.jpg',41),(11,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746811687/qbt18io4n6c2mju30om6.png',41),(12,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746811689/cgd8mutbn6drmfkaawlp.jpg',41),(13,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746865552/onx0y6jqpehrc4ciidwz.png',42),(14,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746865555/uueef07boklpuomipc0t.png',42),(15,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1746865558/lfb3nuecasj9ys4oasnr.jpg',42),(16,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748228198/ypdi0m89aa8lttb3pwxl.jpg',43),(17,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748228201/vno9rg0ylaysrkhwhbyx.jpg',43),(18,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748228204/wyy5nqubohkyhrisbgyn.png',43),(19,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748230254/y4c4m0q7wvim5upznmdn.png',44),(20,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748230257/utvnqyhsz4xa3fstxczs.png',44),(21,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748230260/zy2pnq4ir8cw8byqth15.jpg',44),(31,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748240433/jmsxzchjmd91qzc2zjft.jpg',48),(32,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748240435/semopgnrjbmbg5omsjdx.jpg',48),(33,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748240438/hjrx3yweubiuidh4qwps.jpg',48),(49,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748334696/zjihatjzcuucfzzl1ior.jpg',54),(50,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748334697/uxahfalksonrrn7v8fp3.jpg',54),(51,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748334701/nhgdamcmlqjxti8b2sxk.png',54),(52,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748340509/jg1s3pubwxxdxwjfz9wl.png',55),(53,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748340514/b5hy74qgrrg9ns5slnam.png',55),(54,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748340516/tp0xhvaanrrtptm2vc5q.png',55),(55,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748354920/axphslhhj7pgz94knhij.jpg',56),(56,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748354922/exb2ndhmsm1b5dndc1ys.png',56),(57,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748354924/pb804f8sqtitcu3c6tbc.jpg',56),(58,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748445851/pod1r1hykxykcrgs9l9m.jpg',57),(59,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748445853/jml7a6ecqxc0ub0vfmtt.jpg',57),(60,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748445855/dfo07d623venljddsdqk.png',57),(61,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748538270/zsl1a5fxsn4dkramgygz.jpg',58),(62,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748538272/grfkd7gn6u0mer464cqc.jpg',58),(63,'https://res.cloudinary.com/dmbvjjg5a/image/upload/v1748538273/j7ss3se1jmnurlcvpnbz.jpg',58);
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
  `is_active` bit(1) NOT NULL DEFAULT b'0',
  `posted_date` datetime DEFAULT NULL,
  `company_id` int NOT NULL,
  `longitude` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `latitude` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `job_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job`
--

LOCK TABLES `job` WRITE;
/*!40000 ALTER TABLE `job` DISABLE KEYS */;
INSERT INTO `job` VALUES (1,'Kỹ sư phần mềm','Phát triển phần mềm theo yêu cầu.','Tốt nghiệp CNTT, kinh nghiệm 2 năm.',10000000,20000000,22,35,2,'123 Lê Lợi, Phường Bến Nghé','Hồ Chí Minh','Quận 1','approved',_binary '','2025-05-01 00:00:00',42,'106.7009','10.7769'),(2,'Nhân viên kinh doanh','Tìm kiếm khách hàng mới.','Giao tiếp tốt, ngoại hình ưa nhìn.',8000000,15000000,20,30,1,'456 Nguyễn Huệ, Phường Bến Nghé','Hồ Chí Minh','Quận 1','approved',_binary '','2025-05-01 00:00:00',42,'106.7012','10.7758'),(3,'Kế toán tổng hợp','Quản lý sổ sách kế toán.','Tốt nghiệp ngành kế toán.',7000000,12000000,23,35,1,'789 Võ Văn Tần, Phường 5','Hồ Chí Minh','Quận 3','approved',_binary '','2025-05-01 00:00:00',1,'106.6867','10.7831'),(6,'Lập trình viên Java','Tham gia dự án Java Web.','Biết Spring Boot.',12000000,25000000,22,35,1,'101 Nguyễn Văn Cừ, Phường Cầu Kho','Hồ Chí Minh','Quận 1','approved',_binary '','2025-05-01 00:00:00',1,'106.6923','10.7698'),(7,'Thiết kế đồ họa','Thiết kế banner, poster.','Thành thạo Photoshop.',7000000,14000000,20,30,1,'234 Lý Tự Trọng, Phường Bến Thành','Hồ Chí Minh','Quận 1','approved',_binary '','2025-05-01 00:00:00',1,'106.6971','10.7774'),(8,'Nhân viên chăm sóc khách hàng','Giải đáp thắc mắc khách hàng.','Kỹ năng giao tiếp tốt.',6000000,10000000,20,32,0,'567 Nguyễn Đình Chiểu, Phường 2','Hồ Chí Minh','Quận 3','approved',_binary '','2025-05-01 00:00:00',4,'106.6824','10.7812'),(9,'Nhân viên cá kho','Quản lý nhập xuất kho.','Chịu được áp lực công việc.',5000000,8000000,22,40,0,'890 Phạm Văn Đồng, Phường Linh Đông','Hồ Chí Minh','Thủ Đức','approved',_binary '','2025-05-01 00:00:00',4,'106.7489','10.8491'),(10,'Giáo viên tiếng Anh','Giảng dạy tiếng Anh cho thiếu nhi.','TOEIC 800 trở lên.',10000000,18000000,24,40,1,'111 Trường Chinh, Phường 12','Hồ Chí Minh','Tân Bình','approved',_binary '','2025-05-01 00:00:00',1,'106.6534','10.8006'),(11,'Quét nhà','ok','ok',5000000,8000000,23,43,2,'222 Xô Viết Nghệ Tĩnh, Phường 21','Hồ Chí Minh','Bình Thạnh','approved',_binary '','2025-05-10 00:00:00',42,'106.7081','10.8034'),(12,'Quét nhà','ểuifnrefnh','n djhn hjfn',6000000,10000000,NULL,NULL,NULL,'333 Điện Biên Phủ, Phường 15','Hồ Chí Minh','Bình Thạnh','approved',_binary '','2025-05-10 00:00:00',42,'106.7115','10.7987'),(13,'Quét nhàjjejee','kwwkkwwk','kkdkcdkck',7000000,12000000,NULL,NULL,NULL,'444 Lê Văn Sỹ, Phường 14','Hồ Chí Minh','Quận 3','approved',_binary '','2025-05-10 00:00:00',42,'106.6742','10.7923'),(14,'okokok','343434fff','4343',8000000,15000000,NULL,NULL,NULL,'555 Nguyễn Trãi, Phường 7','Hồ Chí Minh','Quận 5','approved',_binary '','2025-05-10 00:00:00',42,'106.6689','10.7602'),(15,'okokok','343434fff','4343',8000000,15000000,NULL,NULL,NULL,'666 Cách Mạng Tháng Tám, Phường 11','Hồ Chí Minh','Quận 10','approved',_binary '','2025-05-10 00:00:00',42,'106.6698','10.7715'),(16,'okokok','343434fff','4343',8000000,15000000,NULL,NULL,NULL,'777 Huỳnh Tấn Phát, Phường Phú Thuận','Hồ Chí Minh','Quận 7','approved',_binary '','2025-05-15 00:00:00',42,'106.7356','10.7296'),(17,'okokok','343434fff','4343',8000000,15000000,NULL,NULL,NULL,'888 Tôn Đức Thắng, Phường Bến Nghé','Hồ Chí Minh','Quận 1','approved',_binary '','2025-05-15 00:00:00',42,'106.7045','10.7818'),(18,'okokok','343434fff','4343',8000000,15000000,NULL,NULL,NULL,'999 Nguyễn Thị Minh Khai, Phường 5','Hồ Chí Minh','Quận 3','approved',_binary '','2025-05-15 00:00:00',42,'106.6832','10.7865'),(19,'okokok','343434fff','4343',8000000,15000000,NULL,NULL,NULL,'123 Bùi Thị Xuân, Phường Phạm Ngũ Lão','Hồ Chí Minh','Quận 1','approved',_binary '','2025-05-15 00:00:00',42,'106.6957','10.7689'),(20,'okokok','343434fff','4343',8000000,15000000,NULL,NULL,NULL,'456 Pasteur, Phường 8','Hồ Chí Minh','Quận 3','approved',_binary '','2025-05-15 00:00:00',42,'106.6893','10.7801'),(21,'okokok','343434fff','4343',8000000,15000000,NULL,NULL,NULL,'789 Lê Hồng Phong, Phường 12','Hồ Chí Minh','Quận 10','approved',_binary '','2025-05-20 00:00:00',42,'106.6648','10.7632'),(22,'Quét nhàjjejee','jiji','nk',5000000,8000000,NULL,NULL,NULL,'101 Trần Hưng Đạo, Phường Cầu Ông Lãnh','Hồ Chí Minh','Quận 1','approved',_binary '','2025-05-20 00:00:00',42,'106.6901','10.7654'),(23,'okokok','343434fff','4343',8000000,15000000,NULL,NULL,NULL,'234 Nguyễn Công Trứ, Phường Nguyễn Thái Bình','Hồ Chí Minh','Quận 1','approved',_binary '','2025-05-20 00:00:00',42,'106.6998','10.7732'),(24,'okokok','343434fff','4343',8000000,15000000,NULL,NULL,NULL,'567 Hoàng Văn Thụ, Phường 4','Hồ Chí Minh','Tân Bình','approved',_binary '','2025-05-20 00:00:00',42,'106.6487','10.7991'),(25,'okokok','343434fff','4343',8000000,15000000,NULL,NULL,NULL,'890 CMT8, Phường 5','Hồ Chí Minh','Quận 10','approved',_binary '','2025-05-20 00:00:00',42,'106.6674','10.7739'),(26,'Quét nhà12','ko','ko',10000000,20000000,18,29,9,'111 Nguyễn Oanh, Phường 17','Hồ Chí Minh','Gò Vấp','approved',_binary '','2025-05-20 00:00:00',42,'106.6792','10.8367'),(27,'Thư ký','kHÔNG CÓ','KHÔNG CÓ',1288000,13999990,20,23,2,'đồng hỷ thái nguyên','Thái nguyên','Đồng hỷ','approved',_binary '','2025-05-29 23:32:38',57,'105.84521','21.63112'),(28,'Chở gas','ok','ok',20000,233232,39,58,10,'Phủ Tây Hồ, Ngõ 50 Đặng Thai Mai, Phường Quảng An, Quận Tây Hồ, Hà Nội, Việt Nam','Hà nội','Tây hồ','approved',_binary '','2025-05-30 00:23:44',58,'105.81975','21.05528'),(29,'Bảo vệ','Bảo vệ nhà xác','Có sức khỏe',120000,188000,20,23,1,'Chợ Trà Ôn, Đường Gia Long, Thị Trấn Trà Ôn, Huyện Trà Ôn, Vĩnh Long, Việt Nam','Vĩnh long','Trà ôn','pending',_binary '','2025-05-31 17:49:25',58,'105.91965','9.96604'),(30,'2','ok','ok',20,2200,19,20,1,'Huyện Bình Giang, Việt Nam','Chưa xác định','Chưa xác định','pending',_binary '','2025-05-31 17:51:29',58,'106.15006','20.90535');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `major`
--

LOCK TABLES `major` WRITE;
/*!40000 ALTER TABLE `major` DISABLE KEYS */;
INSERT INTO `major` VALUES (1,'Retail & Sales'),(2,'Food & Beverage'),(3,'Customer Service'),(4,'Delivery & Logistics'),(5,'Tutoring & Education'),(6,'Administrative & Office Work'),(7,'Freelancing & Online Work'),(8,'Events & Promotion'),(9,'Cleaning & Housekeeping'),(10,'Public Services');
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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `major_job`
--

LOCK TABLES `major_job` WRITE;
/*!40000 ALTER TABLE `major_job` DISABLE KEYS */;
INSERT INTO `major_job` VALUES (1,1,1),(2,2,2),(3,3,3),(6,6,6),(7,7,7),(8,8,8),(9,9,9),(27,10,10),(28,5,11),(12,5,12),(13,4,13),(14,4,14),(15,4,15),(16,4,16),(17,4,17),(18,4,18),(19,4,19),(20,4,20),(21,4,21),(22,5,22),(23,4,23),(24,4,24),(25,4,25),(26,4,26),(31,1,27),(34,4,28),(36,3,30);
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
  `is_active` bit(2) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'a@gmail.com','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2024-04-12 00:00:00','ROLE_COMPANY',_binary ''),(2,'admin2','123456','2025-04-25 16:37:12','ROLE_ADMIN',_binary ''),(3,'admin3','$2a$10$5X9k5N1sTc1/CjVH5XJoje3QMYijH3ETpgkox00R0MdPaJPPrf7wO','2025-04-25 16:41:12','ROLE_ADMIN',_binary ''),(7,'admin7','123456','2025-04-27 16:06:31','ROLE_ADMIN',_binary ''),(8,'admin8','123456','2025-04-27 16:06:31','ROLE_ADMIN',_binary ''),(13,'admin13','123456','2025-04-27 16:06:31','ROLE_ADMIN',_binary ''),(14,'admin14','123456','2025-04-27 16:06:31','ROLE_ADMIN',_binary ''),(18,'admin18','123456','2025-04-27 16:06:31','ROLE_ADMIN',_binary ''),(21,'user3','password3','2025-04-03 00:00:00','CANDIDATE',_binary ''),(23,'user5','password5','2025-04-05 00:00:00','CANDIDATE',_binary ''),(24,'user6','password6','2025-04-06 00:00:00','CANDIDATE',_binary ''),(25,'user7','password7','2025-04-07 00:00:00','CANDIDATE',_binary ''),(33,'user15','password15','2025-04-15 00:00:00','CANDIDATE',_binary ''),(40,'nhanvien','$2a$10$ZMOYhzCnmJB5QuHZfKGAg.n7T.PJH86ixRX.IoPc8EZrg7.kgWDA2','2025-05-01 03:55:01','ROLE_COMPANY',_binary ''),(45,'dat55','$2a$10$HSJ2vXR108swlgEwlIOnQONe2SJDa2F8csKefCrje.GP14wxuG4re','2025-05-01 14:21:39','ROLE_COMPANY',_binary ''),(54,'nva','$2a$10$/2RWYF1VMU/6zYFFvOSKeuWSrRJFOkwaSyrr.7h3A56Rge/C/8qv2','2025-05-10 00:13:24','ROLE_CANDIDATE',_binary ''),(55,'abc_company','$2a$10$v5CUYXPGYXHIPoPLsLfdwOafDPGbRtM1AYdjiFVZl34Y1oyum4coy','2025-05-10 00:27:58','ROLE_COMPANY',_binary ''),(56,'candidate','$2a$10$nd3S2JNIo0UZQuEUSkgsHOW3TvPP0sy0EX5mM2mJ3ivEigsnWBTnG','2025-05-10 00:41:37','ROLE_CANDIDATE',_binary ''),(57,'can','$2a$10$zgdJqEU2WxAJS3cqgT1bC.xkN7Ki1716d72C8SvLiLW6kFyaWfvt2','2025-05-10 00:44:50','ROLE_CANDIDATE',_binary ''),(58,'nhanvien0','$2a$10$8LD3Kg8YNj9t3cmJ1xKaL.ivISHiO27.AVdr8J9PFTxql6hsIsisu','2025-05-10 01:25:33','ROLE_CANDIDATE',_binary ''),(59,'company77','$2a$10$v/uLRG.6cYKYcVndZzmIGeHwB7S7e4zwM4riquewZDzkExHKon9TS','2025-05-10 15:25:44','ROLE_COMPANY',_binary ''),(61,'hqd123456','$2a$10$Vdm5ttnRf9iI2.wOSCgL1u.eUkH8LKnil7meeKaaB3YkXmu634o/W','2025-05-17 16:14:39','ROLE_CANDIDATE',_binary ''),(67,'dathqd3343@gamail.com','$2a$10$hZUaqpXrHDrLsrcr7liwFe/3OTx.CDy4jqpQ8yw.d/cJUlyd4uziC','2025-05-25 17:59:08','ROLE_CANDIDATE',_binary ''),(68,'aadmin12345','$2a$10$SFEzaWJZrDV7q4m3VFMoeO0/d8IVCbj8xKCJb9S9GYWno4aoz/gMu','2025-05-26 09:56:33','ROLE_COMPANY',_binary ''),(69,'admin12345678','$2a$10$4iP7IY5MzMLztC/GnKcDEeSnVGaC2iaPrql85rZhBes54w3VwzQwa','2025-05-26 10:30:49','ROLE_COMPANY',_binary ''),(75,'congty098765','$2a$10$WOTIRC7GmeXrR38rjXSsk.VpKEm01/hN/hSIa6MuNGbmwXVbWzEoW','2025-05-26 13:20:27','ROLE_COMPANY',_binary ''),(81,'16quangjdat@gmail.com','$2a$10$Jbifp2obAfDYHp1VyGD07uF8ojAZ/3JaJDgbekpTWE3qI/zSr4gVa','2025-05-27 01:26:35','ROLE_CANDIDATE',_binary ''),(86,'2251012030ddat@ou.edu.vn','$2a$10$iPoG1CAkWGLPA7Tct3nr1O9fmUzmIAocaWdLf1TsN2Elq5tL40rzC','2025-05-27 15:31:31','ROLE_CANDIDATE',_binary ''),(87,'hqd111lv@gmail.com','$2a$10$xsZN5bvPhJEKQFwUdzy8TO6wNl4vjUYwxZRRJc3qXgKB2fjD461hq','2025-05-27 17:08:24','ROLE_COMPANY',_binary ''),(88,'dathqd3333@gmail.com','$2a$10$cX063IjJzOvKfxaYUDQ9MeIUD8GR7x.aqbL7N5viXGJR91hqtALKG','2025-05-27 18:32:27','ROLE_CANDIDATE',_binary ''),(89,'dat@gmail.com','$2a$10$ws3YiHNUqIjdohXCzzwRWOQo9/F7UY8CLU6RMYHyA3AjmnUXhVTrG','2025-05-27 18:43:06','ROLE_CANDIDATE',_binary ''),(90,'dathqd3433@gmail.com','$2a$10$z1t52HE03NxayiFLWP/pLOW/cv.ecoty5CTp6tfANPZE09tQzQHPi','2025-05-27 20:57:21','ROLE_CANDIDATE',_binary ''),(91,'dathqd333@gmail.com','$2a$10$9BdGDDqgIl3lndYc0VD5yuME0pENNEDuktLEYhQRIoi2GiJbXayGC','2025-05-27 21:08:33','ROLE_COMPANY',_binary ''),(92,'trunghauu71@gmail.com','$2a$10$3wpGnHGH0l9SSLe1JBNKCuOAs8Kmoy36zOgIJlfz8wzfLQAeTnBYy','2025-05-28 22:23:49','ROLE_COMPANY',_binary ''),(93,'2251012030dat@ou.edu.vn','$2a$10$FyiBlloC77.wwA1c4Qfw4uvvFKoH6NqjLgnpYpHh9mHiNE4E.FkVS','2025-05-29 23:48:26','ROLE_CANDIDATE',_binary ''),(94,'166quangdat@gmail.com','$2a$10$39Zw82x1fvg5Lm/kT9YVQu5ed3raCxCyLidR4Xh2SDneoKOxRSSgC','2025-05-29 23:59:52','ROLE_CANDIDATE',_binary ''),(95,'hqd11lv@gmail.com','$2a$10$w8CbjSZ.e0Kn7Xf.c4QzQ.nV8z2bDgMpaw6o5EMYD/bc3P7rlCPw2','2025-05-30 00:04:25','ROLE_COMPANY',_binary ''),(96,'116quangdat@gmail.com','$2a$10$D.TB51.HNHE6pPDqiPS9LenVVQZkGwLwSXMUm1t9K04YJOdL/tNFa','2025-05-31 16:10:38','ROLE_CANDIDATE',_binary '');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-01 10:12:22
