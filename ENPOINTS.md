# -------------------- 🔐 AUTHENTICATION -------------------- #

POST /auth/register             # Foydalanuvchi yoki Vendor ro'yxatdan o'tadi
POST /auth/login                # Login qilish (Super Admin, Admin, Vendor, User, Courier)
POST /auth/logout               # Auth tokenni o'chiradi (logout)
GET  /auth/profile              # Login bo‘lgan userning profil ma’lumotlari

POST /auth/forgot-password      # Parolni unutganlar uchun (email/sms orqali link yuboriladi)
POST /auth/reset-password       # Reset link orqali yangi parol o‘rnatish


# -------------------- 👤 USERS (Super Admin, Admin) -------------------- #

GET    /users                   # Foydalanuvchilar ro'yxati (Super Admin, Admin)
POST   /users                   # Yangi foydalanuvchi yaratish (Admin yoki Super Admin)
GET    /users/:id               # Bitta foydalanuvchini korish
PUT    /users/:id               # Foydalanuvchini yangilash
DELETE /users/:id               # Foydalanuvchini ochirish


# -------------------- 🧑‍💼 ADMINS (faqat Super Admin) -------------------- #

GET    /admins                  # Adminlar royxati
POST   /admins                  # Yangi admin yaratish
GET    /admins/:id              # Admin haqida malumot
PUT    /admins/:id              # Adminni yangilash
DELETE /admins/:id              # Adminni ochirish


# -------------------- 🏪 VENDORS (Super Admin, Admin, ozi uchun) -------------------- #

GET    /vendors                 # Barcha vendorlar ro'yxati
POST   /vendors                 # Yangi vendor yaratish
GET    /vendors/:id             # Vendorni korish
PUT    /vendors/:id             # Vendorni yangilash
DELETE /vendors/:id             # Vendorni ochirish


# -------------------- 🚴 COURIERS (faqat Super Admin) -------------------- #

GET    /couriers                # Courierlar royxati
POST   /couriers                # Yangi courier yaratish
GET    /couriers/:id            # Courier haqida ma’lumot
PUT    /couriers/:id            # Courierni yangilash (status, tur: mashina, velosiped)
DELETE /couriers/:id            # Courierni o‘chirish


# -------------------- 🍽️ RESTAURANTS (Vendor, Admin, Super Admin) -------------------- #

GET    /restaurants                     # Barcha restoranlar (foydalanuvchilar uchun landing)
POST   /restaurants                     # Yangi restoran yaratish
GET    /restaurants/:id                 # Bitta restoran tafsiloti
PUT    /restaurants/:id                 # Restoranni yangilash (Vendor o‘zi)
DELETE /restaurants/:id                 # Restoranni o‘chirish

GET    /restaurants/:id/menus           # Restoranga tegishli menyular
GET    /restaurants/:id/reviews         # Foydalanuvchi izohlari
GET    /restaurants/:id/likes           # Like sonini olish


# -------------------- 🧾 MENUS (Vendor ozi uchun) -------------------- #

GET    /menus                           # Barcha menyular (Admin uchun ko‘rinadi)
POST   /menus                           # Menu qo‘shish (Vendor)
GET    /menus/:id                       # Menu tafsiloti
PUT    /menus/:id                       # Menu yangilash
DELETE /menus/:id                       # Menu o‘chirish


# -------------------- 💬 REVIEWS & RATINGS (User) -------------------- #

POST /reviews                           # Foydalanuvchi izoh qoldiradi
GET  /reviews/:restaurantId             # Restoran uchun barcha izohlar


# -------------------- ❤️ LIKES / FAVORITES (User) -------------------- #

POST   /likes                           # Like qoyish (restoran yoki menu)
GET    /favorites                       # Favorite qilingan menyu/restoranlar
DELETE /likes/:id                       # Liked itemni yoq qilish


# -------------------- 🛒 ORDERS (User / Courier / Vendor) -------------------- #

POST /orders                            # Zakaz berish (checkout)
GET  /orders                            # Foydalanuvchining buyurtmalari
GET  /orders/vendor                     # Vendor uchun buyurtmalar
GET  /orders/courier                    # Courier uchun buyurtmalar
PUT  /orders/:id/status                 # Zakaz statusini ozgartirish (yolda, yetkazildi)


# -------------------- 📍 COURIER LOCATION (real-time) -------------------- #

PUT /couriers/:id/location              # Courier joylashuvini yangilaydi (lat, lng)
GET /couriers/:id/location              # Courierning hozirgi joylashuvi


# -------------------- 📊 STATISTICS -------------------- #

GET /stats/overview                     # Umumiy statistikalar (rolga qarab ozgaradi)
GET /stats/vendor/:id                   # Vendor uchun buyurtmalar va daromad statistikasi
GET /stats/courier/:id                  # Courier uchun buyurtmalar va daromad
GET /stats/admin-panel                  # Admin panel uchun umumiy graflar

GET /stats/vendor-dashboard/:id         # Vendor dashboard uchun umumiy korsatkichlar
GET /stats/admin-dashboard              # Admin dashboard korsatkichlari
GET /stats/courier-dashboard/:id        #   


# -------------------- 🖼️ MEDIA UPLOADS -------------------- #

POST /upload/menu                       # Menu uchun rasm yuklash
POST /upload/restaurant                 # Restoran rasmi yuklash

