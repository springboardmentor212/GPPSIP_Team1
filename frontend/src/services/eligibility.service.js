/**
 * @typedef {Object} EligibilityRequest
 * @property {number} age - The age of the citizen
 * @property {string} gender - Gender (Male, Female, etc.)
 * @property {number} annualIncome - Annual income in INR
 * @property {string} occupation - Employment/occupation category
 * @property {string} education - Educational level
 * @property {string} state - Location state
 * @property {string} district - Location city/district
 * @property {string} socialCategory - Social category (General, OBC, etc.)
 * @property {string} disabilityStatus - Yes/No
 */

/**
 * @typedef {Object} RecommendedScheme
 * @property {number} id - Unique database ID of the scheme
 * @property {string} title - Title of the scheme
 * @property {string} ministry - Ministry governing this scheme
 * @property {string} eligibilityTag - Status e.g. "Eligible"
 * @property {number} matchPercentage - Calculated match score (0-100)
 * @property {string} description - Brief summary/description of the scheme
 * @property {string} maxBenefit - Benefit summary e.g. "$50,000 Grants"
 * @property {string} deadline - Deadline string e.g. "Oct 24, 2024"
 * @property {string} category - Category tag
 * @property {string[]} tags - Small tags e.g. ["IT", "FIN"]
 */

/**
 * @typedef {Object} EligibilityResponse
 * @property {boolean} success - Operation success status
 * @property {string} message - Response feedback status message
 * @property {RecommendedScheme[]} recommendations - Calculated matching schemes
 */

import api from './api';


/**
 * Assess eligibility and fetch matching schemes.
 * PENDING BACKEND INTEGRATION: Connect this when eligibility matching API is implemented in backend.
 * Currently simulated via mock latency and mock JSON response.
 * 
 * @param {EligibilityRequest} requestData
 * @returns {Promise<EligibilityResponse>}
 */
export async function checkEligibility(requestData) {
  // Simulate network latency (800ms)
  await new Promise(resolve => setTimeout(resolve, 800));

  // In simulated environment, return mock recommendations based on the form values
  const mockRecommendations = [
    {
      id: 201,
      title: "MSME Digital Credit Facilitation",
      ministry: "Ministry of Finance",
      eligibilityTag: "Eligible",
      matchPercentage: requestData.annualIncome < 300000 ? 95 : 85,
      description: "Providing low-interest credit and digital infrastructure support to emerging small and medium enterprises in...",
      maxBenefit: "$50,000 Grants",
      deadline: "Oct 24, 2024",
      category: "Small Business (MSME)",
      tags: ["IT", "FIN", "+3"]
    },
    {
      id: 203,
      title: "Cybersecurity Talent Pipeline",
      ministry: "Department of National Security",
      eligibilityTag: "Eligible",
      matchPercentage: requestData.age < 30 ? 92 : 80,
      description: "Scholarships and placement programs for graduate students specializing in defense-grade cybersecurity...",
      maxBenefit: "Full Tuition",
      deadline: "Aug 01, 2024",
      category: "Education & Research",
      tags: ["GRADUATE", "TECH"]
    },
    {
      id: 206,
      title: "Rural Telemedicine Network Grant",
      ministry: "Ministry of Health & Family Welfare",
      eligibilityTag: "Eligible",
      matchPercentage: requestData.state === "Maharashtra" ? 90 : 85,
      description: "Subsidies for clinic infrastructure and high-speed satellite internet enablement in Tier-3 rural locations.",
      maxBenefit: "₹25 Lakhs Support",
      deadline: "Jan 10, 2025",
      category: "Healthcare",
      tags: ["MED", "RURAL"]
    }
  ];

  return {
    success: true,
    message: "Eligibility processed successfully.",
    recommendations: mockRecommendations
  };
}
