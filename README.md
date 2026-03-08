Problem Statement
Urban centers in India often face devastating floods because management is reactive. There is a critical gap in identifying ward-level micro-hotspots before the monsoon, leading to delayed resource deployment. Jal-Drishti (VenaCity) aims to convert fragmented urban data into actionable intelligence.

Key Features
Ward-Level Heatmaps: Real-time GIS visualization using Mapbox GL JS to identify 2,500+ hotspots.

Pre-Monsoon Readiness Score: A dynamic 0-100 metric for administrators to prioritize drainage maintenance.

Rainfall Simulation: A "What-If" slider to predict flooding based on varying rainfall intensities (e.g., 20mm vs. 100mm).

Automated Alerts: Instant notifications to ward officers via Firebase Cloud Messaging (FCM) when a readiness score drops below a safe threshold.

System Architecture
We utilize a Serverless Architecture to ensure the system scales automatically during high-traffic monsoon events.

Frontend: React.js + Mapbox (GIS Mapping)

Database: Google Cloud Firestore (Real-time NoSQL)

Processing: Firebase Cloud Functions (Predictive Logic)

Auth: Firebase Authentication (Role-based access for Bureaucrats)

🛠️ The "Readiness Score" Logic
The engine calculates risk by weighting three primary factors:

Topography (30%): Low-lying zones from Digital Elevation Models (DEM).

Infrastructure Health (40%): Siltation levels and historical drainage capacity.

Impervious Surface (30%): Percentage of concrete vs. green cover in the ward.
