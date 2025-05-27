
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Produto, MelhorPreco } from '@/types/cotacao';
import { ShoppingCart, Search } from 'lucide-react';

interface CotacaoTableProps {
  produtos: Produto[];
}

export function CotacaoTable({ produtos }: CotacaoTableProps) {
  // Calcular os melhores preços por produto
  const getMelhoresPrecos = (): MelhorPreco[] => {
    const produtosAgrupados = produtos.reduce((acc, produto) => {
      if (!acc[produto.nome]) {
        acc[produto.nome] = [];
      }
      acc[produto.nome].push(produto);
      return acc;
    }, {} as Record<string, Produto[]>);

    return Object.entries(produtosAgrupados).map(([nome, produtosList]) => {
      const menorPreco = Math.min(...produtosList.map(p => p.precoUnitario));
      const produtoMenorPreco = produtosList.find(p => p.precoUnitario === menorPreco)!;
      
      return {
        nome,
        menorPreco,
        representante: produtoMenorPreco.representante,
        unidadeMedida: produtoMenorPreco.unidadeMedida
      };
    });
  };

  const melhoresPrecos = getMelhoresPrecos();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const isMelhorPreco = (produto: Produto) => {
    const melhor = melhoresPrecos.find(m => m.nome === produto.nome);
    return melhor?.menorPreco === produto.precoUnitario && melhor?.representante === produto.representante;
  };

  return (
    <div className="space-y-6">
      {/* Resumo dos Melhores Preços */}
      {melhoresPrecos.length > 0 && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Melhores Preços por Produto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {melhoresPrecos.map((melhor, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">{melhor.nome}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Menor Preço:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(melhor.menorPreco)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Representante:</span>
                      <Badge variant="secondary">{melhor.representante}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Unidade:</span>
                      <span>{melhor.unidadeMedida}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela de Todas as Cotações */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Todas as Cotações ({produtos.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {produtos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma cotação cadastrada ainda.</p>
              <p className="text-sm">Adicione uma cotação usando o formulário acima.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Representante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Unit.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qtd
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {produtos.map((produto) => (
                    <tr 
                      key={produto.id} 
                      className={`hover:bg-gray-50 ${isMelhorPreco(produto) ? 'bg-green-50 border-l-4 border-green-500' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {produto.nome}
                            </div>
                            {isMelhorPreco(produto) && (
                              <Badge variant="default" className="mt-1 bg-green-600">
                                Menor Preço
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">{produto.representante}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(produto.precoUnitario)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {produto.quantidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {produto.unidadeMedida}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        {formatCurrency(produto.precoTotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(produto.dataAtualizacao)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
