<?php

     class users
     {
        private $res;
        private $db;
        public function __construct($db)
        {
            $this->db = $db;
            $this->res =
'[
{
    "LastName": "Admin",
    "FirstName": "",
    "UserName": "admin",
    "Email": "vjabagch@gmail.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "ProjectAIM Admin",
    "Department": "",
    "UserID": 1
},
{
    "LastName": "Jabagchourian",
    "FirstName": "Vahe",
    "UserName": "vj",
    "Email": "vahe.jabagchourian@gmail.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "ActionAIM",
    "Title": "Software Engineer",
    "Department": "Supplier",
    "UserID": 2
},
{
    "LastName": "Berberian",
    "FirstName": "Shant",
    "UserName": "sb",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Engrg Manager",
    "Department": "Engineering",
    "UserID": 3
},
{
    "LastName": "Ghandi",
    "FirstName": "Rohid",
    "UserName": "rg",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Engineer",
    "Department": "Engineering",
    "UserID": 4
},
{
    "LastName": "Allison",
    "FirstName": "Alice",
    "UserName": "aa",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Test",
    "Department": "Test",
    "UserID": 5
},
{
    "LastName": "Bell",
    "FirstName": "Leslie",
    "UserName": "lb",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Project Manager",
    "Department": "Project Mgmt",
    "UserID": 6
},
{
    "LastName": "Bethoven",
    "FirstName": "Barbara",
    "UserName": "bb",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Mrktg Director",
    "Department": "Marketing",
    "UserID": 7
},
{
    "LastName": "Brown",
    "FirstName": "Abraham",
    "UserName": "ab",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Engineer",
    "Department": "Engineering",
    "UserID": 8
},
{
    "LastName": "Bunker",
    "FirstName": "Todd",
    "UserName": "tb",
    "Email": "vahe.jabagchourian@gmail.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Supplier Manager",
    "Department": "Supplier Mgmt",
    "UserID": 9
},
{
    "LastName": "Danson",
    "FirstName": "Tim",
    "UserName": "td",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "QC Analyst",
    "Department": "Quality Control",
    "UserID": 10
},
{
    "LastName": "Davis",
    "FirstName": "Frank",
    "UserName": "fd",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Engineer",
    "Department": "Engineering",
    "UserID": 11
},
{
    "LastName": "Duddy",
    "FirstName": "John",
    "UserName": "jd",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "QC Analyst",
    "Department": "Quality Control",
    "UserID": 12
},
{
    "LastName": "Edison",
    "FirstName": "Charlie",
    "UserName": "ce",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Engineer",
    "Department": "Engineering",
    "UserID": 13
},
{
    "LastName": "Erickson",
    "FirstName": "George",
    "UserName": "ge",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Project Manager",
    "Department": "Project Mgmt",
    "UserID": 14
},
{
    "LastName": "Gaidzag",
    "FirstName": "Bambino",
    "UserName": "bg",
    "Email": "bg@bg.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Cage",
    "Title": "",
    "Department": "",
    "UserID": 15
},
{
    "LastName": "Hernandez",
    "FirstName": "Kevin",
    "UserName": "kh",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Software Engineer",
    "Department": "Software",
    "UserID": 16
},
{
    "LastName": "Jabagchourian",
    "FirstName": "Harry",
    "UserName": "hj",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "ActionAIM",
    "Title": "Proj Mgmt Conslt",
    "Department": "Supplier",
    "UserID": 17
},
{
    "LastName": "Jansen",
    "FirstName": "Linda",
    "UserName": "lj",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Quality Control",
    "Department": "Quality Control",
    "UserID": 18
},
{
    "LastName": "Johnson",
    "FirstName": "Robert",
    "UserName": "rj",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Mktg Manager",
    "Department": "Marketing",
    "UserID": 19
},
{
    "LastName": "Jones",
    "FirstName": "Silva",
    "UserName": "sj",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Project Manager",
    "Department": "Project Mgmt",
    "UserID": 20
},
{
    "LastName": "King",
    "FirstName": "Diana",
    "UserName": "dk",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Software Engineer",
    "Department": "Software",
    "UserID": 21
},
{
    "LastName": "Kirkorian",
    "FirstName": "Mike",
    "UserName": "mk",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Software Engineer",
    "Department": "Software",
    "UserID": 22
},
{
    "LastName": "Lennon",
    "FirstName": "Dean",
    "UserName": "dl",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Engineer",
    "Department": "Engineering",
    "UserID": 23
},
{
    "LastName": "Martin",
    "FirstName": "Ledwig",
    "UserName": "lm",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Software Developer",
    "Department": "Software",
    "UserID": 24
},
{
    "LastName": "Mulvany",
    "FirstName": "Fred",
    "UserName": "fm",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Horizon",
    "Title": "Software Developer",
    "Department": "Software",
    "UserID": 25
},
{
    "LastName": "Patterson",
    "FirstName": "Robert",
    "UserName": "rp",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Project Mgr",
    "Department": "Project Mgmt",
    "UserID": 26
},
{
    "LastName": "Peterson",
    "FirstName": "John",
    "UserName": "jp",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Horizon",
    "Title": "Supp Chain Analyst",
    "Department": "Supplier Mgmt",
    "UserID": 27
},
{
    "LastName": "Peterson",
    "FirstName": "Alex",
    "UserName": "ap",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Horizon",
    "Title": "Controller",
    "Department": "Contracts",
    "UserID": 28
},
{
    "LastName": "Presely",
    "FirstName": "George",
    "UserName": "gp",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Quality Control",
    "Department": "Quality Control",
    "UserID": 29
},
{
    "LastName": "Samson",
    "FirstName": "Daniel",
    "UserName": "ds",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Software Engineer",
    "Department": "Software",
    "UserID": 30
},
{
    "LastName": "Samson",
    "FirstName": "Robert",
    "UserName": "rs",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Horizon",
    "Title": "Software Engineer",
    "Department": "Software",
    "UserID": 31
},
{
    "LastName": "Sheen",
    "FirstName": "Samy",
    "UserName": "ss",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "QC Engineer",
    "Department": "Quality Control",
    "UserID": 32
},
{
    "LastName": "Silva",
    "FirstName": "Jones",
    "UserName": "js",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "QC Suprvr",
    "Department": "Quality Control",
    "UserID": 33
},
{
    "LastName": "Smith",
    "FirstName": "Bob",
    "UserName": "bs",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Supply Analyst",
    "Department": "Supplier Mgmt",
    "UserID": 34
},
{
    "LastName": "Smith",
    "FirstName": "Daniel",
    "UserName": "ds",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Horizon",
    "Title": "MTS",
    "Department": "Engineering",
    "UserID": 35
},
{
    "LastName": "Smith",
    "FirstName": "Peter",
    "UserName": "ps",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Horizon",
    "Title": "Chief",
    "Department": "Engineering",
    "UserID": 36
},
{
    "LastName": "Test",
    "FirstName": "Test",
    "UserName": "tt",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1233",
    "Company": "Telestart",
    "Title": "Test",
    "Department": "",
    "UserID": 37
},
{
    "LastName": "Walters",
    "FirstName": "Tom",
    "UserName": "tw",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Supply Manager",
    "Department": "Supply Mgmt",
    "UserID": 38
},
{
    "LastName": "Washington",
    "FirstName": "Abraham",
    "UserName": "aw",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Project Manager",
    "Department": "Project Mgmt",
    "UserID": 39
},
{
    "LastName": "Wooden",
    "FirstName": "Joe",
    "UserName": "jw",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Marketer",
    "Department": "Marketing",
    "UserID": 40
},
{
    "LastName": "Zedan",
    "FirstName": "Michael",
    "UserName": "mz",
    "Email": "vahe.jabagchourian@gmail.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "SW Engrg Mgr",
    "Department": "Software",
    "UserID": 41
},
{
    "LastName": "Zigler",
    "FirstName": "Alice",
    "UserName": "az",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Mktg Mgr",
    "Department": "Marketing",
    "UserID": 42
},
{
    "LastName": "Zigler",
    "FirstName": "Zig",
    "UserName": "zz",
    "Email": "hhjab@socal.rr.com",
    "PhoneNumber": "123-456-7890",
    "Extension": "1234",
    "Company": "Telestar",
    "Title": "Test",
    "Department": "Test",
    "UserID": 43
}]'; 
        
        }
        
         public function get($id = null)
        {
            $arr = json_decode($this->res, true);
            return array_filter($arr, function($elem) use($id){
                return ($elem['UserID'] == $id || $id == null);
            });       
        }
        
        public function orderby($col, $dir = 'asc')
        {
            $arr = json_decode($this->res, true);
            return usort($arr, function($a, $b) use ($col, $dir){
                if ($a[$col] == $b[$col]){
                    return 0;
                }
                switch ($dir){
                    case 'asc':
                        return $a[$col] < $b[$col] ? -1:1;
                    case 'desc':
                        return $a[$col] < $b[$col] ? 1:-1;                               
                }
            });
        }
     }