# نشر المشروع على Netlify

## الطريقة الأولى: ربط GitHub مع Netlify (موصى بها)

1. **سجل الدخول إلى Netlify:**
   - اذهب إلى [netlify.com](https://www.netlify.com)
   - سجل الدخول بحساب GitHub

2. **إضافة موقع جديد:**
   - اضغط على "Add new site" → "Import an existing project"
   - اختر "GitHub" واسمح بالوصول إلى مستودعاتك

3. **اختر المستودع:**
   - اختر `Maze-Solver-Robot` من القائمة
   - Netlify سيكتشف الإعدادات تلقائياً من `netlify.toml`

4. **الإعدادات:**
   - **Build command:** `npm run build:client` (يتم تعيينه تلقائياً)
   - **Publish directory:** `dist/public` (يتم تعيينه تلقائياً)
   - **Node version:** 20 (يتم تعيينه تلقائياً)

5. **اضغط "Deploy site":**
   - Netlify سيبدأ البناء تلقائياً
   - بعد الانتهاء، ستحصل على رابط للموقع

## الطريقة الثانية: النشر باستخدام Netlify CLI

1. **تثبيت Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **تسجيل الدخول:**
   ```bash
   netlify login
   ```

3. **بناء المشروع:**
   ```bash
   npm run build:client
   ```

4. **النشر:**
   ```bash
   netlify deploy --prod --dir=dist/public
   ```

## ملاحظات مهمة

- المشروع حالياً لا يحتوي على API routes، لذا يمكن نشره كـ Static Site
- إذا أردت إضافة API routes لاحقاً، يمكن استخدام Netlify Functions
- الملف `netlify.toml` يحتوي على إعدادات النشر
- جميع المسارات يتم توجيهها إلى `index.html` لدعم Client-Side Routing

## تحديثات تلقائية

عند ربط GitHub مع Netlify:
- كل commit جديد على `main` سيتم نشره تلقائياً
- يمكنك إعداد Branch previews للمراجعة قبل النشر

