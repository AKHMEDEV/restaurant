# 🍽️ Restaurant Ordering Platform – Backend

## 🧾 Loyiha haqida

Bu loyiha onlayn ovqat buyurtma berish tizimining backend qismidir. Loyihada foydalanuvchi roli asosida ishlaydigan RESTful API yaratilgan bo‘lib, restoranlar, menyular, buyurtmalar va foydalanuvchi faoliyatini boshqarish imkonini beradi.

## 🎯 Asosiy maqsad

- Foydalanuvchilar (mijozlar) yaqin atrofdagi restoranlardan ovqat buyurtma qilishlari mumkin.
- Restoran egalari (vendor) o‘z restoranlarini, menyularini va buyurtmalarni boshqarishadi.
- Kuryerlar buyurtmalarni olib yetkazish uchun tizimdan foydalanadi.
- Adminlar platformani to‘liq nazorat qilishadi: foydalanuvchilarni, restoranlarni, chegirmalarni va statistikani boshqaradilar.

## 👥 Rollar

| Rol          | Tavsif                                                  |
|--------------|----------------------------------------------------------|
| `USER`       | Royxatdan otgan oddiy foydalanuvchi                    |
| `VENDOR`     | Restoran egasi, menyu va buyurtmalarni boshqaradi        |
| `COURIER`    | Yetkazib beruvchi, buyurtma statuslarini yangilaydi      |
| `ADMIN`      | Tizim admini, foydalanuvchilarni, restoranlarni boshqaradi|
| `SUPER_ADMIN`| Eng yuqori huquqlarga ega admin                          |

## ⚙️ Texnologiyalar

- **NestJS** – Backend uchun asosiy framework
- **PostgreSQL** – Ma’lumotlar bazasi
- **Prisma ORM** – Ma’lumotlar modeli va DB bilan ishlash
- **JWT** – Autentifikatsiya
- **RBAC** – Role-based Access Control
- **Telegram Bot (opsional)** – Bildirishnomalar yuborish

## 🔐 Xavfsizlik

- JWT asosida autentifikatsiya
- Har bir endpoint uchun Role va Guard'lar bilan himoyalangan
- AuditLog orqali tizimdagi muhim harakatlar loglanadi

## 📦 Modul tuzilmasi (qisqacha)

Modullar quyidagicha tashkil qilingan:
- Auth – ro‘yxatdan o‘tish, login, tokenlar
- User – foydalanuvchilar ro‘yxati va bloklash
- Restaurant – restoranlar va tasdiqlash
- Menu – menyular, kategoriya, tarjimalar
- Order – buyurtma va yetkazish holatlari
- Notification – bildirishnomalar
- Comment / Reaction – izoh va layklar
- Discount – chegirmalar boshqaruvi
- Favorite – sevimli menyular
- Admin – statistika va audit log

## ✅ Funksionalliklar

- 🔐 Auth: login, register, token yangilash
- 🧑‍🍳 Vendor: restoran ochish, menyu boshqaruvi
- 🛍 User: buyurtma berish, izoh yozish, like/dislike
- 🚚 Courier: buyurtma statusini boshqarish
- 🛎 Notification: tizimdagi o‘zgarishlar haqida xabarnoma
- 📊 Admin: statistika, audit log, chegirmalar, kategoriyalar

## 🔄 Multilanguage

- Menyular va kategoriyalar `uz`, `ru`, `en` tillarida qo‘llab-quvvatlanadi
- `Translation` model orqali har bir til uchun nom va tavsif saqlanadi

## 📎 Qo‘shimcha imkoniyatlar

- Telegram bilan integratsiya qilish imkoniyati
- Chegirma (promo code) funksiyasi
- Foydalanuvchi faoliyatini kuzatish (AuditLog)
- Sevimli menyular (favorite)

---

> Ushbu loyiha RESTful API yordamida servislarni modulga bo‘lib ishlab chiqishga yo‘naltirilgan. Loyihani kengaytirish oson, yangi rollar yoki funksiyalar qo‘shish uchun modular arxitektura tanlangan.
# restaurant
