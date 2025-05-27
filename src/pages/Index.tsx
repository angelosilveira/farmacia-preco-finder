
import React, { useState } from 'react';
import { CotacaoForm } from '@/components/CotacaoForm';
import { CotacaoTable } from '@/components/CotacaoTable';
import { Produto } from '@/types/cotacao';
import { ClipboardList } from 'lucide-react';

const Index = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const handleAddProduto = (novoProduto: Produto) => {
    setProdutos(prev => [...prev, novoProduto]);
  };

  const totalCotacoes = produtos.length;
  const totalValor = produtos.reduce((sum, produto) => sum + produto.precoTotal, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-lg">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sistema de Cotação</h1>
                <p className="text-lg text-gray-600">Gestão de Preços para Farmácia</p>
              </div>
            </div>
            
            {totalCotacoes > 0 && (
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalCotacoes}</div>
                  <div className="text-sm opacity-90">Cotações</div>
                </div>
              </div>
            )}
          </div>
          
          {totalValor > 0 && (
            <div className="mt-4 bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">Valor Total das Cotações:</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(totalValor)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Formulário de Cotação */}
          <div className="flex justify-center">
            <CotacaoForm onAddProduto={handleAddProduto} />
          </div>

          {/* Tabela de Cotações */}
          <CotacaoTable produtos={produtos} />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>Sistema de Cotação de Medicamentos - Encontre sempre os melhores preços</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
