pipeline {
    agent {
        docker {
            image 'node:20-bullseye' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
                sh 'npm run build' 
            }
        }

        stage('Unit Tests') { 
            steps {
                sh 'npm run test unit.test' 
            }
        }

        stage('Integration Tests') { 
            steps {
                sh 'npm run test integration.test' 
            }
        }
    }
}