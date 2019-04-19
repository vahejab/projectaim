/*
SQLyog Community v13.1.2 (64 bit)
MySQL - 5.7.24 : Database - projectaim
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`projectaim` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `projectaim`;

/*Table structure for table `actionitems` */

DROP TABLE IF EXISTS `actionitems`;

CREATE TABLE `actionitems` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ActionItemID` int(11) NOT NULL,
  `ActionItemTitle` varchar(255) DEFAULT NULL,
  `Criticality` enum('High','Med','Low','') DEFAULT NULL,
  `AssignorID` int(11) DEFAULT NULL,
  `OwnerID` int(11) DEFAULT NULL,
  `AltOwnerID` int(11) DEFAULT NULL,
  `ApproverID` int(11) DEFAULT NULL,
  `AssignedDate` date DEFAULT NULL,
  `DueDate` date DEFAULT NULL,
  `ECD` date DEFAULT NULL,
  `CompletionDate` date DEFAULT NULL,
  `ClosedDate` date DEFAULT NULL,
  `ActionItemStatement` text,
  `ClosureCriteria` text,
  `ClosureStatement` text,
  `RejectionJustification` text,
  `OwnerNotes` text,
  `ApproverComments` text,
  `Notes` text,
  PRIMARY KEY (`ID`),
  KEY `fk_actionowner_user` (`OwnerID`),
  KEY `fk_actionaltowner_user` (`AltOwnerID`),
  KEY `fk_actionassignor_user` (`AssignorID`),
  KEY `fk_actionapprover_user` (`ApproverID`),
  KEY `SURROGATE` (`ActionItemID`),
  CONSTRAINT `fk_actionaltowner_user` FOREIGN KEY (`AltOwnerID`) REFERENCES `users` (`ID`),
  CONSTRAINT `fk_actionapprover_user` FOREIGN KEY (`ApproverID`) REFERENCES `users` (`ID`),
  CONSTRAINT `fk_actionassignor_user` FOREIGN KEY (`AssignorID`) REFERENCES `users` (`ID`),
  CONSTRAINT `fk_actionowner_user` FOREIGN KEY (`OwnerID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

/*Data for the table `actionitems` */

