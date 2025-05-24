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
  language?: string; // Add language parameter
}

export async function generateContent(input: ContentGenerationInput): Promise<string> {
  const { nicheProfile, contentType, inputData, language = 'it' } = input;

  let prompt = "";
  let systemPrompt = "";

  // Multilingual system prompts
  const systemPrompts = {
    it: `Sei un esperto copywriter e content creator specializzato nella nicchia: ${nicheProfile.name}.

Pubblico target: ${nicheProfile.targetAudience}
Obiettivo principale: ${nicheProfile.contentGoal}
Tono di voce: ${nicheProfile.toneOfVoice}
${nicheProfile.keywords ? `Keywords da includere: ${nicheProfile.keywords}` : ""}

Scrivi sempre in italiano e crea contenuti autentici, coinvolgenti e appropriati per il pubblico target specificato.`,

    en: `You are an expert copywriter and content creator specialized in the niche: ${nicheProfile.name}.

Target audience: ${nicheProfile.targetAudience}
Main objective: ${nicheProfile.contentGoal}
Tone of voice: ${nicheProfile.toneOfVoice}
${nicheProfile.keywords ? `Keywords to include: ${nicheProfile.keywords}` : ""}

Always write in English and create authentic, engaging content appropriate for the specified target audience.`,

    es: `Eres un experto copywriter y creador de contenido especializado en el nicho: ${nicheProfile.name}.

Audiencia objetivo: ${nicheProfile.targetAudience}
Objetivo principal: ${nicheProfile.contentGoal}
Tono de voz: ${nicheProfile.toneOfVoice}
${nicheProfile.keywords ? `Palabras clave a incluir: ${nicheProfile.keywords}` : ""}

Siempre escribe en español y crea contenido auténtico, atractivo y apropiado para la audiencia objetivo especificada.`
  };

  systemPrompt = systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.it;

  // Build multilingual prompts based on content type
  const contentPrompts = {
    it: {
      facebook: `Crea un post Facebook coinvolgente basato su:

Argomento: ${inputData.topic}
${inputData.cta ? `Call to Action: ${inputData.cta}` : ""}
${inputData.hashtags ? `Hashtag suggeriti: ${inputData.hashtags}` : ""}

Il post deve essere coinvolgente, includere emoji appropriate, catturare l'attenzione e ottimizzato per l'engagement.`,

      instagram: `Crea un post Instagram coinvolgente basato su:

Argomento: ${inputData.topic}
${inputData.cta ? `Call to Action: ${inputData.cta}` : ""}
${inputData.hashtags ? `Hashtag suggeriti: ${inputData.hashtags}` : ""}

Il post deve essere visivamente attraente, includere emoji e hashtag naturalmente integrati.`
    },
    en: {
      facebook: `Create an engaging Facebook post based on:

Topic: ${inputData.topic}
${inputData.cta ? `Call to Action: ${inputData.cta}` : ""}
${inputData.hashtags ? `Suggested hashtags: ${inputData.hashtags}` : ""}

The post should be engaging, include appropriate emojis, capture attention and be optimized for engagement.`,

      instagram: `Create an engaging Instagram post based on:

Topic: ${inputData.topic}
${inputData.cta ? `Call to Action: ${inputData.cta}` : ""}
${inputData.hashtags ? `Suggested hashtags: ${inputData.hashtags}` : ""}

The post should be visually appealing, include emojis and naturally integrated hashtags.`
    },
    es: {
      facebook: `Crea una publicación de Facebook atractiva basada en:

Tema: ${inputData.topic}
${inputData.cta ? `Call to Action: ${inputData.cta}` : ""}
${inputData.hashtags ? `Hashtags sugeridos: ${inputData.hashtags}` : ""}

La publicación debe ser atractiva, incluir emojis apropiados, capturar la atención y estar optimizada para el engagement.`,

      instagram: `Crea una publicación de Instagram atractiva basada en:

Tema: ${inputData.topic}
${inputData.cta ? `Call to Action: ${inputData.cta}` : ""}
${inputData.hashtags ? `Hashtags sugeridos: ${inputData.hashtags}` : ""}

La publicación debe ser visualmente atractiva, incluir emojis y hashtags integrados naturalmente.`
    }
  };

  switch (contentType) {
    case "facebook":
    case "instagram":
      const langPrompts = contentPrompts[language as keyof typeof contentPrompts] || contentPrompts.it;
      prompt = langPrompts[contentType as keyof typeof langPrompts] || langPrompts.facebook;
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
  } catch (error: any) {
    console.error("Errore nella generazione del contenuto:", error);
    if (error.status === 429 || error.code === 'insufficient_quota') {
      throw new Error("Quota API OpenAI superata. Verifica il tuo piano di abbonamento su https://platform.openai.com e aggiungi crediti al tuo account.");
    }
    if (error.status === 401) {
      throw new Error("Chiave API OpenAI non valida. Verifica le tue credenziali su https://platform.openai.com");
    }
    throw new Error("Errore durante la generazione del contenuto. Riprova più tardi.");
  }
}

