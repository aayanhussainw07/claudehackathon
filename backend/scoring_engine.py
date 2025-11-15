"""
Scoring engine to calculate lifestyle compatibility between user preferences
and neighborhood characteristics
"""

def calculate_compatibility_score(quiz_results, neighborhood):
    """
    Calculate a 0-100 compatibility score based on quiz results and neighborhood data

    Args:
        quiz_results: dict with user quiz answers
        neighborhood: dict with neighborhood characteristics

    Returns:
        float: compatibility score (0-100)
    """
    if not quiz_results:
        return 50  # Default neutral score if no quiz taken

    total_score = 0
    weights_sum = 0

    # 1. Walkability match (weight: 15)
    walkability_pref = quiz_results.get('walkability', 5)
    neighborhood_walkability = neighborhood.get('walkability', 50) / 10  # Convert to 0-10 scale
    walkability_match = 100 - (abs(walkability_pref - neighborhood_walkability) * 10)
    total_score += walkability_match * 15
    weights_sum += 15

    # 2. Food/Restaurant density (weight: 12)
    food_pref = quiz_results.get('food_importance', 5)
    neighborhood_food = neighborhood.get('food_score', 5)
    food_match = 100 - (abs(food_pref - neighborhood_food) * 10)
    total_score += food_match * 12
    weights_sum += 12

    # 3. Nightlife vs Quiet (weight: 10)
    nightlife_pref = quiz_results.get('nightlife', 5)  # 0=quiet, 10=vibrant
    neighborhood_nightlife = neighborhood.get('nightlife_score', 5)
    nightlife_match = 100 - (abs(nightlife_pref - neighborhood_nightlife) * 10)
    total_score += nightlife_match * 10
    weights_sum += 10

    # 4. Public transportation (weight: 13)
    transit_pref = quiz_results.get('public_transit', 5)
    neighborhood_transit = neighborhood.get('transit_score', 5)
    transit_match = 100 - (abs(transit_pref - neighborhood_transit) * 10)
    total_score += transit_match * 13
    weights_sum += 13

    # 5. Parks and green space (weight: 8)
    parks_pref = quiz_results.get('parks', 5)
    neighborhood_parks = neighborhood.get('parks_score', 5)
    parks_match = 100 - (abs(parks_pref - neighborhood_parks) * 10)
    total_score += parks_match * 8
    weights_sum += 8

    # 6. Diversity preference (weight: 7)
    diversity_pref = quiz_results.get('diversity', 5)
    neighborhood_diversity = neighborhood.get('diversity_score', 5)
    diversity_match = 100 - (abs(diversity_pref - neighborhood_diversity) * 10)
    total_score += diversity_match * 7
    weights_sum += 7

    # 7. Safety/Family-friendly (weight: 15)
    safety_pref = quiz_results.get('safety', 5)
    neighborhood_safety = neighborhood.get('safety_score', 5)
    safety_match = 100 - (abs(safety_pref - neighborhood_safety) * 10)
    total_score += safety_match * 15
    weights_sum += 15

    # 8. Commute distance preference (weight: 10)
    if 'target_location' in quiz_results and 'lat' in neighborhood:
        max_distance = quiz_results.get('max_commute_miles', 10)
        actual_distance = calculate_distance(
            quiz_results['target_location']['lat'],
            quiz_results['target_location']['lng'],
            neighborhood['lat'],
            neighborhood['lng']
        )
        if actual_distance <= max_distance:
            distance_match = 100 - (actual_distance / max_distance * 100)
        else:
            distance_match = 0
        total_score += distance_match * 10
        weights_sum += 10

    # 9. Age demographic fit (weight: 10)
    age_pref = quiz_results.get('age_group_preference', 'mixed')
    neighborhood_demo = neighborhood.get('primary_demographic', 'mixed')
    if age_pref == neighborhood_demo or age_pref == 'no_preference':
        age_match = 100
    else:
        age_match = 50
    total_score += age_match * 10
    weights_sum += 10

    # Calculate weighted average
    if weights_sum > 0:
        final_score = total_score / weights_sum
    else:
        final_score = 50

    return max(0, min(100, final_score))  # Clamp between 0-100

def calculate_distance(lat1, lng1, lat2, lng2):
    """
    Calculate distance between two points in miles using Haversine formula
    """
    from math import radians, sin, cos, sqrt, atan2

    R = 3959  # Earth's radius in miles

    lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])

    dlat = lat2 - lat1
    dlng = lng2 - lng1

    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlng/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))

    distance = R * c
    return distance

def get_score_breakdown(quiz_results, neighborhood):
    """
    Get detailed breakdown of compatibility scores for UI display
    """
    breakdown = {
        'walkability': 0,
        'food': 0,
        'nightlife': 0,
        'transit': 0,
        'parks': 0,
        'diversity': 0,
        'safety': 0,
        'commute': 0,
        'demographics': 0
    }

    if not quiz_results:
        return breakdown

    # Calculate each component (simplified version of main function)
    if 'walkability' in quiz_results:
        walkability_pref = quiz_results['walkability']
        neighborhood_walkability = neighborhood.get('walkability', 50) / 10
        breakdown['walkability'] = 100 - (abs(walkability_pref - neighborhood_walkability) * 10)

    if 'food_importance' in quiz_results:
        food_pref = quiz_results['food_importance']
        neighborhood_food = neighborhood.get('food_score', 5)
        breakdown['food'] = 100 - (abs(food_pref - neighborhood_food) * 10)

    # Add more breakdowns as needed...

    return breakdown
