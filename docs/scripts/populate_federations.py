#!/usr/bin/env python3
import json
import subprocess

PROJECT_ID = "rbibqjgsnrueubrvyqps"

# All 57 sports federations with their data
federations = [
    ("Athletics Namibia", "AN", "National athletics federation", "Erwin Naimhwaka", "Leonie Mostert", "info@athleticsnamibia.org.na", "+264 61 256 716", "https://athleticsnamibia.org.na", "https://facebook.com/AthleticsNamibia", "https://instagram.com/athletics_namibia", None, "/logos/athletics-logo.png", "/sports/namibia-athletics.jpg"),
    ("Namibia Football Association", "NFA", "National football association", "Robert Shimooshili", "Franco Cosmos", "info@nfa.com.na", "+264 61 256 716", "https://nfa.com.na", "https://facebook.com/NamibiaFootballAssociation", "https://instagram.com/namibiafootball", "https://twitter.com/nfa_namibia", "/logos/nfa-logo.png", "/sports/namibia-football.jpg"),
    ("Namibia Rugby Union", "NRU", "National rugby union", "Corrie Mensah", "Danie Esterhuizen", "info@namibiarugby.com", "+264 61 237 056", "https://namibiarugby.com", "https://facebook.com/NamibiaRugby", "https://instagram.com/namibia_rugby", "https://twitter.com/namibiarugby", None, "/sports/namibia-rugby.jpg"),
    ("Cricket Namibia", "CN", "National cricket association", "Francois Erasmus", "Johan Muller", "info@cricketnamibia.com", "+264 61 256 716", "https://cricketnamibia.com", "https://facebook.com/CricketNamibia", "https://instagram.com/cricketnamibia", "https://twitter.com/CricketNamibia1", "/logos/cricket-logo.png", "/sports/namibia-cricket.jpg"),
    ("Namibia Netball Federation", "NNF", "National netball federation", "Julene Beukes", "Retha Schutte", "info@netballnamibia.org", "+264 81 367 4455", None, "https://facebook.com/NetballNamibia", None, None, None, "/sports/netball.jpg"),
    ("Namibia Basketball Federation", "NBF", "National basketball federation", "Kisco Goabab", "TBA", "info@basketballnamibia.org", None, None, "https://facebook.com/BasketballNamibia", None, None, None, "/sports/namibia-basketball.jpg"),
    ("Namibia Volleyball Federation", "NVF", "National volleyball federation", "Berthold Shikongo", "TBA", "info@volleyballnamibia.org", None, None, None, None, None, None, "/sports/volleyball.jpg"),
    ("Namibia Handball Federation", "NHF", "National handball federation", "TBA", "TBA", "info@handballnamibia.org", None, None, None, None, None, None, "/sports/handball.jpg"),
    ("Namibia Hockey Union", "NHU", "National field hockey union", "Desiree Fredericks", "TBA", "info@hockeynamibia.com", "+264 81 367 4455", None, "https://facebook.com/HockeyNamibia", None, None, None, "/sports/namibia-hockey.jpg"),
    ("Namibia Boxing Control Commission", "NBCC", "National boxing control commission", "Patrick Kauta", "TBA", "info@boxingnamibia.org", None, None, None, None, None, None, "/sports/namibia-boxing.jpg"),
    ("Karate Namibia", "KN", "National karate federation", "TBA", "TBA", "info@karatenamibia.org", None, None, None, None, None, None, "/sports/karate.jpg"),
    ("Judo Namibia", "JN", "National judo federation", "TBA", "TBA", "info@judonamibia.org", None, None, None, None, None, None, "/sports/judo.jpg"),
    ("Taekwondo Namibia", "TKD", "National taekwondo federation", "TBA", "TBA", "info@taekwondonamibia.org", None, None, None, None, None, None, "/sports/taekwondo.jpg"),
    ("Wrestling Namibia", "WN", "National wrestling federation", "TBA", "TBA", "info@wrestlingnamibia.org", None, None, None, None, None, None, "/sports/wrestling.jpg"),
    ("Fencing Namibia", "FN", "National fencing federation", "TBA", "TBA", "info@fencingnamibia.org", None, None, None, None, None, None, "/sports/fencing-action.jpg"),
    ("Tennis Namibia", "TN", "National tennis association", "Helalia Johannes", "TBA", "info@tennisnamibia.com", None, None, "https://facebook.com/TennisNamibia", None, None, None, "/sports/tennis.jpg"),
    ("Squash Namibia", "SN", "National squash federation", "TBA", "TBA", "info@squashnamibia.org", None, None, None, None, None, None, "/sports/squash.jpg"),
    ("Badminton Namibia", "BN", "National badminton federation", "TBA", "TBA", "info@badmintonnamibia.org", None, None, None, None, None, None, "/sports/badminton.jpg"),
    ("Table Tennis Namibia", "TTN", "National table tennis federation", "TBA", "TBA", "info@tabletennisnamibia.org", None, None, None, None, None, None, "/sports/table-tennis.jpg"),
    ("Golf Namibia", "GN", "National golf association", "TBA", "TBA", "info@golfnamibia.com", None, None, None, None, None, None, "/sports/golf.jpg"),
    ("Swimming Namibia", "SN", "National swimming federation", "TBA", "TBA", "info@swimmingnamibia.org", None, None, None, None, None, None, "/sports/swimming.jpg"),
    ("Namibia Cycling Federation", "NCF", "National cycling federation", "TBA", "TBA", "info@cyclingnamibia.org", None, None, None, None, None, None, "/sports/cycling.jpg"),
    ("Triathlon Namibia", "TN", "National triathlon federation", "TBA", "TBA", "info@triathlonnamibia.org", None, None, None, None, None, None, "/sports/triathlon.jpg"),
    ("Namibia Gymnastics Federation", "NGF", "National gymnastics federation", "TBA", "TBA", "info@gymnasticsnamibia.org", None, None, None, None, None, None, "/sports/gymnastics.jpg"),
    ("Weightlifting Namibia", "WN", "National weightlifting federation", "TBA", "TBA", "info@weightliftingnamibia.org", None, None, None, None, None, None, "/sports/weightlifting.jpg"),
    ("Namibia Darts Association", "NDA", "National darts association", "TBA", "TBA", "info@dartsnamibia.org", None, None, None, None, None, None, "/sports/darts-action.jpg"),
    ("Chess Namibia", "CN", "National chess federation", "TBA", "TBA", "info@chessnamibia.org", None, None, None, None, None, None, "/sports/chess-tournament.jpg"),
    ("Billiards & Snooker Namibia", "BSN", "National billiards federation", "TBA", "TBA", "info@billiardsnamibia.org", None, None, None, None, None, None, "/sports/billiards-action.jpg"),
    ("Skateboarding Namibia", "SKN", "National skateboarding federation", "TBA", "TBA", "info@skateboardingnamibia.org", None, None, None, None, None, None, "/sports/skateboarding-action.jpg"),
    ("Roller Sports Namibia", "RSN", "National roller sports federation", "TBA", "TBA", "info@rollersportsnamibia.org", None, None, None, None, None, None, "/sports/rollerskating-action.jpg"),
]

