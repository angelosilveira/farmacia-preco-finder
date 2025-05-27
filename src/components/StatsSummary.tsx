import { Produto } from "@/types/cotacao";

interface StatsSummaryProps {
  produtos: Produto[];
}

export function StatsSummary({ produtos }: StatsSummaryProps) {
  // Calculate unique representatives
  const uniqueRepresentantes = new Set(produtos.map((p) => p.representante))
    .size;

  // Calculate products without minimum price quote (assuming products with only one quote)
  const produtosSemCotacaoMinima = Array.from(
    new Set(produtos.map((p) => p.nome))
  ).filter(
    (nome) => produtos.filter((p) => p.nome === nome).length === 1
  ).length;

  // Total unique products
  const totalProdutos = new Set(produtos.map((p) => p.nome)).size;

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-secondary/20 rounded-lg mb-4 text-sm">
      <div>{totalProdutos} produtos</div>
      <div className="w-[1px] h-4 bg-border" />
      <div>{uniqueRepresentantes} representantes</div>
      <div className="w-[1px] h-4 bg-border" />
      <div>
        {produtosSemCotacaoMinima}{" "}
        {produtosSemCotacaoMinima === 1 ? "produto" : "produtos"} sem cotação
        mínima
      </div>
    </div>
  );
}
