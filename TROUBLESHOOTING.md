# 🔧 حل المشاكل (Troubleshooting)

## ⚠️ المشاكل الشائعة وحلولها

---

## 1️⃣ السيرفر ما يشتغل

### المشكلة:
```
npm run dev
```
ما يشتغل أو يعطي أخطاء

### الحلول:

#### الحل 1: أعد تثبيت المكتبات
```bash
# احذف node_modules
Remove-Item -Recurse -Force node_modules

# احذف package-lock.json
Remove-Item package-lock.json

# أعد التثبيت
npm install

# شغل السيرفر
npm run dev
```

#### الحل 2: امسح Cache
```bash
# امسح npm cache
npm cache clean --force

# أعد التثبيت
npm install

# شغل السيرفر
npm run dev
```

#### الحل 3: تأكد من Node.js
```bash
# تحقق من الإصدار
node -v

# يجب أن يكون 16+
# إذا كان أقل، حمّل إصدار أحدث من nodejs.org
```

---

## 2️⃣ الصفحة بيضاء فارغة

### المشكلة:
التطبيق يفتح بس الصفحة بيضاء

### الحلول:

#### الحل 1: تحقق من Console
1. اضغط `F12` لفتح Developer Tools
2. اذهب إلى تبويب "Console"
3. شوف الأخطاء الحمراء
4. صوّر الأخطاء إذا ما فهمتها

#### الحل 2: Hard Refresh
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

#### الحل 3: امسح Cache المتصفح
```
Windows: Ctrl + Shift + Delete
Mac: Cmd + Shift + Delete

ثم:
1. اختر "Cached images and files"
2. اضغط "Clear data"
3. أعد تحميل الصفحة
```

---

## 3️⃣ Port محجوز

### المشكلة:
```
Port 5173 is in use
```

### الحلول:

#### الحل 1: استخدم Port الجديد
- Vite سيختار port جديد تلقائياً
- شوف الرسالة:
  ```
  ➜  Local:   http://localhost:5174/
  ```
- استخدم الرابط الجديد (5174 بدل 5173)

#### الحل 2: أوقف العملية القديمة
```bash
# شوف العمليات على port 5173
netstat -ano | findstr :5173

# أوقف العملية (استبدل PID بالرقم)
taskkill /PID <PID> /F
```

---

## 4️⃣ أخطاء TypeScript

### المشكلة:
```
error TS2304: Cannot find name 'X'
error TS2345: Argument of type 'X' is not assignable
```

### الحلول:

#### الحل 1: أعد بناء المشروع
```bash
# توقف السيرفر (Ctrl+C)

# امسح dist
Remove-Item -Recurse -Force dist

# أعد البناء
npm run build

# شغل السيرفر
npm run dev
```

#### الحل 2: تحقق من types
```bash
# أعد تثبيت types
npm install --save-dev @types/react @types/react-dom

# شغل السيرفر
npm run dev
```

---

## 5️⃣ البيانات ما تنحفظ

### المشكلة:
البيانات تختفي بعد Refresh

### الحلول:

#### الحل 1: تحقق من localStorage
1. افتح Developer Tools (F12)
2. اذهب إلى "Application" tab
3. شوف "Local Storage"
4. تأكد أنه ما في Disable

#### الحل 2: تحقق من Incognito
- إذا كنت في Incognito Mode
- localStorage ما يشتغل صح
- استخدم نافذة عادية

#### الحل 3: Browser Settings
- تأكد أن Cookies & Site Data مفعّلة
- إعدادات -> Privacy -> Site Data

---

## 6️⃣ التصميم مكسور

### المشكلة:
الألوان والتنسيق غلط

### الحلول:

