pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo '✅ Code checked out successfully'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                echo '✅ Dependencies installed'
            }
        }
        
        stage('Test') {
            steps {
                // This multi-line script starts the app, tests it, and cleans up
                sh '''
                    echo "🚀 Starting server in the background for testing..."
                    node server.js &
                    SERVER_PID=$!
                    echo "Server started with Process ID: $SERVER_PID"
                    
                    echo "⏳ Waiting 3 seconds for server to boot..."
                    sleep 3
                    
                    echo "🧪 Running tests..."
                    npm test
                    TEST_EXIT_CODE=$?
                    
                    echo "🛑 Stopping the server..."
                    kill $SERVER_PID
                    
                    # Exit with the test result (0 = success, 1 = failure)
                    exit $TEST_EXIT_CODE
                '''
                echo '✅ All tests passed'
            }
        }
    }
    
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
