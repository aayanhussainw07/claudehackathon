import json
import os
from typing import Dict, List

try:
  from anthropic import Anthropic
except ImportError:
  Anthropic = None

CLAUDE_MODEL = os.getenv('CLAUDE_MODEL', 'claude-3-haiku-20240307')
CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')
_anthropic_client = Anthropic(api_key=CLAUDE_API_KEY) if CLAUDE_API_KEY and Anthropic else None

PREFERENCE_LABELS = {
  'walkability': 'Walkability',
  'nightlife': 'Nightlife & Culture',
  'parks': 'Parks & Greenery',
  'public_transit': 'Transit Access',
  'food_importance': 'Food Scene',
  'diversity': 'Diversity',
  'safety': 'Safety & Calm',
  'max_commute_miles': 'Commute Tolerance',
  'age_group_preference': 'Community Vibe'
}

PERSONA_TEMPLATES = {
  'walkability': {
    'title': 'Transit-First Urbanist',
    'tagline': 'Loves strolling and subway access',
    'focus': 'Manhattan core & waterfront Brooklyn'
  },
  'nightlife': {
    'title': 'After-Hours Creative',
    'tagline': 'Wants late-night energy with local culture',
    'focus': 'Downtown Manhattan & North Brooklyn'
  },
  'parks': {
    'title': 'Greenway Seeker',
    'tagline': 'Needs tree-lined blocks and quick park escapes',
    'focus': 'Brooklyn brownstones & Queens waterfront'
  },
  'public_transit': {
    'title': 'Car-Free Commuter',
    'tagline': 'Optimizes for express lines and short transfers',
    'focus': 'Express corridors across all five boroughs'
  },
  'food_importance': {
    'title': 'Culinary Explorer',
    'tagline': 'Hunts for diverse bites and market culture',
    'focus': 'Queens corridors & downtown Manhattan'
  },
  'diversity': {
    'title': 'Global Citizen',
    'tagline': 'Thrives in multicultural hubs',
    'focus': 'Queens, Brooklyn, and Northern Manhattan'
  },
  'safety': {
    'title': 'Calm Community Builder',
    'tagline': 'Wants peaceful streets with local staples',
    'focus': 'Park Slope, Riverdale & Bay Ridge pockets'
  },
  'max_commute_miles': {
    'title': 'Hyper-Local Weekday',
    'tagline': 'Aims to stay close to office or campus',
    'focus': 'Neighborhoods within 30 minutes of Midtown'
  },
  'age_group_preference': {
    'title': 'Community Curator',
    'tagline': 'Looks for neighbors in a similar life stage',
    'focus': 'Clustered micro-neighborhoods citywide'
  }
}

NYC_SOURCE_SNIPPETS = [
  {
    'source': 'NYC Open Data',
    'borough': 'Brooklyn',
    'headline': 'Prospect Park greenway funding',
    'summary': 'City added $52M to expand protected bike lanes and new dog runs along Park Slope borders.'
  },
  {
    'source': 'Reddit r/nyc',
    'borough': 'Manhattan',
    'headline': 'Lower Manhattan nightlife check-in',
    'summary': 'Locals note Greenwich Village and LES still offer the best live jazz + late bites mix.'
  },
  {
    'source': 'Queens Eats Newsletter',
    'borough': 'Queens',
    'headline': 'Astoria-Ditmars food crawl report',
    'summary': 'New Greek bakeries and pan-Latin pop-ups are drawing crowds to 30th Avenue.'
  },
  {
    'source': 'Staten Island Advance',
    'borough': 'Staten Island',
    'headline': 'North Shore ferry upgrades',
    'summary': 'Faster boats will cut the commute to downtown Manhattan by 12 minutes later this year.'
  },
  {
    'source': 'Brooklyn Paper',
    'borough': 'Brooklyn',
    'headline': 'Williamsburg waterfront rezoning',
    'summary': 'Mixed-use plan reserves 600 units for middle-income renters with priority for local artists.'
  },
  {
    'source': 'Bronx Times',
    'borough': 'Bronx',
    'headline': 'New community safety pilot in Fordham',
    'summary': 'Neighborhood ambassadors and NYPD coordination lowered complaints 18% month over month.'
  }
]


def derive_preference_weights(quiz_results: Dict) -> List[Dict]:
  weights = []
  for key, label in PREFERENCE_LABELS.items():
    raw_value = quiz_results.get(key)
    if raw_value is None:
      continue
    if key == 'age_group_preference':
      weight = 80 if raw_value != 'no_preference' else 45
    elif key == 'max_commute_miles':
      normalized = max(1, min(20, float(raw_value)))
      # Shorter commute distance = higher weight
      weight = 100 - (((normalized - 1) / 19) * 100)
    else:
      normalized = max(0, min(10, float(raw_value)))
      weight = (normalized / 10) * 100
    sentiment = _describe_weight(label, weight, raw_value)
    weights.append({
      'key': key,
      'label': label,
      'weight': round(weight, 2),
      'narrative': sentiment
    })
  return sorted(weights, key=lambda item: item['weight'], reverse=True)


def _describe_weight(label: str, weight: float, raw_value) -> str:
  if weight >= 75:
    qualifier = 'crucial'
  elif weight >= 50:
    qualifier = 'important'
  else:
    qualifier = 'supporting'
  descriptor = ''
  if isinstance(raw_value, (int, float)):
    descriptor = f'({raw_value}/10)' if raw_value <= 10 else f'(~{raw_value} mi)'
  elif isinstance(raw_value, str):
    descriptor = f'({raw_value})'
  return f'{label} is {qualifier} {descriptor}'.strip()


