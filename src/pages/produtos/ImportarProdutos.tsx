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

export default function ImportarProdutos() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<Partial<Produto>[]>([]);
  const [fileName, setFileName] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const produtosParsed: Partial<Produto>[] = (
        json as { [key: string]: unknown }[]
      ).map((row) => {
        const r = row as { [key: string]: unknown };
        const precoUnitario = Number(
          r.precoUnitario ?? r["Preço Unitário"] ?? 0
        );
        const quantidade = Number(r.quantidade ?? r.Quantidade ?? 1);

        return {
          nome: String(r.nome ?? r.Nome ?? ""),
          categoria: String(
            r.categoria ?? r.Categoria ?? "Medicamentos"
          ) as Produto["categoria"],
          precoUnitario,
          quantidade,
          unidadeMedida: String(
            r.unidadeMedida ?? r["Unidade Medida"] ?? r["Unidade"] ?? "Unidade"
          ),
          precoTotal: precoUnitario * quantidade,
          representante: String(r.representante ?? r.Representante ?? ""),
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
      const validos = produtos.filter(
        (p) => p.nome && p.precoUnitario && p.representante
      );
      if (validos.length === 0) {
        toast({
          variant: "destructive",
          title: "Nenhum produto válido para importar.",
        });
        setLoading(false);
        return;
      }
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
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço Unit.</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Un. Medida</TableHead>
                      <TableHead>Preço Total</TableHead>
                      <TableHead>Representante</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.slice(0, 20).map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{p.nome}</TableCell>
                        <TableCell>{p.categoria}</TableCell>
                        <TableCell>
                          {p.precoUnitario?.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell>{p.quantidade}</TableCell>
                        <TableCell>{p.unidadeMedida}</TableCell>
                        <TableCell>
                          {p.precoTotal?.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell>{p.representante}</TableCell>
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
            O arquivo deve conter as colunas: <b>nome</b>, <b>categoria</b>,{" "}
            <b>precoUnitario</b>, <b>quantidade</b>, <b>unidadeMedida</b>,{" "}
            <b>representante</b>.<br />
            Linhas sem nome, preço unitário ou representante serão ignoradas.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
