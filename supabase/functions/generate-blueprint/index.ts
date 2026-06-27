import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

interface GroqMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

async function callGroq(apiKey: string, messages: GroqMessage[]): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`)
  }

  const data: GroqResponse = await response.json()
  return data.choices[0]?.message?.content || ""
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { user_id, mind_dump } = await req.json()

    if (!user_id || !mind_dump) {
      return new Response(
        JSON.stringify({ error: "Missing user_id or mind_dump" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY")
    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Extract goals and identity from mind dump
    const extractionPrompt = `Analyze this mind dump and extract structured information for a Human Operating System called FORGE. The user has written freely about their dreams, fears, goals, and frustrations.

Mind dump:
"""
${mind_dump}
"""

Extract and return ONLY a JSON object with these fields:
{
  "destination": "A single clear statement of who they want to become (e.g. 'I am an AI Founder building the future of work')"
  "current_reality": "An honest assessment of where they are now (1-2 sentences)"
  "gap": "The key things that need to change to bridge the gap (2-3 sentences)"
  "principles": ["3-5 core principles extracted from their values"],
  "standards": ["3-5 non-negotiable rules/standards they must live by"],
  "milestones": [
    {"label": "First milestone (30 days)", "timeframe": "30 days"},
    {"label": "Second milestone (90 days)", "timeframe": "90 days"},
    {"label": "Third milestone (6 months)", "timeframe": "6 months"},
    {"label": "Fourth milestone (2 years)", "timeframe": "2 years"},
    {"label": "Final milestone (5 years)", "timeframe": "5 years"}
  ]
}

Be specific and actionable. Use their own words where possible.`

    const extraction = await callGroq(groqApiKey, [
      { role: "system", content: "You are the Forge Identity Engine. You extract clear identity and strategy from raw thoughts. Return only valid JSON." },
      { role: "user", content: extractionPrompt },
    ])

    // Parse the extraction
    let blueprint
    try {
      const jsonMatch = extraction.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        blueprint = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("Failed to parse blueprint:", extraction)
      return new Response(
        JSON.stringify({ error: "Failed to parse blueprint" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Update the profile in Supabase using service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (supabaseUrl && serviceRoleKey) {
      // Update profile
      await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user_id}`, {
        method: "PATCH",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          destination: blueprint.destination,
          current_reality: blueprint.current_reality,
          gap: blueprint.gap,
          principles: blueprint.principles,
          standards: blueprint.standards,
          updated_at: new Date().toISOString(),
        }),
      })

      // Insert milestones
      if (blueprint.milestones && Array.isArray(blueprint.milestones)) {
        for (let i = 0; i < blueprint.milestones.length; i++) {
          const m = blueprint.milestones[i]
          await fetch(`${supabaseUrl}/rest/v1/milestone_progress`, {
            method: "POST",
            headers: {
              "apikey": serviceRoleKey,
              "Authorization": `Bearer ${serviceRoleKey}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal,resolution=merge-duplicates",
            },
            body: JSON.stringify({
              user_id,
              milestone_id: String(i + 1),
              milestone_label: m.label,
              timeframe: m.timeframe,
              is_completed: false,
              started_at: new Date().toISOString(),
            }),
          })
        }
      }

      // Create an initial insight
      await fetch(`${supabaseUrl}/rest/v1/insights`, {
        method: "POST",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          user_id,
          insight_text: "Identity forged. Your blueprint is now active. Review your standards.",
          insight_type: "immediate",
          category: "breakthrough",
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      })
    }

    return new Response(
      JSON.stringify({ success: true, blueprint }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error("Error in generate-blueprint:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
