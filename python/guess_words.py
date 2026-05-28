import json


words = {
"3": ["TAX", "CUT", "PEA", "SHY", "TOP", "WIN"],
"4": ["FOLK", "LOVE", "BOMB", "CROP", "RICH", "READ"],
"5": ["VEGAN", "PRIDE", "PEACE", "JAPAN", "PASTA", "EARTH"],
"6": ["BORDER", "DEGREE", "FOREST", "LONGER", "BRIDGE", "FLOWER"],
"7": ["POLLUTE", "COMMUNE", "CULTURE", "PAINTER", "FREEDOM", "RETREAT"],
"8": ["COMMUNISM", "NEIGHBOR", "BROCCOLI", "ORGANIZE", "RESEARCH", "PIPELINE"],
}

with open('guesses.json', 'w') as f:
    json.dump(words, f)