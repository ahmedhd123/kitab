const bcrypt = require('bcryptjs');

async function createNewHash() {
  const password = 'admin123';
  
  console.log('🔐 إنشاء hash جديد...');
  const newHash = await bcrypt.hash(password, 12);
  console.log('Hash جديد:', newHash);
  
  const isValid = await bcrypt.compare(password, newHash);
  console.log('اختبار Hash الجديد:', isValid ? '✅ صحيح' : '❌ خاطئ');
  
  // Test old hash  
  const oldHash = '$2a$12$f9X9k0Xf/LpsJ7EgH25w.eCiswKPtvP3DiYy1DNAv.w.JTnvmwS/O';
  console.log('\nاختبار Hash القديم...');
  
  // Try different password variations
  const passwords = ['admin123', ' admin123', 'admin123 ', 'Admin123', 'ADMIN123'];
  
  for (const testPass of passwords) {
    const result = await bcrypt.compare(testPass, oldHash);
    console.log(`"${testPass}": ${result ? '✅' : '❌'}`);
  }
}

createNewHash();
