import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TranslateRequest {
  text: string;
  sourceLanguage?: string;
  targetLanguage: string;
}

interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, sourceLanguage, targetLanguage }: TranslateRequest = await req.json();

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: text, targetLanguage" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GOOGLE_TRANSLATE_API_KEY");
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Translation service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const params = new URLSearchParams({
      key: apiKey,
      q: text,
      target: targetLanguage.split("-")[0],
      format: "text",
    });

    if (sourceLanguage) {
      params.append("source", sourceLanguage.split("-")[0]);
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?${params.toString()}`,
      { method: "POST" }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Google Translate API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Translation failed", details: errorData }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data: GoogleTranslateResponse = await response.json();
    const translation = data.data.translations[0];

    return new Response(
      JSON.stringify({
        translatedText: translation.translatedText,
        detectedSourceLanguage: translation.detectedSourceLanguage || sourceLanguage,
        originalText: text,
        targetLanguage,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
