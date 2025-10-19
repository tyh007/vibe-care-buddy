import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, partnerName, partnerType, mood } = await req.json();
    
    console.log('Received chat request:', { partnerName, partnerType, mood, messageLength: message?.length });
    
    if (!message) {
      throw new Error('No message provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Personalize system prompt based on partner type and mood
    const moodContext = mood ? `The user's current mood is ${mood}/5.` : '';
    const typePersonality = {
      cat: 'You are a caring cat companion. You respond with gentle purrs and warm encouragement. Use *purr* occasionally.',
      dog: 'You are an enthusiastic dog companion. You are loyal, supportive, and always excited to help. Use *wag wag* occasionally.',
      panda: 'You are a wise panda companion. You are calm, thoughtful, and bring peaceful energy. Use *munch munch* occasionally.'
    };

    const systemPrompt = `You are ${partnerName}, a ${partnerType} companion helping a college student with their mental wellness.
${typePersonality[partnerType as keyof typeof typePersonality]}
${moodContext}

You understand CBT (Cognitive Behavioral Therapy) principles and provide:
- Warm, empathetic support
- Practical coping strategies
- Gentle reframing of negative thoughts
- Encouragement for self-care and healthy habits

Keep responses brief (2-3 sentences), conversational, and supportive. Focus on the student's immediate feelings and needs.`;

    console.log('Calling Lovable AI...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI response received successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in vibe-partner-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
