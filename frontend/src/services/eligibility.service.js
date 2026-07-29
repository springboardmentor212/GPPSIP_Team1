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


export async function checkEligibility(requestData) {
  try {
    // The backend uses POST /api/schemes/check-eligibility
    const response = await api.post('/schemes/check-eligibility', requestData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
}
