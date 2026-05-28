from english_words import get_english_words_set

import json


words = get_english_words_set(['gcide'], alpha=False, lower=False)

def get_word_list(number:int):

    word_list = []
    for word in words:
        if len(word) == number and word.isalpha():
            word_list.append(word.upper())

    return word_list

data = {}
for number in range(3,9):

    word_list = get_word_list(number=number)
    data[f'{number}'] = word_list
    print(len(word_list))

with open('data.json', 'w') as f:
    json.dump(data, f)