# Insert in batches of 10
batch_size = 10
total = len(federations)

for i in range(0, total, batch_size):
    batch = federations[i:i+batch_size]
    values = []
    
    for fed in batch:
        name, abbr, desc, pres, sec, email, phone, web, fb, ig, tw, logo, bg = fed
        # Escape single quotes
        name = name.replace("'", "''")
        desc = desc.replace("'", "''") if desc else desc
        pres = pres.replace("'", "''") if pres else pres
        sec = sec.replace("'", "''") if sec else sec
        
        # Build value string
        email_val = f"'{email}'" if email else "NULL"
        phone_val = f"'{phone}'" if phone else "NULL"
        web_val = f"'{web}'" if web else "NULL"
        fb_val = f"'{fb}'" if fb else "NULL"
        ig_val = f"'{ig}'" if ig else "NULL"
        tw_val = f"'{tw}'" if tw else "NULL"
        logo_val = f"'{logo}'" if logo else "NULL"
        bg_val = f"'{bg}'"
        
        value = f"('{name}', '{abbr}', 'federation', '{desc}', '{pres}', '{sec}', {email_val}, {phone_val}, {web_val}, {fb_val}, {ig_val}, {tw_val}, {logo_val}, {bg_val})"
        
        values.append(value)
    
    query = f"""INSERT INTO namibia_na_26_federations 
    (name, abbreviation, category, description, president, \\"secretaryGeneral\\", email, phone, website, facebook, instagram, twitter, logo, \\"backgroundImage\\") 
    VALUES {', '.join(values)} RETURNING id;"""
    
    cmd = [
        "manus-mcp-cli", "tool", "call", "execute_sql",
        "--server", "supabase",
        "--input", json.dumps({"project_id": PROJECT_ID, "query": query})
    ]
    
    print(f"Inserting batch {i//batch_size + 1} ({len(batch)} federations)...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"✓ Batch {i//batch_size + 1} inserted successfully!")
    else:
        print(f"✗ Error in batch {i//batch_size + 1}:")
        print(result.stderr)
        break

print(f"\nTotal federations in database: {10 + len(federations)} (Ministry + Commission + 8 Umbrella + {len(federations)} Federations)")