insert  into `actionitems`(`ID`,`ActionItemID`,`ActionItemTitle`,`Criticality`,`AssignorID`,`OwnerID`,`AltOwnerID`,`ApproverID`,`AssignedDate`,`DueDate`,`ECD`,`CompletionDate`,`ClosedDate`,`ActionItemStatement`,`ClosureCriteria`,`ClosureStatement`,`RejectionJustification`,`OwnerNotes`,`ApproverComments`,`Notes`) values 
(1,1,'Create ActionAIM My Info Feature','High',1,10,25,1,'2015-11-03','2015-11-10','2015-11-12',NULL,NULL,'Add my info page functionality to allow for new and existing users to modify user account information. User will access page by clicking on button on menu which, when logged in, will allow for editing username, user company information (phone number, department, title, email).','My Info page has been created with the above information and has been tesed to allow only logged in users to view their own account. Data has been validated properly.',NULL,NULL,NULL,NULL,'\"My Info\" page is implemented then tested and verified by peers.'),
(2,2,'Create ActionAIM Dashboard Feature','Low',1,10,15,1,'2015-11-03','2015-11-10','2015-11-12','2018-06-21','2018-06-21','Add dashboard page functionality to allow for new and existing users to modify user account information. User will access page by clicking on button on menu which, when logged in, will allow for editing username, user company information (phone number, department, title, email).','Dashboard page has been created with the above information and has been tested to allow only logged in users to view their own account. Data has been validated properly.',NULL,NULL,NULL,NULL,'\"Dashboard\" page is implemented then tested and verified by peers.'),
(3,3,'Add links section to individual detail Action Items page','Med',1,21,11,1,'2015-12-09','2015-12-23','2015-12-23',NULL,NULL,'Create a new section in the detailed action item page allowing owner to insert supporting hyperlinks for action item. Hyperlinks could provide access to relevant documentation, webpages and related material.','New links section appears on action item detail page with clear instructions provided to the action item owner to create links and save. Other users of the ActionAIM database should be able to access links when visiting the particular action item detail page.',NULL,NULL,NULL,NULL,'Link option added, tested, and verified by peers.'),
(4,4,'Create ActionAIM Users Manual','Med',1,23,24,10,'2016-01-18','2016-01-19','2016-01-20','2016-01-19','2016-01-19','Prepare User\'s Document for ActionAIM web tool. Document needs to be in Microsoft Word format and needs to clearly describe all menu items of the tool along with plenty of clarifying images.','Completed document reviewed by a non-author for completeness and accuracy.',NULL,NULL,NULL,NULL,'Users Manual created in Microsoft Word and Acrobat PDF format. Contents are reviewed by two team members and following the implementation of corrections the Manual is formally released.'),
(5,5,'Create PowerPoint overview charts','Med',1,8,NULL,1,'2015-12-31','2016-01-29','2016-02-12',NULL,NULL,'Create ActionAIM PowerPoint overview chart to help introduce the tool to a general audience, potential, and actual users of the tool.  Content to include features with sections for general users, action item owners and administrator.','Presentation file to be completed per the above requirements and reviewed by a team member independent of the document author.',NULL,NULL,NULL,NULL,'Presentation charts completed and reviewed for accuracy and content by two team members.'),
(6,6,'Create ActionAIM requirements document','High',1,9,NULL,1,'2016-01-05','2016-01-29','2016-02-03','2016-01-28','2016-01-29','Create and finalize ActionAIM requirements document containing the details of technical requirements, software requirements, and hardware requirements. Requirements to cover deployment, testing, end user requirements, accessibility, security, and the functional specification of the application.','Create a requirements compliance matrix verifying completeness of all features as per the above.  Verify completeness by means of peer review.',NULL,NULL,NULL,NULL,''),
(7,7,'Create action item process documentation','Low',1,11,NULL,1,'2016-01-05','2016-03-03','2016-03-03','2016-01-27','2016-01-29','Create an action item process documentation describing the lifecycle of action items.  Document shall contain a process flow chart, roles, inputs and outputs.','Completed action item process documentation to be reviewed by means of a peer review.  Final product needs to be approved by management.',NULL,NULL,NULL,NULL,''),
(8,8,'Add in multiple project support to ActionAIM application ','Med',1,10,23,1,'2016-01-11','2016-01-25','2016-02-01','2016-01-29','2016-01-29','Modify ActionAIM application to allow for managing Action Items of multiple projects with a centralized application.  All unique parts of each project will be independent of other projects.','Multiple projects entered and successfully tested with above approach.  Application is verified by representatives of more than one independent project.',NULL,NULL,NULL,NULL,''),
(9,9,'Prepare ActionAIM training workshop','High',1,3,NULL,1,'2016-01-11','2016-04-01','2016-03-25',NULL,NULL,'Prepare a hands-on ActionAIM training workshop. Workshop to include:\r\n1.	Purpose and explanation of action item process\r\n2.	Action item process flow and link to other project management processes\r\n3.	A case study of a project with action items\r\n4.	Hands on use of ActionAIM for the case study\r\n5.	Handout material for participants of the workshop','The above material prepared.\r\nMaterial peer reviewed and updated per comments.\r\nA pilot workshop held and refined as appropriate.',NULL,NULL,NULL,NULL,''),
(10,10,'Evaluate PHP development tool','Low',1,23,NULL,1,'2016-01-18','2016-03-07','2016-03-07',NULL,NULL,'Evaluate a PHP development tool.\r\nEvaluation to include:\r\n1.	Ease of use\r\n2.	Setup\r\n3.	Debugging\r\n4.	Customer support\r\n5.	Price','Trade study conducted on a minimum of 3 tools.\r\nConclusions and recommendation presented to management for decision.',NULL,NULL,NULL,NULL,''),
(11,11,'Introduce ActionAIM to the customer','Med',1,20,18,1,'2016-01-18','2016-03-03','2016-03-03',NULL,NULL,'Introduce ActionAIM to the customer during the next project review meeting. Compare the current action item management methods via Microsoft Excel and Microsoft Word to the web based tool. Emphasize the automated features including reports and graphs, automated emails, and access via the Internet. Obtain concurrence to apply and use the new tool.','The ActionAIM tool is introduced to the customer and concurrence obtained to use the database on the project.',NULL,NULL,NULL,NULL,''),
(12,12,'Create Issue Management process documentation','Med',1,10,NULL,1,'2016-01-25','2016-04-01','2016-03-23',NULL,NULL,'Create an issue management process documentation describing the lifecycle of an issue.  Document shall contain a process flow chart, roles, inputs and outputs. The document shall also clarify the difference between issue and action item.','Completed issue management process documentation to be reviewed by means of a peer review.  Final product needs to be approved by management.',NULL,NULL,NULL,NULL,''),
(13,13,'Network Installation Proposal','Med',1,4,6,1,'2016-01-27','2016-02-19','2016-02-19',NULL,NULL,'Create and present to management a proposal to install site-wide network.  Proposal presentation to include client profile consisting of building profile, number and breakdown of users.  Include number of network devices servers.    Proposed layout to be included in the form of a network diagram.  Research and provide cost breakdown of each hardware and software component.  Include cabling diagram, bill of materials, project timeline chart and proposal summary.','Presentation containing all required aspects delivered to management.  Proposal summary and cost breakdown included within presentation.  Project timeline outlining schedule of work presented as well as all requested features included in presentation.   Installation proposal approved by management.',NULL,NULL,NULL,NULL,''),
(14,14,'Create shopping cart login components','Low',1,13,NULL,1,'2016-02-01','2016-03-03','2016-03-03',NULL,NULL,'Create a login functionality allowing users to log in and validate credentials upon login.  Login page to be fully tested and be used to allow members to login and validate credentials.','Fully tested login page to be ready for incorporation into shopping cart application.',NULL,NULL,NULL,NULL,''),
(15,15,'Create shopping cart purchase mechanism','Med',1,16,10,11,'2016-02-01','2016-04-01','2016-04-01',NULL,NULL,'Create a shopping cart application that allows for selecting items and quantities and processing order.  Include payment information, credit card information city state and zip code information.  Order invoice summary and administrative panel with remaining product quantities to be included in application.','Order processing, administrator panel, order invoice summary, and purchase mechanism fully incorporated, tested and ready to be used.',NULL,NULL,NULL,NULL,''),
(16,16,'Document shopping cart application','Low',1,24,NULL,1,'2016-02-01','2016-02-26','2016-02-26',NULL,NULL,'Create final report for shopping cart application and submit for review.  Report to contain the following components:\r\n1)	Functional requirements / project specifications\r\n2)	Database diagram (Entity Relationship Diagram)\r\n3)	Key page screenshots\r\n4)	Code printouts divided into JavaScript, Template, and PHP code sections','Final report consisting of mentioned components reviewed, verified and approved by customer.',NULL,NULL,NULL,NULL,''),
(17,17,'Feasibility Analysis for International DTV Receiver','Low',1,12,NULL,1,'2016-02-08','2016-03-03','2016-03-03',NULL,NULL,'Conduct research and create feasibility analysis document for a digital terrestrial television receiver capable of receiving international and domestic TV over the air (OTA) signals. Document fundamentals of Software Defined Radio, proposed project breakdown and characteristics of 4 different standards ATSC (Advanced Television Standards Committee), DVB-T (Digital Video Broadcasting - Terrestrial), ISDB-T (Integrated Services Digital Broadcasting - Terrestrial), and DMB-T (Digital Media Broadcasting - Terrestrial). Document to include simplified block diagram, expanded diagram of receiver, including region specific routing and final output.','Feasibility analysis consisting of all mentioned criteria submitted and reviewed with any comments.  Conclusion clearly identified as to the feasibility of designing international receiver project will be verified for being present in the document.  Report approved after review of all criteria.',NULL,NULL,NULL,NULL,''),
(18,18,'Research and create a design proposal for product XYZ','Med',1,10,NULL,1,'2016-02-08','2016-04-01','2016-03-21',NULL,NULL,'Prepare a written design proposal that briefly describes product idea. Selection criteria must be one that is novel, and practical to implement, and strongly consider the project recommendations.  Include minimal working subset, system block diagram.  Research cost and produce a tentative schedule for implementation.','Design proposal to be reviewed by peers for completeness and adherence to above criteria.',NULL,NULL,NULL,NULL,''),
(19,19,'Create customer address database','Low',1,15,NULL,1,'2016-02-08','2016-02-19','2016-02-19','2016-02-16','2016-02-18','Research state, city, zip code, for US Cities listing online or through existing sources.  Create script in VBA (Visual Basic for Applications) to complete records from various scattered sources into central database and complete required fields via master list of cities, states, zip codes.  Create report summarizing work done.','All records consolidated into Excel file and records from city, state abbreviation and state name look up table into consolidated excel file.    Client requesting database consolidation to review document.',NULL,NULL,NULL,NULL,''),
(20,20,'Create Graphics Rendering Design Proposal','Med',1,15,NULL,1,'2016-02-09','2016-04-22','2016-04-15',NULL,NULL,'Create proposal for a Graphics Rendering Design including preliminary schedule, block diagram summarizing main features and required hardware platform for a Field Programmable Gate Array (FPGA) design.','Submitted proposal to be approved by management for work.  Verification criteria to include schedule and block diagram.',NULL,NULL,NULL,NULL,''),
(21,21,'Presentation charts for graphics processor project','High',1,14,NULL,1,'2016-02-09','2016-04-01','2016-04-01',NULL,NULL,'Prepare, document and deliver PowerPoint presentation for the graphics processor project.   Presentation to include necessary flow charts demonstrating components of design as well as a top level block diagram of design that is programmed on a programmable device as well as a summary capture of relevant screen shots demonstrating the project.  Live demonstration to be run on a pc monitor.  Necessary images and waveforms to be included in presentation.','Dry run the presentation to project peers. Presentation to be revised based on feedback received.   Presentation and demo to adhere to above criteria.',NULL,NULL,NULL,NULL,''),
(22,22,'Proposal for VLSI Design','Med',1,15,NULL,1,'2016-02-09','2016-04-08','2016-04-08',NULL,NULL,'Create proposal detailing design for a VLSI (Very Large Scale Integrated) 6-Bit ADC (Analog to Digital Converter) integrated circuit.  Design to be compliant to the scope presented by the customer.','Completed project proposal to be submitted to customer.  Project proposal to include overview, block diagram of main components, proposed design, cost, and schedule.',NULL,NULL,NULL,NULL,''),
(23,23,'Prepare for CMMI Audit','High',1,9,NULL,1,'2016-02-10','2016-03-11','2016-03-11',NULL,NULL,'Make arrangements with and invite evaluation team.\r\nPrepare all material for review.\r\nConduct internal orientation and training to assure successful audit.','Audit held and CMMI level 4 certification received.',NULL,NULL,NULL,NULL,''),
(24,24,'Release CDR Report','Low',1,12,NULL,1,'2016-02-10','2016-03-03','2016-03-03',NULL,NULL,'Document the Critical Design Review (CDR) outcome and release the report containing all action items and assignments.','CDR Report released and approved by management and customer.',NULL,NULL,NULL,NULL,''),
(25,25,'Release Supplier Management Plan',NULL,1,19,NULL,1,'2016-02-11','2016-04-01','2016-04-01',NULL,NULL,'Prepare and release supplier management plan outlining supplier communication plan, monthly face-to-face meetings, schedule management, risk management, and progress assessment methodology. Include metrics for monthly performance measurement.','Formally released plan signed by Horizon project management and Horizon supplier management.',NULL,NULL,NULL,NULL,''),
(26,26,'Sign Contract with Supplier','Med',1,21,NULL,1,'2016-02-11','2016-04-15','2016-04-04',NULL,NULL,'Complete all negotiations with software supplier and sign contract.','Contract to include frequency of contract status meetings, communications plan, action item management tracking methodology, scheduling tool and revision methods.',NULL,NULL,NULL,NULL,''),
(27,27,'Select Action Item Management Tool','High',1,11,22,1,'2016-02-12','2016-03-18','2016-03-18',NULL,NULL,'Conduct a trade study for action item management web tool for use on the Horizon Project. Use a minimum of 3 software tools and assemble a comparative matrix for category ratings to help select the tool. Consider cost, training requirements, and ease of use. Also consider licensing requirements and vendor support.','Trade study report released with comparative matrix and ratings for all categories. Clear description of advantages and disadvantages of each tool. Selected tool clearly identified with explanation for choice.',NULL,NULL,NULL,NULL,''),
(28,28,'Implement Action Management Tool','High',1,22,NULL,1,'2016-02-11','2016-05-03','2016-05-03',NULL,NULL,'Install the ActionAIM web tool on the Horizon Project server.  Populate the tool with current action items. Introduce tool to users and start producing weekly reports for management review.','Fully operational ActionAIM in place and weekly reporting implemented.',NULL,NULL,NULL,NULL,''),
(29,29,'Release Failure Analysis Report',NULL,1,21,NULL,1,'2016-02-12','2016-03-30','2016-03-30',NULL,NULL,'Complete the analysis of the XB32 board failure and release the Failure Analysis Report (FAR). Apply corrective action to all XB32 boards in inventory.','Root cause analysis conducted and recommended solution verified.',NULL,NULL,NULL,NULL,''),
(30,30,'Design Horizon Project Website','Med',1,25,NULL,1,'2016-02-15','2016-05-13','2016-05-13',NULL,NULL,'Identify requirements and design project website to share information with team members and customer and to provide updates.','Identify requirements and design project website to share information with team members and customer and to provide updates.',NULL,NULL,NULL,NULL,''),
(31,31,'Project Progress Report','High',1,23,25,1,'2016-02-16','2016-02-29','2016-02-29',NULL,NULL,'Prepare project progress report and present to program managements. Report to include project schedule plan and actual, budget plan and actual, project risks and mitigation plans, and supplier management progress.','Draft report completed and reviewed by management, review meeting held and action items documented.',NULL,NULL,NULL,NULL,''),
(32,32,'Conduct PDR','High',1,22,NULL,1,'2016-02-18','2016-03-25','2016-03-25',NULL,NULL,'Plan and conduct Horizon Project Preliminary Design Review (PDR). Invite customer and subcontractor.','PDR held and follow up action items documented in ActionAIM.',NULL,NULL,NULL,NULL,''),
(33,33,'Host Customer Delegation','High',1,25,25,1,'2016-02-18','2016-03-03','2016-03-03',NULL,NULL,'A delegation from XYZ company is visiting the Horizon Project on Nov. 12, 2013, to assess the maturity of our hardware and software processes. Identify Horizon Project personnel who need to make presentations, assign tasks, gather presentation material, and hold a dry run presentation with project management. Organize the meeting agenda then host the meeting with the customer.','Meeting held, presentations made, customer assessment received, and action items documented.',NULL,NULL,NULL,NULL,''),
(34,34,'Release CDR Report','High',1,16,NULL,1,'2016-02-22','2016-03-15','2016-03-15',NULL,NULL,'Document the Critical Design Review (CDR) outcome and release the report containing all action items and assignments.','Report prepared, approved by program manager and released.\r\nReport contains action items and assignments.',NULL,NULL,NULL,NULL,''),
(35,35,'Provide feature to add project logo to database','High',1,10,25,1,'2015-12-10','2015-12-31','2016-01-07',NULL,NULL,'Create a new section in admin panel to allow admin to insert the project logo in the Action Item database so that users can see logo on home page and select other locations as desired.','Form will be completed and only accessible by logged in admin. Form shall have instructions on how to create link to the logo and drop in the image file into specified link location.',NULL,NULL,NULL,NULL,'Feature designed and tested. Documentation provided.'),
(36,36,'Create Issue Management process documentation ','High',1,15,24,1,'2016-03-26','2016-04-13','2016-04-13','2016-03-30','2016-03-31','Create an issue management process documentation describing the lifecycle of an issue. Document shall contain a process flow chart, roles, inputs and outputs. The document shall also clarify the difference between issue and action item.','Completed issue management process documentation to be reviewed by means of a peer review. Final product needs to be approved by management.',NULL,NULL,NULL,NULL,''),
(37,37,'Prepare ActionAIM training workshop','High',1,24,24,1,'2016-03-26','2016-04-08','2016-04-08','2016-03-31','2016-04-11','Prepare a hands-on ActionAIM training workshop. Workshop to include:\r\n1.	Purpose and explanation of action item process\r\n2.	Action item process flow and link to other project management processes\r\n3.	A case study of a project with action items\r\n4.	Hands on use of ActionAIM for the case study\r\n5.	Handout material for participants of the workshop','The above material prepared.\r\nMaterial peer reviewed and updated per comments.\r\nA pilot workshop held and refined as appropriate.',NULL,NULL,NULL,NULL,''),
(38,38,'Research and create a design proposal for product XYZ','Low',1,25,12,1,'2015-12-01','2015-12-10','2015-12-10','2015-12-18','2015-12-21','Prepare a written design proposal that briefly describes product idea. Selection criteria must be one that is novel, and practical to implement, and strongly consider the project recommendations. Include minimal working subset, system block diagram. Research cost and produce a tentative schedule for implementation.','Design proposal to be reviewed by peers for completeness and adherence to above criteria.',NULL,NULL,NULL,NULL,''),
(39,39,'Create customer address database  ','Low',1,25,23,1,'2015-11-02','2015-11-16','2015-11-16','2015-11-20','2015-11-21','Research state, city, zip code, for US Cities listing online or through existing sources. Create script in VBA (Visual Basic for Applications) to complete records from various scattered sources into central database and complete required fields via master list of cities, states, zip codes. Create report summarizing work done.','All records consolidated into Excel file and records from city, state abbreviation and state name look up table into consolidated excel file. Client requesting database consolidation to review document.',NULL,NULL,NULL,NULL,''),
(40,40,'Create ActionAIM Users Manual ','High',1,22,25,1,'2016-03-21','2016-03-30','2016-03-30','2016-03-24','2016-03-25','Prepare User\'s Document for ActionAIM web tool. Document needs to be in Microsoft Word format and needs to clearly describe all menu items of the tool along with plenty of clarifying images.','Completed document reviewed by a non-author for completeness and accuracy.',NULL,NULL,NULL,NULL,''),
(41,41,'Create ActionAIM requirements document',NULL,1,25,25,1,'2016-03-26','2016-04-15','2016-04-15',NULL,NULL,'Create and finalize ActionAIM requirements document containing the details of technical requirements, software requirements, and hardware requirements. Requirements to cover deployment, testing, end user requirements, accessibility, security, and the functional specification of the application. ','Create a requirements compliance matrix verifying completeness of all features as per the above. Verify completeness by means of peer review.',NULL,NULL,NULL,NULL,''),
(42,42,'Create action item process documentation','Low',1,10,25,1,'2016-03-26','2016-04-20','2016-04-21',NULL,NULL,'Create an action item process documentation describing the lifecycle of action items. Document shall contain a process flow chart, roles, inputs and outputs.','Completed action item process documentation to be reviewed by means of a peer review. Final product needs to be approved by management.',NULL,NULL,NULL,NULL,''),
(43,43,'Prepare ActionAIM training workshop','High',1,25,10,1,'2016-03-26','2016-06-01','2016-06-01',NULL,NULL,'Prepare a hands-on ActionAIM training workshop. Workshop to include:\r\n 1. Purpose and explanation of action item process\r\n 2. Action item process flow and link to other project management processes\r\n 3. A case study of a project with action items\r\n 4. Hands on use of ActionAIM for the case study\r\n 5. Handout material for participants of the workshop','The above material prepared.\r\n Material peer reviewed and updated per comments.\r\n A pilot workshop held and refined as appropriate.',NULL,NULL,NULL,NULL,''),
(44,44,'Create ActionAIM Users Manual ','Med',1,10,22,1,'2016-01-18','2016-01-19','2016-01-20',NULL,NULL,'Prepare User\'s Document for ActionAIM web tool. Document needs to be in Microsoft Word format and needs to clearly describe all menu items of the tool along with plenty of clarifying images.','Completed document reviewed by a non-author for completeness and accuracy.',NULL,NULL,NULL,NULL,'Users Manual created in Microsoft Word and Acrobat PDF format. Contents are reviewed by two team members and following the implementation of corrections the Manual is formally released.');

