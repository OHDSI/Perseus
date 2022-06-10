from azure.identity import ManagedIdentityCredential
from azure.keyvault.secrets import SecretClient


def get_secrets() -> dict:
    print('Fetch variables from Azure Key Vault')
    kv_endpoint = 'https://kv-perseus.vault.azure.net/'

    credential = ManagedIdentityCredential()
    client = SecretClient(vault_url=kv_endpoint, credential=credential)
    config = {
        'SOLR_HOST': client.get_secret('SolrHost').value,
        'SOLR_PORT': client.get_secret('SolrPort').value,
        'VOCABULARY_DB_NAME': client.get_secret('VocabularyDbName').value,
        'VOCABULARY_DB_USER': client.get_secret('VocabularyDbUser').value,
        'VOCABULARY_DB_PASSWORD': client.get_secret('VocabularyDbPass').value,
        'VOCABULARY_DB_HOST': client.get_secret('VocabularyDbHost').value,
        'VOCABULARY_DB_PORT': client.get_secret('VocabularyDbPort').value,
    }
    client.close()

    return config