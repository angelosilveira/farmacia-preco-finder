import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { Colaborador } from "@/types/colaboradores";

export default function ListaColaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColaboradores();
  }, []);

  const fetchColaboradores = async () => {
    try {
      const { data, error } = await supabase
        .from("colaboradores")
        .select("*")
        .order("nome");

      if (error) throw error;

      setColaboradores(data || []);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os colaboradores.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("colaboradores")
        .delete()
        .match({ id });

      if (error) throw error;

      setColaboradores((prev) => prev.filter((col) => col.id !== id));
      toast({
        title: "Colaborador removido",
        description: "O colaborador foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao deletar colaborador:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o colaborador.",
      });
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Lista de Colaboradores</h3>
        <Button asChild>
          <Link to="/colaboradores/adicionar">
            <Plus className="mr-2 h-4 w-4" />
            Novo Colaborador
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Data Admissão</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colaboradores.map((colaborador) => (
            <TableRow key={colaborador.id}>
              <TableCell className="font-medium">{colaborador.nome}</TableCell>
              <TableCell>{colaborador.cargo}</TableCell>
              <TableCell>
                {colaborador.telefone && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{colaborador.telefone}</Badge>
                  </div>
                )}
                {colaborador.email && (
                  <div className="text-sm text-muted-foreground">
                    {colaborador.email}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(colaborador.data_admissao), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>
                <Badge variant={colaborador.status ? "default" : "secondary"}>
                  {colaborador.status ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/colaboradores/editar/${colaborador.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Remover colaborador?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso removerá
                          permanentemente o colaborador {colaborador.nome}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(colaborador.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
