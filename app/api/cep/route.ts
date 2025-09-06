import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cep = searchParams.get('cep');

  if (!cep) {
    return NextResponse.json({ error: 'CEP não informado' }, { status: 400 });
  }

  // Consulta local no banco
  const address = await prisma.address.findUnique({ where: { cep } });
  if (address) {
    return NextResponse.json(address);
  }

  // Consulta externa (ViaCEP)
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (data.erro) throw new Error('CEP não encontrado');
    const novo = await prisma.address.create({
      data: {
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        localidade: data.localidade,
        uf: data.uf,
      },
    });
    return NextResponse.json(novo);
  } catch (err) {
    return NextResponse.json({ error: 'CEP não encontrado ou erro na consulta' }, { status: 404 });
  }
}
