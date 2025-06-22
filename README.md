# Quantify Lite Frontend

This is the frontend for the Quantify Lite application, a modern web app built with React to help users optimize their savings.

## Overview

The application provides a user-friendly interface for users to input their financial information, including annual earnings and specific savings goals. It then communicates with a backend service to get an optimized investment plan and displays the results in a clean, easy-to-understand format.

## Features

-   **Two-Page Interface:** A seamless user experience with a dedicated input page and a results page.
-   **Dynamic Savings Goals:** Users can add multiple savings goals, each with a specific amount and time horizon.
-   **Interactive Results:** The results page displays a list of recommended investment accounts. Each item is clickable and redirects to the provider's website.
-   **Data-Driven Visuals:** Each result includes details like the amount to invest, the account's AER, its term, and whether it's an ISA.
-   **Mock Data Mode:** A built-in toggle allows for frontend testing and demonstration without requiring a running backend.
-   **Modern Design:** A sleek, responsive design with a pale pink and purple color scheme.

## How It Works

The frontend is structured into several key areas:

-   `src/pages`: Contains the main page components:
    -   `InputPage.js`: A form to collect the user's annual earnings and a list of savings goals. It manages the form state and sends the data to the optimization service upon submission.
    -   `ResultsPage.js`: Displays the optimization results passed from the input page. It renders a list of investment recommendations and provides links to external account pages.
-   `src/services`: Handles API communication.
    -   `api.js`: Contains the `optimiseSavings` function, which makes a POST request to the backend's `/optimise` endpoint. It can also return a hardcoded set of mock data if the "Use Mock Data" option is selected, which is useful for testing or if the backend is unavailable.
-   `src/styles`: Contains the CSS files for styling the application.
    -   `App.css`: Global styles and theme variables (colors, fonts, etc.).
    -   `InputPage.css`: Styles specific to the input form and its components.
    -   `ResultsPage.css`: Styles for the results list and result items.
-   `App.js`: The main application component that sets up routing using `react-router-dom`, allowing navigation between the `InputPage` and `ResultsPage`.

## Getting Started

Follow these instructions to get the frontend running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14.x or later recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2.  Install the required dependencies:
    ```sh
    npm install
    ```

### Running the Application

1.  To start the development server, run:
    ```sh
    npm start
    ```
    This will open the application in your default web browser at [http://localhost:3000](http://localhost:3000).

2.  The application will automatically reload if you make any changes to the source files.

### Operation

1.  On the input page, enter your annual earnings.
2.  Add one or more savings goals, specifying the amount and time horizon for each.
3.  (Optional) Check the "Use Mock Data" box to test the frontend without a backend connection.
4.  Click "Optimise Savings" to see the recommended investment plan on the results page.
5.  On the results page, click any account card to be redirected to the account provider's website.

## Version Control

This project is managed using Git and is hosted on GitHub.

### Cloning the Repository
To get a local copy of the project, clone the repository using the following command:
```bash
git clone https://github.com/samphillips38/quantify-lite-frontend.git
cd quantify-lite-frontend
```

### Contribution Workflow
If you wish to contribute, please follow this basic workflow:
1.  Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`
2.  Make your changes and commit them with a clear message: `git commit -m "Add some feature"`
3.  Push your branch to the repository: `git push origin feature/your-feature-name`
4.  Open a pull request on GitHub.
