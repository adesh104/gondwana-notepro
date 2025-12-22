
export enum NoteStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  RETURNED = 'RETURNED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export enum WorkflowAction {
  FORWARD = 'FORWARD',
  RETURN = 'RETURN',
  INITIATE = 'INITIATE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // Base64 or Blob URL for simulation
}

export interface Staff {
  id: string;
  name: string;
  designation: string;
  department: string;
  role: UserRole;
  password?: string;
  email?: string;
  phone?: string;
  photo?: string; // Base64 encoded image
}

export interface WorkflowEntry {
  id: string;
  from: Staff;
  to: Staff;
  timestamp: string;
  remark: string;
  action: WorkflowAction;
  notificationsSent?: {
    email: boolean;
    sms: boolean;
  };
}

export interface NoteSheet {
  id: string;
  subject: string;
  content: string;
  referenceNo: string;
  dateInitiated: string;
  status: NoteStatus;
  creator: Staff;
  currentHandler: Staff;
  history: WorkflowEntry[];
  attachments?: Attachment[];
}

export interface UniversitySettings {
  id: string;
  universityName: string;
  logo?: string; // Base64 encoded logo
}

export interface UserState {
  currentUser: Staff;
  isAuthenticated: boolean;
}
