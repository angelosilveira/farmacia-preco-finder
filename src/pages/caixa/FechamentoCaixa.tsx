import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  valorInicial: z.string().min(1, "Informe o valor inicial do caixa"),
  dinheiro: z.string().min(1, "Informe o valor em dinheiro"),
  pix: z.string().min(1, "Informe o valor em PIX"),
  cartaoCredito: z.string().min(1, "Informe o valor em cartão de crédito"),
  cartaoDebito: z.string().min(1, "Informe o valor em cartão de débito"),
  responsavel: z.string().min(1, "Selecione o responsável pelo fechamento"),
  observacoes: z.string().optional(),
});

type Usuario = {
  id: string;
  nome: string;
  email: string;
};

export default function FechamentoCaixa() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valorInicial: "R$ 0,00",
      dinheiro: "R$ 0,00",
      pix: "R$ 0,00",
      cartaoCredito: "R$ 0,00",
      cartaoDebito: "R$ 0,00",
      responsavel: "",
      observacoes: "",
    },
  });

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const { data: users, error } = await supabase
          .from("usuarios")
          .select("id, nome, email")
          .order("nome");

        if (error) throw error;
        setUsuarios(users || []);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de usuários.",
          variant: "destructive",
        });
      }
    }

    fetchUsuarios();
  }, []);

  const parseValue = (val: string) =>
    parseFloat(val.replace(/[^\d,-]/g, "").replace(",", "."));

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const calculateTotal = () => {
    const values = form.getValues();
    const total =
      parseValue(values.dinheiro) +
      parseValue(values.pix) +
      parseValue(values.cartaoCredito) +
      parseValue(values.cartaoDebito);
    return formatCurrency(total);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      const valorInicial = parseValue(values.valorInicial);
      const dinheiro = parseValue(values.dinheiro);
      const pix = parseValue(values.pix);
      const cartaoCredito = parseValue(values.cartaoCredito);
      const cartaoDebito = parseValue(values.cartaoDebito);
      const total = dinheiro + pix + cartaoCredito + cartaoDebito;
      const diferenca = total - valorInicial;

      const { error } = await supabase.from("fechamentos_caixa").insert([
        {
          valor_inicial: valorInicial,
          dinheiro,
          pix,
          cartao_credito: cartaoCredito,
          cartao_debito: cartaoDebito,
          total,
          diferenca,
          responsavel: values.responsavel,
          observacoes: values.observacoes,
          data_fechamento: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Fechamento realizado",
        description: "O fechamento de caixa foi registrado com sucesso!",
      });

      navigate("/caixa/historico");
    } catch (error) {
      console.error("Erro ao realizar fechamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar o fechamento de caixa.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Fechamento de Caixa</CardTitle>
          <CardDescription>
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável pelo Fechamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {usuarios.map((usuario) => (
                          <SelectItem key={usuario.id} value={usuario.id}>
                            {usuario.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valorInicial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Inicial</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="R$ 0,00"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor em caixa no início do dia
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dinheiro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dinheiro</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIX</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cartaoCredito"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cartão de Crédito</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cartaoDebito"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cartão de Débito</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="text-lg font-semibold">
                  Total: {calculateTotal()}
                </div>
              </div>

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observações sobre o fechamento..."
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
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Realizar Fechamento
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/caixa")}
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
