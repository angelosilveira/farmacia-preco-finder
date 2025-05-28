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
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres",
  }),
  empresa: z.string().min(2, {
    message: "A empresa deve ter pelo menos 2 caracteres",
  }),
  telefone: z.string().min(10, {
    message: "O telefone deve ter pelo menos 10 dígitos",
  }),
  email: z
    .string()
    .email({
      message: "Digite um email válido",
    })
    .optional()
    .nullable(),
});

export default function EditarRepresentante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      empresa: "",
      telefone: "",
      email: "",
    },
  });

  useEffect(() => {
    async function fetchRepresentante() {
      try {
        const { data, error } = await supabase
          .from("representantes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Representante não encontrado");

        // Preenche o formulário com os dados do representante
        form.reset({
          nome: data.nome,
          empresa: data.empresa,
          telefone: data.telefone,
          email: data.email || "",
        });
      } catch (error) {
        console.error("Erro ao carregar representante:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do representante.",
          variant: "destructive",
        });
        navigate("/representantes/lista");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchRepresentante();
    }
  }, [id, form, navigate]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("representantes")
        .update(values)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Representante atualizado",
        description: "Os dados foram atualizados com sucesso!",
      });
      navigate("/representantes/lista");
    } catch (error) {
      console.error("Erro ao atualizar representante:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o representante.",
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
          Carregando dados do representante...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Representante</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do representante" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        {...field}
                      />
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
                  onClick={() => navigate("/representantes/lista")}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
