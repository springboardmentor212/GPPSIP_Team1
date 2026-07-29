import api from './api';

// Initial Mock Data matching the applications requirement
const INITIAL_APPLICATIONS = [
  {
    id: "APP-2026-001",
    applicantName: "Aarav Sharma",
    schemeName: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    department: "Agriculture & Farmers Welfare",
    submittedDate: "2026-07-10",
    status: "Approved"
  },
  {
    id: "APP-2026-002",
    applicantName: "Aditi Patel",
    schemeName: "Post-Matric Scholarship Scheme",
    department: "Education",
    submittedDate: "2026-07-12",
    status: "Pending"
  },
  {
    id: "APP-2026-003",
    applicantName: "Vikram Singh",
    schemeName: "Atal Pension Yojana",
    department: "Finance",
    submittedDate: "2026-07-15",
    status: "Under Review"
  },
  {
    id: "APP-2026-004",
    applicantName: "Priya Nair",
    schemeName: "Ayushman Bharat PM-JAY",
    department: "Health & Family Welfare",
    submittedDate: "2026-07-18",
    status: "Rejected"
  },
  {
    id: "APP-2026-005",
    applicantName: "Rohan Gupta",
    schemeName: "Pradhan Mantri Awas Yojana",
    department: "Housing & Urban Affairs",
    submittedDate: "2026-07-20",
    status: "Pending"
  }
];

// Helper to load/save applications from localStorage
function loadLocalApplications() {
  const data = localStorage.getItem('mock_applications');
  if (!data) {
    localStorage.setItem('mock_applications', JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_APPLICATIONS;
  }
}

function saveLocalApplications(apps) {
  localStorage.setItem('mock_applications', JSON.stringify(apps));
}

// Simulated network delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fail simulation flag stored in sessionStorage to survive reloads
let forceFailure = sessionStorage.getItem('mock_applications_fail') === 'true';

export function setSimulatedFailure(value) {
  forceFailure = value;
  sessionStorage.setItem('mock_applications_fail', value ? 'true' : 'false');
}

export function getSimulatedFailure() {
  return forceFailure;
}

/**
 * Fetch all applications (Simulated).
 */
export async function getApplications() {
  await delay(600); // Simulate 600ms network latency
  if (forceFailure) {
    throw new Error("Simulated Connection Timeout: The database took too long to respond.");
  }
  return { success: true, applications: loadLocalApplications() };
}

/**
 * Submit a new application.
 */
export async function applyForScheme(data) {
  await delay(600);
  if (forceFailure) {
    throw new Error("Simulated API Submission Error.");
  }
  const apps = loadLocalApplications();
  const nextNum = apps.length > 0 
    ? Math.max(...apps.map(a => {
        const match = a.id.match(/-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })) + 1
    : 1;

  const paddedNum = String(nextNum).padStart(3, '0');
  
  const newApp = {
    id: `APP-2026-${paddedNum}`,
    applicantName: data.applicantName || "Anonymous",
    schemeName: data.schemeName || "General Welfare Scheme",
    department: data.department || "General Department",
    submittedDate: new Date().toISOString().split('T')[0],
    status: data.status || "Pending"
  };
  apps.unshift(newApp); // Add to the top
  saveLocalApplications(apps);
  return { success: true, application: newApp };
}

/**
 * Update an existing application.
 */
export async function updateApplication(id, data) {
  await delay(600);
  if (forceFailure) {
    throw new Error("Simulated API Update Error.");
  }
  const apps = loadLocalApplications();
  const index = apps.findIndex(app => app.id === id);
  if (index !== -1) {
    apps[index] = { ...apps[index], ...data };
    saveLocalApplications(apps);
    return { success: true, application: apps[index] };
  }
  return { success: false, message: "Application not found" };
}

/**
 * Delete an application.
 */
export async function deleteApplication(id) {
  await delay(600);
  if (forceFailure) {
    throw new Error("Simulated API Deletion Error.");
  }
  const apps = loadLocalApplications();
  const filtered = apps.filter(app => app.id !== id);
  saveLocalApplications(filtered);
  return { success: true };
}
