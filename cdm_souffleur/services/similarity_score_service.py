from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import string

def get_terms_vestors(results, query):
    sentences = [query] + list(map(lambda x: x['term'][0], results))
    cleaned_sentences = list(map(clean_string, sentences))
    vectorizer = CountVectorizer().fit_transform(cleaned_sentences)
    vectors = vectorizer.toarray()
    return vectors


def cosine_sim_vectors(vec1, vec2):
    vec1 = vec1.reshape(1, -1)
    vec2 = vec2.reshape(1, -1)
    return cosine_similarity(vec1, vec2)[0][0]


def clean_string(text):
    text = ''.join([word for word in text if word not in string.punctuation])
    text = text.lower()
    return text