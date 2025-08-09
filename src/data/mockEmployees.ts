import { Employee } from "@/types/employee";

export const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "Marie",
    lastName: "Dubois",
    email: "marie.dubois@gesem.com",
    phone: "+33 1 23 45 67 89",
    position: "Développeuse Senior",
    department: "IT",
    salary: 65000,
    hireDate: "2022-03-15",
    status: "active"
  },
  {
    id: "2",
    firstName: "Pierre",
    lastName: "Martin",
    email: "pierre.martin@gesem.com",
    phone: "+33 1 98 76 54 32",
    position: "Chef de Projet",
    department: "Management",
    salary: 75000,
    hireDate: "2021-09-01",
    status: "active"
  },
  {
    id: "3",
    firstName: "Sophie",
    lastName: "Leroy",
    email: "sophie.leroy@gesem.com",
    phone: "+33 1 11 22 33 44",
    position: "Designer UX/UI",
    department: "Design",
    salary: 55000,
    hireDate: "2023-01-10",
    status: "active"
  },
  {
    id: "4",
    firstName: "Jean",
    lastName: "Moreau",
    email: "jean.moreau@gesem.com",
    phone: "+33 1 55 66 77 88",
    position: "Comptable",
    department: "Finance",
    salary: 45000,
    hireDate: "2020-06-20",
    status: "inactive"
  },
  {
    id: "5",
    firstName: "Camille",
    lastName: "Bernard",
    email: "camille.bernard@gesem.com",
    phone: "+33 1 44 55 66 77",
    position: "Responsable RH",
    department: "RH",
    salary: 60000,
    hireDate: "2021-11-05",
    status: "active"
  },
  {
    id: "6",
    firstName: "Thomas",
    lastName: "Petit",
    email: "thomas.petit@gesem.com",
    phone: "+33 1 33 44 55 66",
    position: "Développeur Frontend",
    department: "IT",
    salary: 50000,
    hireDate: "2023-05-15",
    status: "active"
  }
];

export const departments = [
  "IT",
  "Management", 
  "Design",
  "Finance",
  "RH",
  "Marketing",
  "Ventes"
];

export const positions = [
  "Développeur Frontend",
  "Développeur Backend", 
  "Développeuse Senior",
  "Chef de Projet",
  "Designer UX/UI",
  "Comptable",
  "Responsable RH",
  "Responsable Marketing",
  "Commercial"
];
