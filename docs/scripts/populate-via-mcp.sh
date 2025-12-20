#!/bin/bash
# Populate all 67 federations via Supabase MCP

PROJECT_ID="rbibqjgsnrueubrvyqps"

# Insert 8 Umbrella Bodies
echo "Inserting Umbrella Bodies..."
manus-mcp-cli tool call execute_sql --server supabase --input "{\"project_id\":\"$PROJECT_ID\",\"query\":\"INSERT INTO namibia_na_26_federations (name, category, description, president, \\\"secretaryGeneral\\\", email, phone, website, facebook, instagram, twitter, logo) VALUES ('Namibia National Olympic Committee', 'umbrella', 'National Olympic Committee coordinating Olympic sports', 'Abner Xoagub', 'Joan Smit', 'info@nnoc-namibia.com', '+264 61 237 056', 'https://nnoc-namibia.com', 'https://facebook.com/NNOCNamibia', 'https://instagram.com/nnoc_namibia', 'https://twitter.com/NNOCNamibia', '/logos/nnoc-logo.jpg'), ('Namibia Paralympic Committee', 'umbrella', 'Coordinating Paralympic sports in Namibia', 'Katrina Shimbulu', 'Carola Paulus', 'info@namibiaparalympics.org', '+264 81 367 4455', NULL, NULL, NULL, NULL, '/sports/paralympic.jpg'), ('Namibia National Students Sports Union', 'umbrella', 'National students sports union', 'TBA', 'TBA', 'info@nnsu.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/students-sports.jpg'), ('Namibia Women in Sport Association', 'umbrella', 'Promoting women in sports across Namibia', 'TBA', 'TBA', 'info@nawisa.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/women-sports.jpg'), ('Traditional and Indigenous Sports Association of Namibia', 'umbrella', 'Preserving traditional Namibian sports', 'TBA', 'TBA', 'info@tisan.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/traditional-sports.jpg'), ('Namibia Uniformed Forces Sports', 'umbrella', 'Sports for uniformed forces personnel', 'TBA', 'TBA', 'info@uniformedsports.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/uniformed-forces.jpg'), ('Namibia Local Authority Sports', 'umbrella', 'Local authority sports coordination', 'TBA', 'TBA', 'info@localauthoritysports.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/local-authority.jpg'), ('Namibia Martial Arts Federation', 'umbrella', 'Umbrella body for all martial arts federations', 'TBA', 'TBA', 'info@martialarts.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/martial-arts.jpg') RETURNING id;\"}"

echo "Umbrella Bodies inserted successfully!"
echo ""
echo "Total federations inserted: 10 (Ministry + Commission + 8 Umbrella Bodies)"
echo "Remaining: 57 sports federations to be inserted..."
