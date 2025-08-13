// Using built-in fetch in Node.js 18+

const sampleBooks = [
  {
    title: "كبرياء وتحامل",
    titleArabic: "كبرياء وتحامل",
    author: "جين أوستن",
    authorArabic: "جين أوستن",
    publishYear: 1813,
    genre: "رومانسية",
    description: "رواية كلاسيكية عن الحب والزواج والطبقات الاجتماعية في إنجلترا الجورجية.",
    pages: 432,
    isbn: "978-1-68158-035-0",
    coverImage: "https://via.placeholder.com/300x400?text=كبرياء+وتحامل",
    rating: 4.8,
    reviewCount: 1247
  },
  {
    title: "غاتسبي العظيم",
    titleArabic: "غاتسبي العظيم", 
    author: "ف. سكوت فيتزجيرالد",
    authorArabic: "ف. سكوت فيتزجيرالد",
    publishYear: 1925,
    genre: "أدب أمريكي",
    description: "رواية أمريكية كلاسيكية عن الحلم الأمريكي خلال عصر الجاز.",
    pages: 180,
    isbn: "978-1-68158-112-8", 
    coverImage: "https://via.placeholder.com/300x400?text=غاتسبي+العظيم",
    rating: 4.6,
    reviewCount: 2156
  },
  {
    title: "مئة عام من العزلة",
    titleArabic: "مئة عام من العزلة",
    author: "غابرييل غارسيا ماركيز",
    authorArabic: "غابرييل غارسيا ماركيز",
    publishYear: 1967,
    genre: "أدب لاتيني",
    description: "رواية سحرية واقعية تحكي قصة عائلة بوينديا عبر ستة أجيال.",
    pages: 417,
    isbn: "978-0-06-088328-7",
    coverImage: "https://via.placeholder.com/300x400?text=مئة+عام+من+العزلة",
    rating: 4.9,
    reviewCount: 3421
  },
  {
    title: "أسود الأرض",
    titleArabic: "أسود الأرض",
    author: "عبد الرحمن منيف",
    authorArabic: "عبد الرحمن منيف", 
    publishYear: 1984,
    genre: "أدب عربي",
    description: "رواية عربية تتناول التحولات الاجتماعية والاقتصادية في المنطقة العربية.",
    pages: 590,
    isbn: "978-9953-68-174-5",
    coverImage: "https://via.placeholder.com/300x400?text=أسود+الأرض",
    rating: 4.7,
    reviewCount: 856
  },
  {
    title: "موسم الهجرة إلى الشمال",
    titleArabic: "موسم الهجرة إلى الشمال",
    author: "الطيب صالح",
    authorArabic: "الطيب صالح",
    publishYear: 1966,
    genre: "أدب عربي",
    description: "رواية سودانية تتناول موضوع الهوية والاستعمار والصراع الثقافي.",
    pages: 169,
    isbn: "978-977-416-021-9",
    coverImage: "https://via.placeholder.com/300x400?text=موسم+الهجرة+إلى+الشمال",
    rating: 4.5,
    reviewCount: 1234
  },
  {
    title: "رجال في الشمس",
    titleArabic: "رجال في الشمس",
    author: "غسان كنفاني",
    authorArabic: "غسان كنفاني",
    publishYear: 1963,
    genre: "أدب عربي",
    description: "رواية فلسطينية تحكي معاناة اللاجئين الفلسطينيين.",
    pages: 96,
    isbn: "978-1-85168-056-9",
    coverImage: "https://via.placeholder.com/300x400?text=رجال+في+الشمس",
    rating: 4.4,
    reviewCount: 932
  },
  {
    title: "الأسود يليق بك",
    titleArabic: "الأسود يليق بك",
    author: "أحلام مستغانمي",
    authorArabic: "أحلام مستغانمي",
    publishYear: 2012,
    genre: "أدب عربي",
    description: "رواية عربية معاصرة تتناول قضايا المرأة والمجتمع.",
    pages: 354,
    isbn: "978-9953-68-425-8",
    coverImage: "https://via.placeholder.com/300x400?text=الأسود+يليق+بك",
    rating: 4.3,
    reviewCount: 1567
  },
  {
    title: "ذاكرة الجسد",
    titleArabic: "ذاكرة الجسد",
    author: "أحلام مستغانمي",
    authorArabic: "أحلام مستغانمي",
    publishYear: 1993,
    genre: "أدب عربي",
    description: "رواية عربية تتناول الحب والحرب والذاكرة.",
    pages: 419,
    isbn: "978-9953-68-001-4",
    coverImage: "https://via.placeholder.com/300x400?text=ذاكرة+الجسد",
    rating: 4.6,
    reviewCount: 2876
  }
];

async function addBooksToRailway() {
  const baseURL = 'https://kitab-production.up.railway.app';
  
  console.log('🔐 Logging in as admin...');
  
  // Login as admin to get auth token
  const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'admin@kitabi.com',
      password: 'admin123'
    })
  });
  
  const loginData = await loginResponse.json();
  
  if (!loginData.success) {
    console.error('❌ Login failed:', loginData);
    return;
  }
  
  const token = loginData.data.token;
  console.log('✅ Login successful');
  
  // Add each book
  for (let i = 0; i < sampleBooks.length; i++) {
    const book = sampleBooks[i];
    console.log(`📚 Adding book ${i + 1}/${sampleBooks.length}: ${book.title}`);
    
    try {
      const addResponse = await fetch(`${baseURL}/api/admin/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(book)
      });
      
      const addData = await addResponse.json();
      
      if (addData.success) {
        console.log(`✅ Added: ${book.title}`);
      } else {
        console.error(`❌ Failed to add ${book.title}:`, addData);
      }
    } catch (error) {
      console.error(`❌ Error adding ${book.title}:`, error);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('🎉 Finished adding books!');
}

addBooksToRailway().catch(console.error);
