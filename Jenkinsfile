// This is a "Declarative Pipeline" — Jenkins' way of describing steps
// Think of it as a recipe that Jenkins follows

pipeline {
    // "agent any" means: run this on any available Jenkins worker
    agent any
    
    // "stages" are the steps in your recipe
    stages {
        // Stage 1: Get the code from GitHub
        stage('Checkout') {
            steps {
                // This pulls your code from GitHub into Jenkins' workspace
                checkout scm
                echo '✅ Code checked out successfully'
            }
        }
        
        // Stage 2: Install dependencies
        stage('Install Dependencies') {
            steps {
                // Run: npm install (downloads Express and other libraries)
                sh 'npm install'
                echo '✅ Dependencies installed'
            }
        }
        
        // Stage 3: Run tests
        stage('Test') {
            steps {
                sh 'npm test'
                echo '✅ All tests passed'
            }
        }
    }
    
    // "post" runs after everything (like cleanup)
    post {
        always {
            echo '🏁 Pipeline finished!'
        }
        success {
            echo '🎉 Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
