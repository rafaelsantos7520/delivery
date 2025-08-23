const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Verificar se já existe um admin com esse login
    const existingAdmin = await prisma.admin.findUnique({
      where: { login: 'rafael' }
    });

    if (existingAdmin) {
      console.log('Admin "rafael" já existe!');
      return;
    }

    // Hash da senha
    const passwordHash = bcrypt.hashSync('84498927', 10);

    // Criar o admin
    const admin = await prisma.admin.create({
      data: {
        name: 'Rafael',
        login: 'rafael',
        passwordHash: passwordHash,
        active: true
      }
    });

    console.log('Admin criado com sucesso!');
    console.log('Nome:', admin.name);
    console.log('Login:', admin.login);
    console.log('ID:', admin.id);
    
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();