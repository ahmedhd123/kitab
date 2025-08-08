import { BookOpen, Shield, Users, Eye, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">شروط الاستخدام</h1>
          <p className="text-lg text-gray-600">
            آخر تحديث: 8 أغسطس 2025
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">مقدمة</h2>
            <p className="text-gray-600 text-right leading-relaxed">
              مرحباً بك في منصة "كتابي". هذه الشروط والأحكام تحكم استخدامك لموقعنا الإلكتروني 
              وتطبيقاتنا المحمولة. باستخدام خدماتنا، فإنك توافق على الالتزام بهذه الشروط. 
              إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا.
            </p>
          </section>

          {/* Acceptance */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">قبول الشروط</h2>
            <p className="text-gray-600 text-right leading-relaxed mb-4">
              عند الوصول إلى منصة "كتابي" واستخدامها، فإنك تقر وتوافق على:
            </p>
            <ul className="text-gray-600 text-right space-y-2">
              <li>• أنك تبلغ من العمر 13 عاماً على الأقل</li>
              <li>• أنك تتمتع بالأهلية القانونية الكاملة للدخول في هذه الاتفاقية</li>
              <li>• أنك ستلتزم بجميع القوانين المحلية والدولية ذات الصلة</li>
              <li>• أنك ستستخدم المنصة لأغراض قانونية فقط</li>
            </ul>
          </section>

          {/* User Account */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">حساب المستخدم</h2>
            <div className="space-y-4 text-gray-600 text-right">
              <p>
                <strong>إنشاء الحساب:</strong> لاستخدام بعض ميزات المنصة، يجب عليك إنشاء حساب. 
                يجب أن تقدم معلومات دقيقة وكاملة ومحدثة.
              </p>
              <p>
                <strong>أمان الحساب:</strong> أنت مسؤول عن الحفاظ على سرية كلمة المرور الخاصة بك 
                وعن جميع الأنشطة التي تحدث تحت حسابك.
              </p>
              <p>
                <strong>استخدام الحساب:</strong> لا يجوز لك مشاركة حسابك مع أشخاص آخرين أو 
                إنشاء أكثر من حساب واحد.
              </p>
            </div>
          </section>

          {/* Content Guidelines */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">إرشادات المحتوى</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-right">
                  <p className="text-yellow-800 font-medium">محتوى محظور</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    يُحظر نشر أي محتوى ينتهك حقوق الطبع والنشر أو يحتوي على مواد غير قانونية
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-right leading-relaxed mb-4">
              عند نشر المحتوى على منصتنا (المراجعات، التعليقات، القوائم)، فإنك توافق على:
            </p>
            <ul className="text-gray-600 text-right space-y-2">
              <li>• عدم نشر محتوى مسيء أو مضلل أو غير قانوني</li>
              <li>• احترام حقوق الملكية الفكرية للآخرين</li>
              <li>• تجنب النشر المتكرر أو الرسائل العشوائية</li>
              <li>• الحفاظ على طابع مناسب ومهذب في التفاعلات</li>
              <li>• عدم انتحال شخصية الآخرين</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">الملكية الفكرية</h2>
            <div className="space-y-4 text-gray-600 text-right">
              <p>
                <strong>حقوق المنصة:</strong> جميع المحتويات الموجودة على المنصة، بما في ذلك 
                النصوص والصور والشعارات والبرمجيات، محمية بموجب قوانين حقوق الطبع والنشر.
              </p>
              <p>
                <strong>المحتوى المُقدم من المستخدمين:</strong> تحتفظ بحقوق الطبع والنشر لأي محتوى 
                تنشره، لكنك تمنحنا ترخيصاً لاستخدامه وعرضه على المنصة.
              </p>
              <p>
                <strong>الإبلاغ عن انتهاكات:</strong> إذا كنت تعتقد أن محتوى ما ينتهك حقوق الطبع 
                والنشر الخاصة بك، يرجى التواصل معنا فوراً.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">الخصوصية وحماية البيانات</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-right">
                  <p className="text-blue-800 font-medium">حماية البيانات</p>
                  <p className="text-blue-700 text-sm mt-1">
                    نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية
                  </p>
                </div>
              </div>
            </div>
            
            <ul className="text-gray-600 text-right space-y-2">
              <li>• نجمع البيانات اللازمة فقط لتحسين تجربتك</li>
              <li>• لا نشارك بياناتك الشخصية مع أطراف ثالثة دون موافقتك</li>
              <li>• نستخدم بروتوكولات أمان متقدمة لحماية بياناتك</li>
              <li>• يمكنك طلب حذف بياناتك في أي وقت</li>
            </ul>
          </section>

          {/* Service Availability */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">توفر الخدمة</h2>
            <p className="text-gray-600 text-right leading-relaxed">
              نسعى لجعل خدماتنا متاحة على مدار الساعة، لكننا لا نضمن أن تكون الخدمة متاحة 
              دون انقطاع في جميع الأوقات. قد نحتاج لإيقاف الخدمة مؤقتاً للصيانة أو التحديثات. 
              سنبذل قصارى جهدنا لإشعارك مسبقاً بأي انقطاع مخطط له.
            </p>
          </section>

          {/* Termination */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">إنهاء الاستخدام</h2>
            <div className="space-y-4 text-gray-600 text-right">
              <p>
                <strong>إنهاء من جانبك:</strong> يمكنك إنهاء حسابك في أي وقت من خلال 
                إعدادات الحساب أو التواصل معنا.
              </p>
              <p>
                <strong>إنهاء من جانبنا:</strong> يحق لنا إيقاف أو إنهاء حسابك إذا انتهكت 
                هذه الشروط أو استخدمت الخدمة بطريقة غير مناسبة.
              </p>
              <p>
                <strong>تأثير الإنهاء:</strong> عند إنهاء الحساب، ستفقد الوصول إلى جميع 
                البيانات والمحتوى المرتبط بحسابك.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">حدود المسؤولية</h2>
            <p className="text-gray-600 text-right leading-relaxed">
              نقدم خدماتنا "كما هي" دون أي ضمانات. لن نكون مسؤولين عن أي أضرار مباشرة أو 
              غير مباشرة قد تنتج عن استخدام خدماتنا. مسؤوليتنا القصوى تقتصر على المبلغ 
              الذي دفعته لنا (إن وجد) خلال الأشهر الستة السابقة.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">تعديل الشروط</h2>
            <p className="text-gray-600 text-right leading-relaxed">
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإشعارك بأي تغييرات جوهرية 
              عبر البريد الإلكتروني أو من خلال إشعار على المنصة. استمرارك في استخدام الخدمة 
              بعد التعديل يعني موافقتك على الشروط الجديدة.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-right">التواصل معنا</h2>
            <p className="text-gray-600 text-right leading-relaxed mb-4">
              إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يمكنك التواصل معنا عبر:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="text-gray-600 text-right space-y-2">
                <li>• البريد الإلكتروني: legal@kitabi.com</li>
                <li>• الهاتف: +966 50 123 4567</li>
                <li>• العنوان: الرياض، المملكة العربية السعودية</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
