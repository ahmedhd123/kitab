import { BookOpen, Users, Target, Heart, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-full mb-8">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">من نحن</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نحن منصة عربية متخصصة في بناء مجتمع محبي القراءة، 
            نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم تجربة قراءة فريدة ومميزة
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">رسالتنا</h2>
            <p className="text-gray-600 text-right leading-relaxed">
              نسعى لنشر ثقافة القراءة في الوطن العربي من خلال بناء منصة تفاعلية 
              تجمع محبي الكتب وتساعدهم على اكتشاف كتب جديدة ومشاركة آرائهم مع مجتمع 
              من القراء المتميزين.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">رؤيتنا</h2>
            <p className="text-gray-600 text-right leading-relaxed">
              أن نكون المنصة الرائدة عربياً في مجال القراءة الرقمية، 
              حيث يجد كل قارئ ما يبحث عنه من كتب ومحتوى يناسب اهتماماته، 
              مع الاستفادة من التقنيات الذكية لتحسين تجربة القراءة.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الشغف بالقراءة</h3>
              <p className="text-gray-600">
                نؤمن بأن القراءة هي غذاء الروح والعقل، ونعمل على إثارة شغف القراءة في نفوس الجميع
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">المجتمع التفاعلي</h3>
              <p className="text-gray-600">
                نبني مجتمعاً يشارك فيه القراء خبراتهم وآراءهم، مما يثري تجربة القراءة للجميع
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الجودة والتميز</h3>
              <p className="text-gray-600">
                نلتزم بتقديم أفضل تجربة ممكنة للمستخدمين من خلال التطوير المستمر والابتكار
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">قصتنا</h2>
          <div className="prose prose-lg max-w-none text-right">
            <p className="text-gray-600 leading-relaxed mb-6">
              بدأت فكرة &ldquo;كتابي&rdquo; من حلم بسيط: إنشاء مساحة رقمية تجمع محبي القراءة العرب 
              في مكان واحد. لاحظنا أن معظم منصات القراءة العالمية لا تلبي احتياجات القارئ العربي 
              بشكل كامل، سواء من ناحية المحتوى أو اللغة أو التفاعل المجتمعي.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              من هنا جاءت فكرة إنشاء منصة عربية تماماً، تفهم ثقافتنا وتحترم تفضيلاتنا، 
              وتستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم توصيات مخصصة لكل قارئ. 
              نريد أن نجعل القراءة تجربة اجتماعية ممتعة، وليس مجرد نشاط فردي.
            </p>
            <p className="text-gray-600 leading-relaxed">
              اليوم، نحن فخورون بما وصلنا إليه من مجتمع متنامي من القراء المتحمسين، 
              ونواصل العمل لتطوير المنصة وإضافة المزيد من الميزات التي تخدم مجتمع القراء العرب.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">فريق العمل</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-gray-900">أحمد محمد</h3>
              <p className="text-purple-600 font-medium">المؤسس والمدير التنفيذي</p>
              <p className="text-sm text-gray-600 mt-2">
                خبرة 10+ سنوات في تطوير المنصات الرقمية
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-gray-900">فاطمة علي</h3>
              <p className="text-purple-600 font-medium">مديرة المحتوى</p>
              <p className="text-sm text-gray-600 mt-2">
                متخصصة في الأدب العربي وإدارة المجتمعات
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-gray-900">محمد سعد</h3>
              <p className="text-purple-600 font-medium">مطور الذكاء الاصطناعي</p>
              <p className="text-sm text-gray-600 mt-2">
                خبير في خوارزميات التوصية والتعلم الآلي
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">إنجازاتنا بالأرقام</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-purple-100">قارئ مسجل</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-purple-100">كتاب في المكتبة</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">25,000+</div>
              <div className="text-purple-100">مراجعة وتقييم</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100,000+</div>
              <div className="text-purple-100">توصية ذكية</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
