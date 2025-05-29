import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Produto } from "@/types/cotacao";

// Define o tipo ProdutoImportacao para o schema de produtos da farmácia
interface ProdutoImportacao {
  codigo: string;
  nome: string;
  laboratorio?: string;
  grupo?: string;
  curva_abc?: string;
  estoque: number;
  preco_compra: number;
  preco_custo: number;
  preco_venda: number;
}

export default function ImportarProdutos() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<ProdutoImportacao[]>([]);
  const [fileName, setFileName] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    try {
      const text = await file.text();
      // Corrige encoding se necessário
      const lines = text.split(/\r?\n/).filter(Boolean);
      // Ignora as 3 primeiras linhas (cabeçalho)
      const dataLines = lines.slice(3);
      // A primeira linha útil é o header
      const header = dataLines[0].split(";").map((h) => h.trim());
      // Linhas de dados
      const rows = dataLines
        .slice(1)
        .filter((l) => l.trim() && l.includes(";"));
      const produtosParsed: ProdutoImportacao[] = rows.map((line) => {
        const cols = line.split(";");
        // Mapeamento dos campos
        const [
          codigo,
          produto, // campo vazio
          ,
          laboratorio,
          grupo, // campo vazio
          ,
          curvaABC, // campo vazio
          ,
          estoq,
          precoCompra, // campo vazio
          ,
          precoCusto, // campos vazios
          ,
          ,
          ,
          ,
          precoVenda,
        ] = cols;
        // Função para converter moeda BR
        const parseBRL = (v: string) =>
          Number(v.replace(/\./g, "").replace(",", ".")) || 0;
        return {
          codigo: codigo?.trim() || "",
          nome: produto?.trim() || "",
          laboratorio: laboratorio?.trim() || undefined,
          grupo: grupo?.trim() || undefined,
          curva_abc: curvaABC?.trim() || undefined,
          estoque: Number(estoq?.replace(/\D/g, "")) || 0,
          preco_compra: parseBRL(precoCompra),
          preco_custo: parseBRL(precoCusto),
          preco_venda: parseBRL(precoVenda),
        };
      });
      setProdutos(produtosParsed);
      toast({
        title: "Arquivo lido",
        description: `${produtosParsed.length} produtos encontrados. Confira antes de importar.`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao ler arquivo",
        description: String(err),
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    setLoading(true);
    try {
      // Considera válidos produtos com nome e código
      const validos = produtos.filter((p) => p.nome && p.codigo);
      if (validos.length === 0) {
        toast({
          variant: "destructive",
          title: "Nenhum produto válido para importar.",
        });
        setLoading(false);
        return;
      }
      // Insere os produtos no Supabase
      const { error } = await supabase.from("produtos").insert(validos);
      if (error) throw error;
      toast({
        title: "Importação concluída",
        description: `Foram importados ${validos.length} produtos.`,
      });
      setProdutos([]);
      setFileName("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro na importação",
        description: String(err),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Importar Produtos via Excel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            {loading ? "Processando..." : "Selecionar arquivo XLSX"}
          </Button>
          {fileName && (
            <div className="text-xs text-muted-foreground">
              Arquivo: {fileName}
            </div>
          )}
          {produtos.length > 0 && (
            <>
              <div className="w-full overflow-x-auto max-h-64 border rounded bg-background">
                <Table className="min-w-[900px] w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Laboratório</TableHead>
                      <TableHead>Grupo</TableHead>
                      <TableHead>Curva ABC</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Preço Compra</TableHead>
                      <TableHead>Preço Custo</TableHead>
                      <TableHead>Preço Venda</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.slice(0, 20).map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{p.codigo}</TableCell>
                        <TableCell>{p.nome}</TableCell>
                        <TableCell>{p.laboratorio}</TableCell>
                        <TableCell>{p.grupo}</TableCell>
                        <TableCell>{p.curva_abc}</TableCell>
                        <TableCell>{p.estoque}</TableCell>
                        <TableCell>
                          {p.preco_compra.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell>
                          {p.preco_custo.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell>
                          {p.preco_venda.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {produtos.length > 20 && (
                  <div className="text-xs text-muted-foreground p-2">
                    Exibindo os 20 primeiros de {produtos.length} produtos.
                  </div>
                )}
              </div>
              <Button
                onClick={handleImport}
                disabled={loading}
                className="mt-4"
              >
                {loading
                  ? "Importando..."
                  : `Importar ${produtos.length} produtos`}
              </Button>
            </>
          )}
          <div className="text-sm text-muted-foreground">
            O arquivo deve conter as colunas: <b>código</b>, <b>nome</b>,{" "}
            <b>laboratório</b>, <b>grupo</b>, <b>curva_abc</b>, <b>estoque</b>,{" "}
            <b>preço_compra</b>, <b>preço_custo</b>, <b>preço_venda</b>.<br />
            Linhas sem nome ou código serão ignoradas.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
