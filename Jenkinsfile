pipeline {
    agent any
    
    environment {
        AWS_ACCOUNT_ID = '312695118327'          // REPLACE with YOUR account ID
        AWS_REGION     = 'eu-central-1'          // REPLACE with your region
        ECR_REPO       = 'task-manager-api'
        IMAGE_TAG      = ''                      // Set dynamically from Git SHA
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                
                // Grab the short Git commit SHA for this build
                script {
                    env.IMAGE_TAG = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                    
                    if (!env.IMAGE_TAG) {
                        env.IMAGE_TAG = 'unknown'
                    }
                    
                    echo "✅ Code checked out — commit SHA: ${env.IMAGE_TAG}"
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                echo '✅ Dependencies installed'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh '''
                    node server.js &
                    APP_PID=$!
                    sleep 3
                    npm test
                    TEST_EXIT=$?
                    kill $APP_PID
                    exit $TEST_EXIT
                '''
                echo '✅ Tests passed'
            }
        }
        
        stage('Code Quality') {
            steps {
                sh '''
                    echo "📊 Code Quality Report:"
                    echo "Total JS files: $(find . -name '*.js' | wc -l)"
                    echo "Total lines of code: $(find . -name '*.js' -not -path './node_modules/*' | xargs wc -l | tail -1)"
                    echo "TODOs found: $(grep -r 'TODO' . --exclude-dir=node_modules | wc -l)"
                '''
                echo '✅ Code quality check done'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${ECR_REPO}:${IMAGE_TAG} ."
                sh "docker tag ${ECR_REPO}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}"
                sh "docker tag ${ECR_REPO}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:latest"
                echo "✅ Docker image built with tag ${IMAGE_TAG}"
            }
        }
        
        stage('Push to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    
                    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:latest
                '''
                echo "✅ Image pushed to ECR with tag ${IMAGE_TAG}"
            }
        }
    }
    
    post {
        success {
            echo "🎉 Full CI pipeline succeeded! Image tag: ${IMAGE_TAG}"
        }
        failure {
            echo "❌ Pipeline failed! Commit: ${IMAGE_TAG}"
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
