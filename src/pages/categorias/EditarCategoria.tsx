import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres",
  }),
  descricao: z.string().optional(),
});

export default function EditarCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
    },
  });

  useEffect(() => {
    async function fetchCategoria() {
      try {
        const { data, error } = await supabase
          .from("categorias")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Categoria não encontrada");

        form.reset({
          nome: data.nome,
          descricao: data.descricao || "",
        });
      } catch (error) {
        console.error("Erro ao carregar categoria:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da categoria.",
          variant: "destructive",
        });
        navigate("/categorias/lista");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchCategoria();
    }
  }, [id, form, navigate]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("categorias")
        .update(values)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Categoria atualizada",
        description: "Os dados foram atualizados com sucesso!",
      });
      navigate("/categorias/lista");
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a categoria.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">
          Carregando dados da categoria...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da categoria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descrição da categoria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/categorias/lista")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
