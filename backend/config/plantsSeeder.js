import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';
import Plant from '../models/plantModel.js';

// Load environment variables from the correct path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from the backend root directory (one level up)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug: Check if environment variables are loaded
console.log('Environment variables check:');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'Not found');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');

// If MONGO_URI is still not found, try loading from project root
if (!process.env.MONGO_URI) {
    console.log('Trying to load .env from project root...');
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
    console.log('MONGO_URI after second attempt:', process.env.MONGO_URI ? 'Loaded' : 'Still not found');
}

/**
 * @description Importa os dados do arquivo plantas.json para o banco de dados.
 */
const importData = async () => {
  try {
    // Check if MONGO_URI is available before connecting
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set. Please check your .env file.');
    }

    // Conecta ao banco de dados
    await connectDB();

    // Limpa os dados existentes na coleção para evitar duplicação
    await Plant.deleteMany();
    console.log('Dados antigos da coleção de plantas foram destruídos...');

    // Lê o arquivo JSON com os dados das plantas
    const plantsData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'plantas.json'), 'utf-8')
    );

    // Insere os novos dados no banco de dados
    await Plant.insertMany(plantsData);

    console.log('Dados importados com sucesso!');
    process.exit();
  } catch (error) {
    console.error(`Erro ao importar dados: ${error}`);
    process.exit(1);
  }
};

/**
 * @description Destrói todos os dados da coleção de plantas no banco de dados.
 */
const destroyData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not set. Please check your .env file.');
        }

        await connectDB();

        await Plant.deleteMany();

        console.log('Todos os dados da coleção de plantas foram destruídos!');
        process.exit();
    } catch (error) {
        console.error(`Erro ao destruir dados: ${error}`);
        process.exit(1);
    }
};

// Verifica os argumentos da linha de comando para decidir qual função executar
if (process.argv[2] === '-d') {
    // Se o argumento for '-d', executa a função para destruir os dados
    destroyData();
} else {
    // Caso contrário, executa a função de importação por padrão
    importData();
}