/*Table structure for table `items` */

DROP TABLE IF EXISTS `items`;

CREATE TABLE `items` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ItemType` enum('Action','Issue','Risk','Opportunity','Lesson') DEFAULT NULL,
  `ItemID` int(11) DEFAULT NULL,
  `ActionID` int(11) DEFAULT NULL,
  `IssueID` int(11) DEFAULT NULL,
  `OpportunityID` int(11) DEFAULT NULL,
  `RiskID` int(11) DEFAULT NULL,
  `LessonID` int(11) DEFAULT NULL,
  `Selector` char(12) DEFAULT NULL,
  `Validator` char(24) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_item_risk` (`RiskID`),
  KEY `fk_item_action` (`ActionID`),
  CONSTRAINT `fk_item_action` FOREIGN KEY (`ActionID`) REFERENCES `actionitems` (`ID`),
  CONSTRAINT `fk_item_risk` FOREIGN KEY (`RiskID`) REFERENCES `risks` (`RiskID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `items` */

/*Table structure for table `itemtypes` */

DROP TABLE IF EXISTS `itemtypes`;

CREATE TABLE `itemtypes` (
  `ItemTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `Type` enum('Action','Issue','Opporunity','Risk','Lesson') DEFAULT NULL,
  PRIMARY KEY (`ItemTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `itemtypes` */

insert  into `itemtypes`(`ItemTypeID`,`Type`) values 
(1,NULL);

/*Table structure for table `projectitems` */

DROP TABLE IF EXISTS `projectitems`;

CREATE TABLE `projectitems` (
  `ProjectItemID` int(11) NOT NULL AUTO_INCREMENT,
  `ProjectID` int(11) DEFAULT NULL,
  `ItemID` int(11) DEFAULT NULL,
  `ItemTypeID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ProjectItemID`),
  KEY `fk_projectitem_itemtype` (`ItemTypeID`),
  KEY `fk_projectitem_projectid` (`ProjectID`),
  KEY `fk_projectitem_item` (`ItemID`),
  CONSTRAINT `fk_projectitem_item` FOREIGN KEY (`ItemID`) REFERENCES `items` (`ID`),
  CONSTRAINT `fk_projectitem_itemtype` FOREIGN KEY (`ItemTypeID`) REFERENCES `itemtypes` (`ItemTypeID`),
  CONSTRAINT `fk_projectitem_projectid` FOREIGN KEY (`ProjectID`) REFERENCES `projects` (`ProjectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `projectitems` */

/*Table structure for table `projects` */

DROP TABLE IF EXISTS `projects`;

CREATE TABLE `projects` (
  `ProjectID` int(11) NOT NULL AUTO_INCREMENT,
  `ProjectName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ProjectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `projects` */

/*Table structure for table `referenceditems` */

DROP TABLE IF EXISTS `referenceditems`;

CREATE TABLE `referenceditems` (
  `ItemID` int(11) DEFAULT NULL,
  `ReferencedItemID` int(11) DEFAULT NULL,
  KEY `fk_referenceditem_item` (`ItemID`),
  KEY `fk_referenceditem_itemreferenced` (`ReferencedItemID`),
  CONSTRAINT `fk_referenceditem_item` FOREIGN KEY (`ItemID`) REFERENCES `items` (`ID`),
  CONSTRAINT `fk_referenceditem_itemreferenced` FOREIGN KEY (`ReferencedItemID`) REFERENCES `items` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `referenceditems` */

/*Table structure for table `relateditems` */

DROP TABLE IF EXISTS `relateditems`;

CREATE TABLE `relateditems` (
  `ItemID` int(11) NOT NULL,
  `RelatedItemID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ItemID`),
  KEY `fk_relateditem_itemrelated` (`RelatedItemID`),
  CONSTRAINT `fk_relateditem_item` FOREIGN KEY (`ItemID`) REFERENCES `items` (`ID`),
  CONSTRAINT `fk_relateditem_itemrelated` FOREIGN KEY (`RelatedItemID`) REFERENCES `items` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `relateditems` */

/*Table structure for table `risks` */

DROP TABLE IF EXISTS `risks`;

CREATE TABLE `risks` (
  `RiskID` int(11) NOT NULL AUTO_INCREMENT,
  `RiskTitle` text CHARACTER SET latin1,
  `RiskStatement` text CHARACTER SET latin1,
  `ApproverID` int(11) DEFAULT NULL,
  `OwnerID` int(11) DEFAULT NULL,
  `CreatorID` int(11) DEFAULT NULL,
  `Likelihood` int(11) DEFAULT NULL,
  `Technical` int(11) DEFAULT NULL,
  `Schedule` int(11) DEFAULT NULL,
  `Cost` int(11) DEFAULT NULL,
  `ClosureCriteria` text CHARACTER SET latin1,
  `CategoryID` int(11) DEFAULT NULL,
  PRIMARY KEY (`RiskID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `risks` */

/*Table structure for table `usercredentials` */

DROP TABLE IF EXISTS `usercredentials`;

CREATE TABLE `usercredentials` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(256) DEFAULT NULL,
  `Password` varchar(2048) DEFAULT NULL,
  `Created` datetime DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `usercredentials` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `LastName` char(25) DEFAULT NULL,
  `FirstName` char(15) DEFAULT NULL,
  `Title` char(20) DEFAULT NULL,
  `Email` varchar(30) DEFAULT NULL,
  `Phone` char(12) DEFAULT NULL,
  `Extension` char(4) DEFAULT NULL,
  `Department` char(25) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `SURROGATE` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`ID`,`UserID`,`LastName`,`FirstName`,`Title`,`Email`,`Phone`,`Extension`,`Department`) values 
(1,1,'Admin','','ProjectAIM Admin','vjabagch@gmail.com','123-456-7890','1234',''),
(2,2,'Jabagchourian','Vahe','Software Engineer','vahe.jabagchourian@gmail.com','123-456-7890','1234','Supplier'),
(3,3,'Bell','Leslie','Project Manager','hhjab@socal.rr.com','123-456-7890','1234','Project Mgmt'),
(4,4,'Berberian','Shant','Engrg Manager','hhjab@socal.rr.com','123-456-7890','1234','Engineering'),
(5,5,'Bethoven','Barbara','Mrktg Director','hhjab@socal.rr.com','123-456-7890','1234','Marketing'),
(6,6,'Brown','Abraham','Engineer','hhjab@socal.rr.com','123-456-7890','1234','Engineering'),
(7,7,'Hernandez','Kevin','Software Engineer','hhjab@socal.rr.com','123-456-7890','1234','Software'),
(8,8,'Jansen','Linda','Quality Control','hhjab@socal.rr.com','123-456-7890','1234','Quality Control'),
(9,9,'Johnson','Robert','Mktg Manager','hhjab@socal.rr.com','123-456-7890','1234','Marketing'),
(10,10,'Jones','Silva','Project Manager','hhjab@socal.rr.com','123-456-7890','1234','Project Mgmt'),
(11,11,'King','Diana','Software Engineer','hhjab@socal.rr.com','123-456-7890','1234','Software'),
(12,12,'Kirkorian','Mike','Software Engineer','hhjab@socal.rr.com','123-456-7890','1234','Software'),
(13,13,'Lennon','Dean','Engineer','hhjab@socal.rr.com','123-456-7890','1234','Engineering'),
(14,14,'Martin','Ledwig','Software Developer','hhjab@socal.rr.com','123-456-7890','1234','Software'),
(15,15,'Mulvany','Fred','Software Developer','hhjab@socal.rr.com','123-456-7890','1234','Software'),
(16,16,'Patterson','Robert','Project Mgr','hhjab@socal.rr.com','123-456-7890','1234','Project Mgmt'),
(17,17,'Peterson','John','Supp Chain Analyst','hhjab@socal.rr.com','123-456-7890','1234','Supplier Mgmt'),
(18,18,'Presely','George','Quality Control','hhjab@socal.rr.com','123-456-7890','1234','Quality Control'),
(19,19,'Samson','Daniel','Software Engineer','hhjab@socal.rr.com','123-456-7890','1234','Software'),
(20,20,'Sheen','Samy','QC Engineer','hhjab@socal.rr.com','123-456-7890','1234','Quality Control'),
(21,21,'Smith','Bob','Supply Analyst','hhjab@socal.rr.com','123-456-7890','1234','Supplier Mgmt'),
(22,22,'Walters','Tom','Supply Manager','hhjab@socal.rr.com','123-456-7890','1234','Supply Mgmt'),
(23,23,'Washington','Abraham','Project Manager','hhjab@socal.rr.com','123-456-7890','1234','Project Mgmt'),
(24,24,'Wooden','Joe','Marketer','hhjab@socal.rr.com','123-456-7890','1234','Marketing'),
(25,25,'Zedan','Michael','SW Engrg Mgr','vahe.jabagchourian@gmail.com','123-456-7890','1234','Software');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
