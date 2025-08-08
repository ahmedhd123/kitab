import { Shield, Eye, Lock, Database, Users, Settings } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">سياسة الخصوصية</h1>
          <p className="text-lg text-gray-600">
            آخر تحديث: 8 أغسطس 2025
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">مقدمة</h2>
            <p className="text-gray-600 text-right leading-relaxed">
              في "كتابي"، نحن ملتزمون بحماية خصوصيتك وضمان أمان بياناتك الشخصية. 
              هذه السياسة توضح كيف نجمع ونستخدم ونحمي معلوماتك عند استخدام منصتنا. 
              نحن نتبع أفضل الممارسات العالمية في حماية البيانات ونلتزم بجميع القوانين المعمول بها.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="border-t border-gray-200 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">المعلومات التي نجمعها</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-right">المعلومات الشخصية</h3>
                <ul className="text-gray-600 text-right space-y-2">
                  <li>• الاسم الكامل</li>
                  <li>• عنوان البريد الإلكتروني</li>
                  <li>• تاريخ الميلاد (اختياري)</li>
                  <li>• الموقع الجغرافي (اختياري)</li>
                  <li>• صورة الملف الشخصي (اختياري)</li>
                  <li>• التفضيلات الشخصية للقراءة</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-right">معلومات الاستخدام</h3>
                <ul className="text-gray-600 text-right space-y-2">
                  <li>• سجل تصفح الكتب والمراجعات</li>
                  <li>• قوائم القراءة والكتب المفضلة</li>
                  <li>• المراجعات والتقييمات التي تكتبها</li>
                  <li>• التفاعلات مع المستخدمين الآخرين</li>
                  <li>• أوقات وتواريخ استخدام المنصة</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-right">المعلومات التقنية</h3>
                <ul className="text-gray-600 text-right space-y-2">
                  <li>• عنوان IP والموقع الجغرافي التقريبي</li>
                  <li>• نوع الجهاز ونظام التشغيل</li>
                  <li>• نوع المتصفح ولغة المفضلة</li>
                  <li>• ملفات تعريف الارتباط (Cookies)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="border-t border-gray-200 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">كيف نستخدم معلوماتك</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 text-right">تحسين الخدمة</h3>
                <ul className="text-blue-800 text-sm text-right space-y-1">
                  <li>• تخصيص توصيات الكتب</li>
                  <li>• تحسين واجهة المستخدم</li>
                  <li>• تطوير ميزات جديدة</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2 text-right">التواصل</h3>
                <ul className="text-green-800 text-sm text-right space-y-1">
                  <li>• إرسال الإشعارات المهمة</li>
                  <li>• الرد على استفساراتك</li>
                  <li>• إرسال التحديثات والأخبار</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2 text-right">الأمان</h3>
                <ul className="text-purple-800 text-sm text-right space-y-1">
                  <li>• حماية حسابك من الاختراق</li>
                  <li>• كشف الأنشطة المشبوهة</li>
                  <li>• منع الاحتيال والإساءة</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2 text-right">التحليل</h3>
                <ul className="text-orange-800 text-sm text-right space-y-1">
                  <li>• فهم سلوك المستخدمين</li>
                  <li>• قياس فعالية الميزات</li>
                  <li>• إعداد تقارير إحصائية</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="border-t border-gray-200 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">حماية البيانات</h2>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium text-right">
                نستخدم أحدث تقنيات التشفير وبروتوكولات الأمان لحماية بياناتك
              </p>
            </div>

            <div className="space-y-4 text-gray-600 text-right">
              <p>
                <strong>التشفير:</strong> جميع البيانات الحساسة مشفرة باستخدام بروتوكولات 
                SSL/TLS أثناء النقل وخوارزميات AES-256 أثناء التخزين.
              </p>
              <p>
                <strong>الوصول المحدود:</strong> فقط الموظفون المخولون يمكنهم الوصول إلى 
                بياناتك، وذلك فقط عند الضرورة لتقديم الخدمة.
              </p>
              <p>
                <strong>المراقبة المستمرة:</strong> نراقب أنظمتنا على مدار الساعة للكشف عن 
                أي محاولات اختراق أو أنشطة مشبوهة.
              </p>
              <p>
                <strong>النسخ الاحتياطية:</strong> نحتفظ بنسخ احتياطية آمنة من بياناتك لضمان 
                عدم فقدانها في حالة حدوث مشاكل تقنية.
              </p>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="border-t border-gray-200 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">مشاركة البيانات</h2>
            </div>
            
            <p className="text-gray-600 text-right leading-relaxed mb-4">
              نحن لا نبيع أو نؤجر بياناتك الشخصية لأطراف ثالثة. قد نشارك بعض المعلومات في الحالات التالية فقط:
            </p>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-right">مقدمو الخدمات</h3>
                <p className="text-gray-600 text-right text-sm">
                  نشارك البيانات اللازمة مع مقدمي الخدمات الموثوقين (مثل خدمات الاستضافة والتحليل) 
                  لتشغيل المنصة، وهم ملزمون بحماية بياناتك.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-right">المتطلبات القانونية</h3>
                <p className="text-gray-600 text-right text-sm">
                  قد نكشف عن معلوماتك إذا كان ذلك مطلوباً بموجب القانون أو لحماية حقوقنا 
                  أو حقوق المستخدمين الآخرين.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-right">الموافقة الصريحة</h3>
                <p className="text-gray-600 text-right text-sm">
                  في أي حالات أخرى، سنطلب موافقتك الصريحة قبل مشاركة بياناتك مع أطراف ثالثة.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="border-t border-gray-200 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">حقوقك</h2>
            </div>
            
            <p className="text-gray-600 text-right leading-relaxed mb-4">
              لديك الحقوق التالية فيما يتعلقببياناتك الشخصية:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-right">الوصول والاستعلام</h3>
                <p className="text-gray-600 text-sm text-right">
                  يمكنك طلب نسخة من جميع البيانات الشخصية التي نحتفظ بها عنك
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-right">التصحيح والتحديث</h3>
                <p className="text-gray-600 text-sm text-right">
                  يمكنك تحديث أو تصحيح معلوماتك الشخصية في أي وقت
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-right">الحذف</h3>
                <p className="text-gray-600 text-sm text-right">
                  يمكنك طلب حذف حسابك وجميع بياناتك الشخصية
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-right">إيقاف المعالجة</h3>
                <p className="text-gray-600 text-sm text-right">
                  يمكنك طلب إيقاف معالجة بياناتك لأغراض معينة
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-right">نقل البيانات</h3>
                <p className="text-gray-600 text-sm text-right">
                  يمكنك طلب نقل بياناتك إلى خدمة أخرى بتنسيق قابل للقراءة
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-right">الاعتراض</h3>
                <p className="text-gray-600 text-sm text-right">
                  يمكنك الاعتراض على معالجة بياناتك لأغراض التسويق أو التحليل
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">ملفات تعريف الارتباط (Cookies)</h2>
            <div className="space-y-4 text-gray-600 text-right">
              <p>
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة. هذه الملفات الصغيرة 
                تُخزن على جهازك وتساعدنا في:
              </p>
              <ul className="space-y-2">
                <li>• تذكر تفضيلاتك وإعداداتك</li>
                <li>• تحليل استخدام الموقع وتحسين الأداء</li>
                <li>• تخصيص المحتوى والإعلانات</li>
                <li>• توفير ميزات الأمان والحماية</li>
              </ul>
              <p>
                يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك، لكن تعطيلها 
                قد يؤثر على بعض وظائف المنصة.
              </p>
            </div>
          </section>

          {/* International Transfers */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">نقل البيانات الدولي</h2>
            <p className="text-gray-600 text-right leading-relaxed">
              قد نقوم بنقل ومعالجة بياناتك في دول أخرى لتقديم خدماتنا. في جميع الحالات، 
              نضمن أن هذه الدول تحتوي على قوانين حماية بيانات مماثلة أو أقوى، أو أننا نطبق 
              ضمانات إضافية لحماية بياناتك.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">خصوصية الأطفال</h2>
            <p className="text-gray-600 text-right leading-relaxed">
              خدماتنا غير مخصصة للأطفال دون سن 13 عاماً. إذا علمنا أننا جمعنا معلومات شخصية 
              من طفل دون سن 13 عاماً، فسنقوم بحذف هذه المعلومات فوراً. إذا كنت والداً أو وصياً 
              وتعتقد أن طفلك قدم لنا معلومات شخصية، يرجى التواصل معنا.
            </p>
          </section>

          {/* Updates to Privacy Policy */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">تحديثات سياسة الخصوصية</h2>
            <p className="text-gray-600 text-right leading-relaxed">
              قد نقوم بتحديث هذه السياسة من وقت لآخر لتعكس التغييرات في ممارساتنا أو القوانين. 
              سنقوم بإشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار بارز على المنصة. 
              ننصحك بمراجعة هذه السياسة بانتظام.
            </p>
          </section>

          {/* Contact Information */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">التواصل معنا</h2>
            <p className="text-gray-600 text-right leading-relaxed mb-4">
              إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو كيفية تعاملنا مع بياناتك، 
              يرجى التواصل معنا:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="text-gray-600 text-right space-y-2">
                <li>• البريد الإلكتروني: privacy@kitabi.com</li>
                <li>• الهاتف: +966 50 123 4567</li>
                <li>• العنوان: الرياض، المملكة العربية السعودية</li>
                <li>• مسؤول حماية البيانات: dpo@kitabi.com</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
