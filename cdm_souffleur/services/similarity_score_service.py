import re

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import string

def get_terms_vectors(results, query, field_name):
    sentences = [query] + list(map(lambda x: x[field_name][0], results))
    cleaned_sentences = list(map(clean_string, sentences))
    vectorizer = CountVectorizer(analyzer='char_wb', ngram_range=(3,4))
    fitted_vectorizer = vectorizer.fit_transform(cleaned_sentences)
    vectors = fitted_vectorizer.toarray()
    return vectors


def cosine_sim_vectors(vec1, vec2):
    vec1 = vec1.reshape(1, -1)
    vec2 = vec2.reshape(1, -1)
    return cosine_similarity(vec1, vec2)[0][0]


def clean_string(text):
    text = ' '.join(re.split('[^a-zA-Z]', text))
    text = text.lower()
    return text