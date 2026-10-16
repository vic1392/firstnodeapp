// This file handles all database operations
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

// Create AWS clients
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const secretsClient = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-east-1' });

// Get config from Secrets Manager
async function getConfig() {
  try {
    const command = new GetSecretValueCommand({ SecretId: 'task-manager/config' });
    const response = await secretsClient.send(command);
    return JSON.parse(response.SecretString);
  } catch (error) {
    console.log('⚠️ Could not fetch secrets, using defaults');
    return { DYNAMO_TABLE: 'tasks', AWS_REGION: 'us-east-1' };
  }
}

let config = null;

// Initialize config on startup
(async () => {
  config = await getConfig();
})();

// Get all tasks
async function getAllTasks() {
  if (!config) config = await getConfig();
  const command = new ScanCommand({ TableName: config.DYNAMO_TABLE });
  const result = await docClient.send(command);
  return result.Items || [];
}

// Get one task by ID
async function getTask(id) {
  if (!config) config = await getConfig();
  const command = new GetCommand({ 
    TableName: config.DYNAMO_TABLE, 
    Key: { id: parseInt(id) } 
  });
  const result = await docClient.send(command);
  return result.Item;
}

// Create a new task
async function createTask(title) {
  if (!config) config = await getConfig();
  const allTasks = await getAllTasks();
  const newId = allTasks.length > 0 ? Math.max(...allTasks.map(t => t.id)) + 1 : 1;
  
  const task = { id: newId, title, done: false };
  const command = new PutCommand({
    TableName: config.DYNAMO_TABLE,
    Item: task
  });
  await docClient.send(command);
  return task;
}

// Delete a task
async function deleteTask(id) {
  if (!config) config = await getConfig();
  const command = new DeleteCommand({
    TableName: config.DYNAMO_TABLE,
    Key: { id: parseInt(id) }
  });
  await docClient.send(command);
  return { id: parseInt(id), deleted: true };
}

module.exports = { getAllTasks, getTask, createTask, deleteTask };