def build_persona_profile(weights: List[Dict], quiz_results: Dict, top_neighborhoods: List[Dict] = None) -> Dict:
  if not weights:
    return {
      'title': 'NYC Explorer',
      'tagline': 'Balanced preferences across the five boroughs',
      'description': 'Take the lifestyle quiz to unlock a personalized portrait.',
      'priorities': [],
      'nyc_focus': 'Citywide'
    }
  dominant = weights[0]
  secondary = weights[1] if len(weights) > 1 else weights[0]
  template = PERSONA_TEMPLATES.get(dominant['key'], {
    'title': 'NYC Explorer',
    'tagline': 'Balances cost, culture, and commute',
    'focus': 'Citywide'
  })
  focus = template['focus']
  if top_neighborhoods:
    boroughs = sorted({n['borough'] for n in top_neighborhoods})
    focus = ', '.join(boroughs)
  description = (
    f"You put {dominant['label'].lower()} at the center of your NYC search while also caring about "
    f"{secondary['label'].lower()}. We'll keep recommendations inside the five boroughs and lean into "
    f"neighborhoods that fit those traits."
  )
  return {
    'title': template['title'],
    'tagline': template['tagline'],
    'description': description,
    'priorities': [dominant['label'], secondary['label']],
    'nyc_focus': focus
  }


def aggregate_source_digest(top_neighborhoods: List[Dict]) -> List[Dict]:
  if not top_neighborhoods:
    return []
  boroughs = {n['borough'] for n in top_neighborhoods}
  digest = [snippet for snippet in NYC_SOURCE_SNIPPETS if snippet['borough'] in boroughs]
  if len(digest) < 3:
    digest.extend(NYC_SOURCE_SNIPPETS[:3])
  # Deduplicate while preserving order
  seen = set()
  unique = []
  for item in digest:
    key = (item['source'], item['headline'])
    if key in seen:
      continue
    seen.add(key)
    unique.append(item)
  return unique[:5]


def generate_claude_portfolio_summary(persona: Dict, top_neighborhoods: List[Dict], weights: List[Dict], sources: List[Dict]) -> Dict:
  if not top_neighborhoods:
    return _fallback_summary(persona, top_neighborhoods, weights, sources)

  prompt = _build_prompt(persona, top_neighborhoods, weights, sources)
  if _anthropic_client:
    try:
      response = _anthropic_client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=600,
        temperature=0.4,
        system='You are an NYC housing concierge specializing in matching residents with neighborhoods.',
        messages=[{
          'role': 'user',
          'content': [{'type': 'text', 'text': prompt}]
        }]
      )
      text = response.content[0].text.strip()
      ai_data = json.loads(text)
      ai_data['generated_by'] = 'claude'
      return ai_data
    except Exception:
      pass
  return _fallback_summary(persona, top_neighborhoods, weights, sources)


def _build_prompt(persona: Dict, neighborhoods: List[Dict], weights: List[Dict], sources: List[Dict]) -> str:
  neighborhood_lines = []
  for neighborhood in neighborhoods:
    highlight = neighborhood.get('summary') or neighborhood.get('vibe') or 'NYC vibe'
    neighborhood_lines.append(
      f"- {neighborhood['name']} ({neighborhood['borough']}): {highlight}; compatibility score {round(neighborhood['score'], 1)}"
    )
  weight_lines = [f"{w['label']}: {round(w['weight'])}" for w in weights[:5]]
  source_lines = [f"{s['source']} ({s['borough']}): {s['summary']}" for s in sources[:5]]
  return (
    "Create a JSON object with keys headline, insights, and call_to_action. "
    "Each insight should be a short sentence. Only mention NYC neighborhoods.\n"
    f"Persona: {persona['title']} - {persona['tagline']} | Focus: {persona['nyc_focus']}.\n"
    f"Top priorities: {', '.join(persona['priorities'])}.\n"
    f"Weighted traits: {', '.join(weight_lines)}.\n"
    "Recommended neighborhoods:\n"
    f"{os.linesep.join(neighborhood_lines)}\n"
    "Recent NYC source snippets:\n"
    f"{os.linesep.join(source_lines)}"
  )


def _fallback_summary(persona: Dict, neighborhoods: List[Dict], weights: List[Dict], sources: List[Dict]) -> Dict:
  insights = []
  if persona.get('priorities'):
    insights.append(f"Your search leans into {persona['priorities'][0].lower()} with {persona['priorities'][1].lower()} close behind.")
  if neighborhoods:
    names = ', '.join([n['name'] for n in neighborhoods])
    insights.append(f"Your leading NYC matches today: {names}.")
  if sources:
    insights.append(f"Local chatter highlights {sources[0]['headline'].lower()} in {sources[0]['borough']}.")
  if weights:
    top_weight = weights[0]
    insights.append(f"{top_weight['label']} scored {round(top_weight['weight'])}/100 in your quiz.")
  call_to_action = 'Head to the NYC Housing Map to compare affordability and lifestyle scores for these picks.'
  return {
    'headline': f"{persona.get('title', 'NYC Explorer')} game plan",
    'insights': insights,
    'call_to_action': call_to_action,
    'generated_by': 'fallback'
  }
