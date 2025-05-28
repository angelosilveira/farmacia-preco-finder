import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Loader2, DollarSign, Coins, CreditCard, QrCode } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type FechamentoCaixa = {
  id: string;
  valor_inicial: number;
  dinheiro: number;
  pix: number;
  cartao_credito: number;
  cartao_debito: number;
  total: number;
  diferenca: number;
  data_fechamento: string;
};

export default function VisaoGeralCaixa() {
  const [today, setToday] = useState<FechamentoCaixa | null>(null);
  const [yesterdayTotal, setYesterdayTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Buscar fechamento de hoje
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const { data: todayData, error: todayError } = await supabase
        .from("fechamentos_caixa")
        .select("*")
        .gte("data_fechamento", startOfToday.toISOString())
        .order("data_fechamento", { ascending: false })
        .limit(1)
        .single();

      if (todayError && todayError.code !== "PGRST116") {
        // PGRST116 é o código para nenhum resultado encontrado
        throw todayError;
      }

      setToday(todayData);

      // Buscar fechamento de ontem
      const startOfYesterday = new Date();
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      startOfYesterday.setHours(0, 0, 0, 0);
      const endOfYesterday = new Date();
      endOfYesterday.setHours(0, 0, 0, 0);

      const { data: yesterdayData, error: yesterdayError } = await supabase
        .from("fechamentos_caixa")
        .select("total")
        .gte("data_fechamento", startOfYesterday.toISOString())
        .lt("data_fechamento", endOfYesterday.toISOString())
        .order("data_fechamento", { ascending: false })
        .limit(1)
        .single();

      if (yesterdayError && yesterdayError.code !== "PGRST116") {
        throw yesterdayError;
      }

      setYesterdayTotal(yesterdayData?.total || null);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">
          Carregando informações do caixa...
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total em Dinheiro
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {today ? formatCurrency(today.dinheiro) : "R$ 0,00"}
            </div>
            {today && (
              <p className="text-xs text-muted-foreground">
                {format(new Date(today.data_fechamento), "dd/MM/yyyy HH:mm")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em PIX</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {today ? formatCurrency(today.pix) : "R$ 0,00"}
            </div>
            {today && (
              <p className="text-xs text-muted-foreground">
                {format(new Date(today.data_fechamento), "dd/MM/yyyy HH:mm")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total em Cartões
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {today
                ? formatCurrency(today.cartao_credito + today.cartao_debito)
                : "R$ 0,00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Crédito:{" "}
              {today ? formatCurrency(today.cartao_credito) : "R$ 0,00"}
              <br />
              Débito: {today ? formatCurrency(today.cartao_debito) : "R$ 0,00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {today ? formatCurrency(today.total) : "R$ 0,00"}
            </div>
            {yesterdayTotal !== null && (
              <p className="text-xs text-muted-foreground">
                Ontem: {formatCurrency(yesterdayTotal)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {today && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Último Fechamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor Inicial:</span>
                <span className="font-medium">
                  {formatCurrency(today.valor_inicial)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Final:</span>
                <span className="font-medium">
                  {formatCurrency(today.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diferença:</span>
                <span
                  className={`font-medium ${
                    today.diferenca < 0
                      ? "text-destructive"
                      : today.diferenca > 0
                      ? "text-green-600"
                      : ""
                  }`}
                >
                  {formatCurrency(today.diferenca)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                Último fechamento em:{" "}
                {format(
                  new Date(today.data_fechamento),
                  "dd 'de' MMMM 'de' yyyy, HH:mm",
                  {
                    locale: ptBR,
                  }
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
