import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  created_at?: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    setLoading(true);
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ variant: "destructive", title: "Erro ao buscar usuários" });
    } else {
      setUsuarios(data || []);
    }
    setLoading(false);
  }

  async function handleAddUsuario(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !email) {
      toast({ variant: "destructive", title: "Preencha nome e email" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("usuarios").insert([{ nome, email }]);
    if (error) {
      toast({ variant: "destructive", title: "Erro ao cadastrar usuário" });
    } else {
      toast({ title: "Usuário cadastrado com sucesso" });
      setNome("");
      setEmail("");
      fetchUsuarios();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Usuários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            onSubmit={handleAddUsuario}
            className="flex flex-col gap-4 md:flex-row md:items-end"
          >
            <Input
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Salvando..." : "Cadastrar"}
            </Button>
          </form>
          <div className="overflow-x-auto">
            <Table className="min-w-[500px] w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.nome}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {u.created_at
                        ? new Date(u.created_at).toLocaleString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
                {usuarios.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      Nenhum usuário cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
