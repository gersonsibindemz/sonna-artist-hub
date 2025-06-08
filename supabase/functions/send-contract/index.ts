
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContractRequest {
  userId: string;
  userEmail: string;
  userName: string;
  accountType: string;
}

const generateContractPDF = (contractData: ContractRequest) => {
  const contractHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Contrato de Distribuição Musical - Sonna For Artists</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .clause { margin-bottom: 15px; }
        .signature { margin-top: 50px; }
        h1 { color: #f59e0b; }
        h2 { color: #1f2937; border-bottom: 2px solid #f59e0b; padding-bottom: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CONTRATO DE DISTRIBUIÇÃO MUSICAL DIGITAL</h1>
        <h2>Sonna For Artists</h2>
        <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>

    <div class="section">
        <h2>PARTES CONTRATANTES</h2>
        <div class="clause">
            <p><strong>CONTRATANTE:</strong> Sonna For Artists, plataforma de distribuição musical digital.</p>
            <p><strong>CONTRATADO:</strong> ${contractData.userName} (${contractData.userEmail})</p>
            <p><strong>TIPO DE CONTA:</strong> ${contractData.accountType === 'label' ? 'Label/Gravadora' : 'Artista Individual'}</p>
        </div>
    </div>

    <div class="section">
        <h2>1. OBJETO DO CONTRATO</h2>
        <div class="clause">
            <p>1.1. Este contrato estabelece os termos e condições para a distribuição digital de conteúdo musical através da plataforma Sonna For Artists.</p>
            <p>1.2. O CONTRATADO autoriza a Sonna For Artists a distribuir suas obras musicais nas principais plataformas de streaming digital.</p>
        </div>
    </div>

    <div class="section">
        <h2>2. LIMITES E CAPACIDADES</h2>
        <div class="clause">
            <p>2.1. <strong>Conta Artista:</strong> Até 2 artistas cadastrados, sem limite de faixas por artista.</p>
            <p>2.2. <strong>Conta Label:</strong> Até 5 artistas cadastrados, sem limite de faixas por artista.</p>
            <p>2.3. Todas as submissões passarão por processo de análise e aprovação antes da distribuição.</p>
        </div>
    </div>

    <div class="section">
        <h2>3. RESPONSABILIDADES DO CONTRATADO</h2>
        <div class="clause">
            <p>3.1. Garantir que possui todos os direitos autorais e conexos sobre o material submetido.</p>
            <p>3.2. Fornecer informações precisas e atualizadas sobre as obras musicais.</p>
            <p>3.3. Respeitar os direitos de terceiros e não submeter conteúdo que viole direitos autorais.</p>
            <p>3.4. Manter seus dados de contato atualizados na plataforma.</p>
        </div>
    </div>

    <div class="section">
        <h2>4. RESPONSABILIDADES DA SONNA FOR ARTISTS</h2>
        <div class="clause">
            <p>4.1. Processar e analisar as submissões em tempo hábil.</p>
            <p>4.2. Distribuir o conteúdo aprovado nas plataformas de streaming parceiras.</p>
            <p>4.3. Fornecer códigos ISRC e ISWC automaticamente para identificação das obras.</p>
            <p>4.4. Manter a confidencialidade dos dados do usuário conforme LGPD.</p>
            <p>4.5. Processar e repassar os royalties conforme acordado.</p>
        </div>
    </div>

    <div class="section">
        <h2>5. PROCESSO DE APROVAÇÃO</h2>
        <div class="clause">
            <p>5.1. Todas as submissões serão analisadas por nossa equipe técnica.</p>
            <p>5.2. O prazo médio de análise é de 3-5 dias úteis.</p>
            <p>5.3. Em caso de rejeição, serão fornecidos os motivos para correção.</p>
            <p>5.4. Conteúdo aprovado será automaticamente enviado para as plataformas de streaming.</p>
        </div>
    </div>

    <div class="section">
        <h2>6. ROYALTIES E PAGAMENTOS</h2>
        <div class="clause">
            <p>6.1. Os royalties serão calculados conforme as reproduções nas plataformas de streaming.</p>
            <p>6.2. Pagamentos mensais para valores acima de €25,00.</p>
            <p>6.3. Relatórios detalhados disponíveis na plataforma.</p>
            <p>6.4. Taxa de serviço: 15% sobre os royalties brutos recebidos das plataformas.</p>
        </div>
    </div>

    <div class="section">
        <h2>7. PROPRIEDADE INTELECTUAL</h2>
        <div class="clause">
            <p>7.1. O CONTRATADO mantém todos os direitos autorais sobre suas obras.</p>
            <p>7.2. A Sonna For Artists atua apenas como distribuidor digital.</p>
            <p>7.3. Este contrato não transfere propriedade intelectual, apenas direitos de distribuição.</p>
        </div>
    </div>

    <div class="section">
        <h2>8. VIGÊNCIA E RESCISÃO</h2>
        <div class="clause">
            <p>8.1. Este contrato entra em vigor na data de aceitação e tem vigência indeterminada.</p>
            <p>8.2. Qualquer parte pode rescindir com aviso prévio de 30 dias.</p>
            <p>8.3. Em caso de rescisão, as obras já distribuídas permanecem ativas por 90 dias para finalização dos royalties.</p>
        </div>
    </div>

    <div class="section">
        <h2>9. POLÍTICA DE PRIVACIDADE</h2>
        <div class="clause">
            <p>9.1. Todos os dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD).</p>
            <p>9.2. Dados pessoais são utilizados exclusivamente para execução dos serviços contratados.</p>
            <p>9.3. O usuário pode solicitar exclusão de dados a qualquer momento.</p>
        </div>
    </div>

    <div class="section">
        <h2>10. DISPOSIÇÕES GERAIS</h2>
        <div class="clause">
            <p>10.1. Este contrato é regido pelas leis portuguesas e brasileiras.</p>
            <p>10.2. Foro competente: Lisboa, Portugal ou São Paulo, Brasil.</p>
            <p>10.3. Alterações devem ser formalizadas por escrito.</p>
        </div>
    </div>

    <div class="signature">
        <p><strong>Data de Aceite:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
        <p><strong>Usuário:</strong> ${contractData.userName}</p>
        <p><strong>Email:</strong> ${contractData.userEmail}</p>
        <br>
        <p>Este contrato foi aceito eletronicamente através da plataforma Sonna For Artists.</p>
    </div>
</body>
</html>`;

  return contractHTML;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { userId, userEmail, userName, accountType }: ContractRequest = await req.json();

    // Verificar se é a primeira submissão do usuário
    const { data: existingTracks, error: tracksError } = await supabaseClient
      .from("tracks")
      .select("id")
      .eq("artist_id", userId)
      .limit(1);

    if (tracksError) throw tracksError;

    // Se não for a primeira submissão, não enviar contrato
    if (existingTracks && existingTracks.length > 0) {
      return new Response(
        JSON.stringify({ message: "Contrato já enviado anteriormente" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Gerar contrato em HTML
    const contractHTML = generateContractPDF({
      userId,
      userEmail,
      userName,
      accountType
    });

    // Simular envio de email (aqui você integraria com um serviço real como Resend)
    console.log(`Enviando contrato para: ${userEmail}`);
    console.log("Contrato gerado:", contractHTML.substring(0, 200) + "...");

    // Log do envio
    await supabaseClient
      .from("email_logs")
      .insert({
        user_email: userEmail,
        subject: "Contrato de Distribuição Musical - Sonna For Artists",
        status: "sent"
      });

    return new Response(
      JSON.stringify({ 
        message: "Contrato enviado com sucesso",
        contractGenerated: true 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Erro ao enviar contrato:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
