generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

//
// ENUMS
//
enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
  VENDOR
  COURIER
}

enum Language {
  uz
  ru
  en
}

enum ReactionType {
  LIKE
  DISLIKE
}

enum CommentTargetType {
  RESTAURANT
  MENU_ITEM
}

enum OrderStatus {
  PENDING
  PREPARING
  READY
  DELIVERED
  CANCELLED
}

enum DeliveryMethod {
  DELIVERY
  PICKUP
}

enum NotificationType {
  ORDER_UPDATE
  INFO
  WARNING
  SYSTEM
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
}

//
// MODELS
//
model User {
  id             String          @id @default(uuid())
  fullName       String
  email          String          @unique
  password       String
  role           UserRole        @default(USER)
  phone          String?         @unique
  avatarUrl      String?
  telegramChatId String?         @unique
  isVerified     Boolean         @default(false)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  restaurants    Restaurant[]
  orders         Order[]
  comments       Comment[]       @relation(name: "UserComments")
  notifications  Notification[]
  reactions      Reaction[]      @relation(name: "UserReactions")
  favorites      Favorite[]
  auditLogs      AuditLog[]
}

model Restaurant {
  id          String     @id @default(uuid())
  name        String
  description String?
  image       String?
  location    String?
  rating      Float      @default(0)
  isApproved  Boolean    @default(false)
  openTime    String?
  closeTime   String?
  ownerId     String
  views       Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  owner       User       @relation(fields: [ownerId], references: [id])
  menus       Menu[]
  orders      Order[]
  comments    Comment[]  @relation("RestaurantComments")
}

model Menu {
  id           String     @id @default(uuid())
  name         String
  description  String?
  price        Float
  image        String?
  isAvailable  Boolean    @default(true)
  restaurantId String
  categoryId   String?
  views        Int        @default(0)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  category     Category?  @relation(fields: [categoryId], references: [id])
  orders       OrderItem[]
  comments     Comment[]  @relation("MenuComments")
  translations MenuTranslation[]
  favorites    Favorite[]
}

model MenuTranslation {
  id          String   @id @default(uuid())
  lang        Language @default(uz)
  name        String
  description String?
  menuId      String

  menu        Menu     @relation(fields: [menuId], references: [id], onDelete: Cascade)
  @@unique([lang, menuId])
}

model Order {
  id              String         @id @default(uuid())
  status          OrderStatus    @default(PENDING)
  paymentStatus   PaymentStatus  @default(PENDING)
  method          DeliveryMethod @default(DELIVERY)
  userId          String
  restaurantId    String
  courierId       String?
  totalAmount     Float
  deliveryAddress String?
  deliveredAt     DateTime?
  cancelledReason String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  user            User           @relation(fields: [userId], references: [id])
  restaurant      Restaurant     @relation(fields: [restaurantId], references: [id])
  courier         User?          @relation(fields: [courierId], references: [id])
  items           OrderItem[]
}

model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  menuId    String
  quantity  Int
  price     Float

  order     Order    @relation(fields: [orderId], references: [id])
  menu      Menu     @relation(fields: [menuId], references: [id])
}

model Comment {
  id          String             @id @default(uuid())
  content     String             @db.Text
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt
  authorId    String
  targetId    String
  targetType  CommentTargetType
  parentId    String?

  author      User     @relation(name: "UserComments", fields: [authorId], references: [id], onDelete: Cascade)
  parent      Comment? @relation("ReplyTo", fields: [parentId], references: [id], onDelete: Cascade)
  replies     Comment[] @relation("ReplyTo")
}

model Reaction {
  id         String       @id @default(uuid())
  type       ReactionType @default(DISLIKE)
  createdAt  DateTime     @default(now())
  userId     String
  targetId   String
  targetType CommentTargetType

  user       User         @relation(name: "UserReactions", fields: [userId], references: [id], onDelete: Cascade)
}

model Notification {
  id         String           @id @default(uuid())
  userId     String
  message    String
  type       NotificationType @default(INFO)
  isRead     Boolean          @default(false)
  createdAt  DateTime         @default(now())

  user       User             @relation(fields: [userId], references: [id])
}

model Category {
  id             String                @id @default(uuid())
  createdAt      DateTime              @default(now())
  updatedAt      DateTime              @updatedAt

  menus          Menu[]
  translations   CategoryTranslation[]
}

model CategoryTranslation {
  id          String   @id @default(uuid())
  lang        Language @default(uz)
  name        String
  description String
  categoryId  String

  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  @@unique([lang, categoryId])
}

model Favorite {
  id       String   @id @default(uuid())
  userId   String
  menuId   String

  user     User     @relation(fields: [userId], references: [id])
  menu     Menu     @relation(fields: [menuId], references: [id])
  @@unique([userId, menuId])
}

model Discount {
  id          String   @id @default(uuid())
  code        String   @unique
  percentage  Int
  expiresAt   DateTime?
  isActive    Boolean  @default(true)
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String?
  action    String
  ip        String?
  userAgent String?
  createdAt DateTime @default(now())

  user      User?    @relation(fields: [userId], references: [id])
}
