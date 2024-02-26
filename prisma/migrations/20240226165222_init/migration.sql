-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL DEFAULT '',
    "address" VARCHAR(255) NOT NULL DEFAULT '',
    "wallet_address" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "layouts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "layout_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "layouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "widgets" (
    "id" SERIAL NOT NULL,
    "widget_name" VARCHAR(255) NOT NULL,
    "widget_description" VARCHAR(255),
    "widget_config" JSONB,

    CONSTRAINT "widgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "layout_widgets" (
    "layout_id" INTEGER NOT NULL,
    "widget_id" INTEGER NOT NULL,

    CONSTRAINT "layout_widgets_pkey" PRIMARY KEY ("layout_id","widget_id")
);

-- CreateTable
CREATE TABLE "crypto_loginnonces" (
    "user_id" INTEGER NOT NULL,
    "nonce" VARCHAR(255) NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");

-- CreateIndex
CREATE INDEX "idx_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_wallet_address" ON "users"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "layout_widgets_layout_id_key" ON "layout_widgets"("layout_id");

-- CreateIndex
CREATE UNIQUE INDEX "layout_widgets_widget_id_key" ON "layout_widgets"("widget_id");

-- CreateIndex
CREATE INDEX "idx_layout_id" ON "layout_widgets"("layout_id");

-- CreateIndex
CREATE INDEX "idx_widget_id" ON "layout_widgets"("widget_id");

-- CreateIndex
CREATE UNIQUE INDEX "crypto_loginnonces_user_id_key" ON "crypto_loginnonces"("user_id");

-- AddForeignKey
ALTER TABLE "layouts" ADD CONSTRAINT "layouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "layout_widgets" ADD CONSTRAINT "layout_widgets_layout_id_fkey" FOREIGN KEY ("layout_id") REFERENCES "layouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "layout_widgets" ADD CONSTRAINT "layout_widgets_widget_id_fkey" FOREIGN KEY ("widget_id") REFERENCES "widgets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crypto_loginnonces" ADD CONSTRAINT "crypto_loginnonces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
