/*
Navicat MySQL Data Transfer

Source Server         : 10.32.50.63_llb
Source Server Version : 50718
Source Host           : 10.32.50.63:3306
Source Database       : mi3_arch

Target Server Type    : MYSQL
Target Server Version : 50718
File Encoding         : 65001

Date: 2019-09-25 11:40:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ti_obj_cab
-- ----------------------------
DROP TABLE IF EXISTS `ti_obj_cab`;
CREATE TABLE `ti_obj_cab` (
  `ID` int(32) NOT NULL AUTO_INCREMENT,
  `F_ID` varchar(36) DEFAULT NULL COMMENT 'ID',
  `F_PID` varchar(36) DEFAULT NULL COMMENT '父ID',
  `F_NID` int(11) DEFAULT NULL,
  `F_MID` int(11) DEFAULT NULL,
  `F_NAME` varchar(64) DEFAULT NULL COMMENT '名称',
  `F_URI` varchar(256) DEFAULT NULL COMMENT 'URI',
  `F_DESC` varchar(256) DEFAULT NULL COMMENT '描述',
  `F_CLASS` varchar(36) DEFAULT NULL COMMENT '类别',
  `F_COL` int(11) DEFAULT NULL,
  `F_ROW` int(11) DEFAULT NULL,
  `F_LAY` int(11) DEFAULT NULL,
  `F_ADDR_STA` int(11) DEFAULT NULL,
  `F_ADDR_YX` int(11) DEFAULT NULL,
  `F_ADDR_YK` int(11) DEFAULT NULL,
  `F_TYPE` int(11) unsigned zerofill DEFAULT NULL COMMENT '值类型',
  `F_LEN` int(11) unsigned zerofill DEFAULT NULL COMMENT '长度',
  `F_V` varchar(4096) DEFAULT NULL COMMENT '内容',
  `F_T_CRT` bigint(32) DEFAULT NULL,
  `F_USER_CRT` varchar(64) DEFAULT NULL,
  `F_T_MOD` bigint(32) DEFAULT NULL,
  `F_USER_MOD` varchar(64) DEFAULT NULL,
  `F_RES0` int(11) unsigned zerofill DEFAULT NULL,
  `F_RES1` varchar(1024) DEFAULT NULL,
  `F_SYN_FLAG` int(11) DEFAULT NULL COMMENT '同步标志',
  `F_DT_FLAG` int(11) DEFAULT NULL,
  `F_ST_FLAG` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=328 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ti_obj_cab
-- ----------------------------
INSERT INTO `ti_obj_cab` VALUES ('223', '1-1-1', null, null, null, '1-1-1', '1-1-1', '', null, '1', '1', '1', '1', '0', '0', null, null, null, '1569226480794', 'sys', '1569226480794', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('224', '1-1-2', null, null, null, '1-1-2', '1-1-2', '', null, '1', '1', '2', '1', '1', '1', null, null, null, '1569226480794', 'sys', '1569226480794', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('225', '1-1-3', null, null, null, '1-1-3', '1-1-3', '', null, '1', '1', '3', '1', '2', '2', null, null, null, '1569226480794', 'sys', '1569226480794', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('226', '1-2-1', null, null, null, '1-2-1', '1-2-1', '', null, '2', '1', '1', '1', '16', '16', null, null, null, '1569226480794', 'sys', '1569226480794', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('227', '1-2-2', null, null, null, '1-2-2', '1-2-2', '', null, '2', '1', '2', '1', '17', '17', null, null, null, '1569226480794', 'sys', '1569226480794', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('228', '1-2-3', null, null, null, '1-2-3', '1-2-3', '', null, '2', '1', '3', '1', '18', '18', null, null, null, '1569226480794', 'sys', '1569226480794', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('229', '1-3-1', null, null, null, '1-3-1', '1-3-1', '', null, '3', '1', '1', '2', '0', '0', null, null, null, '1569226480794', 'sys', '1569226480794', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('230', '1-3-2', null, null, null, '1-3-2', '1-3-2', '', null, '3', '1', '2', '2', '1', '1', null, null, null, '1569226480794', 'sys', '1569226480794', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('231', '1-3-3', null, null, null, '1-3-3', '1-3-3', '', null, '3', '1', '3', '2', '2', '2', null, null, null, '1569226480794', 'sys', '1569226480794', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('232', '1-4-1', null, null, null, '1-4-1', '1-4-1', '', null, '4', '1', '1', '2', '16', '16', null, null, null, '1569226480797', 'sys', '1569226480797', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('233', '1-4-2', null, null, null, '1-4-2', '1-4-2', '', null, '4', '1', '2', '2', '17', '17', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('234', '1-4-3', null, null, null, '1-4-3', '1-4-3', '', null, '4', '1', '3', '2', '18', '18', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('235', '1-5-1', null, null, null, '1-5-1', '1-5-1', '', null, '5', '1', '1', '3', '0', '0', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('236', '1-5-2', null, null, null, '1-5-2', '1-5-2', '', null, '5', '1', '2', '3', '1', '1', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('237', '1-5-3', null, null, null, '1-5-3', '1-5-3', '', null, '5', '1', '3', '3', '2', '2', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('238', '1-6-1', null, null, null, '1-6-1', '1-6-1', '', null, '6', '1', '1', '3', '16', '16', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('239', '1-6-2', null, null, null, '1-6-2', '1-6-2', '', null, '6', '1', '2', '3', '17', '17', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('240', '1-6-3', null, null, null, '1-6-3', '1-6-3', '', null, '6', '1', '3', '3', '18', '18', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('241', '1-7-1', null, null, null, '1-7-1', '1-7-1', '', null, '7', '1', '1', '4', '0', '0', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('242', '1-7-2', null, null, null, '1-7-2', '1-7-2', '', null, '7', '1', '2', '4', '1', '1', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('243', '1-7-3', null, null, null, '1-7-3', '1-7-3', '', null, '7', '1', '3', '4', '2', '2', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('244', '2-1-1', null, null, null, '2-1-1', '2-1-1', '', null, '1', '2', '1', '1', '3', '3', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('245', '2-1-2', null, null, null, '2-1-2', '2-1-2', '', null, '1', '2', '2', '1', '4', '4', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('246', '2-1-3', null, null, null, '2-1-3', '2-1-3', '', null, '1', '2', '3', '1', '5', '5', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('247', '2-2-1', null, null, null, '2-2-1', '2-2-1', '', null, '2', '2', '1', '1', '19', '19', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('248', '2-2-2', null, null, null, '2-2-2', '2-2-2', '', null, '2', '2', '2', '1', '20', '20', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('249', '2-2-3', null, null, null, '2-2-3', '2-2-3', '', null, '2', '2', '3', '1', '21', '21', null, null, null, '1569226480798', 'sys', '1569226480798', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('250', '2-3-1', null, null, null, '2-3-1', '2-3-1', '', null, '3', '2', '1', '2', '3', '3', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('251', '2-3-2', null, null, null, '2-3-2', '2-3-2', '', null, '3', '2', '2', '2', '4', '4', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('252', '2-3-3', null, null, null, '2-3-3', '2-3-3', '', null, '3', '2', '3', '2', '5', '5', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('253', '2-4-1', null, null, null, '2-4-1', '2-4-1', '', null, '4', '2', '1', '2', '19', '19', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('254', '2-4-2', null, null, null, '2-4-2', '2-4-2', '', null, '4', '2', '2', '2', '20', '20', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('255', '2-4-3', null, null, null, '2-4-3', '2-4-3', '', null, '4', '2', '3', '2', '21', '21', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('256', '2-5-1', null, null, null, '2-5-1', '2-5-1', '', null, '5', '2', '1', '3', '3', '3', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('257', '2-5-2', null, null, null, '2-5-2', '2-5-2', '', null, '5', '2', '2', '3', '4', '4', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('258', '2-5-3', null, null, null, '2-5-3', '2-5-3', '', null, '5', '2', '3', '3', '5', '5', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('259', '2-6-1', null, null, null, '2-6-1', '2-6-1', '', null, '6', '2', '1', '3', '19', '19', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('260', '2-6-2', null, null, null, '2-6-2', '2-6-2', '', null, '6', '2', '2', '3', '20', '20', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('261', '2-6-3', null, null, null, '2-6-3', '2-6-3', '', null, '6', '2', '3', '3', '21', '21', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('262', '2-7-1', null, null, null, '2-7-1', '2-7-1', '', null, '7', '2', '1', '4', '3', '3', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('263', '2-7-2', null, null, null, '2-7-2', '2-7-2', '', null, '7', '2', '2', '4', '4', '4', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('264', '2-7-3', null, null, null, '2-7-3', '2-7-3', '', null, '7', '2', '3', '4', '5', '5', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('265', '3-1-1', null, null, null, '3-1-1', '3-1-1', '', null, '1', '3', '1', '1', '6', '6', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('266', '3-1-2', null, null, null, '3-1-2', '3-1-2', '', null, '1', '3', '2', '1', '7', '7', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('267', '3-1-3', null, null, null, '3-1-3', '3-1-3', '', null, '1', '3', '3', '1', '8', '8', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('268', '3-2-1', null, null, null, '3-2-1', '3-2-1', '', null, '2', '3', '1', '1', '22', '22', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('269', '3-2-2', null, null, null, '3-2-2', '3-2-2', '', null, '2', '3', '2', '1', '23', '23', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('270', '3-2-3', null, null, null, '3-2-3', '3-2-3', '', null, '2', '3', '3', '1', '24', '24', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('271', '3-3-1', null, null, null, '3-3-1', '3-3-1', '', null, '3', '3', '1', '2', '6', '6', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('272', '3-3-2', null, null, null, '3-3-2', '3-3-2', '', null, '3', '3', '2', '2', '7', '7', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('273', '3-3-3', null, null, null, '3-3-3', '3-3-3', '', null, '3', '3', '3', '2', '8', '8', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('274', '3-4-1', null, null, null, '3-4-1', '3-4-1', '', null, '4', '3', '1', '2', '22', '22', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('275', '3-4-2', null, null, null, '3-4-2', '3-4-2', '', null, '4', '3', '2', '2', '23', '23', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('276', '3-4-3', null, null, null, '3-4-3', '3-4-3', '', null, '4', '3', '3', '2', '24', '24', null, null, null, '1569226480805', 'sys', '1569226480805', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('277', '3-5-1', null, null, null, '3-5-1', '3-5-1', '', null, '5', '3', '1', '3', '6', '6', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('278', '3-5-2', null, null, null, '3-5-2', '3-5-2', '', null, '5', '3', '2', '3', '7', '7', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('279', '3-5-3', null, null, null, '3-5-3', '3-5-3', '', null, '5', '3', '3', '3', '8', '8', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('280', '3-6-1', null, null, null, '3-6-1', '3-6-1', '', null, '6', '3', '1', '3', '22', '22', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('281', '3-6-2', null, null, null, '3-6-2', '3-6-2', '', null, '6', '3', '2', '3', '23', '23', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('282', '3-6-3', null, null, null, '3-6-3', '3-6-3', '', null, '6', '3', '3', '3', '24', '24', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('283', '3-7-1', null, null, null, '3-7-1', '3-7-1', '', null, '7', '3', '1', '4', '6', '6', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('284', '3-7-2', null, null, null, '3-7-2', '3-7-2', '', null, '7', '3', '2', '4', '7', '7', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('285', '3-7-3', null, null, null, '3-7-3', '3-7-3', '', null, '7', '3', '3', '4', '8', '8', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('286', '4-1-1', null, null, null, '4-1-1', '4-1-1', '', null, '1', '4', '1', '1', '9', '9', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('287', '4-1-2', null, null, null, '4-1-2', '4-1-2', '', null, '1', '4', '2', '1', '10', '10', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('288', '4-1-3', null, null, null, '4-1-3', '4-1-3', '', null, '1', '4', '3', '1', '11', '11', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('289', '4-2-1', null, null, null, '4-2-1', '4-2-1', '', null, '2', '4', '1', '1', '25', '25', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('290', '4-2-2', null, null, null, '4-2-2', '4-2-2', '', null, '2', '4', '2', '1', '26', '26', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('291', '4-2-3', null, null, null, '4-2-3', '4-2-3', '', null, '2', '4', '3', '1', '27', '27', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('292', '4-3-1', null, null, null, '4-3-1', '4-3-1', '', null, '3', '4', '1', '2', '9', '9', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('293', '4-3-2', null, null, null, '4-3-2', '4-3-2', '', null, '3', '4', '2', '2', '10', '10', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('294', '4-3-3', null, null, null, '4-3-3', '4-3-3', '', null, '3', '4', '3', '2', '11', '11', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('295', '4-4-1', null, null, null, '4-4-1', '4-4-1', '', null, '4', '4', '1', '2', '25', '25', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('296', '4-4-2', null, null, null, '4-4-2', '4-4-2', '', null, '4', '4', '2', '2', '26', '26', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('297', '4-4-3', null, null, null, '4-4-3', '4-4-3', '', null, '4', '4', '3', '2', '27', '27', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('298', '4-5-1', null, null, null, '4-5-1', '4-5-1', '', null, '5', '4', '1', '3', '9', '9', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('299', '4-5-2', null, null, null, '4-5-2', '4-5-2', '', null, '5', '4', '2', '3', '10', '10', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('300', '4-5-3', null, null, null, '4-5-3', '4-5-3', '', null, '5', '4', '3', '3', '11', '11', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('301', '4-6-1', null, null, null, '4-6-1', '4-6-1', '', null, '6', '4', '1', '3', '25', '25', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('302', '4-6-2', null, null, null, '4-6-2', '4-6-2', '', null, '6', '4', '2', '3', '26', '26', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('303', '4-6-3', null, null, null, '4-6-3', '4-6-3', '', null, '6', '4', '3', '3', '27', '27', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('304', '4-7-1', null, null, null, '4-7-1', '4-7-1', '', null, '7', '4', '1', '4', '9', '9', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('305', '4-7-2', null, null, null, '4-7-2', '4-7-2', '', null, '7', '4', '2', '4', '10', '10', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('306', '4-7-3', null, null, null, '4-7-3', '4-7-3', '', null, '7', '4', '3', '4', '11', '11', null, null, null, '1569226480806', 'sys', '1569226480806', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('307', '5-1-1', null, null, null, '5-1-1', '5-1-1', '', null, '1', '5', '1', '1', '12', '12', null, null, null, '1569226480807', 'sys', '1569226480807', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('308', '5-1-2', null, null, null, '5-1-2', '5-1-2', '', null, '1', '5', '2', '1', '13', '13', null, null, null, '1569226480807', 'sys', '1569226480807', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('309', '5-1-3', null, null, null, '5-1-3', '5-1-3', '', null, '1', '5', '3', '1', '14', '14', null, null, null, '1569226480807', 'sys', '1569226480807', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('310', '5-2-1', null, null, null, '5-2-1', '5-2-1', '', null, '2', '5', '1', '1', '28', '28', null, null, null, '1569226480807', 'sys', '1569226480807', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('311', '5-2-2', null, null, null, '5-2-2', '5-2-2', '', null, '2', '5', '2', '1', '29', '29', null, null, null, '1569226480807', 'sys', '1569226480807', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('312', '5-2-3', null, null, null, '5-2-3', '5-2-3', '', null, '2', '5', '3', '1', '30', '30', null, null, null, '1569226480807', 'sys', '1569226480807', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('313', '5-3-1', null, null, null, '5-3-1', '5-3-1', '', null, '3', '5', '1', '2', '12', '12', null, null, null, '1569226480807', 'sys', '1569226480807', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('314', '5-3-2', null, null, null, '5-3-2', '5-3-2', '', null, '3', '5', '2', '2', '13', '13', null, null, null, '1569226480807', 'sys', '1569226480807', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('315', '5-3-3', null, null, null, '5-3-3', '5-3-3', '', null, '3', '5', '3', '2', '14', '14', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('316', '5-4-1', null, null, null, '5-4-1', '5-4-1', '', null, '4', '5', '1', '2', '28', '28', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('317', '5-4-2', null, null, null, '5-4-2', '5-4-2', '', null, '4', '5', '2', '2', '29', '29', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('318', '5-4-3', null, null, null, '5-4-3', '5-4-3', '', null, '4', '5', '3', '2', '30', '30', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('319', '5-5-1', null, null, null, '5-5-1', '5-5-1', '', null, '5', '5', '1', '3', '12', '12', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('320', '5-5-2', null, null, null, '5-5-2', '5-5-2', '', null, '5', '5', '2', '3', '13', '13', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('321', '5-5-3', null, null, null, '5-5-3', '5-5-3', '', null, '5', '5', '3', '3', '14', '14', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('322', '5-6-1', null, null, null, '5-6-1', '5-6-1', '', null, '6', '5', '1', '3', '28', '28', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('323', '5-6-2', null, null, null, '5-6-2', '5-6-2', '', null, '6', '5', '2', '3', '29', '29', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('324', '5-6-3', null, null, null, '5-6-3', '5-6-3', '', null, '6', '5', '3', '3', '30', '30', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('325', '5-7-1', null, null, null, '5-7-1', '5-7-1', '', null, '7', '5', '1', '4', '12', '12', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('326', '5-7-2', null, null, null, '5-7-2', '5-7-2', '', null, '7', '5', '2', '4', '13', '13', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
INSERT INTO `ti_obj_cab` VALUES ('327', '5-7-3', null, null, null, '5-7-3', '5-7-3', '', null, '7', '5', '3', '4', '14', '14', null, null, null, '1569226480808', 'sys', '1569226480808', 'sys', '00000000000', null, '0', '0', '0');
