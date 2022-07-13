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

    credential = ManagedIdentityCredential()
    client = SecretClient(vault_url=kv_endpoint, credential=credential)
    config = {
        'APP_LOGIC_DB_NAME': client.get_secret('SharedDbName').value,
        'APP_LOGIC_DB_USER': client.get_secret('SharedDbPerseusUser').value,
        'APP_LOGIC_DB_PASSWORD': client.get_secret('SharedDbPerseusPass').value,
        'APP_LOGIC_DB_HOST': client.get_secret('SharedDbHost').value,
        'APP_LOGIC_DB_PORT': client.get_secret('SharedDbPort').value,

        'USER_SCHEMAS_DB_NAME': client.get_secret('SourceDbName').value,
        'USER_SCHEMAS_DB_USER': client.get_secret('SourceDbUser').value,
        'USER_SCHEMAS_DB_PASSWORD': client.get_secret('SourceDbPass').value,
        'USER_SCHEMAS_DB_HOST': client.get_secret('SourceDbHost').value,
        'USER_SCHEMAS_DB_PORT': client.get_secret('SourceDbPort').value,

        'FILE_MANAGER_API_URL': client.get_secret('FilesManagerUrl').value
    }
    client.close()

    return config