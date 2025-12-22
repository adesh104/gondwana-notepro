
import { Staff, UserRole } from './types';

export const UNIVERSITY_NAME = "Gondwana University, Gadchiroli";

/**
 * Official Staff Registry - Gondwana University, Gadchiroli
 * Data compiled from statutory officers, departmental faculty, and administrative heads.
 * Testing Password for all accounts: Pass
 */
export const MOCK_STAFF: Staff[] = [
  // --- SYSTEM ADMINISTRATION ---
  { 
    id: 'ADMIN01', 
    name: 'Digital Cell Administrator', 
    designation: 'System Manager', 
    department: 'ICT Infrastructure', 
    role: UserRole.ADMIN, 
    password: 'Pass',
    phone: '+91 94221 00001'
  },
  
  // --- STATUTORY OFFICERS ---
  { 
    id: 'VC', 
    name: 'Dr. Prashant S. Bokare', 
    designation: 'Vice-Chancellor', 
    department: 'Administration', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00002'
  },
  { 
    id: 'PVC', 
    name: 'Dr. Sriram S. Kawale', 
    designation: 'Pro-Vice-Chancellor', 
    department: 'Administration', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00003'
  },
  { 
    id: 'REG', 
    name: 'Dr. Anil Hirekhan', 
    designation: 'Registrar', 
    department: 'Registrar Office', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00004'
  },
  { 
    id: 'FO', 
    name: 'CA Mayur D. Gadekar', 
    designation: 'Finance & Accounts Officer', 
    department: 'Finance Section', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00005'
  },

  // --- UNIVERSITY DIRECTORS ---
  { 
    id: 'DIR_EXAM', 
    name: 'Dr. Rajani Madane', 
    designation: 'Director, Board of Examinations & Evaluation', 
    department: 'Examination Section', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00006'
  },
  { 
    id: 'DIR_IIL', 
    name: 'Dr. Manish Uttarwar', 
    designation: 'Director, Innovation, Incubation & Linkages', 
    department: 'Innovation Cell', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00007'
  },
  { 
    id: 'DIR_SPORTS', 
    name: 'Dr. Anita Lokhande', 
    designation: 'Director, Sports & Physical Education', 
    department: 'Sports Department', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00008'
  },
  { 
    id: 'DIR_NSS', 
    name: 'Dr. Sopandev Pise', 
    designation: 'Director, National Service Scheme (NSS)', 
    department: 'NSS Department', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00009'
  },
  { 
    id: 'DIR_SDW', 
    name: 'Dr. Priyadarshani Khobragade', 
    designation: 'Director, Students Development', 
    department: 'Student Welfare', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00010'
  },
  { 
    id: 'DIR_KRC', 
    name: 'Dr. S. M. Rokade', 
    designation: 'Director, Knowledge Resource Center', 
    department: 'Knowledge Resource Center', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00011'
  },

  // --- ACADEMIC DEANS ---
  { 
    id: 'DEAN_ST', 
    name: 'Dr. S. S. Kawale', 
    designation: 'Dean, Faculty of Science & Technology', 
    department: 'Administration', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00012'
  },
  { 
    id: 'DEAN_CM', 
    name: 'Dr. Vinayak Irpate', 
    designation: 'Dean, Faculty of Commerce & Management', 
    department: 'Administration', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00013'
  },
  { 
    id: 'DEAN_HUM', 
    name: 'Dr. S. M. Rokade', 
    designation: 'Dean, Faculty of Humanities', 
    department: 'Administration', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00014'
  },
  { 
    id: 'DEAN_IDS', 
    name: 'Dr. A. Chandramouli', 
    designation: 'Dean, Faculty of Inter-disciplinary Studies', 
    department: 'Administration', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00015'
  },

  // --- PGTD COMPUTER SCIENCE ---
  { 
    id: 'CS_HOD', 
    name: 'Dr. Krishna Karoo', 
    designation: 'Assistant Professor & Head', 
    department: 'Department of Computer Science', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00016'
  },
  { 
    id: 'CS_FAC01', 
    name: 'Shri. R. M. Pant', 
    designation: 'Assistant Professor', 
    department: 'Department of Computer Science', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00017'
  },

  // --- PGTD ENGLISH ---
  { 
    id: 'ENG_HOD', 
    name: 'Dr. Vivek Joshi', 
    designation: 'Professor & Head', 
    department: 'Department of English', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00018'
  },
  { 
    id: 'ENG_FAC01', 
    name: 'Dr. Silestin Meshram', 
    designation: 'Assistant Professor', 
    department: 'Department of English', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00019'
  },

  // --- PGTD MATHEMATICS ---
  { 
    id: 'MATH_HOD', 
    name: 'Dr. S. K. Singh', 
    designation: 'Professor & Head', 
    department: 'Department of Mathematics', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00020'
  },
  { 
    id: 'MATH_FAC01', 
    name: 'Dr. S. S. Jaiswal', 
    designation: 'Associate Professor', 
    department: 'Department of Mathematics', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00021'
  },

  // --- PGTD APPLIED CHEMISTRY ---
  { 
    id: 'CHEM_HOD', 
    name: 'Dr. S. B. Rewatkar', 
    designation: 'Professor & Head', 
    department: 'Department of Chemistry', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00022'
  },
  { 
    id: 'CHEM_FAC01', 
    name: 'Dr. G. D. Deshmukh', 
    designation: 'Assistant Professor', 
    department: 'Department of Chemistry', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00023'
  },

  // --- PGTD PHYSICS ---
  { 
    id: 'PHYS_HOD', 
    name: 'Dr. J. V. Dadve', 
    designation: 'Professor & Head', 
    department: 'Department of Physics', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00024'
  },
  { 
    id: 'PHYS_FAC01', 
    name: 'Dr. S. S. Kawale', 
    designation: 'Professor', 
    department: 'Department of Physics', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00025'
  },

  // --- PGTD BOTANY / ZOOLOGY ---
  { 
    id: 'BOT_HOD', 
    name: 'Dr. T. R. Bandre', 
    designation: 'Professor & Head', 
    department: 'Department of Botany', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00026'
  },
  { 
    id: 'ZOO_HOD', 
    name: 'Dr. K. B. Nagarnaik', 
    designation: 'Professor & Head', 
    department: 'Department of Zoology', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00027'
  },

  // --- PGTD HUMANITIES (HISTORY/SOC/ECON) ---
  { 
    id: 'HIST_HOD', 
    name: 'Dr. S. M. Rokade', 
    designation: 'Professor & Head', 
    department: 'Department of History', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00028'
  },
  { 
    id: 'SOC_HOD', 
    name: 'Dr. Priyadarshani Khobragade', 
    designation: 'Associate Professor', 
    department: 'Department of Sociology', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00029'
  },
  { 
    id: 'ECON_HOD', 
    name: 'Dr. J. P. Deshmukh', 
    designation: 'Professor & Head', 
    department: 'Department of Economics', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00030'
  },

  // --- PGTD MASS COMMUNICATION ---
  { 
    id: 'MC_HOD', 
    name: 'Dr. Nitin Thakare', 
    designation: 'HOD, Mass Communication', 
    department: 'Department of Mass Communication', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00031'
  },

  // --- PGTD LAW ---
  { 
    id: 'LAW_HOD', 
    name: 'Dr. Rajshree Gade', 
    designation: 'Assistant Professor & Head', 
    department: 'Department of Law', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00032'
  },

  // --- ADMINISTRATIVE SECTION HEADS ---
  { 
    id: 'SEC_ACAD', 
    name: 'Shri. Ishwar Randaye', 
    designation: 'Assistant Registrar (Academic)', 
    department: 'Academic Section', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00033'
  },
  { 
    id: 'SEC_EST', 
    name: 'Shri. S. S. Waghmare', 
    designation: 'Assistant Registrar (Establishment)', 
    department: 'Establishment Section', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00034'
  },
  { 
    id: 'SEC_GEN', 
    name: 'Shri. D. K. Meshram', 
    designation: 'Assistant Registrar (General Administration)', 
    department: 'Administration', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00035'
  },
  { 
    id: 'SEC_EXAM_PRO', 
    name: 'Shri. Sunil Raut', 
    designation: 'Assistant Registrar (Professional Exams)', 
    department: 'Examination Section', 
    role: UserRole.STAFF, 
    password: 'Pass',
    phone: '+91 94221 00036'
  }
];

export const INITIAL_DEPARTMENTS = [
  'Administration',
  'Registrar Office',
  'Finance Section',
  'Examination Section',
  'Academic Section',
  'Establishment Section',
  'Innovation Cell',
  'Student Welfare',
  'Sports Department',
  'NSS Department',
  'Knowledge Resource Center',
  'Department of Computer Science',
  'Department of English',
  'Department of Physics',
  'Department of Chemistry',
  'Department of Mathematics',
  'Department of Law',
  'Department of History',
  'Department of Sociology',
  'Department of Economics',
  'Department of Marathi',
  'Department of Botany',
  'Department of Zoology',
  'Department of Mass Communication',
  'Department of Commerce',
  'ICT Infrastructure'
];
