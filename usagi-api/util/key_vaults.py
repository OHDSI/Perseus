from azure.identity import ManagedIdentityCredential
from azure.keyvault.secrets import SecretClient


"""
For local development use DefaultAzureCredential(exclude_interactive_browser_credential=False) 
insteadof ManagedIdentityCredential.
See more: https://docs.microsoft.com/en-us/python/api/overview/azure/identity-readme?view=azure-python
"""
def get_secrets() -> dict:
    print('Fetch variables from Azure Key Vault')
    kv_endpoint = 'https://kv-perseus.vault.azure.net/'

    credential = ManagedIdentityCredential(exclude_interactive_browser_credential=False)
    client = SecretClient(vault_url=kv_endpoint, credential=credential)
    config = {
        'SOLR_URL': client.get_secret('SolrUrl').value,
        'USAGI_DB_NAME': client.get_secret('SharedDbName').value,
        'USAGI_DB_USER': client.get_secret('SharedDbUsagiUser').value,
        'USAGI_DB_PASSWORD': client.get_secret('SharedDbUsagiPass').value,
        'USAGI_DB_HOST': client.get_secret('SharedDbHost').value,
        'USAGI_DB_PORT': client.get_secret('SharedDbPort').value,
        'VOCABULARY_DB_NAME': client.get_secret('VocabularyDbName').value,
        'VOCABULARY_DB_USER': client.get_secret('VocabularyDbUser').value,
        'VOCABULARY_DB_PASSWORD': client.get_secret('VocabularyDbPass').value,
        'VOCABULARY_DB_HOST': client.get_secret('VocabularyDbHost').value,
        'VOCABULARY_DB_PORT': client.get_secret('VocabularyDbPort').value,
    }
    client.close()

    return config