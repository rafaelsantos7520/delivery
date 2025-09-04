import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Buscar categoria por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            active: true
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar categoria
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se já existe outra categoria com esse nome
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name,
        id: { not: categoryId }
      }
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'Já existe uma categoria com esse nome' },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: {
        id: categoryId
      },
      data: {
        name,
        description
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar categoria
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    // Verificar se a categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se há produtos vinculados
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar categoria que possui produtos vinculados' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: {
        id: categoryId
      }
    });

    return NextResponse.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}