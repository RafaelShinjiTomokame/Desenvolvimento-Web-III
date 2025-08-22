-- CreateTable
CREATE TABLE "public"."pessoa" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."telefone" (
    "id" SERIAL NOT NULL,
    "numero" VARCHAR(11) NOT NULL,
    "idpessoa" INTEGER NOT NULL,

    CONSTRAINT "telefone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."carro" (
    "id" SERIAL NOT NULL,
    "modelo" VARCHAR(20) NOT NULL,

    CONSTRAINT "carro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pessoa_por_carro" (
    "idpessoa" INTEGER NOT NULL,
    "idcarro" INTEGER NOT NULL,

    CONSTRAINT "pessoa_por_carro_pkey" PRIMARY KEY ("idpessoa","idcarro")
);

-- AddForeignKey
ALTER TABLE "public"."telefone" ADD CONSTRAINT "telefone_idpessoa_fkey" FOREIGN KEY ("idpessoa") REFERENCES "public"."pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pessoa_por_carro" ADD CONSTRAINT "pessoa_por_carro_idpessoa_fkey" FOREIGN KEY ("idpessoa") REFERENCES "public"."pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pessoa_por_carro" ADD CONSTRAINT "pessoa_por_carro_idcarro_fkey" FOREIGN KEY ("idcarro") REFERENCES "public"."carro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
