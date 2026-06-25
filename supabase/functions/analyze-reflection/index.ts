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
      temperature: 0.5,
      max_tokens: 1500,
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
    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "Missing user_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY")
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!groqApiKey || !supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing configuration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Fetch recent data for analysis
    const headers = {
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    }

    // Get recent reflections (last 14 days)
    const reflectionsRes = await fetch(
      `${supabaseUrl}/rest/v1/reflections?user_id=eq.${user_id}&order=reflection_date.desc&limit=14`,
      { headers }
    )
    const reflections = await reflectionsRes.json()

    // Get recent daily logs
    const logsRes = await fetch(
      `${supabaseUrl}/rest/v1/daily_logs?user_id=eq.${user_id}&order=log_date.desc&limit=14`,
      { headers }
    )
    const logs = await logsRes.json()

    // Get deep work sessions (last 30 days)
    const sessionsRes = await fetch(
      `${supabaseUrl}/rest/v1/deep_work_sessions?user_id=eq.${user_id}&order=session_start.desc&limit=50`,
      { headers }
    )
    const sessions = await sessionsRes.json()

    // Get existing behavior patterns
    const patternsRes = await fetch(
      `${supabaseUrl}/rest/v1/behavior_patterns?user_id=eq.${user_id}`,
      { headers }
    )
    const existingPatterns = await patternsRes.json()

    // Analyze patterns with Groq
    const analysisPrompt = `Analyze this user's behavior data and detect patterns. Return ONLY a JSON object.

Recent reflections (last 14 days):
${JSON.stringify(reflections, null, 2)}

Daily logs:
${JSON.stringify(logs, null, 2)}

Deep work sessions:
${JSON.stringify(sessions, null, 2)}

Existing patterns:
${JSON.stringify(existingPatterns, null, 2)}

Analyze and return patterns in this format:
{
  "patterns": {
    "optimal_hours": [7, 8, 9, 10],
    "task_completion_rate": 0.75,
    "optimal_task_count": 3,
    "common_blockers": ["email", "meetings", "phone"],
    "success_signals": ["morning work", "single focus"],
    "deep_work_consistency": 0.6
  },
  "insights": [
    {
      "text": "You complete 85% of tasks started before 10am. Morning work is your strength.",
      "type": "immediate",
      "category": "breakthrough"
    }
  ],
  "weekly_summary": {
    "progress": "Made progress on 12 tasks this week.",
    "blockers": "Email was mentioned as a blocker 3 times.",
    "recommendation": "Consider blocking email during morning deep work sessions."
  }
}

Only include insights that are genuinely useful. Return max 2 insights.`

    const analysis = await callGroq(groqApiKey, [
      { role: "system", content: "You are a behavioral analyst that finds actionable patterns in productivity data. Return only valid JSON." },
      { role: "user", content: analysisPrompt },
    ])

    // Parse the analysis
    let result
    try {
      const jsonMatch = analysis.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("Failed to parse analysis:", analysis)
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Update behavior patterns
    if (result.patterns) {
      const patterns = result.patterns

      // Upsert each pattern type
      const patternTypes = [
        { type: "optimal_hours", data: patterns.optimal_hours },
        { type: "task_completion_rate", data: { rate: patterns.task_completion_rate } },
        { type: "optimal_task_count", data: { count: patterns.optimal_task_count } },
        { type: "common_blockers", data: { blockers: patterns.common_blockers } },
        { type: "success_signals", data: { signals: patterns.success_signals } },
        { type: "deep_work_consistency", data: { rate: patterns.deep_work_consistency } },
      ]

      for (const p of patternTypes) {
        if (p.data !== undefined && p.data !== null) {
          await fetch(`${supabaseUrl}/rest/v1/behavior_patterns`, {
            method: "POST",
            headers: { ...headers, "Prefer": "return=minimal,resolution=merge-duplicates" },
            body: JSON.stringify({
              user_id,
              pattern_type: p.type,
              pattern_data: p.data,
              confidence_score: 0.7,
              sample_size: reflections?.length || 0,
              last_observed: new Date().toISOString(),
            }),
          })
        }
      }
    }

    // Insert insights
    if (result.insights && Array.isArray(result.insights)) {
      for (const insight of result.insights) {
        await fetch(`${supabaseUrl}/rest/v1/insights`, {
          method: "POST",
          headers: { ...headers, "Prefer": "return=minimal" },
          body: JSON.stringify({
            user_id,
            insight_text: insight.text,
            insight_type: insight.type || "immediate",
            category: insight.category || "breakthrough",
            relevance_score: 0.8,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          }),
        })
      }
    }

    // Create weekly summary insight if it's Monday or if explicitly requested
    if (result.weekly_summary) {
      const today = new Date().getDay()
      if (today === 1) { // Monday
        await fetch(`${supabaseUrl}/rest/v1/insights`, {
          method: "POST",
          headers: { ...headers, "Prefer": "return=minimal" },
          body: JSON.stringify({
            user_id,
            insight_text: result.weekly_summary.recommendation,
            insight_type: "weekly",
            category: "progress",
            relevance_score: 0.9,
            expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          }),
        })
      }
    }

    return new Response(
      JSON.stringify({ success: true, analysis: result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error("Error in analyze-reflection:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
