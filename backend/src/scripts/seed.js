require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Scheme = require('../models/scheme.model');
const Policy = require('../models/policy.model');

// MongoDB Connection URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/policygpt';

const seedDatabase = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        // 1. Create a Gov. Official user if not exists
        const govEmail = 'gov.official@policygpt.gov';
        let govOfficial = await User.findOne({ email: govEmail });

        if (!govOfficial) {
            console.log('Creating default Government Official user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);

            govOfficial = new User({
                fullName: 'Gov Official User',
                email: govEmail,
                mobile: '9876543210',
                dob: new Date('1980-01-01'),
                password: hashedPassword,
                state: 'Delhi',
                district: 'Central Delhi',
                role: 'Gov. Official',
                termsAccepted: true
            });
            await govOfficial.save();
            console.log('Government Official user created.');
        } else {
            console.log('Government Official user already exists.');
        }

        // 2. Create a default Citizen user if not exists
        const citizenEmail = 'citizen@policygpt.in';
        let citizen = await User.findOne({ email: citizenEmail });

        if (!citizen) {
            console.log('Creating default Citizen user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);

            citizen = new User({
                fullName: 'Citizen User',
                email: citizenEmail,
                mobile: '9876543211',
                dob: new Date('1995-05-15'),
                password: hashedPassword,
                state: 'Delhi',
                district: 'New Delhi',
                role: 'Citizen',
                termsAccepted: true
            });
            await citizen.save();
            console.log('Citizen user created.');
        } else {
            console.log('Citizen user already exists.');
        }

        // 3. Clear existing schemes and insert seed data
        console.log('Clearing old schemes data...');
        await Scheme.deleteMany({});
        console.log('Old schemes data cleared.');

        const schemesData = [
            {
                title: 'National Merit-cum-Means Scholarship (NMMS)',
                description: 'Provides financial assistance to meritorious students of economically weaker sections to arrest their drop-out rate at class VIII and encourage them to continue education at the secondary stage. Under this scheme, scholarships are awarded to students whose parental income from all sources is not more than Rs. 3,50,000 per annum.',
                category: 'Scholarships',
                status: 'Active',
                creator: govOfficial._id,
                eligibilityRules: {
                    age: { min: 12, max: 18 },
                    income: { max: 350000 },
                    education: 'Class VIII passed',
                    disabilityStatus: false
                }
            },
            {
                title: 'MSME Sustainable (ZED) Certification Scheme',
                description: 'Promotes adaptation of Quality Tools/Systems and Energy Efficient manufacturing in MSMEs. Encourages them to constantly upgrade their quality standards in products and processes, aiming for Zero Defect and Zero Effect on the environment.',
                category: 'Business Support',
                status: 'Active',
                creator: govOfficial._id,
                eligibilityRules: {
                    occupation: 'Business Owner',
                    education: 'Any graduate',
                    disabilityStatus: false
                }
            },
            {
                title: 'PM Surya Ghar: Muft Bijli Yojana',
                description: 'A rooftop solar scheme that aims to provide free electricity to one crore households in India. Households receive a substantial subsidy to install solar panels on their roofs, enabling clean energy transition and saving thousands on monthly power bills.',
                category: 'Social Security',
                status: 'Active',
                creator: govOfficial._id,
                eligibilityRules: {
                    income: { max: 300000 },
                    disabilityStatus: false
                }
            },
            {
                title: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
                description: 'The largest health assurance scheme in the world, aiming to provide a health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families.',
                category: 'Healthcare',
                status: 'Active',
                creator: govOfficial._id,
                eligibilityRules: {
                    income: { max: 150000 },
                    disabilityStatus: false
                }
            },
            {
                title: "Prime Minister's Research Fellowship (PMRF)",
                description: 'Designed for improving the quality of research in various higher educational institutions in the country. Offers attractive fellowships to doctoral students in science, technology, and engineering in IITs, IISc, and select central universities.',
                category: 'Student Schemes',
                status: 'Active',
                creator: govOfficial._id,
                eligibilityRules: {
                    education: 'Postgraduate / B.Tech graduate',
                    disabilityStatus: false
                }
            },
            {
                title: 'Pradhan Mantri Awas Yojana (Urban) - PMAY-U',
                description: 'Provides all-weather dignified homes with water, electricity, kitchen, and toilet facilities to all eligible urban households. Promotes affordable housing in partnership and credit-linked interest subsidy schemes.',
                category: 'Housing',
                status: 'Active',
                creator: govOfficial._id,
                eligibilityRules: {
                    income: { max: 600000 },
                    disabilityStatus: false
                }
            }
        ];

        console.log('Seeding scheme data...');
        const seededSchemes = await Scheme.insertMany(schemesData);
        console.log(`Successfully seeded ${seededSchemes.length} schemes.`);

        // 4. Clear and seed policies data
        console.log('Clearing old policies data...');
        await Policy.deleteMany({});
        console.log('Old policies data cleared.');

        const policiesData = [
            {
                title: 'National Education Policy 2020 (NEP)',
                description: 'Outlines the vision of India\'s new education system. The policy covers elementary education to colleges in both rural and urban India, aiming to modularize curriculum, encourage multidisciplinary learning, and introduce key educational standards.',
                department: 'Ministry of Education',
                category: 'Education',
                status: 'Approved',
                creator: govOfficial._id
            },
            {
                title: 'National Digital Health Mission (NDHM)',
                description: 'Aims to establish a digital health infrastructure for India. It includes digital health IDs, doctor registries, personal health records, and telemedicine services to make healthcare delivery efficient and seamless.',
                department: 'Ministry of Health and Family Welfare',
                category: 'Healthcare',
                status: 'Approved',
                creator: govOfficial._id
            },
            {
                title: 'National Agriculture Policy (NAP)',
                description: 'Aims to promote sustainable agriculture, optimize resource utilization, secure fair pricing for farmers, and upgrade rural storage and distribution infrastructure to minimize crop wastage.',
                department: 'Ministry of Agriculture & Farmers Welfare',
                category: 'Agriculture',
                status: 'Approved',
                creator: govOfficial._id
            }
        ];

        console.log('Seeding policy data...');
        const seededPolicies = await Policy.insertMany(policiesData);
        console.log(`Successfully seeded ${seededPolicies.length} policies.`);

        mongoose.connection.close();
        console.log('Database connection closed. Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();
