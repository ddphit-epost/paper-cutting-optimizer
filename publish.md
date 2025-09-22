//git init
// git add * 
//git status

// git commit -m "Initial commit" 
// git push -u origin main

# خطوات نشر المشروع GitHub Pages على PyCharm

لرفع مشروعك على GitHub ونشره كصفحة ويب مباشرة (GitHub Pages) باستخدام PyCharm، اتبع الخطوات التالية:

## الخطوة الأولى: إعداد Git و GitHub في PyCharm

1.  **تثبيت Git:** تحقق من أن Git مثبت على جهازك. يمكنك تحميله من [git-scm.com](https://git-scm.com/).
2.  **ربط حساب GitHub:**
    - اذهب إلى `File` > `Settings` > `Version Control` > `GitHub`.
    - اضغط على `+` وأضف حسابك على GitHub.

## الخطوة الثانية: إنشاء مستودع (Repository) على GitHub 
...

1.  **من داخل PyCharm:**
    - اذهب إلى `VCS` > `Import into Version Control` > `Share Project on GitHub`.
    - اختر اسمًا للمستودع (Repository name)، مثلاً `paper-cutting-optimizer`.
    - أضف وصفًا قصيرًا.
    - اضغط `Share`.
    - سيطلب منك PyCharm اختيار الملفات التي تريد إضافتها إلى Git. عادةً، يمكنك تحديد كل ملفات المشروع والضغط على `Add`. هذا سيقوم بعمل أول `commit`.

## الخطوة الثالثة: تفعيل GitHub Pages

1.  **اذهب إلى مستودعك على GitHub:** افتح متصفح الويب وانتقل إلى المستودع الذي أنشأته (`https://github.com/your-username/paper-cutting-optimizer`).
2.  **افتح الإعدادات (Settings):**
    - اضغط على تبويب `Settings` في المستودع.
    - في القائمة الجانبية، اختر `Pages`.
3.  **اختر المصدر (Source):**
    - تحت قسم `Build and deployment`، في خانة `Source`، اختر `Deploy from a branch`.
    - في قسم `Branch`، اختر `main` (أو `master` حسب اسم الفرع الرئيس لديك) والمجلد `/root`.
    - اضغط `Save`.

4.  **انتظر النشر:** سيقوم GitHub بنشر موقعك. قد يستغرق الأمر بضع دقائق. ستجد رابط موقعك في نفس الصفحة. سيكون شيئًا مثل: `https://your-username.github.io/paper-cutting-optimizer/`

## الخطوة الرابعة: تحديث المشروع في المستقبل

- بعد إجراء أي تعديلات على الكود في PyCharm:
    1.  **Commit:** اذهب إلى نافذة `Commit` (عادة على اليسار أو من خلال `Ctrl+K`).
    2.  اكتب رسالة للـ commit (مثلًا: "تحديث تصميم الواجهة").
    3.  اضغط `Commit and Push`.
    4.  في النافذة التالية، اضغط `Push`.
- سيتم تحديث التغييرات تلقائيًا على موقعك في GitHub Pages.

مبروك! لقد قمت بنشر مشروعك بنجاح.