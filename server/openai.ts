import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""
});

export interface ContentGenerationInput {
  nicheProfile: {
    name: string;
    targetAudience: string;
    contentGoal: string;
    toneOfVoice: string;
    keywords?: string;
  };
  contentType: string;
  inputData: any;
}

export async function generateContent(input: ContentGenerationInput): Promise<string> {
  const { nicheProfile, contentType, inputData } = input;

  let prompt = "";
  let systemPrompt = "";

  // Build system prompt based on niche profile
  systemPrompt = `Sei un esperto copywriter e content creator specializzato nella nicchia: ${nicheProfile.name}.

Pubblico target: ${nicheProfile.targetAudience}
Obiettivo principale: ${nicheProfile.contentGoal}
Tono di voce: ${nicheProfile.toneOfVoice}
${nicheProfile.keywords ? `Keywords da includere: ${nicheProfile.keywords}` : ""}

Scrivi sempre in italiano e crea contenuti autentici, coinvolgenti e appropriati per il pubblico target specificato.`;

  // Build specific prompts based on content type
  switch (contentType) {
    case "facebook":
    case "instagram":
      prompt = `Crea un post ${contentType === "facebook" ? "Facebook" : "Instagram"} coinvolgente basato su:

Argomento: ${inputData.topic}
${inputData.cta ? `Call to Action: ${inputData.cta}` : ""}
${inputData.hashtags ? `Hashtag suggeriti: ${inputData.hashtags}` : ""}

Il post deve:
- Essere coinvolgente e adatto al pubblico target
- Includere emoji appropriate se pertinenti al tono di voce
- Avere una struttura che catturi l'attenzione
- Includere gli hashtag in modo naturale
- Rispettare il tono di voce specificato nel profilo
- Essere ottimizzato per l'engagement`;
      break;

    case "product":
      prompt = `Crea una descrizione prodotto e-commerce persuasiva per:

Nome prodotto: ${inputData.name}
Caratteristiche: ${inputData.features}
Benefici: ${inputData.benefits}
${inputData.cta ? `Call to Action: ${inputData.cta}` : ""}

La descrizione deve:
- Essere persuasiva e orientata alla vendita
- Evidenziare i benefici emotivi oltre a quelli pratici
- Utilizzare il tono di voce appropriato
- Includere una call to action efficace
- Essere strutturata per facilitare la lettura
- Convincere il cliente all'acquisto`;
      break;

    case "blog":
      prompt = `Crea un'idea per articolo blog completa con:

Argomento: ${inputData.topic}
${inputData.angle ? `Angolatura: ${inputData.angle}` : ""}
${inputData.keywords ? `Keywords da includere: ${inputData.keywords}` : ""}

Fornisci:
1. Un titolo accattivante e SEO-friendly
2. Una scaletta dettagliata con sottotitoli
3. Una breve introduzione
4. Punti chiave da sviluppare
5. Una conclusione con call to action`;
      break;

    case "video":
      prompt = `Crea uno script per video breve (30-60 secondi) su:

Argomento: ${inputData.topic}
${inputData.platform ? `Piattaforma: ${inputData.platform}` : ""}
${inputData.cta ? `Call to Action: ${inputData.cta}` : ""}

Lo script deve:
- Essere conciso e dinamico
- Catturare l'attenzione nei primi 3 secondi
- Avere un messaggio chiaro e diretto
- Includere indicazioni per scene/inquadrature
- Terminare con una call to action efficace
- Essere adatto al tono di voce specificato`;
      break;

    default:
      throw new Error(`Tipo di contenuto non supportato: ${contentType}`);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const generatedText = response.choices[0].message.content;
    if (!generatedText) {
      throw new Error("Nessun contenuto generato dall'AI");
    }

    return generatedText;
  } catch (error) {
    console.error("Errore nella generazione del contenuto:", error);
    throw new Error("Errore durante la generazione del contenuto. Riprova più tardi.");
  }
}

export async function generateContentVariation(originalContent: string, nicheProfile: any): Promise<string> {
  const systemPrompt = `Sei un esperto copywriter. Crea una variazione del contenuto fornito mantenendo:
- Lo stesso messaggio principale
- Il tono di voce: ${nicheProfile.toneOfVoice}
- L'appropriatezza per il pubblico: ${nicheProfile.targetAudience}
- L'obiettivo: ${nicheProfile.contentGoal}

La variazione deve essere diversa ma ugualmente efficace.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Crea una variazione di questo contenuto:\n\n${originalContent}` }
      ],
      temperature: 0.9,
      max_tokens: 1000,
    });

    const generatedText = response.choices[0].message.content;
    if (!generatedText) {
      throw new Error("Nessuna variazione generata dall'AI");
    }

    return generatedText;
  } catch (error) {
    console.error("Errore nella generazione della variazione:", error);
    throw new Error("Errore durante la generazione della variazione. Riprova più tardi.");
  }
}
