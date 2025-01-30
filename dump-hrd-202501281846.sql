-- MySQL dump 10.13  Distrib 5.7.33, for Win64 (x86_64)
--
-- Host: localhost    Database: hrd
-- ------------------------------------------------------
-- Server version	5.7.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `nama_user` varchar(100) NOT NULL,
  `role` int(11) NOT NULL,
  `created_by` varchar(100) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  `alamat` varchar(250) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Marsel',1,'SYSTEM','2025-01-27 11:45:08','cc03e747a6afbbcbf8be7668acfebee5',1,'jl baru raya','marsel_d','2025-01-27 16:41:19'),(2,'Marsel_d',2,'1','2025-01-27 11:45:46','cc03e747a6afbbcbf8be7668acfebee5',1,'jl. tes test 123','marsel_d','2025-01-27 14:46:45'),(9,'budi',2,'budi','2025-01-27 18:18:09','cc03e747a6afbbcbf8be7668acfebee5',1,'jl. test 123',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_absen`
--

DROP TABLE IF EXISTS `user_absen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_absen` (
  `id_absen` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `tanggal` varchar(100) NOT NULL,
  `waktu` time DEFAULT NULL,
  `image_name` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id_absen`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_absen`
--

LOCK TABLES `user_absen` WRITE;
/*!40000 ALTER TABLE `user_absen` DISABLE KEYS */;
INSERT INTO `user_absen` VALUES (8,'marsel','2025-01-27','15:35:39','2025-01-27-153539-marsel.jpg'),(9,'marsel','2025-01-27','15:35:54','2025-01-27-153554-marsel.jpg'),(10,'marsel_d','2025-01-27','00:33:37','2025-01-27-003337-marsel_d.jpg');
/*!40000 ALTER TABLE `user_absen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'hrd'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-28 18:46:26
