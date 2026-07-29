// Simulated network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_PROFILE_EXTRAS = {
  organization: "Federal Bureau of Policy & Innovation",
  jobTitle: "Senior Policy Analyst",
  bio: "Dedicated policy expert focusing on artificial intelligence governance and public sector innovation. 12+ years of experience in federal policy design.",
  memberSince: "Jan 2024",
  verified: true,
  enterprisePlan: true,
  profileImage: "", // Base64 encoded custom image
  interests: ["AI Ethics", "Data Privacy", "Public Health Law", "Cybersecurity Frameworks"],
  notifications: {
    emailUpdates: true,
    newPolicyAlerts: true,
    weeklyReports: false,
    aiDigests: true
  },
  preferences: {
    language: "English (US)",
    theme: "Light"
  },
  twoFactorEnabled: true
};

function loadLocalProfile(userEmail) {
  const key = `profile_extras_${userEmail || 'default'}`;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(DEFAULT_PROFILE_EXTRAS));
    return DEFAULT_PROFILE_EXTRAS;
  }
  try {
    return { ...DEFAULT_PROFILE_EXTRAS, ...JSON.parse(data) };
  } catch (e) {
    return DEFAULT_PROFILE_EXTRAS;
  }
}

function saveLocalProfile(userEmail, extras) {
  const key = `profile_extras_${userEmail || 'default'}`;
  localStorage.setItem(key, JSON.stringify(extras));
}

/**
 * Get profile settings
 */
export async function getProfileSettings(userEmail) {
  await delay(500); // Simulate network latency
  return { success: true, profile: loadLocalProfile(userEmail) };
}

/**
 * Save profile details
 */
export async function updateProfileSettings(userEmail, profileData) {
  await delay(600);
  const current = loadLocalProfile(userEmail);
  const updated = { ...current, ...profileData };
  saveLocalProfile(userEmail, updated);
  return { success: true, profile: updated };
}

/**
 * Change user password
 */
export async function changeUserPassword(passwordData) {
  await delay(600);
  // Prefill simulated checks
  if (passwordData.newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }
  return { success: true, message: "Password updated successfully." };
}

/**
 * Delete citizen account
 */
export async function deleteCitizenAccount(userEmail) {
  await delay(600);
  const key = `profile_extras_${userEmail || 'default'}`;
  localStorage.removeItem(key);
  return { success: true };
}
