pipeline {
    agent any
    
    environment {
        AWS_ACCOUNT_ID = '312695118327' 
        AWS_REGION = 'eu-central-1'  
        ECR_REPO = 'task-manager-api'
        S3_BUCKET = 'task-manager-artifacts-xxx'  // REPLACE
        
        // Smart tagging based on branch
        IMAGE_TAG = "${env.BRANCH_NAME}-${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "📦 Building branch: ${env.BRANCH_NAME}"
            }
        }
        
        stage('Install & Test') {
            steps {
                sh 'npm install'
                sh '''
                    node server.js &
                    APP_PID=$!
                    sleep 3
                    npm test
                    TEST_EXIT=$?
                    kill $APP_PID
                    exit $TEST_EXIT
                '''
            }
        }
        
        // Only build Docker image on develop, release, and main
        stage('Build & Push Docker') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    branch 'release/*'
                }
            }
            steps {
                sh '''
                    docker build -t ${ECR_REPO}:${IMAGE_TAG} .
                    aws ecr get-login-password --region ${AWS_REGION} | \
                      docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    docker tag ${ECR_REPO}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                '''
            }
        }
        
        // Only deploy to dev environment from develop branch
        stage('Deploy to DEV') {
            when { branch 'develop' }
            steps {
                echo '🚀 Deploying to DEV environment...'
                sh "aws s3 cp --recursive . s3://${S3_BUCKET}/dev/ --exclude 'node_modules/*' --exclude '.git/*'"
            }
        }
        
        // Only deploy to staging from release branches
        stage('Deploy to STAGING') {
            when { branch 'release/*' }
            steps {
                echo '🚀 Deploying to STAGING environment...'
                sh "aws s3 cp --recursive . s3://${S3_BUCKET}/staging/ --exclude 'node_modules/*' --exclude '.git/*'"
            }
        }
        
        // Only deploy to prod from main branch
        stage('Deploy to PROD') {
            when { branch 'main' }
            input {
                message "Approve production deployment?"
                ok "Deploy to PROD"
                submitter "admin"
            }
            steps {
                echo '🚀 Deploying to PRODUCTION...'
                sh "aws s3 cp --recursive . s3://${S3_BUCKET}/prod/ --exclude 'node_modules/*' --exclude '.git/*'"
            }
        }
    }
    
    post {
        success { echo '🎉 Pipeline succeeded!' }
        failure { echo '❌ Pipeline failed!' }
    }
}