#### الحل 1: تأكد من Tailwind
```bash
# شوف إذا في ملف tailwind.config.js
dir tailwind.config.js

# إذا مش موجود، أنشئه
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### الحل 2: Hard Refresh
```
Ctrl + Shift + R
```

#### الحل 3: امسح Cache
```
Ctrl + Shift + Delete
```

---

## 7️⃣ التقويم ما يشتغل صح

### المشكلة:
التواريخ غلط أو العمليات ما تظهر

### الحل:
✅ **تم إصلاح هذا الخطأ!**

إذا لسه في مشكلة:
1. امسح البيانات القديمة:
   - الإعدادات -> حذف جميع البيانات
2. أضف عمليات جديدة
3. شوف التقويم

---

## 8️⃣ الصفحات ما تتنقل

### المشكلة:
الضغط على Navigation ما يشتغل

### الحلول:

#### الحل 1: تحقق من Console
```
F12 -> Console
شوف الأخطاء
```

#### الحل 2: Refresh الصفحة
```
F5 أو Ctrl + R
```

---

## 9️⃣ التصدير ما يشتغل

### المشكلة:
تصدير JSON أو CSV ما يحمّل

### الحلول:

#### الحل 1: Browser Permissions
- تأكد من السماح بالتحميلات
- Settings -> Downloads -> Allow

#### الحل 2: Pop-up Blocker
- تأكد أن Pop-ups مسموحة
- Settings -> Site Settings -> Pop-ups

---

## 🔟 الموبايل ما يشتغل صح

### المشكلة:
التطبيق ما يظهر صح على الموبايل

### الحلول:

#### الحل 1: Responsive Mode
للاختبار على الكمبيوتر:
```
F12 -> Toggle Device Toolbar (Ctrl+Shift+M)
```

#### الحل 2: شبكة محلية
للوصول من الموبايل:
```bash
# شغل مع --host
npm run dev -- --host

# ثم استخدم IP address على الموبايل
http://192.168.1.X:5174
```

---

## 🆘 أخطاء شائعة في Console

### خطأ 1: "React is not defined"
```bash
npm install react react-dom
npm run dev
```

### خطأ 2: "Cannot find module"
```bash
npm install
npm run dev
```

### خطأ 3: "Module not found: Can't resolve"
```bash
# تأكد من المسارات صحيحة
# تأكد من الملفات موجودة
```

### خطأ 4: "Unexpected token"
```bash
# مشكلة في Syntax
# راجع الملف وشوف السطر المذكور
```

---

## 📋 Checklist للتحقق

قبل ما تسأل عن مساعدة، تحقق من:

- [ ] Node.js 16+ مثبت
- [ ] `npm install` نفذت بنجاح
- [ ] السيرفر شغّال (`npm run dev`)
- [ ] الرابط صحيح (localhost:5174)
- [ ] المتصفح حديث (Chrome/Firefox آخر إصدار)
- [ ] JavaScript مفعّل
- [ ] localStorage مسموح
- [ ] Console ما فيه أخطاء حمراء
- [ ] Cache ممسوح

---

## 🔄 إعادة ضبط كاملة

إذا كل شي فشل، جرّب إعادة ضبط كاملة:

```bash
# 1. احذف كل شي
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force dist
Remove-Item package-lock.json

# 2. أعد التثبيت
npm install

# 3. أعد البناء
npm run build

# 4. شغل السيرفر
npm run dev
```

---

## 💻 متطلبات النظام

### الحد الأدنى:
- **Node.js**: 16.0+
- **npm**: 7.0+
- **RAM**: 2 GB
- **متصفح**: Chrome 90+ / Firefox 88+

### الموصى به:
- **Node.js**: 18.0+
- **npm**: 9.0+
- **RAM**: 4 GB+
- **متصفح**: أحدث إصدار

---

## 📞 الحصول على مساعدة

إذا جربت كل شي وما اشتغل:

### معلومات مطلوبة:
1. **إصدار Node.js**: `node -v`
2. **إصدار npm**: `npm -v`
3. **نظام التشغيل**: Windows/Mac/Linux
4. **المتصفح**: Chrome/Firefox/etc
5. **الخطأ بالضبط**: صورة من Console

### الأوامر المساعدة:
```bash
# معلومات النظام
node -v
npm -v

# معلومات المشروع
npm list --depth=0

# فحص الأخطاء
npm run build
```

---

## ✅ كل شي شغّال؟

إذا التطبيق اشتغل بنجاح:

1. ✅ افتح `http://localhost:5174`
2. ✅ اذهب للإعدادات وحدد ميزانيتك
3. ✅ أضف أول عملية مالية
4. ✅ شاهد التوصيات الذكية
5. ✅ حدد هدف مالي
6. ✅ راجع الإحصائيات

**استمتع! 🎉**

---

## 📚 مراجع إضافية

- [Node.js Documentation](https://nodejs.org/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

---

**آخر تحديث**: اليوم
**الحالة**: جميع الأخطاء مُصلّحة ✅
**النسخة**: 2.0.0