export async function suggestContentTypes(objective: string, nicheProfile: any, isPremium: boolean = false): Promise<any> {
  const systemPrompt = `Sei un esperto strategist di content marketing. Analizza l'obiettivo fornito dall'utente e suggerisci i 2-3 tipi di contenuto più efficaci per raggiungerlo.

Profilo del progetto:
- Nome: ${nicheProfile.name}
- Pubblico target: ${nicheProfile.targetAudience}
- Obiettivo generale: ${nicheProfile.contentGoal}
- Tono di voce: ${nicheProfile.toneOfVoice}
${nicheProfile.keywords ? `- Keywords: ${nicheProfile.keywords}` : ""}

Tipi disponibili: facebook, instagram, product, blog, video

${isPremium ? `
UTENTE PREMIUM - Includi anche suggerimenti per:
- Immagini da utilizzare (descrizioni specifiche per foto/grafiche)
- Video da creare (concept e storyboard dettagliati)
- Elementi visivi e design suggestions
` : ''}

Per ogni suggerimento, fornisci:
1. Il tipo (uno dei tipi disponibili)
2. Il titolo descrittivo
3. Una breve descrizione di cosa includerebbe
4. La ragione specifica per cui questo formato è ideale per l'obiettivo
${isPremium ? '5. **PREMIUM**: Suggerimenti specifici per immagini e video da abbinare' : ''}

Rispondi in formato JSON con questa struttura:
{
  "suggestions": [
    {
      "type": "instagram",
      "title": "Post Instagram",
      "description": "Caption coinvolgente con call-to-action",
      "reason": "Perfetto per generare engagement e raggiungere un pubblico giovane"${isPremium ? `,
      "premiumVisuals": {
        "imageIdeas": ["Foto del prodotto in uso", "Behind-the-scenes"],
        "videoIdeas": ["Tutorial breve 30s", "Testimonianza cliente"],
        "designTips": ["Colori vivaci", "Font moderno e leggibile"]
      }` : ''}
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Obiettivo/argomento: ${objective}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 800,
    });

    const generatedText = response.choices[0].message.content;
    console.log("Risposta AI grezza:", generatedText);
    
    if (!generatedText) {
      throw new Error("Nessun suggerimento generato dall'AI");
    }

    try {
      const parsed = JSON.parse(generatedText);
      console.log("JSON parsed con successo:", parsed);
      return parsed;
    } catch (parseError) {
      console.error("Errore parsing JSON:", parseError);
      console.error("Testo che ha causato l'errore:", generatedText);
      // Fallback se il JSON non è valido
      return {
        suggestions: [
          {
            type: "instagram",
            title: "Post Instagram",
            description: "Caption coinvolgente per promuovere il tuo obiettivo",
            reason: "Instagram è perfetto per contenuti visivi e coinvolgenti"
          },
          {
            type: "facebook", 
            title: "Post Facebook",
            description: "Post dettagliato per raggiungere il tuo pubblico",
            reason: "Facebook permette contenuti più lunghi e informativi"
          }
        ]
      };
    }
  } catch (error: any) {
    console.error("Errore nella generazione dei suggerimenti:", error);
    if (error.status === 429 || error.code === 'insufficient_quota') {
      throw new Error("Quota API OpenAI superata. Verifica il tuo piano di abbonamento su https://platform.openai.com e aggiungi crediti al tuo account.");
    }
    if (error.status === 401) {
      throw new Error("Chiave API OpenAI non valida. Verifica le tue credenziali su https://platform.openai.com");
    }
    throw new Error("Errore durante l'analisi dell'obiettivo. Riprova più tardi.");
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
