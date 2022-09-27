const { PrismaClient } = require('@prisma/client');

class PrismaClientSingleton {
  constructor() {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient();
    }
    return PrismaClientSingleton.instance;
  }
}
module.exports = PrismaClientSingleton;
