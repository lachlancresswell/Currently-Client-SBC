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
    }
}