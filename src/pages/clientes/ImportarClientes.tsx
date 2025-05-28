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
import { Cliente } from "@/types/clientes";

export default function ImportarClientes() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<Partial<Cliente>[]>([]);
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
      // Espera colunas: nome, telefone, email, cpf, endereco, observacoes
      const clientesParsed: Partial<Cliente>[] = (
        json as { [key: string]: unknown }[]
      ).map((row) => {
        const r = row as { [key: string]: unknown };
        console.log("🚀 ~ ).map ~ r:", r);
        return {
          nome: String(r.nome ?? r.Nome ?? ""),
          telefone: String(r.telefone ?? r.Telefone ?? ""),
          email: r.email ?? r.Email ? String(r.email ?? r.Email) : null,
          cpf: r.cpf ?? r.CPF ? String(r.cpf ?? r.CPF) : null,
          endereco:
            r.endereco ?? r.Endereco ? String(r.endereco ?? r.Endereco) : null,
          observacoes:
            r.observacoes ?? r.Observacoes
              ? String(r.observacoes ?? r.Observacoes)
              : null,
          saldo_devedor:
            r.saldo_devedor ?? r["Saldo Devedor"]
              ? Number(r.saldo_devedor ?? r["Saldo Devedor"])
              : 0,
          status_pagamento: (r.status_pagamento ??
            r.Status ??
            "em_dia") as Cliente["status_pagamento"],
          ultima_compra:
            r.ultima_compra ?? r["Última Compra"]
              ? String(r.ultima_compra ?? r["Última Compra"])
              : null,
        };
      });
      setClientes(clientesParsed);
      toast({
        title: "Arquivo lido",
        description: `${clientesParsed.length} clientes encontrados. Confira antes de importar.`,
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
      const validos = clientes.filter((c) => c.nome && c.telefone);
      if (validos.length === 0) {
        toast({
          variant: "destructive",
          title: "Nenhum cliente válido para importar.",
        });
        setLoading(false);
        return;
      }
      const { error } = await supabase.from("clientes").insert(validos);
      if (error) throw error;
      toast({
        title: "Importação concluída",
        description: `Foram importados ${validos.length} clientes.`,
      });
      setClientes([]);
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
          <CardTitle>Importar Clientes via Excel</CardTitle>
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
          {clientes.length > 0 && (
            <>
              <div className="w-full overflow-x-auto max-h-64 border rounded bg-background">
                <Table className="min-w-[900px] w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Endereço</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientes.slice(0, 20).map((c, i) => (
                      <TableRow key={i}>
                        <TableCell>{c.nome}</TableCell>
                        <TableCell>{c.telefone}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.cpf}</TableCell>
                        <TableCell>{c.endereco}</TableCell>
                        <TableCell>{c.observacoes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {clientes.length > 20 && (
                  <div className="text-xs text-muted-foreground p-2">
                    Exibindo os 20 primeiros de {clientes.length} clientes.
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
                  : `Importar ${clientes.length} clientes`}
              </Button>
            </>
          )}
          <div className="text-sm text-muted-foreground">
            O arquivo deve conter as colunas: <b>nome</b>, <b>telefone</b>,{" "}
            <b>email</b>, <b>cpf</b>, <b>endereco</b>, <b>observacoes</b>.<br />
            Linhas sem nome ou telefone serão ignoradas.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
